import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import content from '../content/en.json' with { type: 'json' };

test('known Grammarly body metadata is normalized before hydration without erasing unrelated attributes',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.addInitScript(()=>{const observer=new MutationObserver(apply);function apply(){if(document.body){document.body.setAttribute('data-new-gr-c-s-check-loaded','14.1153.0');document.body.setAttribute('data-gr-ext-installed','');observer.disconnect();}}observer.observe(document,{childList:true,subtree:true});apply();});
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  await expect(page.locator('body')).not.toHaveAttribute('data-new-gr-c-s-check-loaded');await expect(page.locator('body')).not.toHaveAttribute('data-gr-ext-installed');
  await page.locator('body').evaluate(body=>body.setAttribute('data-review-unrelated','keep'));await expect(page.locator('body')).toHaveAttribute('data-review-unrelated','keep');
  expect(errors).toEqual([]);
});

test('Grammarly reinjection during bootstrap is cleaned until hydration commits, not forever',async({page})=>{
  const errors:string[]=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    let injected=false,reinserted=false;
    const extension=new MutationObserver(()=>{
      const body=document.body;if(!body)return;
      if(!injected||(!reinserted&&!body.hasAttribute('data-gr-ext-installed'))){
        if(injected)reinserted=true;injected=true;
        body.setAttribute('data-new-gr-c-s-check-loaded','14.1153.0');body.setAttribute('data-gr-ext-installed','');
        if(reinserted)extension.disconnect();
      }
    });extension.observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['data-gr-ext-installed']});
  });
  await page.goto('/');await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  expect(errors).toEqual([]);await expect(page.locator('body')).not.toHaveAttribute('data-gr-ext-installed');
  await page.locator('body').evaluate(body=>{body.setAttribute('data-gr-ext-installed','after-commit');body.setAttribute('data-review-unrelated','keep');});
  await page.waitForTimeout(100);
  await expect(page.locator('body')).toHaveAttribute('data-gr-ext-installed','after-commit');await expect(page.locator('body')).toHaveAttribute('data-review-unrelated','keep');
});

test('server-rendered identity and links remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: content.hero.heading.en, exact: true })).toBeVisible();
  await expect(page.locator('.hero-name')).toHaveText('Ahmed AbdElHady Esmail');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://linkedin.com/in/ahmed-abdelhady-esmail');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.hero-world')).not.toHaveClass(/is-enhanced/);
  await expect(page.getByText('Who is he?', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: content.profile.fullName, exact: true })).toBeVisible();
  await expect(page.locator('.intro-copy')).toHaveText(content.about.bio.en);
  await page.getByRole('link', { name: 'Find out', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('shell has one primary heading, keyboard entry and accessible Hero and About', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await expect(page.locator('.hero-world')).toHaveAttribute('data-phase','ready');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('link', { name: 'Find out', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#about')).toBeFocused();
  await expect(page.getByRole('heading', { name: content.profile.fullName, exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
