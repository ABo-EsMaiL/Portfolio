import { test, expect } from '@playwright/test';
import content from '../content/en.json' with { type: 'json' };

async function probeDraws(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const probe={draws:0};Object.defineProperty(window,'renderProbe',{value:probe});
    for (const key of ['drawArrays','drawElements'] as const) {
      const original=WebGL2RenderingContext.prototype[key];
      Object.defineProperty(WebGL2RenderingContext.prototype,key,{value:function(this:WebGL2RenderingContext,...args:unknown[]) { probe.draws++;return Reflect.apply(original,this,args); }});
    }
  });
}

test('real WebGL tiers resize correctly; context loss stops draws and restores readable image',async ({page}) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await probeDraws(page);await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const root=page.locator('.hero-world');await expect(root).toHaveAttribute('data-phase','ready');await expect(root).toHaveAttribute('data-webgl','true');
  await expect.poll(async()=>Number(await root.getAttribute('data-draw-calls'))).toBeGreaterThan(0);
  await expect.poll(async()=>Number(await root.getAttribute('data-points'))).toBeGreaterThan(0);
  await expect(page.locator('.spatial-layer canvas')).toHaveCount(1);
  const desktopRatio=await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).width/c.getBoundingClientRect().width);expect(desktopRatio).toBeLessThanOrEqual(1.5);
  await page.setViewportSize({width:390,height:844});
  await expect.poll(()=>page.locator('canvas').evaluate(c=>c.getBoundingClientRect().width)).toBe(390);
  const mobileRatio=await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).width/c.getBoundingClientRect().width);expect(mobileRatio).toBeLessThanOrEqual(1.25);
  await page.evaluate(()=>document.querySelector('canvas')!.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(root).toHaveAttribute('data-webgl','false');await expect(page.locator('canvas')).toHaveCount(0);await expect(root).toHaveAttribute('data-draw-calls','0');
  const stable=await page.evaluate(async ()=>{
    const probe=(window as typeof window & {renderProbe:{draws:number}}).renderProbe;const before=probe.draws;
    await new Promise<void>(resolve=>{let n=0;function frame(){if(++n===30)resolve();else requestAnimationFrame(frame);}requestAnimationFrame(frame);});return probe.draws===before;
  });expect(stable).toBe(true);
  expect(await page.locator('.portrait-image').evaluate(img=>getComputedStyle(img).opacity)).toBe('1');
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await expect(page.locator('.monitor-fallback')).toBeVisible();await expect(page.locator('.about-copy h2')).toHaveText(content.profile.fullName);
  expect(errors).toEqual([]);
});

test('WebGL unavailable uses the same cutout with no leaked canvas',async ({page}) => {
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,type:string,...args:unknown[]){return type.includes('webgl')?null:Reflect.apply(original,this,[type,...args]);}});});
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','false');await expect(page.locator('canvas')).toHaveCount(0);
  expect(await page.locator('.portrait-image').evaluate(img=>getComputedStyle(img).opacity)).toBe('1');await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await expect(page.locator('.monitor-fallback')).toBeVisible();await expect(page.locator('.about-copy h2')).toHaveText(content.profile.fullName);
});

test('shared source failure reports an unavailable portrait and leaves both identities usable without GPU leaks',async ({page}) => {
  await page.route('**/portrait-scene-960.webp',route=>route.abort());await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','false');await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-image-failed','true');
  await expect(page.getByText('Portrait unavailable',{exact:true})).toBeVisible();
  expect(await page.locator('.portrait-image').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(0);
  await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await expect(page.locator('.intro-copy')).toHaveText(content.about.bio.en);
});

test('live reduced-motion change disposes the active spatial layer',async ({page}) => {
  await probeDraws(page);await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');await expect(page.locator('.hero-world')).toHaveAttribute('data-points','0');
  await expect(page.locator('.hero-world')).not.toHaveClass(/is-enhanced/);
  await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();await expect(page.locator('#about')).toBeVisible();
  expect(await page.locator('#about').evaluate(node=>(node as HTMLElement).inert)).toBe(false);
  expect(await page.locator('.portrait-image').evaluate(img=>getComputedStyle(img).opacity)).toBe('1');
  const before=await page.evaluate(()=>(window as typeof window & {renderProbe:{draws:number}}).renderProbe.draws);await page.waitForTimeout(350);
  expect(await page.evaluate(()=>(window as typeof window & {renderProbe:{draws:number}}).renderProbe.draws)).toBe(before);
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page).toHaveURL(/#about$/);await expect(page.locator('#about')).toBeInViewport();
});

