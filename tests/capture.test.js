'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { capture, runAction } = require('../scripts/capture');

function mockChromium({ failRoute, failAction = false } = {}) {
  const records = { contexts: [], closeCount: 0, browserClosed: false, clicks: 0, gotoOptions: [] };
  const chromium = { async launch() { return {
    async newContext(options) {
      records.contexts.push(options);
      let currentUrl;
      const locator = { async click() { records.clicks++; if (failAction) throw new Error('button missing'); }, async hover() {}, async waitFor() {}, async count() { return 0; }, nth() { return locator; } };
      const page = {
        on() {}, url() { return currentUrl; }, locator() { return locator; },
        async goto(url, gotoOptions) { records.gotoOptions.push(gotoOptions); currentUrl = url; if (url.includes(failRoute || '\0')) throw new Error('navigation timeout'); return { status: () => 200, ok: () => true }; },
        async waitForTimeout() {}, async screenshot({ path: file }) { fs.writeFileSync(file, 'mock png'); },
        mouse: { async wheel() {}, async click() { records.clicks++; } }
      };
      return { async newPage() { return page; }, async close() { records.closeCount++; fs.writeFileSync(options.recordHar.path, JSON.stringify({ log: { entries: [] } })); } };
    },
    async close() { records.browserClosed = true; }
  }; } };
  return { chromium, records };
}

const basic = { viewports: [{ width: 800, height: 600 }], settleMs: 0, heuristics: { scrollSteps: 0, maxHover: 0 } };
async function withTemp(run) { const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'replication-capture-')); try { await run(directory); } finally { fs.rmSync(directory, { recursive: true, force: true }); } }

test('routes, duplicate-size viewports, and separate runs never overwrite HARs or screenshots', async () => withTemp(async (directory) => {
  const { chromium, records } = mockChromium();
  const config = { ...basic, routeList: ['/', '/about?x=1'], viewports: [basic.viewports[0], basic.viewports[0]] };
  const first = await capture('https://example.test/', directory, config, { chromium });
  const second = await capture('https://example.test/', directory, basic, { chromium });
  assert.equal(first.status, 'passed');
  assert.equal(first.cases.length, 4);
  assert.equal(new Set(first.cases.map((entry) => entry.har)).size, 4);
  assert.notEqual(first.outputDir, second.outputDir);
  for (const entry of first.cases) { assert.ok(fs.existsSync(entry.har)); assert.ok(entry.actions.every((action) => fs.existsSync(action.screenshot))); }
  assert.ok(records.contexts.every((context) => context.recordHar.content === 'embed' && !('userAgent' in context) && !('isMobile' in context)));
  assert.ok(records.gotoOptions.every((options) => options.waitUntil === 'domcontentloaded'));
  assert.equal(records.clicks, 0);
}));

test('navigation failure still flushes HAR, closes context, writes coverage, and continues', async () => withTemp(async (directory) => {
  const { chromium, records } = mockChromium({ failRoute: '/bad' });
  const report = await capture('https://example.test/', directory, { ...basic, routeList: ['/bad', '/good'] }, { chromium });
  assert.equal(report.status, 'failed');
  assert.equal(report.cases[0].status, 'failed');
  assert.equal(report.cases[1].status, 'passed');
  assert.equal(records.closeCount, 2);
  assert.equal(records.browserClosed, true);
  assert.ok(report.cases.every((entry) => entry.harSaved));
  assert.equal(JSON.parse(fs.readFileSync(report.reportPath, 'utf8')).status, 'failed');
}));

test('explicit action failure captures evidence while later route actions still run', async () => withTemp(async (directory) => {
  const { chromium, records } = mockChromium({ failAction: true });
  const report = await capture('https://example.test/menu', directory, {
    ...basic, context: { isMobile: true, hasTouch: true },
    actions: [{ type: 'click', selector: '#missing' }],
    routes: { '/menu': [{ type: 'state', name: 'menu-open' }] }
  }, { chromium });
  assert.equal(report.status, 'failed');
  const failed = report.cases[0].actions.find((action) => action.status === 'failed');
  assert.match(failed.error, /button missing/);
  assert.ok(fs.existsSync(failed.screenshot));
  assert.ok(report.cases[0].actions.some((action) => action.state?.name === 'menu-open'));
  assert.equal(records.contexts[0].isMobile, true);
  assert.equal(records.contexts[0].hasTouch, true);
  assert.equal(records.closeCount, 1);
}));

test('launch errors still create a failed coverage report', async () => withTemp(async (directory) => {
  const report = await capture('https://example.test/', directory, basic, { chromium: { async launch() { throw new Error('browser unavailable'); } } });
  assert.equal(report.status, 'failed');
  assert.match(report.errors[0], /browser unavailable/);
  assert.ok(fs.existsSync(report.reportPath));
}));

test('runAction supports all documented actions and bounds waits', async () => {
  const events = [];
  const locator = { async click() { events.push('click'); }, async hover() { events.push('hover'); }, async waitFor(options) { events.push(options.state); } };
  const page = { locator: () => locator, url: () => 'https://example.test/', mouse: { async wheel(x, y) { events.push([x, y]); } }, async waitForTimeout(ms) { events.push(ms); } };
  for (const action of [{ type: 'click', selector: '#x' }, { type: 'hover', selector: '#x' }, { type: 'scroll', y: 200 }, { type: 'waitForSelector', selector: '#x', state: 'hidden' }, { type: 'wait', ms: 10 }, { type: 'snapshot' }, { type: 'state', name: 'ready' }]) {
    assert.equal((await runAction(page, action)).status, 'passed');
  }
  assert.deepEqual(events, ['click', 'hover', [0, 200], 'hidden', 10]);
  await assert.rejects(runAction(page, { type: 'wait', ms: 31000 }), /between/);
  await assert.rejects(runAction(page, { type: 'eval' }), /Unsupported/);
});
