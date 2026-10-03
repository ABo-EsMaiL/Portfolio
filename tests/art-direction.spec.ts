import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import content from '../content/en.json' with { type: 'json' };
import heroUi from '../content/hero-ui.json' with { type: 'json' };

for (const width of [320,390,600,768,1440]) {
  test(`light engineering composition unfolds into a monitor at ${width}px`,async ({page}) => {
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.setViewportSize({width,height:width<768?844:900});await page.goto('/');
    await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('.capsule').evaluate(node=>getComputedStyle(node).backdropFilter)).toMatch(/blur\(/);
    expect(await page.locator('html').evaluate(node=>getComputedStyle(node).colorScheme)).toBe('light');
    await expect(page.locator('h1')).toHaveText(content.hero.heading.en);
    await expect(page.locator('.headline-line')).toHaveCount(2);
    if(width>=1200){
      const title=await page.evaluate(()=>({centers:Array.from(document.querySelectorAll('.headline-line'),line=>{const range=document.createRange();range.selectNodeContents(line);const r=range.getBoundingClientRect();return r.x+r.width/2;}),gap:document.querySelector('.detection-hud-2')!.getBoundingClientRect().top-document.querySelector('.headline-line:last-child > span:first-child')!.getBoundingClientRect().bottom,mask:getComputedStyle(document.querySelector('.identity')!).maskComposite}));
      for(const center of title.centers)expect(Math.abs(center-width/2)).toBeLessThan(1);
      expect(title.gap).toBeGreaterThanOrEqual(16);expect(title.gap).toBeLessThanOrEqual(64);expect(title.mask).toMatch(/^exclude(?:,\s*exclude)*$/);
      expect(await page.locator('.headline-line:last-child').evaluate(node=>parseFloat(getComputedStyle(node).marginTop))).toBe(-8);
    }
    const heroCrop=await page.locator('.portrait-motion').evaluate(node=>{const rect=node.getBoundingClientRect(),inset=getComputedStyle(node).clipPath.slice(6,-1).split(/\s+/).map(parseFloat);return{visible:rect.height-(inset[2]??inset[0]??0),full:rect.height};});
    if(width<1200)expect(heroCrop.visible/heroCrop.full).toBeCloseTo(1,2);
    else expect(heroCrop.visible/heroCrop.full).toBeGreaterThanOrEqual(content.portrait.heroCrop.height/content.portrait.aboutCrop.height);
    await expect(page.locator('.role')).toHaveText(content.hero.subtitle.en);
    const type=await page.evaluate(()=>({name:parseFloat(getComputedStyle(document.querySelector('.hero-name')!).fontSize),role:parseFloat(getComputedStyle(document.querySelector('.role')!).fontSize),icon:document.querySelector('.socials svg')!.getBoundingClientRect().width}));
    expect(type.name).toBeGreaterThan(type.role);expect(type.icon).toBeGreaterThanOrEqual(width<1024?24:25);
    for(const selector of ['.hero-name','.role']){
      const singleLine=await page.locator(selector).evaluate(node=>{const range=document.createRange();range.selectNodeContents(node);return{lines:new Set(Array.from(range.getClientRects(),r=>Math.round(r.top))).size,width:node.scrollWidth,available:node.clientWidth};});
      if(width>=1024)expect(singleLine.lines).toBe(1);expect(singleLine.width).toBeLessThanOrEqual(singleLine.available);
    }
    expect(await page.locator('h1').evaluate(node=>getComputedStyle(node).fontWeight)).toBe('800');
    expect(await page.locator('h1').evaluate(node=>getComputedStyle(node).textTransform)).toBe('uppercase');
    await expect(page.locator('.engineering-note')).not.toContainText('—');
    await expect(page.locator('.capsule-panel a')).toHaveText([content.profile.displayName,'Hero','About']);
    await expect(page.locator('.focus-tags li')).toHaveText(heroUi.focusTags.map(tag=>tag.en));
    await expect(page.locator('.detection-hud')).toHaveCount(3);
    await expect(page.locator('.detection-tracker,.annotation-badge,.voice-wave,#identity-summary')).toHaveCount(0);
    await expect(page.getByText('Who is he?',{exact:true})).toHaveCount(0);
    await expect(page.getByRole('link',{name:'Profile notes',exact:true})).toHaveCount(0);
    await expect(page.getByRole('link',{name:'Find out',exact:true})).toBeVisible();
    for(const node of await page.locator('h1,.role,.focus-tags li,.capsule-panel a').all()) {
      expect((await node.textContent())?.trim()).not.toMatch(/\.$/);
    }
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    await page.mouse.move(width-32,180);
    await page.getByRole('link',{name:'Find out',exact:true}).click();
    await expect(page.locator('#about')).toBeFocused();
    const portrait=(await page.locator('.portrait-stage').boundingBox())!;
    const monitor=await page.locator('.monitor-fallback').evaluate(node=>{const rect=node.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height};});
    expect(portrait.y).toBeLessThan(monitor.y);
    expect(portrait.y+portrait.height).toBeGreaterThan(monitor.y);
    expect(Math.abs(portrait.y+portrait.height-monitor.y-monitor.height*.977)).toBeLessThan(2);
    expect(Math.abs(portrait.x+portrait.width/2-monitor.x-monitor.width/2)).toBeLessThan(2);
    expect(monitor.x).toBeGreaterThanOrEqual(0);expect(monitor.x+monitor.width).toBeLessThanOrEqual(width);
    await expect(page.locator('.about-copy h2')).toHaveText(content.profile.fullName);
    await expect(page.locator('.intro-copy')).toHaveText(content.about.bio.en);
    await expect(page.locator('.about-stack span')).toHaveText(['Python','FastAPI','TensorFlow','Docker']);
    for(const node of await page.locator('.about-copy h2,.about-role,.about-stack span').all()) expect((await node.textContent())?.trim()).not.toMatch(/\.$/);
    expect(Number(await page.locator('.hero-world').getAttribute('data-cables'))).toBeGreaterThan(.95);
    const dockIcon=await page.locator('.socials svg').first().evaluate(node=>node.getBoundingClientRect().width);
    if(width<1024)expect(dockIcon).toBe(type.icon);else expect(dockIcon).toBeLessThan(type.icon);
    expect(dockIcon).toBeGreaterThanOrEqual(width<1024?24:26);
    const separation=await page.evaluate(()=>{
      const monitor=document.querySelector('.monitor-fallback')!.getBoundingClientRect(),about=document.querySelector('.about-copy')!.getBoundingClientRect();
      return innerWidth<1200?about.top-(monitor.top+monitor.height*1.23):about.left-monitor.right;
    });
    expect(separation).toBeGreaterThanOrEqual(20);
    expect(await page.locator('.intro-copy').evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
    for(const link of await page.locator('.socials a').all())expect((await link.boundingBox())!.width).toBeGreaterThanOrEqual(44);
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('binary inputs are separate glyph textures; skill assets stay local',async({page})=>{
  await page.addInitScript(()=>{
    const glyphs:string[]=[];Object.defineProperty(window,'sceneGlyphs',{value:glyphs});
    const fillText=CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText=function(text,...args){glyphs.push(text);return Reflect.apply(fillText,this,[text,...args]);};
  });
  const icons:string[]=[];page.on('response',response=>{if(/\/assets\/skills\/.*\.(svg|png)$/.test(response.url())){expect(response.status()).toBe(200);icons.push(response.url());}});
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
  const glyphs=await page.evaluate(()=>(window as typeof window & {sceneGlyphs:string[]}).sceneGlyphs);
  expect(glyphs).toContain('0');expect(glyphs).toContain('1');expect(glyphs).not.toContain('0 1');
  const fields=new Set(['database','text','network','pipeline']);
  const expected=[...new Set(heroUi.skillDomains.flatMap(domain=>domain.skills.map(skill=>skill.icon)))].filter(icon=>!fields.has(icon));
  expect([...new Set(icons.map(url=>url.split('/').at(-1)!.replace(/(-reference\.png|\.svg)$/,'')))].sort()).toEqual(expected.sort());
  for(const url of icons)expect(new URL(url).origin).toBe(new URL(page.url()).origin);
  await expect(page.getByRole('list',{name:'CV skills feeding the system'}).locator('li')).toHaveText(heroUi.skillDomains.flatMap(domain=>domain.skills.map(skill=>skill.label.en)));
});

test('owner Facebook link and brand hover/focus colors survive the social train',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  const colors={linkedin:'rgb(10, 102, 194)',github:'rgb(24, 23, 23)',facebook:'rgb(8, 102, 255)',email:'rgb(179, 38, 30)'};
  await expect(page.getByRole('link',{name:'Facebook',exact:true})).toHaveAttribute('href','https://www.facebook.com/AhmedAbdElHady222/');
  for(const stage of ['hero','about']){
    if(stage==='about'){await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();}
    for(const [id,color] of Object.entries(colors)){
      const link=page.locator(`.socials a[data-social=${id}]`),svg=link.locator('svg');
      await link.hover();await expect(svg).toHaveCSS('color','rgb(255, 255, 255)');expect(await link.evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe(color);
      await page.mouse.move(1430,850);await link.focus();await expect(svg).toHaveCSS('color','rgb(255, 255, 255)');expect(await link.evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe(color);
      await link.evaluate(node=>(node as HTMLElement).blur());
    }
    expect(await page.locator('.world-light').evaluate(node=>getComputedStyle(node).backgroundImage)).not.toContain('world-substrate.svg');
    expect(await page.locator('.monitor-fallback').evaluate(node=>getComputedStyle(node).backgroundImage)).toContain('world-substrate.svg');
  }
});

test('skill artwork is 60 percent while packet labels stay readable',async({page})=>{
  await page.addInitScript(()=>{
    const probe={sizes:[] as number[],fields:[] as number[],fonts:[] as string[]};Object.defineProperty(window,'skillArtwork',{value:probe});
    const proto=CanvasRenderingContext2D.prototype,draw=proto.drawImage,scale=proto.scale,fill=proto.fillText;
    Object.defineProperty(proto,'drawImage',{value:function(this:CanvasRenderingContext2D,image:CanvasImageSource,...args:number[]){if(this.canvas instanceof HTMLCanvasElement&&this.canvas.dataset.skill&&args.length===4)probe.sizes.push(Math.max(args[2],args[3]));return Reflect.apply(draw,this,[image,...args]);}});
    proto.scale=function(x,y){if(this.canvas instanceof HTMLCanvasElement&&this.canvas.dataset.skill&&x!==2)probe.fields.push(x);return scale.call(this,x,y);};
    proto.fillText=function(text,...args){if(this.canvas instanceof HTMLCanvasElement&&this.canvas.dataset.skill)probe.fonts.push(this.font);return Reflect.apply(fill,this,[text,...args]);};
  });
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
  const probe=await page.evaluate(()=>(window as typeof window&{skillArtwork:{sizes:number[];fields:number[];fonts:string[]}}).skillArtwork);
  expect(probe.sizes.length).toBeGreaterThan(0);for(const size of probe.sizes)expect(size).toBeCloseTo(152*.6,4);
  expect(probe.fields.length).toBeGreaterThan(0);for(const size of probe.fields)expect(size).toBeCloseTo(1.5*.6,4);
  expect(probe.fonts.length).toBeGreaterThan(0);for(const font of probe.fonts)expect(font).toMatch(/^600 40px /);
});

test('no-JS discovery anchor and full static portrait remain functional',async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try {
    const page=await context.newPage();await page.goto('/');await expect(page.locator('canvas')).toHaveCount(0);
    const crops=await page.evaluate(()=>{const hero=document.querySelector('.portrait-stage')!.getBoundingClientRect(),about=document.querySelector('.about-portrait')!.getBoundingClientRect();return{hero:hero.width/hero.height,about:about.width/about.height};});
    expect(crops.hero).toBeCloseTo(.75*content.portrait.heroCrop.width/content.portrait.heroCrop.height,3);
    expect(crops.about).toBeCloseTo(.75*content.portrait.aboutCrop.width/content.portrait.aboutCrop.height,3);
    await page.getByRole('link',{name:'Find out',exact:true}).click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#about')).toBeInViewport();
    await expect(page.locator('.about-portrait img')).toHaveAttribute('src','/assets/portrait-scene-960.webp');
    expect(await page.locator('.about-portrait img').evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
    await expect(page.getByRole('img',{name:'Portrait of Ahmed Esmail'})).toBeVisible();
  } finally {await context.close();}
});
test('complete uploaded phone cable tails stay outside the readable CV column',async({page})=>{
  await page.addInitScript(()=>{
    const tubes:number[][]=[];Object.defineProperty(window,'wireVertices',{value:tubes});
    const gl=WebGL2RenderingContext.prototype,upload=gl.bufferData;
    Object.defineProperty(gl,'bufferData',{value:function(this:WebGL2RenderingContext,...args:unknown[]){const data=args[1];
      if(args[0]===this.ARRAY_BUFFER&&data instanceof Float32Array&&data.length===(128+1)*(8+1)*3){
        const points=Array.from(data),ys=points.filter((_,i)=>i%3===1),zs=points.filter((_,i)=>i%3===2);
        if(Math.min(...ys)<-.6&&Math.max(...zs.map(Math.abs))<.1)tubes.push(points);
      }return Reflect.apply(upload,this,args);
    }});
  });
  for(const width of [320,390,600]){
    await page.setViewportSize({width,height:844});await page.goto('/');
    await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
    await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
    const result=await page.evaluate(()=>{
      const tubes=(window as typeof window&{wireVertices:number[][]}).wireVertices;
      const monitor=document.querySelector('.monitor-fallback')!.getBoundingClientRect(),about=document.querySelector('.about-copy')!.getBoundingClientRect();
      const hits:{x:number;y:number}[]=[];let collisions=0;for(const tube of tubes.slice(-3))for(let i=0;i<tube.length;i+=3){
        const x=monitor.left+monitor.width/2+tube[i]*monitor.width,y=monitor.top+monitor.height/2-tube[i+1]*monitor.width;
        if(y>about.top-8&&y<about.bottom+8&&x>about.left-8&&x<about.right+8){collisions++;hits.push({x,y});}
      }
      return{width:innerWidth,tubes:tubes.length,collisions,hits,about:{left:about.left,right:about.right,top:about.top,bottom:about.bottom}};
    });
    expect(result.tubes).toBeGreaterThanOrEqual(3);expect(result.collisions,JSON.stringify(result)).toBe(0);
  }
});
test('drawn phone skill packets clear the monitor stand, social controls and CV copy',async({page})=>{
  test.setTimeout(60000);
  await page.addInitScript(()=>{
    const result={draws:0,collisions:0,hits:[] as unknown[]};Object.defineProperty(window,'skillClearance',{value:result});
    const gl=WebGL2RenderingContext.prototype,names=new WeakMap<WebGLUniformLocation,string>(),location=gl.getUniformLocation,matrix=gl.uniformMatrix4fv;
    gl.getUniformLocation=function(program,name){const value=location.call(this,program,name);if(value)names.set(value,name);return value;};
    gl.uniformMatrix4fv=function(location,transpose,value){
      const root=document.querySelector<HTMLElement>('.hero-world'),v=Array.from(value);
      if(location&&names.get(location)==='modelViewMatrix'&&innerWidth<768&&Number(root?.dataset.progress)>.999&&Math.abs(Math.hypot(v[0],v[1],v[2])-52)<.1&&Math.abs(Math.hypot(v[4],v[5],v[6])-52*4/3)<.1){
        const canvas=document.querySelector('.spatial-layer')!.getBoundingClientRect(),monitor=document.querySelector('.monitor-fallback')!.getBoundingClientRect(),dock=document.querySelector('.social-dock')!.getBoundingClientRect(),about=document.querySelector('.about-copy')!.getBoundingClientRect();
        const x=innerWidth/2+v[12],y=canvas.top+canvas.height/2-v[13];
        const hits=(left:number,top:number,right:number,bottom:number)=>x+26>left&&x-26<right&&y+52*2/3>top&&y-52*2/3<bottom;
        result.draws++;if(hits(dock.left,dock.top,dock.right,dock.bottom)||hits(monitor.left+monitor.width*.34,monitor.bottom,monitor.left+monitor.width*.66,monitor.top+monitor.height*1.23)||hits(about.left,about.top,about.right,about.bottom)){result.collisions++;result.hits.push({x,y,dock:dock.toJSON(),monitor:monitor.toJSON(),about:about.toJSON(),progress:root?.dataset.progress});}
      }return matrix.call(this,location,transpose,value);
    };
  });
  for(const width of [390,600]){
    await page.setViewportSize({width,height:844});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-webgl','true');
    await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
    await page.waitForTimeout(6500);
    const result=await page.evaluate(()=>(window as typeof window&{skillClearance:{draws:number;collisions:number}}).skillClearance);
    expect(result.draws).toBeGreaterThan(0);expect(result.collisions,JSON.stringify(result)).toBe(0);
  }
});
