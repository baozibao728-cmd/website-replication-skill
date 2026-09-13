#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');

function boundedNumber(value, fallback, min, max, name) {
  const number = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(`${name} must be between ${min} and ${max}`);
  return number;
}

function safeLabel(value) { return String(value || 'state').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60) || 'state'; }
function httpUrl(value, base) {
  const result = new URL(value, base);
  if (!['http:', 'https:'].includes(result.protocol)) throw new Error('Only HTTP(S) URLs are supported');
  if (result.username || result.password) throw new Error('URLs containing credentials are not supported');
  return result.href;
}

async function runAction(page, action, options = {}) {
  if (!action || typeof action !== 'object') throw new Error('Each action must be an object');
  const type = action.type;
  const timeout = boundedNumber(action.timeoutMs, options.timeoutMs ?? 15000, 1, 60000, 'action timeoutMs');
  const result = { type, status: 'passed' };
  if (['click', 'hover', 'waitForSelector'].includes(type) && (typeof action.selector !== 'string' || !action.selector)) throw new Error(`${type} requires a selector`);
  switch (type) {
    case 'click': await page.locator(action.selector).click({ timeout }); break;
    case 'hover': await page.locator(action.selector).hover({ timeout }); break;
    case 'scroll': await page.mouse.wheel(boundedNumber(action.x, 0, -100000, 100000, 'scroll x'), boundedNumber(action.y, 600, -100000, 100000, 'scroll y')); break;
    case 'waitForSelector': {
      const state = action.state || 'visible';
      if (!['attached', 'detached', 'visible', 'hidden'].includes(state)) throw new Error('Invalid waitForSelector state');
      await page.locator(action.selector).waitFor({ state, timeout });
      break;
    }
    case 'wait': await page.waitForTimeout(boundedNumber(action.ms, 500, 0, 30000, 'wait ms')); break;
    case 'snapshot': break;
    case 'state': result.state = { name: String(action.name || 'state'), url: page.url() }; break;
    default: throw new Error(`Unsupported action type: ${type}`);
  }
  if (action.waitMs !== undefined) await page.waitForTimeout(boundedNumber(action.waitMs, 0, 0, 30000, 'waitMs'));
  if (options.outputDir) {
    const name = `${safeLabel(options.filenamePrefix || 'action')}-${safeLabel(action.name || type)}.png`;
    const screenshot = path.join(options.outputDir, name);
    await page.screenshot({ path: screenshot, fullPage: true, timeout });
    result.screenshot = screenshot;
  }
  return result;
}

