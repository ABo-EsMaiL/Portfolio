import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function travel(page:import('@playwright/test').Page,p:number){
  await page.evaluate(p=>{const root=document.querySelector<HTMLElement>('.hero-world')!,track=document.querySelector<HTMLElement>('.journey-track')!,stage=document.querySelector<HTMLElement>('.world-stage')!;scrollTo(0,root.offsetTop+p*(track.offsetHeight-stage.clientHeight));},p);
  await expect.poll(async()=>Number(await page.locator('.hero-world').getAttribute('data-progress'))).toBeCloseTo(p,2);
}

for(const width of [320,390,600,700,767,768,780,790,1036,1100,1190,1440,1920]){
  test(`owner placement stays readable and centered at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready',{timeout:10000});
    const hero=await page.evaluate(()=>{
      const text=(selector:string)=>{const node=document.querySelector(selector)!,range=document.createRange();range.selectNodeContents(node);const r=range.getBoundingClientRect();return{left:r.left,right:r.right,center:r.x+r.width/2};};
      const p=document.querySelector('.portrait-stage')!.getBoundingClientRect(),insets=getComputedStyle(document.querySelector('.portrait-motion')!).clipPath.slice(6,-1).split(/\s+/).map(parseFloat);
      return{title:text('.headline-line:first-child'),overline:text('.identity-overline'),name:text('.hero-name'),role:text('.role'),portrait:p.toJSON(),hem:p.bottom-(insets[2]??insets[0]??0),socials:Array.from(document.querySelectorAll('.socials a'),n=>n.getBoundingClientRect().toJSON()),cta:document.querySelector('[data-discovery-cta]')!.getBoundingClientRect().toJSON()};
    });
    for(const r of [hero.title,hero.overline,hero.name,hero.role]){expect(r.left).toBeGreaterThanOrEqual(8);expect(r.right).toBeLessThanOrEqual(width-8);}
    expect(Math.abs(hero.title.center-width/2)).toBeLessThan(1);expect(Math.abs(hero.overline.center-width/2)).toBeLessThan(1);
    if(width>=1024)expect(hero.hem).toBeGreaterThanOrEqual(900);
    if(width<900){expect(hero.name.left).toBeGreaterThan(width*.58);expect(hero.cta.left).toBeGreaterThan(width*.58);}
    if(width<1200){expect(Math.abs(hero.hem-900)).toBeLessThan(2);for(const link of hero.socials)expect(link.right).toBeLessThan(width*.2);}
    for(const p of [1,.5,0,1])await travel(page,p);
    const about=await page.evaluate(()=>{
      const m=document.querySelector('.monitor-fallback')!.getBoundingClientRect(),a=document.querySelector('.about-copy')!.getBoundingClientRect(),p=document.querySelector('.portrait-stage')!.getBoundingClientRect();
      const nodes=Array.from(document.querySelectorAll('.about-copy h2,.about-role,.intro-copy,.about-stack span'));
      return{monitor:m.toJSON(),about:a.toJSON(),portrait:p.toJSON(),text:nodes.flatMap(n=>{const range=document.createRange();range.selectNodeContents(n);return Array.from(range.getClientRects(),r=>({left:r.left,right:r.right}));}),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    expect(about.overflow).toBe(false);
    const expectedCenter=width<1200?width/2:Math.max(width*.32,Math.min(width*.46,700)*.53+121);
    expect(Math.abs(about.monitor.x+about.monitor.width/2-expectedCenter)).toBeLessThan(1);
    expect(Math.abs(about.portrait.x+about.portrait.width/2-expectedCenter)).toBeLessThan(1);
    expect(Math.abs(about.portrait.bottom-about.monitor.y-about.monitor.height*.977)).toBeLessThan(2);
    for(const r of about.text){expect(r.left).toBeGreaterThanOrEqual(8);expect(r.right).toBeLessThanOrEqual(width-8);}
    if(width<1200)expect(about.about.top-about.monitor.y-about.monitor.height*1.23).toBeGreaterThanOrEqual(80);
    else expect(about.about.left-about.monitor.right).toBeGreaterThanOrEqual(24);
    if(width===780)expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  });
}

test('face-linked nodes precede streamed words, hold after completion and dissolve once',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.hero-world')).toHaveAttribute('data-annotation','linked',{timeout:10000});
  await expect(page.locator('.identity-links')).toBeVisible();
  const tokens=page.locator('.hero-copy .stream-token');expect(await tokens.count()).toBeGreaterThan(8);
  await expect.poll(()=>tokens.evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n).opacity)>.5).length)).toBeGreaterThan(0);
  const partiallyRevealed=await tokens.evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n).opacity)>.5).length);
  expect(partiallyRevealed).toBeLessThan(await tokens.count());
  await expect(page.locator('.hero-world')).toHaveAttribute('data-annotation','holding');
  const copy=page.locator('.hero-name');await expect(copy).toBeVisible();
  await page.waitForTimeout(1000);await expect(page.locator('.hero-world')).toHaveAttribute('data-annotation','holding');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-annotation','dust');
  expect(await page.locator('.identity-dust circle').count()).toBeGreaterThan(40);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('.detection-hud').first()).toHaveCSS('opacity','0');await expect(page.locator('.identity-links')).toHaveCSS('opacity','0');
  await expect(copy).toBeVisible();await expect(page.locator('.identity-dust')).toHaveCSS('opacity','0');
  await travel(page,1);await travel(page,0);await expect(page.locator('.detection-hud').first()).toHaveCSS('opacity','0');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
});

test('all contacts keep old neutral icons without labels and turn into brands only on hover or focus',async({page})=>{
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  const colors={linkedin:'rgb(10, 102, 194)',github:'rgb(24, 23, 23)',facebook:'rgb(8, 102, 255)',email:'rgb(179, 38, 30)'};
  for(const p of [0,1]){
    await travel(page,p);
    for(const [id,color] of Object.entries(colors)){
      await page.mouse.move(0,0);await page.evaluate(()=>(document.activeElement as HTMLElement)?.blur());
      const link=page.locator(`.socials a[data-social=${id}]`);await expect(link.locator('svg')).toHaveCSS('color','rgb(23, 45, 67)');
      await expect.poll(()=>link.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe('rgba(255, 255, 255, 0.7)');
      expect(await link.evaluate(n=>getComputedStyle(n,'::before').borderRadius)).toBe('50%');
      await link.hover();await expect(link.locator('svg')).toHaveCSS('color','rgb(255, 255, 255)');
      await expect.poll(()=>link.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe(color);
      await page.mouse.move(0,0);
      await link.focus();expect(await link.evaluate(n=>getComputedStyle(n).outlineStyle)).not.toBe('none');
      await expect(link.locator('svg')).toHaveCSS('color','rgb(255, 255, 255)');
      await expect.poll(()=>link.evaluate(n=>getComputedStyle(n,'::before').backgroundColor)).toBe(color);
      expect(await link.innerText()).toBe('');await expect(link).toHaveAccessibleName(/.+/);
    }
  }
});

test('phone portrait and landscape use side lanes with smaller visuals and no annotation nodes',async({page})=>{
  test.setTimeout(60000);
  for(const [width,height] of [[320,568],[390,600],[440,956],[844,390],[1024,600]]){
    await page.setViewportSize({width,height});await page.goto('/',{waitUntil:'domcontentloaded'});
    if(width<1200){await expect(page.locator('.identity-links')).toHaveCSS('display','none');await expect(page.locator('.identity-dust')).toHaveCSS('display','none');}
    await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    if(width<1200){await expect(page.locator('.identity-links')).toHaveCSS('display','none');await expect(page.locator('.identity-dust')).toHaveCSS('display','none');}
    const layout=await page.evaluate(()=>{const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect().toJSON();return{copy:rect('.hero-copy'),portrait:rect('.portrait-stage'),cta:rect('[data-discovery-cta]'),socials:Array.from(document.querySelectorAll('.socials a'),n=>n.getBoundingClientRect().toJSON()),font:parseFloat(getComputedStyle(document.querySelector('.hero-name')!).fontSize),glyph:parseFloat(getComputedStyle(document.querySelector('.socials svg')!).width)};});
    if(width<900){expect(layout.copy.left).toBeGreaterThan(width*.58);expect(layout.cta.top).toBeGreaterThanOrEqual(layout.copy.bottom+12);expect(layout.font).toBeLessThanOrEqual(21);}
    if(width<1200){expect(Math.abs(layout.portrait.bottom-height)).toBeLessThan(2);for(const r of layout.socials){expect(r.right).toBeLessThan(width*.2);expect(r.width).toBeGreaterThanOrEqual(44);expect(r.bottom).toBeLessThanOrEqual(height);}expect(layout.glyph).toBeLessThan(30);}
    expect(layout.cta.bottom).toBeLessThanOrEqual(height-8);
    expect(layout.cta.right).toBeLessThanOrEqual(width-8);
  }
});

test('tablet identity stays centered with narrative left on both sides of the old 1024 breakpoint',async({page})=>{
  await page.setViewportSize({width:1000,height:900});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  for(const width of [1000,1025,1038]){
    await page.setViewportSize({width,height:900});await travel(page,0);
    await expect.poll(()=>page.locator('.portrait-stage').evaluate((n,width)=>{const r=n.getBoundingClientRect();return Math.abs(r.x+r.width/2-width/2);},width)).toBeLessThan(1);
    const rects=await page.evaluate(()=>{const r=(s:string)=>document.querySelector(s)!.getBoundingClientRect().toJSON();return{portrait:r('.portrait-stage'),copy:r('.hero-copy'),actions:r('.hero-actions')};});
    expect(Math.abs(rects.portrait.x+rects.portrait.width/2-width/2)).toBeLessThan(1);
    expect(rects.actions.right+16).toBeLessThanOrEqual(rects.portrait.left);expect(rects.copy.left).toBeGreaterThanOrEqual(rects.portrait.right+8);
    await expect(page.locator('.pitch-title')).toBeVisible();await expect(page.locator('.pitch-title')).toHaveText('From pixels to decisions');await expect(page.locator('.focus-tags')).toBeVisible();
  }
});

test('near-1209px side copy clears the headline with the real scrollbar gutter',async({page})=>{
  await page.setViewportSize({width:1206,height:914});await page.goto('/');await page.addStyleTag({content:'html { scrollbar-gutter:stable; }'});await page.evaluate(()=>dispatchEvent(new Event('resize')));
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  for(const width of [1206,1209,1214]){
    await page.setViewportSize({width,height:914});
    const gap=await page.evaluate(()=>{const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect();return Math.min(rect('.hero-copy').top,rect('.hero-actions').top)-rect('.identity').bottom;});
    expect(gap).toBeGreaterThanOrEqual(40);
  }
});

test('stacked About uses its available width and the skill caption follows the display, not the text footer',async({page})=>{
  await page.setViewportSize({width:1059,height:900});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  for(const width of [1214,1059,768,440]){
    await page.setViewportSize({width,height:900});
    if(width===1214){await page.addStyleTag({content:'html { scrollbar-gutter:stable; }'});await page.evaluate(()=>dispatchEvent(new Event('resize')));}
    await travel(page,1);
    const layout=await page.evaluate(()=>{const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect().toJSON();return{stage:rect('.world-stage'),monitor:rect('.monitor-fallback'),about:rect('.about-copy'),bio:rect('.intro-copy'),caption:rect('.scene-caption')};});
    expect(layout.stage.width).toBeLessThan(1200);expect(layout.bio.width).toBeCloseTo(layout.about.width,0);
    await expect(page.locator('.scene-caption')).toBeVisible();
    expect(Math.abs(layout.caption.x+layout.caption.width/2-layout.monitor.x-layout.monitor.width/2)).toBeLessThan(1);
    const clearance=layout.caption.y-layout.monitor.y-layout.monitor.height*1.23;
    expect(clearance).toBeGreaterThanOrEqual(24);expect(clearance).toBeLessThanOrEqual(40);
    expect(layout.caption.bottom+24).toBeLessThan(layout.about.top);
    await travel(page,.7);await travel(page,1);
  }
});

test('resize across the mixed tablet thresholds retains readable final geometry',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  for(const width of [1190,1036,790,780,768,767,700,390,1440]){
    await page.setViewportSize({width,height:900});await travel(page,1);
    await expect.poll(()=>page.locator('.monitor-fallback').evaluate(n=>{const r=n.getBoundingClientRect(),center=innerWidth<1200?innerWidth/2:Math.max(innerWidth*.32,Math.min(innerWidth*.46,700)*.53+121);return Math.abs(r.x+r.width/2-center);})).toBeLessThan(1);
    const bounds=await page.locator('.about-copy').evaluate(n=>{const r=n.getBoundingClientRect();return{left:r.left,right:r.right,scroll:n.scrollWidth,width:n.clientWidth};});
    expect(bounds.left).toBeGreaterThanOrEqual(8);expect(bounds.right).toBeLessThanOrEqual(width-8);expect(bounds.scroll).toBeLessThanOrEqual(bounds.width);
  }
});
