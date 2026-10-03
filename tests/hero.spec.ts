import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import content from '../content/en.json' with { type: 'json' };

for (const width of [320,390,768,1440]) {
  test(`readable Hero and About share the source portrait at ${width}px`,async ({page}) => {
    await page.setViewportSize({width,height:width<768?844:900});
    await page.goto('/');
    await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
    await expect(page.getByRole('img',{name:'Portrait of Ahmed Esmail'})).toHaveAttribute('width','960');
    await expect(page.locator('.portrait-image')).toHaveAttribute('src','/assets/portrait-scene-960.webp');
    expect(await page.locator('.portrait-image').evaluate((image:HTMLImageElement) => image.complete && image.naturalWidth>0)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width<768) expect((await page.getByRole('link',{name:'Find out'}).boundingBox())!.y).toBeLessThan(844);
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    await page.screenshot({path:`tmp/hero-dom-${width}.png`});
    await page.getByRole('link',{name:'Find out',exact:true}).click();
    await expect(page.locator('#about')).toBeFocused();
    await expect(page.locator('.hero-world')).toHaveAttribute('data-stage','About');
    await expect(page.getByRole('heading',{name:content.profile.fullName,exact:true})).toBeInViewport();
    await expect(page.locator('.intro-copy')).toHaveText(content.about.bio.en);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    await page.screenshot({path:`tmp/about-dom-${width}.png`});
  });
}

test('capsule hover, focus and toggle are independent; Escape restores toggle focus',async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-bound','true');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  const progress = await page.locator('.hero-world').getAttribute('data-progress');
  const toggle=page.getByRole('button',{name:'Toggle navigation'});
  const expandedWidth=(await page.locator('.capsule').boundingBox())!.width;
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect.poll(async()=>(await page.locator('.capsule').boundingBox())!.width).toBeLessThan(expandedWidth-20);
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.getByRole('link',{name:'Ahmed Esmail',exact:true}).focus();
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  expect(await page.locator('.hero-world').getAttribute('data-progress')).toBe(progress);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
});

for (const phase of ['entering','hunting','locked']) {
  test(`early wheel input in ${phase} resolves once without rewinding`,async ({page}) => {
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(p=>document.querySelector<HTMLElement>('.hero-world')?.dataset.phase===p,phase);
    const elapsed=await page.evaluate(async () => {
      const root=document.querySelector<HTMLElement>('.hero-world')!;const start=performance.now();
      window.dispatchEvent(new WheelEvent('wheel',{deltaY:120}));window.dispatchEvent(new WheelEvent('wheel',{deltaY:180}));
      await new Promise<void>(resolve=>{function frame(){if(root.dataset.phase==='ready')resolve();else requestAnimationFrame(frame);}requestAnimationFrame(frame);});
      return performance.now()-start;
    });
    expect(elapsed).toBeLessThanOrEqual(200);
    await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
    await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
    await expect(page.getByText('Who is he?',{exact:true})).toHaveCount(0);
  });
}

test('pending decode shows a resource loader; input cannot replay the intro on late arrival',async ({page}) => {
  await page.addInitScript(()=>{
    const decode=HTMLImageElement.prototype.decode;
    let release!:()=>void;
    const pending=new Promise<void>(resolve=>{release=resolve;});
    Object.defineProperty(window,'releasePortraitDecode',{value:release});
    HTMLImageElement.prototype.decode=function(){return Promise.all([decode.call(this),pending]).then(()=>undefined);};
  });
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.hero-world')).toHaveAttribute('data-bound','true');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','loading');
  await expect(page.locator('.resource-loader')).toBeVisible();
  await page.evaluate(()=>window.dispatchEvent(new WheelEvent('wheel',{deltaY:100})));
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('.resource-loader')).toBeHidden();
  await page.evaluate(()=>(window as typeof window & {releasePortraitDecode:()=>void}).releasePortraitDecode());
  await page.waitForFunction(()=>document.querySelector<HTMLImageElement>('.portrait-image')?.naturalWidth);
  await page.waitForTimeout(350);
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
});

test('decode timeout releases the visitor instead of trapping a loader',async ({page}) => {
  await page.addInitScript(()=>{HTMLImageElement.prototype.decode=()=>new Promise<void>(()=>{});});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.resource-loader')).toBeVisible();
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready',{timeout:5000});
  await expect(page.locator('.resource-loader')).toBeHidden();
  await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
});

test('reduced motion exposes static Hero and About with a native CTA anchor',async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.hero-world')).not.toHaveClass(/is-enhanced/);
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.getByRole('link',{name:'Find out'})).toHaveAttribute('href','#about');
  await page.getByRole('link',{name:'Find out'}).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
  await expect(page.locator('.hero-world')).toHaveAttribute('data-handoffs','1');
});

test('missing portrait leaves truthful identity and an honest image error',async ({page}) => {
  await page.route('**/portrait-scene-960.webp',route=>route.abort());await page.goto('/');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-image-failed','true');
  await expect(page.getByText('Portrait unavailable',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:content.hero.heading.en,exact:true})).toBeVisible();
  await expect(page.locator('.hero-name')).toBeVisible();
  await expect(page.getByRole('link',{name:'LinkedIn',exact:true})).toBeVisible();
});
test('short phone viewport can reach the full About copy without shrinking the text',async({page})=>{
  await page.setViewportSize({width:390,height:600});await page.goto('/');
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  await page.getByRole('button',{name:'Toggle navigation'}).click();
  await page.getByRole('link',{name:'About',exact:true}).click();await expect(page.locator('#about')).toBeFocused();
  await page.keyboard.press('End');
  await expect.poll(()=>page.locator('.intro-copy').evaluate(node=>node.getBoundingClientRect().bottom)).toBeLessThanOrEqual(600);
  await expect(page.locator('.about-copy h2')).toBeInViewport();
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