for (const mode of ['wheel','keyboard','touch'] as const) {
  test(`trusted ${mode} input preserves native scroll and a single handoff`,async ({browser}) => {
    const context=await browser.newContext({viewport:{width:390,height:600},hasTouch:true,isMobile:true});const page=await context.newPage();
    try {
      await page.goto('/');await page.waitForFunction(()=>document.querySelector<HTMLElement>('.hero-world')?.dataset.phase==='hunting');
      await page.evaluate(type=>{
        const root=document.querySelector<HTMLElement>('.hero-world')!;let start=0;
        window.addEventListener(type,event=>{start=performance.now();root.dataset.inputTrusted=String(event.isTrusted);},{once:true,capture:true});
        const observer=new MutationObserver(()=>{if(root.dataset.phase==='ready'&&start){root.dataset.inputElapsed=String(performance.now()-start);observer.disconnect();}});observer.observe(root,{attributes:true,attributeFilter:['data-phase']});
      },mode==='keyboard'?'keydown':mode==='touch'?'touchmove':'wheel');
      if(mode==='wheel'){await page.mouse.move(25,550);await page.mouse.wheel(0,200);}
      else if(mode==='keyboard'){await page.keyboard.press('PageDown');}
      else {
        const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:25,y:550}]});
        for(const y of [500,450,400,350,300])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:25,y}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      }
      const root=page.locator('.hero-world');await expect(root).toHaveAttribute('data-phase','ready');await expect(root).toHaveAttribute('data-handoffs','1');await expect(root).toHaveAttribute('data-input-trusted','true');
      expect(Number(await root.getAttribute('data-input-elapsed'))).toBeLessThanOrEqual(200);
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);await expect.poll(async()=>Number(await root.getAttribute('data-progress'))).toBeGreaterThan(0);
    }finally{await context.close();}
  });
}

test('scene requests stay local and never load an ML model or source archive',async ({page}) => {
  const urls:string[]=[];page.on('request',r=>urls.push(r.url()));await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
  const origin=new URL(page.url()).origin;expect(urls.every(url=>new URL(url).origin===origin)).toBe(true);
  expect(urls.some(url=>/onnx|u2net|isnet|\.wasm|portrait-source-cutout|portrait-source-mask/.test(url))).toBe(false);
});

