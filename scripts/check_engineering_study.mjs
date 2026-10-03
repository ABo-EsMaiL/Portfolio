import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile, readFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const expected=JSON.parse(await readFile('content/hero-ui.json','utf8'));
const report={url:'http://127.0.0.1:3003/',viewports:[],intro:[],modes:[],errors:[],requests:[]};
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:width<768?844:900}});
  page.on('pageerror',error=>report.errors.push({width,error:error.message}));page.on('console',message=>{if(message.type()==='error')report.errors.push({width,error:message.text()});});page.on('response',response=>{if(response.status()>=400)report.requests.push({width,url:response.url(),status:response.status()});});
  await page.goto(report.url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#stage').dataset.ready==='true');
  await page.waitForFunction(()=>document.querySelector('#stage').dataset.webgl==='true'&&Number(document.querySelector('#stage').dataset.drawCalls)>0);
  if(width===1440){
   await page.evaluate(()=>{const probe={samples:[],initial:null};window.studyProbe=probe;const frame=()=>{const stage=document.querySelector('#stage'),photo=document.querySelector('#portrait'),img=photo.querySelector('img');if(!probe.initial){const p=photo.getBoundingClientRect();probe.initial={width:p.width,height:p.height,clip:getComputedStyle(photo).clipPath};}if(stage.dataset.introPhase==='locked'){const r=img.getBoundingClientRect(),a={x:.3984375,y:.0478515625,width:.20572916666666666,height:.1962890625},face={x:r.x+r.width*a.x,y:r.y+r.height*a.y,width:r.width*a.width,height:r.height*a.height};const boxes=[...document.querySelectorAll('.tracker')].map(box=>{const b=box.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};});probe.samples.push({face,boxes});}if(stage.dataset.introPhase!=='ready')requestAnimationFrame(frame);};frame();});
  }
  await page.waitForFunction(()=>document.querySelector('#stage').dataset.view==='hero');
  if(width===1440){const probe=await page.evaluate(()=>window.studyProbe);assert(probe.samples.length>10);assert(Math.abs(probe.initial.height/probe.initial.width-1.9)<.01);let maxError=0;for(const sample of probe.samples)for(const box of sample.boxes)for(const key of ['x','y','width','height'])maxError=Math.max(maxError,Math.abs(box[key]-sample.face[key]));assert(maxError<2,`Face alignment: ${maxError}`);report.intro.push({width,samples:probe.samples.length,maxFaceError:maxError,initial:probe.initial});}
  const viewport={width,scenes:[]};
  for(const scene of ['hero','about','skills']){
   await page.locator(`[data-scene="${scene}"]`).click();await page.waitForTimeout(200);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width}/${scene}`);
   if(scene==='skills')for(let i=0;i<expected.skillDomains.length;i++){await page.locator(`[data-domain="${i}"]`).click();assert.deepEqual(await page.locator('.skill-list li').allTextContents(),expected.skillDomains[i].skills.map(skill=>skill.label.en));}
   await page.locator('.skill-list img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   await page.evaluate(()=>scrollTo(0,0));
   const screenshot=`docs/engineering-study-${width}-${scene}.png`;await page.screenshot({path:screenshot,fullPage:width<768});
   viewport.scenes.push({scene,screenshot,drawCalls:Number(await page.locator('#stage').getAttribute('data-draw-calls')),triangles:Number(await page.locator('#stage').getAttribute('data-triangles'))});
  }
  report.viewports.push(viewport);
  await page.locator('#pause').click();assert.equal(await page.locator('#pause').getAttribute('aria-pressed'),'true');await page.locator('#pause').click();assert.equal(await page.locator('#pause').getAttribute('aria-pressed'),'false');
  await page.locator('#replay').click();await page.waitForFunction(()=>document.querySelector('#stage').dataset.view==='intro');await page.locator('[data-scene="skills"]').click();await page.waitForTimeout(3400);assert.equal(await page.locator('#stage').getAttribute('data-view'),'skills');
  await page.close();
 }
 const reduce=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduce.goto(report.url);await reduce.waitForFunction(()=>document.querySelector('#stage').dataset.ready==='true');assert.equal(await reduce.locator('#stage').getAttribute('data-view'),'hero');await reduce.locator('[data-scene="skills"]').click();await reduce.getByRole('button',{name:'Models & agents'}).focus();await reduce.keyboard.press('Enter');assert.equal(await reduce.locator('[data-domain="1"]').getAttribute('aria-pressed'),'true');report.modes.push('reduced motion / keyboard selection');await reduce.close();
 const fallback=await browser.newPage({viewport:{width:390,height:844}});await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});await fallback.goto(report.url);await fallback.waitForFunction(()=>document.querySelector('#stage').dataset.ready==='true');await fallback.locator('[data-scene="skills"]').click();assert.equal(await fallback.locator('#stage').getAttribute('data-webgl'),'false');assert(await fallback.locator('.fallback-assembly').isVisible());assert((await fallback.locator('.skill-list li').count())>0);report.modes.push('no-WebGL readable capability fallback');await fallback.close();
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);
 await writeFile('docs/engineering-study-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}