function normalizeConfig(inputUrl, config) {
  const routeList = config.routeList === undefined ? [inputUrl] : config.routeList;
  if (!Array.isArray(routeList) || !routeList.length || routeList.some((route) => typeof route !== 'string')) throw new Error('routeList must be a nonempty array of URLs or paths');
  const viewports = config.viewports || [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
  if (!Array.isArray(viewports) || !viewports.length) throw new Error('viewports must be a nonempty array');
  const checkedViewports = viewports.map((viewport) => ({
    width: boundedNumber(viewport.width, 1440, 100, 7680, 'viewport width'),
    height: boundedNumber(viewport.height, 900, 100, 4320, 'viewport height')
  }));
  if (checkedViewports.some((viewport) => !Number.isInteger(viewport.width) || !Number.isInteger(viewport.height))) throw new Error('Viewport dimensions must be integers');
  if (config.actions !== undefined && !Array.isArray(config.actions)) throw new Error('actions must be an array');
  if (config.routes !== undefined && (!config.routes || Array.isArray(config.routes) || typeof config.routes !== 'object')) throw new Error('routes must map route paths to action arrays');
  for (const actions of Object.values(config.routes || {})) if (!Array.isArray(actions)) throw new Error('Each routes value must be an action array');
  const context = {};
  for (const key of ['isMobile', 'hasTouch']) if (config.context?.[key] !== undefined) {
    if (typeof config.context[key] !== 'boolean') throw new Error(`context.${key} must be boolean`);
    context[key] = config.context[key];
  }
  const heuristics = config.heuristics || {};
  if (heuristics.centerClick !== undefined && typeof heuristics.centerClick !== 'boolean') throw new Error('heuristics.centerClick must be boolean');
  return {
    routeList: routeList.map((route) => httpUrl(route, inputUrl)), viewports: checkedViewports, context,
    actions: config.actions || [], routes: config.routes || {},
    settleMs: boundedNumber(config.settleMs, 1000, 0, 30000, 'settleMs'),
    timeoutMs: boundedNumber(config.timeoutMs, 15000, 1, 60000, 'timeoutMs'),
    heuristics: {
      centerClick: heuristics.centerClick === true,
      scrollSteps: Math.floor(boundedNumber(heuristics.scrollSteps, 12, 0, 100, 'scrollSteps')),
      scrollWaitMs: boundedNumber(heuristics.scrollWaitMs, 500, 0, 30000, 'scrollWaitMs'),
      maxHover: Math.floor(boundedNumber(heuristics.maxHover, 20, 0, 100, 'maxHover'))
    }
  };
}

async function capture(url, outDir, config = {}, dependencies = {}) {
  const inputUrl = httpUrl(url);
  const settings = normalizeConfig(inputUrl, config);
  const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
  const outputDir = path.join(path.resolve(outDir), `run-${runId}`);
  fs.mkdirSync(outputDir, { recursive: true });
  const reportPath = path.join(outputDir, 'coverage.json');
  const report = {
    runId, inputUrl, outputDir, reportPath, startedAt: new Date().toISOString(), status: 'running',
    settings, cases: [], errors: [],
    note: 'This report covers only recorded routes, viewports, and actions. Scrolling and hovering are discovery heuristics, not proof of complete site coverage. Default viewports change dimensions only; mobile/touch emulation requires explicit context options.'
  };
  const writeReport = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  let browser;
  writeReport();
  try {
    const chromium = dependencies.chromium || require(require.resolve('playwright', { paths: [process.cwd(), __dirname] })).chromium;
    browser = await chromium.launch({ headless: true });
    for (let routeIndex = 0; routeIndex < settings.routeList.length; routeIndex++) {
      const route = settings.routeList[routeIndex];
      for (let viewportIndex = 0; viewportIndex < settings.viewports.length; viewportIndex++) {
        const viewport = settings.viewports[viewportIndex];
        const routeHash = createHash('sha256').update(route).digest('hex').slice(0, 12);
        const caseId = `r${routeIndex}-${routeHash}-v${viewportIndex}-${viewport.width}x${viewport.height}`;
        const caseDir = path.join(outputDir, caseId);
        fs.mkdirSync(caseDir);
        const entry = { caseId, route, viewport, context: settings.context, status: 'running', har: path.join(caseDir, `${caseId}.har`), actions: [], pageErrors: [], requestFailures: [], httpErrors: [], errors: [] };
        report.cases.push(entry);
        let context;
        let page;
        let sequence = 0;
        const recordAction = async (action, source = 'explicit') => {
          const item = { index: sequence++, source, action, status: 'running' };
          entry.actions.push(item);
          try { Object.assign(item, await runAction(page, action, { outputDir: caseDir, filenamePrefix: `${String(item.index).padStart(3, '0')}-${source}`, timeoutMs: settings.timeoutMs })); }
          catch (error) {
            item.status = 'failed'; item.error = error.message;
            try { item.screenshot = path.join(caseDir, `${String(item.index).padStart(3, '0')}-failed.png`); await page.screenshot({ path: item.screenshot, fullPage: true, timeout: settings.timeoutMs }); }
            catch (screenshotError) { delete item.screenshot; item.screenshotError = screenshotError.message; }
          }
        };
        try {
          context = await browser.newContext({ viewport, ...settings.context, recordHar: { path: entry.har, content: 'embed', mode: 'full' } });
          page = await context.newPage();
          page.on('pageerror', (error) => entry.pageErrors.push(error.message));
          page.on('requestfailed', (request) => entry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
          page.on('response', (response) => { if (response.status() >= 400) entry.httpErrors.push({ url: response.url(), status: response.status() }); });
          const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: settings.timeoutMs });
          entry.navigation = { finalUrl: page.url(), status: response?.status() ?? null };
          if (response && !response.ok()) throw new Error(`Navigation returned HTTP ${response.status()}`);
          await page.waitForTimeout(settings.settleMs);
          await recordAction({ type: 'snapshot', name: 'initial' }, 'navigation');
          const routeUrl = new URL(route);
          const routeActions = settings.routes[routeUrl.pathname + routeUrl.search] || settings.routes[routeUrl.pathname] || settings.routes[route] || [];
          for (const action of [...settings.actions, ...routeActions]) await recordAction(action);
          if (settings.heuristics.centerClick) {
            const item = { index: sequence++, source: 'heuristic', action: { type: 'centerClick' }, status: 'running' };
            entry.actions.push(item);
            try {
              await page.mouse.click(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
              Object.assign(item, await runAction(page, { type: 'snapshot', name: 'after-center-click' }, { outputDir: caseDir, filenamePrefix: `${item.index}-heuristic`, timeoutMs: settings.timeoutMs }));
            } catch (error) { item.status = 'failed'; item.error = error.message; }
          }
          for (let index = 0; index < settings.heuristics.scrollSteps; index++) await recordAction({ type: 'scroll', y: Math.floor(viewport.height * 0.8), waitMs: settings.heuristics.scrollWaitMs }, 'heuristic');
          if (settings.heuristics.maxHover) {
            const hoverTargets = page.locator('a,button,[role="button"]');
            const count = Math.min(await hoverTargets.count(), settings.heuristics.maxHover);
            for (let index = 0; index < count; index++) {
              const item = { index: sequence++, source: 'heuristic', action: { type: 'hover', selector: 'a,button,[role="button"]', nth: index }, status: 'running' };
              entry.actions.push(item);
              try {
                await hoverTargets.nth(index).hover({ timeout: Math.min(2000, settings.timeoutMs) });
                Object.assign(item, await runAction(page, { type: 'snapshot', name: `hover-${index}` }, { outputDir: caseDir, filenamePrefix: `${item.index}-heuristic`, timeoutMs: settings.timeoutMs }));
              } catch (error) { item.status = 'failed'; item.error = error.message; }
            }
          }
          await recordAction({ type: 'snapshot', name: 'final' }, 'navigation');
        } catch (error) { entry.errors.push(error.message); }
        finally {
          if (context) { try { await context.close(); entry.harSaved = fs.existsSync(entry.har); } catch (error) { entry.errors.push(`Context close failed: ${error.message}`); } }
          entry.status = entry.errors.length || entry.actions.some((action) => action.status === 'failed') || entry.pageErrors.length || entry.requestFailures.length || entry.httpErrors.length ? 'failed' : 'passed';
          writeReport();
        }
      }
    }
  } catch (error) { report.errors.push(error.message); }
  finally {
    if (browser) { try { await browser.close(); } catch (error) { report.errors.push(`Browser close failed: ${error.message}`); } }
    report.status = report.errors.length || report.cases.some((entry) => entry.status === 'failed') ? 'failed' : 'passed';
    report.completedAt = new Date().toISOString();
    writeReport();
  }
  return report;
}

async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/capture.js URL outDir [scrolls] [scrollWaitMs] [--routes routes.json] [--actions actions.json]\nCreates a unique run directory containing per-route/per-viewport embedded HARs, screenshots, and coverage.json. Node.js 20+ and Playwright Chromium are required to capture. See references/capture-actions.md.');
    return;
  }
  const positional = [];
  let routeFile;
  let actionFile;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--routes' || arg === '--actions') {
      const file = args[++index];
      if (!file || file.startsWith('--')) throw new Error(`${arg} requires a JSON file`);
      if (arg === '--routes') routeFile = file; else actionFile = file;
    } else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  if (positional.length < 2 || positional.length > 4) throw new Error('Usage: node scripts/capture.js URL outDir [scrolls] [scrollWaitMs] [--routes routes.json] [--actions actions.json]');
  const config = actionFile ? JSON.parse(fs.readFileSync(actionFile, 'utf8').replace(/^\uFEFF/, '')) : {};
  if (!config || Array.isArray(config) || typeof config !== 'object') throw new Error('actions.json must be an object');
  if (routeFile) config.routeList = JSON.parse(fs.readFileSync(routeFile, 'utf8').replace(/^\uFEFF/, ''));
  config.heuristics = { ...config.heuristics };
  if (positional[2] !== undefined) config.heuristics.scrollSteps = Number(positional[2]);
  if (positional[3] !== undefined) config.heuristics.scrollWaitMs = Number(positional[3]);
  const report = await capture(positional[0], positional[1], config);
  console.log(JSON.stringify({ status: report.status, outputDir: report.outputDir, reportPath: report.reportPath, cases: report.cases.length, errors: report.errors }, null, 2));
  if (report.status !== 'passed') process.exitCode = 1;
}

module.exports = { capture, runAction, normalizeConfig, main };
if (require.main === module) main().catch((error) => { console.error(JSON.stringify({ error: error.message })); process.exitCode = 1; });
