import { test, expect, type Page } from '@playwright/test';
import content from '../content/en.json' with { type: 'json' };

async function scrollJourney(page:Page,progress:number) {
  await page.evaluate(p=>{
    const root=document.querySelector<HTMLElement>('.hero-world')!;
    const track=root.querySelector<HTMLElement>('.journey-track')!;
    const stage=root.querySelector<HTMLElement>('.world-stage')!;
    scrollTo(0,root.offsetTop+p*(track.offsetHeight-stage.clientHeight));
  },progress);
  await expect.poll(async()=>Number(await page.locator('.hero-world').getAttribute('data-progress'))).toBeCloseTo(progress,2);
}

for(const [width,height] of [[390,600],[768,900],[1440,900]]){
  test(`integrated entrance shows the complete source grounded to the viewport at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector<HTMLElement>('.hero-world')?.dataset.phase==='hunting');
    const state=await page.evaluate(()=>{
      const portrait=document.querySelector('.portrait-stage')!.getBoundingClientRect(),image=document.querySelector('.portrait-image')!.getBoundingClientRect();
      const nav=document.querySelector('.capsule')!.getBoundingClientRect(),clip=getComputedStyle(document.querySelector('.portrait-motion')!).clipPath.match(/[\d.]+px/g)?.map(parseFloat)??[];
      return{top:portrait.top,bottom:portrait.bottom,imageHeight:image.height,portraitHeight:portrait.height,navBottom:nav.bottom,clipBottom:clip[2]??0};
    });
    expect(state.top).toBeGreaterThanOrEqual(state.navBottom+24);
    expect(state.bottom).toBeCloseTo(height,0);expect(state.imageHeight).toBeCloseTo(state.portraitHeight,0);expect(state.clipBottom).toBeLessThan(1);
    await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    await expect(page.locator('body')).not.toContainText(/dashboard|4\s*\/\s*6|Replay entrance|Next scene/i);
    // Short viewports retain the accepted capsule route; the lower Hero CTA is outside that viewport.
    await page.getByRole('link',{name:height<844?'About':'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
    if(width>=1200){
      const clearance=await page.evaluate(()=>document.querySelector('.about-copy')!.getBoundingClientRect().left-document.querySelector('.monitor-fallback')!.getBoundingClientRect().right);
      expect(clearance).toBeGreaterThanOrEqual(20);
    }
  });
}

test('decoded portrait enters, three frames lock the source face, then identity reveals without an unresolved beat',async ({page})=>{
  await page.addInitScript(()=>{
    const probe={phases:[] as {phase:string;at:number;decoded:boolean;fonts:string}[],revealedPhase:''};
    Object.defineProperty(window,'introProbe',{value:probe});
    new MutationObserver(()=>{
      const root=document.querySelector<HTMLElement>('.hero-world'),phase=root?.dataset.phase;
      if(phase&&phase!==probe.phases.at(-1)?.phase) probe.phases.push({phase,at:performance.now(),decoded:!!document.querySelector<HTMLImageElement>('.portrait-image')?.naturalWidth,fonts:document.fonts.status});
      const identity=root?.querySelector<HTMLElement>('.identity');
      if(!probe.revealedPhase&&root?.classList.contains('is-enhanced')&&identity&&Number(getComputedStyle(identity).opacity)>.01) probe.revealedPhase=phase??'';
    }).observe(document,{subtree:true,attributes:true,attributeFilter:['data-phase','style']});
  });
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector<HTMLElement>('.hero-world')?.dataset.phase==='locked');
  const boxes=await page.locator('.detection-hud').evaluateAll(nodes=>nodes.map(node=>{
    const rect=node.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height};
  }));
  expect(boxes).toHaveLength(3);
  const face=await page.locator('.portrait-image').evaluate((image,anchor)=>{
    const rect=image.getBoundingClientRect();return{x:rect.x+rect.width*anchor.x,y:rect.y+rect.height*anchor.y,width:rect.width*anchor.width,height:rect.height*anchor.height};
  },content.portrait.faceBox);
  for(const box of boxes) for(const key of ['x','y','width','height'] as const) expect(Math.abs(box[key]-face[key])).toBeLessThan(2);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  const probe=await page.evaluate(()=>(window as typeof window & {introProbe:{phases:{phase:string;at:number;decoded:boolean;fonts:string}[];revealedPhase:string}}).introProbe);
  expect(probe.phases.map(item=>item.phase).filter(phase=>phase!=='loading')).toEqual(['entering','hunting','locked','ready']);
  const entrance=probe.phases.find(item=>item.phase==='entering')!;
  expect(entrance.decoded).toBe(true);expect(entrance.fonts).toBe('loaded');
  expect(probe.revealedPhase).toBe('locked');
  const elapsed=probe.phases.at(-1)!.at-entrance.at;
  expect(elapsed).toBeGreaterThan(6500);expect(elapsed).toBeLessThan(8500);
  await expect(page.locator('.resource-loader')).toBeHidden();
});

for(const width of [390,1440]) {
  test(`same portrait and social train reverse through five native progress samples at ${width}px`,async ({page})=>{
    await page.setViewportSize({width,height:900});await page.goto('/');
    const root=page.locator('.hero-world');await expect(root).toHaveAttribute('data-phase','ready');
    const image=await page.locator('.portrait-image').elementHandle();
    const links=await page.locator('.socials a').elementHandles();
    expect(links).toHaveLength(content.socials.length);
    const cta=(await page.getByRole('link',{name:'Find out',exact:true}).boundingBox())!;
    const sample=()=>page.evaluate(()=>{
      const rect=(selector:string)=>{const r=document.querySelector(selector)!.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
      const portrait=rect('.portrait-stage'),clip=getComputedStyle(document.querySelector('.portrait-motion')!).clipPath.slice(6,-1).split(/\s+/).map(parseFloat);
      return{portrait,image:rect('.portrait-image'),monitor:rect('.monitor-fallback'),hem:portrait.y+portrait.height-(clip[2]??0),socials:Array.from(document.querySelectorAll('.socials li'),node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y};})};
    });
    const forward=[];
    for(const p of [0,.25,.5,.75,1]) {
      await scrollJourney(page,p);
      expect(await page.evaluate(node=>node===document.querySelector('.portrait-image'),image)).toBe(true);
      await expect(page.locator('.portrait-image')).toHaveCount(1);
      await expect(page.locator('.portrait-image')).toHaveAttribute('src','/assets/portrait-scene-960.webp');
      await expect(root).toHaveAttribute('data-stage',p>.57?'About':'Hero');
      for(const [i,social] of content.socials.entries()) {
        expect(await page.evaluate(({node,index})=>node===document.querySelectorAll('.socials a')[index],{node:links[i],index:i})).toBe(true);
        await expect(page.getByRole('link',{name:social.label.en,exact:true})).toHaveAttribute('href',social.url);
      }
      const frame=await sample(),apertureBottom=frame.monitor.y+frame.monitor.height*.977;
      expect(Math.abs(frame.portrait.x+frame.portrait.width/2-frame.monitor.x-frame.monitor.width/2)).toBeLessThan(2);
      const catchBottom=forward.length?(width<1200?forward[0].hem:forward[0].portrait.y+forward[0].portrait.width):0;
      if(forward.length&&apertureBottom>catchBottom+2){
        expect(Math.abs(frame.portrait.y-forward[0].portrait.y)).toBeLessThan(2);
        expect(Math.abs(frame.portrait.width-forward[0].portrait.width)).toBeLessThan(2);
      }else if(forward.length){expect(Math.abs(frame.hem-apertureBottom)).toBeLessThan(2);}
      forward.push(frame);
    }
    if(width>=1024)expect(Math.abs(forward[0].portrait.x+forward[0].portrait.width/2-forward[4].portrait.x-forward[4].portrait.width/2)).toBeGreaterThan(20);
    // Compact lanes can keep nearly the same texture scale; the visible source still widens into About.
    expect(Math.abs((forward[4].hem-forward[4].portrait.y)-(forward[0].hem-forward[0].portrait.y))).toBeGreaterThan(20);
    const hero=forward[0].socials,docked=forward[4].socials;
    if(width>=1024)for(const social of hero) expect(social.y).toBeGreaterThanOrEqual(cta.y+cta.height);
    const dock=await page.locator('.social-dock').boundingBox();expect(dock).not.toBeNull();
    for(const social of docked) {expect(social.x).toBeGreaterThanOrEqual(dock!.x);expect(social.x+44).toBeLessThanOrEqual(dock!.x+dock!.width);expect(social.y+44).toBeLessThanOrEqual(dock!.y+dock!.height);}
    if(width>=1024){expect(hero[0].x).toBeLessThan(hero[1].x);expect(hero[1].x).toBeLessThan(hero[2].x);expect(Math.abs(hero[0].y-hero[2].y)).toBeLessThan(1);}
    else{expect(Math.abs(hero[0].x-hero[2].x)).toBeLessThan(1);expect(hero[0].y).toBeLessThan(hero[1].y);expect(hero[1].y).toBeLessThan(hero[2].y);}
    expect(Math.abs(docked[0].x-docked[2].x)).toBeLessThan(1);
    expect(docked[0].y).toBeLessThan(docked[1].y);expect(docked[1].y).toBeLessThan(docked[2].y);
    for(const social of docked) expect(social.x).toBeLessThan(width*.15);
    expect(forward[2].socials[0].x).toBeGreaterThanOrEqual(Math.min(docked[0].x,hero[0].x));expect(forward[2].socials[0].x).toBeLessThanOrEqual(Math.max(docked[0].x,hero[0].x));
    for(const [i,p] of [1,.75,.5,.25,0].entries()) {
      await scrollJourney(page,p);
      expect(await page.evaluate(node=>node===document.querySelector('.portrait-image'),image)).toBe(true);
      for(const [index,link] of links.entries()) expect(await page.evaluate(({node,index})=>node===document.querySelectorAll('.socials a')[index],{node:link,index})).toBe(true);
      const reverse=await sample(),original=forward[4-i];
      for(const key of ['portrait','image','monitor'] as const) for(const axis of ['x','y','width','height'] as const) expect(Math.abs(reverse[key][axis]-original[key][axis])).toBeLessThan(2);
      for(const [index,social] of reverse.socials.entries()) for(const axis of ['x','y'] as const) expect(Math.abs(social[axis]-original.socials[index][axis])).toBeLessThan(2);
    }
    await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
    await expect(root).toHaveAttribute('data-phase','ready');await expect(root).toHaveAttribute('data-handoffs','1');
  });
}

test('stage navigation expands independently while CTA and stage links traverse the entire native range',async ({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const root=page.locator('.hero-world'),capsule=page.locator('.capsule'),toggle=page.getByRole('button',{name:'Toggle navigation'});
  await expect(root).toHaveAttribute('data-phase','ready');
  const expandedWidth=(await capsule.boundingBox())!.width;
  await page.mouse.move(20,850);await scrollJourney(page,.5);
  await expect(capsule).toHaveAttribute('data-expanded','false');
  expect((await capsule.boundingBox())!.width).toBeLessThan(expandedWidth);
  await expect(page.locator('.capsule-title')).toHaveText('Hero');
  const progress=await root.getAttribute('data-progress'),portrait=await page.locator('.portrait-stage').boundingBox(),socials=await page.locator('.socials li').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('style')));
  await capsule.hover();await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.mouse.move(20,850);await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.getByRole('link',{name:'About',exact:true}).focus();
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
  expect(await root.getAttribute('data-progress')).toBe(progress);
  expect(await page.locator('.portrait-stage').boundingBox()).toEqual(portrait);
  expect(await page.locator('.socials li').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('style')))).toEqual(socials);
  await page.getByRole('link',{name:'About',exact:true}).click();
  await expect(page.locator('#about')).toBeFocused();await expect(root).toHaveAttribute('data-stage','About');
  await expect.poll(async()=>Number(await root.getAttribute('data-progress'))).toBeCloseTo(1,2);
  await expect(page.getByRole('link',{name:'About',exact:true})).toHaveAttribute('aria-current','location');
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','false');
  await page.mouse.move(20,850);await page.evaluate(()=>(document.activeElement as HTMLElement)?.blur());
  await expect(page.locator('.capsule-title')).toHaveText('About');
  await capsule.hover();await page.getByRole('link',{name:'Hero',exact:true}).click();
  await expect(page.locator('#hero-title')).toBeFocused();await expect(root).toHaveAttribute('data-stage','Hero');
  await expect.poll(async()=>Number(await root.getAttribute('data-progress'))).toBeCloseTo(0,2);
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await expect.poll(async()=>Number(await root.getAttribute('data-progress'))).toBeCloseTo(1,2);
  await expect(root).toHaveAttribute('data-handoffs','1');await expect(root).toHaveAttribute('data-phase','ready');
});

test('Find out takes a readable journey and native wheel cancels the guided motion',async ({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const root=page.locator('.hero-world');await expect(root).toHaveAttribute('data-phase','ready');
  await page.evaluate(()=>{
    const samples:{at:number;y:number}[]=[];Object.defineProperty(window,'guidedProbe',{value:samples});
    document.querySelector('[data-discovery-cta]')!.addEventListener('click',()=>{
      const start=performance.now();function frame(){samples.push({at:performance.now()-start,y:scrollY});if(document.activeElement?.id!=='about')requestAnimationFrame(frame);}requestAnimationFrame(frame);
    },{once:true});
  });
  await page.getByRole('link',{name:'Find out',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  const samples=await page.evaluate(()=>(window as typeof window & {guidedProbe:{at:number;y:number}[]}).guidedProbe);
  expect(samples.at(-1)!.at).toBeGreaterThan(1800);expect(samples.at(-1)!.at).toBeLessThan(3200);
  for(let i=1;i<samples.length;i++)expect(samples[i].y).toBeGreaterThanOrEqual(samples[i-1].y);
  await scrollJourney(page,0);await page.getByRole('link',{name:'Find out',exact:true}).click();
  await page.waitForTimeout(450);await page.mouse.move(20,600);await page.mouse.wheel(0,-100);
  await page.waitForTimeout(300);const stopped=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(600);expect(await page.evaluate(()=>scrollY)).toBe(stopped);
  expect(Number(await root.getAttribute('data-progress'))).toBeLessThan(.8);
});