test('camera journey preserves full source UVs while the real GPU portrait fits the screen and reverses',async ({page})=>{
  await page.addInitScript(crop=>{
    const gl=WebGL2RenderingContext.prototype;
    const probe={draws:0,buffer:0,bottom:0,width:0};Object.defineProperty(window,'portraitGpuProbe',{value:probe});
    const uniforms=new WeakMap<WebGLUniformLocation,{name:string;program:WebGLProgram}>(),widths=new WeakMap<WebGLProgram,number>();let program:WebGLProgram|null=null;
    const use=gl.useProgram;gl.useProgram=function(value){program=value;return use.call(this,value);};
    const location=gl.getUniformLocation;gl.getUniformLocation=function(program,name){const value=location.call(this,program,name);if(value)uniforms.set(value,{name,program});return value;};
    const matrix=gl.uniformMatrix4fv;gl.uniformMatrix4fv=function(location,transpose,value){const uniform=location?uniforms.get(location):undefined;if(uniform?.name==='modelViewMatrix'){const [x,y,z]=Array.from(value);widths.set(uniform.program,Math.hypot(x,y,z));}return matrix.call(this,location,transpose,value);};
    let bound:WebGLBuffer|null=null,vao:WebGLVertexArrayObject|null=null,nextId=0;
    const uploads=new WeakMap<WebGLBuffer,{id:number;bottom:number}>();
    const attributes=new Map<WebGLVertexArrayObject|null,Map<number,WebGLBuffer>>();
    const bind=gl.bindBuffer;gl.bindBuffer=function(target,buffer){if(target===this.ARRAY_BUFFER)bound=buffer;return bind.call(this,target,buffer);};
    const bindVao=gl.bindVertexArray;gl.bindVertexArray=function(value){vao=value;return bindVao.call(this,value);};
    for(const key of ['bufferData','bufferSubData'] as const) {
      const original=gl[key];
      Object.defineProperty(gl,key,{value:function(this:WebGL2RenderingContext,...args:unknown[]){
        const data=args[key==='bufferData'?1:2];
        // Source UVs identify the portrait, not the idle cloud, monitor or packet meshes.
        if(args[0]===this.ARRAY_BUFFER&&bound&&data instanceof Float32Array&&data.length===8&&Math.abs(data[0]-crop.x)<.00001&&Math.abs(data[2]-crop.x-crop.width)<.00001&&Math.abs(data[1]-(1-crop.y))<.00001) {
          const previous=uploads.get(bound);uploads.set(bound,{id:previous?.id??++nextId,bottom:data[5]});
        }
        return Reflect.apply(original,this,args);
      }});
    }
    const attribute=gl.vertexAttribPointer;
    gl.vertexAttribPointer=function(...args){if(bound){const buffers=attributes.get(vao)??new Map<number,WebGLBuffer>();buffers.set(args[0],bound);attributes.set(vao,buffers);}return Reflect.apply(attribute,this,args);};
    const disable=gl.disableVertexAttribArray;gl.disableVertexAttribArray=function(index){attributes.get(vao)?.delete(index);return disable.call(this,index);};
    for(const key of ['drawArrays','drawElements'] as const) {
      const original=gl[key];
      Object.defineProperty(gl,key,{value:function(this:WebGL2RenderingContext,...args:unknown[]){
        for(const buffer of attributes.get(vao)?.values()??[]) {const upload=uploads.get(buffer);if(upload){probe.draws++;probe.buffer=upload.id;probe.bottom=upload.bottom;probe.width=program?widths.get(program)??0:0;}}
        return Reflect.apply(original,this,args);
      }});
    }
  },content.portrait.aboutCrop);
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const root=page.locator('.hero-world');await expect(root).toHaveAttribute('data-phase','ready');await expect(root).toHaveAttribute('data-webgl','true');
  const read=()=>page.evaluate(()=>(window as typeof window & {portraitGpuProbe:{draws:number;buffer:number;bottom:number;width:number}}).portraitGpuProbe);
  await expect.poll(async()=>(await read()).draws).toBeGreaterThan(0);
  const hero=await read();expect(hero.bottom).toBeCloseTo(1-content.portrait.aboutCrop.y-content.portrait.aboutCrop.height,5);
  expect(hero.width).toBeCloseTo((await page.locator('.portrait-stage').boundingBox())!.width,1);
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await expect.poll(async()=>(await read()).width).toBeLessThan(hero.width*.6);
  const about=await read();expect(about.buffer).toBe(hero.buffer);expect(about.draws).toBeGreaterThan(hero.draws);
  // Idle pulses cannot satisfy the model-matrix reversal assertion.
  await page.evaluate(()=>scrollTo(0,0));await expect(root).toHaveAttribute('data-stage','Hero');
  await expect.poll(async()=>(await read()).width).toBeCloseTo(hero.width,1);
  const reversed=await read();expect(reversed.buffer).toBe(hero.buffer);expect(reversed.draws).toBeGreaterThan(about.draws);
  await expect(page.locator('.spatial-layer canvas')).toHaveCount(1);
});

test('wheel over the capsule is native journey input, not a hover/toggle scrub',async ({page}) => {
  await page.setViewportSize({width:390,height:600});await page.goto('/');await page.waitForFunction(()=>document.querySelector<HTMLElement>('.hero-world')?.dataset.phase==='hunting');
  await page.locator('.capsule').hover();await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','hunting');await page.mouse.wheel(0,180);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0);
});

test('high-DPR touch tier is capped and scroll does not keep an artificial hover open',async ({browser}) => {
  const context=await browser.newContext({viewport:{width:390,height:600},deviceScaleFactor:3,hasTouch:true,isMobile:true});const page=await context.newPage();
  try{
    await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    const ratio=await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).width/c.getBoundingClientRect().width);expect(ratio).toBeLessThanOrEqual(1.25);
    await page.getByRole('button',{name:'Toggle navigation'}).tap();await page.getByRole('button',{name:'Toggle navigation'}).tap();await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();scrollTo(0,120);});
    await expect(page.locator('.capsule')).toHaveAttribute('data-expanded','false');
  }finally{await context.close();}
});

test('synthetic visibility signal stops real GPU draws and resumes the same scene',async ({page}) => {
  // Headed/headless automation did not expose native hidden state on this host.
  // This tests our handler, not actual OS/tab visibility; native check remains a disclosed review gap.
  await probeDraws(page);await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  const before=await page.evaluate(()=>(window as typeof window & {renderProbe:{draws:number}}).renderProbe.draws);await page.waitForTimeout(350);
  expect(await page.evaluate(()=>(window as typeof window & {renderProbe:{draws:number}}).renderProbe.draws)).toBe(before);
  await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(n=>(window as typeof window & {renderProbe:{draws:number}}).renderProbe.draws>n,before);
});
