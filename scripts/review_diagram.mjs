// Documentation-only browser check. Uses installed Edge + native Node WebSocket.
// No application code or downloaded browser dependency.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const targets = await fetch('http://127.0.0.1:9223/json/list').then(r => r.json());
const target = targets.find(t => t.type === 'page' && t.url.includes('architecture-roadmap.html'));
assert(target, 'Local diagram tab not found');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
const exceptions = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
  const call = pending.get(message.id);
  if (!call) return;
  pending.delete(message.id);
  clearTimeout(call.timer);
  message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result);
};
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const reports = [];
try {
  await cdp('Runtime.enable');
  await cdp('Page.enable');
  for (const width of [1440, 390, 320]) {
    const height = width > 800 ? 1050 : 844;
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    await evaluate('window.scrollTo(0, 0)');
    const report = await evaluate(`(() => {
      const text = document.body.innerText;
      const svgTexts = [...document.querySelectorAll('svg text')].filter(e => e.textContent.trim());
      const outside = svgTexts.filter(e => { const b=e.getBBox(); const v=e.ownerSVGElement.viewBox.baseVal; return b.x<0 || b.y<0 || b.x+b.width>v.width+1 || b.y+b.height>v.height+1; }).map(e=>e.textContent);
      return { width: innerWidth, title: document.title, documentWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth, headingCount: document.querySelectorAll('h1').length,
        hasSections: ['Component & data flow','Intro handoff','Visual transformation roadmap','Approval gates'].every(t=>text.includes(t)),
        svgCount: document.querySelectorAll('svg').length, outOfSvgBounds: outside,
        scrollRegions: [...document.querySelectorAll('.canvas')].map(e=>({width:e.clientWidth, contentWidth:e.scrollWidth, keyboardFocusable:e.tabIndex===0})),
        externalResources: performance.getEntriesByType('resource').filter(e=>/^https?:/.test(e.name)).map(e=>e.name),
        scriptCount: document.scripts.length, invalidLinks: [...document.querySelectorAll('a')].filter(e=>!e.getAttribute('href')).length };
    })()`);
    assert(report.documentWidth <= report.clientWidth + 1, `Horizontal page overflow: ${width}`);
    assert.equal(report.headingCount, 1);
    assert(report.hasSections);
    assert.equal(report.svgCount, 6);
    assert.deepEqual(report.outOfSvgBounds, []);
    assert.deepEqual(report.externalResources, []);
    assert.equal(report.scriptCount, 0);
    assert.equal(report.invalidLinks, 0);
    assert(report.scrollRegions.every(r => r.keyboardFocusable));
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await fs.writeFile(new URL(`docs/architecture-review-${width}.png`, root), Buffer.from(shot.data, 'base64'));
    if (width === 1440) {
      for (const section of ['state', 'storyboard']) {
        await evaluate(`window.scrollTo(0, document.getElementById('${section}').getBoundingClientRect().top + scrollY - 24)`);
        await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        const sectionShot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await fs.writeFile(new URL(`docs/architecture-${section}-1440.png`, root), Buffer.from(sectionShot.data, 'base64'));
      }
    }
    reports.push(report);
  }
  assert.deepEqual(exceptions, []);
  const result = { status: 'PASS', browser: (await cdp('Browser.getVersion')).product,
    kind: 'Rendered documentation only — not Hero/application/performance verification', exceptions, viewports: reports };
  await fs.writeFile(new URL('docs/diagram-verification.json', root), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  ws.close();
}
