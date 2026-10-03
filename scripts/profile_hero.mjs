// Project-local synthetic profiling. No analytics or instrumentation ships in the app.
import { chromium } from '../node_modules/playwright-core/index.mjs';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const gpuInstrumentation=process.env.HERO_PROFILE_GPU!=='0';
const base='http://127.0.0.1:3000';const dir=gpuInstrumentation?'.tools/review/hero':'.tools/review/hero-without-gpu-probe';await mkdir(dir,{recursive:true});
const hardware=JSON.parse((await readFile('tmp/hero-hardware.json','utf8')).replace(/^\uFEFF/,''));
const html=await (await fetch(base)).text();const initial=[...new Set([...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m=>new URL(m[1],base).href))];
const percentile=(a,p)=>a.length?[...a].sort((x,y)=>x-y)[Math.max(0,Math.ceil(p*a.length)-1)]:null;
const runs=[];const browser=await chromium.launch({channel:'msedge',headless:true});const browserVersion=browser.version();
const buildId=(await readFile('.next/BUILD_ID','utf8')).trim();const sourceHash=createHash('sha256');
for(const file of ['package-lock.json','content/en.json','src/app/layout.tsx','src/app/page.tsx','src/app/globals.css','src/components/Journey.tsx','src/components/Navigation.tsx','src/lib/content.ts','src/lib/journey.ts','src/lib/hero.ts','src/lib/scene.ts','public/assets/portrait-manifest.json','specs/001-cinematic-identity/contracts/design.theme.css'])sourceHash.update(file).update(await readFile(file));
const buildSourceSha256=sourceHash.digest('hex');
try {
 for(const tier of [{name:'desktop',width:1440,height:900,dpr:1},{name:'mobile-emulation',width:390,height:844,dpr:3}])for(let run=1;run<=3;run++){
  const context=await browser.newContext({viewport:{width:tier.width,height:tier.height},deviceScaleFactor:tier.dpr,hasTouch:tier.name!=='desktop',isMobile:tier.name!=='desktop'});
  const page=await context.newPage();await page.bringToFront();const errors=[];const urls=new Set();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>urls.add(r.url()));
  await page.addInitScript(gpuInstrumentation=>{
    const stats={intervals:[],frames:[],lcp:[],shifts:[],events:[],longTasks:[],gpuTimer:false};window.heroProfile=stats;
    for(const [type,key] of [['largest-contentful-paint','lcp'],['layout-shift','shifts'],['event','events'],['longtask','longTasks']]){
      try{new PerformanceObserver(list=>{for(const e of list.getEntries())stats[key].push({start:e.startTime,duration:e.duration,value:e.value,hadRecentInput:e.hadRecentInput,id:e.interactionId});}).observe({type,buffered:true,...(type==='event'?{durationThreshold:16}:{})});}catch{/* Unsupported API remains empty, never invented. */}
    }
    const raf=requestAnimationFrame.bind(window);let active=null;
    window.requestAnimationFrame=callback=>raf(time=>{const frame={cpu:0,gpu:null,draws:0};const previous=active;active=frame;const start=performance.now();try{callback(time);}finally{frame.cpu=performance.now()-start;active=previous;if(frame.draws===3)stats.frames.push(frame);}});
    const states=new WeakMap();const pending=[];
    const clear=WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear=function(mask){
      const ready=document.querySelector('.hero-world')?.dataset.phase==='ready';
      if(active&&ready&&this.canvas.closest('.spatial-layer')){
        let state=states.get(this);if(!state){state={ext:gpuInstrumentation?this.getExtension('EXT_disjoint_timer_query_webgl2'):null,query:null};states.set(this,state);stats.gpuTimer=!!state.ext;}
        if(state.ext&&!state.query&&!this.isContextLost()){state.query=this.createQuery();state.frame=active;this.beginQuery(state.ext.TIME_ELAPSED_EXT,state.query);}
      }
      return clear.call(this,mask);
    };
    for(const key of ['drawArrays','drawElements']){
      const original=WebGL2RenderingContext.prototype[key];WebGL2RenderingContext.prototype[key]=function(...args){
        const result=Reflect.apply(original,this,args);if(active&&document.querySelector('.hero-world')?.dataset.phase==='ready'&&this.canvas.closest('.spatial-layer')){
          active.draws++;const state=states.get(this);if(state?.query&&active.draws===3){this.endQuery(state.ext.TIME_ELAPSED_EXT);pending.push({gl:this,query:state.query,frame:state.frame,ext:state.ext});state.query=null;}
        }return result;
      };
    }
    let previous=0;function sample(time){
      if(document.querySelector('.hero-world')?.dataset.phase==='ready'){if(previous)stats.intervals.push(time-previous);previous=time;}else previous=0;
      for(let i=pending.length-1;i>=0;i--){const q=pending[i];if(q.gl.getQueryParameter(q.query,q.gl.QUERY_RESULT_AVAILABLE)){
        if(!q.gl.getParameter(q.ext.GPU_DISJOINT_EXT))q.frame.gpu=q.gl.getQueryParameter(q.query,q.gl.QUERY_RESULT)/1e6;q.gl.deleteQuery(q.query);pending.splice(i,1);
      }}raf(sample);
    }raf(sample);
  },gpuInstrumentation);
  const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline.frame',transferMode:'ReturnAsStream'});
  await page.goto(base);await page.waitForFunction(()=>document.querySelector('.hero-world')?.dataset.phase==='ready');
  // Real local synthetic protocol: 20 s native wheel reversals; ten Hero-stage selections interrupted by wheel; 3 s idle.
  const started=Date.now();let direction=1;while(Date.now()-started<20000){await page.mouse.move(25,tier.height-40);await page.mouse.wheel(0,160*direction);direction*=-1;await page.waitForTimeout(240);}
  for(let i=0;i<10;i++){
    const nav=page.locator('.capsule');if(await nav.getAttribute('data-expanded')==='false')await page.getByRole('button',{name:'Toggle navigation'}).click();
    await page.locator('[data-stage-link]').click();await page.mouse.move(25,tier.height-40);await page.mouse.wheel(0,120*(i%2?1:-1));
  }
  await page.waitForTimeout(3000);
  const measured=await page.evaluate(()=>{
    const c=document.querySelector('canvas');const gl=c.getContext('webgl2');const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {stats:window.heroProfile,root:{...document.querySelector('.hero-world').dataset},gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null,canvas:{width:c.width,height:c.height},visibility:document.visibilityState};
  });
  const completed=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await completed;const chunks=[];
  for(;;){const chunk=await cdp.send('IO.read',{handle:stream,size:1048576});chunks.push(chunk.base64Encoded?Buffer.from(chunk.data,'base64'):Buffer.from(chunk.data));if(chunk.eof)break;}await cdp.send('IO.close',{handle:stream});
  const trace=Buffer.concat(chunks);const traceName=`${tier.name}-${run}.trace.json.gz`;await writeFile(`${dir}/${traceName}`,gzipSync(trace));
  const {stats}=measured;const median=percentile(stats.intervals,.5);const dropped=stats.intervals.reduce((n,dt)=>n+Math.max(0,Math.round(dt/median)-1),0);
  const initialAssets=[];for(const url of initial){const body=Buffer.from(await (await fetch(url)).arrayBuffer());initialAssets.push({url:new URL(url).pathname,bytes:body.length,gzipBytes:gzipSync(body).length});}
  const deferred=[];for(const url of urls){if(new URL(url).pathname.endsWith('.js')&&!initial.includes(url)){const body=Buffer.from(await (await fetch(url)).arrayBuffer());deferred.push({url:new URL(url).pathname,bytes:body.length,gzipBytes:gzipSync(body).length});}}
  const summary={tier,run,frameSamples:stats.intervals.length,medianFrameMs:median,p95FrameMs:percentile(stats.intervals,.95),estimatedDroppedPercent:100*dropped/(stats.intervals.length+dropped),ownCallbackP95Ms:percentile(stats.frames.map(f=>f.cpu),.95),gpuTimerAvailable:stats.gpuTimer,gpuP95Ms:percentile(stats.frames.filter(f=>f.gpu!==null).map(f=>f.gpu),.95),pairedCpuGpuP95Ms:percentile(stats.frames.filter(f=>f.gpu!==null).map(f=>f.cpu+f.gpu),.95),lcpMs:stats.lcp.at(-1)?.start??null,cls:stats.shifts.filter(s=>!s.hadRecentInput).reduce((n,s)=>n+s.value,0),eventDurationMaxMs:stats.events.length?Math.max(...stats.events.filter(e=>e.id).map(e=>e.duration)):null,longTasks:stats.longTasks,initialJsGzipBytes:initialAssets.reduce((n,a)=>n+a.gzipBytes,0),deferredJsGzipBytes:deferred.reduce((n,a)=>n+a.gzipBytes,0),initialAssets,deferred,gpu:measured.gpu,canvas:measured.canvas,root:measured.root,visibility:measured.visibility,errors,trace:{path:`${dir}/${traceName}`,sha256:createHash('sha256').update(trace).digest('hex'),uncompressedBytes:trace.length},requests:[...urls].map(url=>new URL(url).pathname)};
  runs.push(summary);await writeFile(`${dir}/${tier.name}-${run}.samples.json`,JSON.stringify(stats));console.log(JSON.stringify(summary));await context.close();
 }
}finally{await browser.close();}
const report={recordedAt:new Date().toISOString(),browserVersion,buildId,buildSourceSha256,browser:'installed Edge, headless, unthrottled loopback; fresh contexts/cache disabled; no RUM, no real phone',hardware,protocol:'cold intro; 20s native wheel reversals; 10 Hero-only navigation selections interrupted by native wheel; 3s idle. Not a Hero→About journey test.',frameEstimator:'RAF intervals; nominal cadence inferred by median; dropped estimate sums max(0,round(interval/median)-1). Not display presentation telemetry.',cpuGpuScope:'One RAF callback that issues all three Hero draws, plus paired EXT_disjoint_timer_query_webgl2 elapsed clear→third draw when available. Query instrumentation adds overhead. Cold upload excluded from ready-frame budget; long tasks retained.',runs};
report.gpuInstrumentation=gpuInstrumentation;
const reportPath=gpuInstrumentation?'docs/hero-performance.json':'docs/hero-performance-without-gpu-probe.json';
await writeFile(reportPath,JSON.stringify(report,null,2));console.log('Wrote '+reportPath+'; six raw CDP traces and sample files under '+dir);
