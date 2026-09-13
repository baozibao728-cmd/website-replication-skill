#!/usr/bin/env node
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const {digest, requestKey, validatePayload} = require('./archive');
const {normalizeConfig, runAction} = require('./capture');

async function auditAssets(directory) {
  const root = await fs.realpath(directory);
  const manifest = JSON.parse((await fs.readFile(path.join(root, 'manifest.json'), 'utf8')).replace(/^\uFEFF/, ''));
  if (manifest.version !== 1 || !Array.isArray(manifest.entries)) throw new Error('Unsupported manifest');
  const report = {level: 'L0', checked: 0, errors: [], status: 'passed'};
  const keys = new Set();
  if (!manifest.entries.length) report.errors.push({reason: 'Manifest has no entries'});
  for (const entry of manifest.entries) {
    try {
      const key = requestKey(entry.method || 'GET', entry.url, entry.requestBodyHash || '');
      if (keys.has(key)) throw new Error('Duplicate request identity');
      keys.add(key);
      if (entry.redirectUrl) {
        if (![301,302,303,307,308].includes(entry.status)) throw new Error('Invalid redirect status');
        if (!manifest.entries.some(e => e.url === entry.redirectUrl)) throw new Error('Redirect destination not captured');
        report.checked++; continue;
      }
      if (typeof entry.file !== 'string' || path.isAbsolute(entry.file)) throw new Error('Invalid manifest file path');
      const file = await fs.realpath(path.resolve(root, entry.file));
      const rel = path.relative(root, file);
      if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) throw new Error('File is outside mirror root');
      const body = await fs.readFile(file);
      if (body.length !== entry.size) throw new Error(`Size mismatch: expected ${entry.size}, got ${body.length}`);
      if (digest(body) !== entry.sha256) throw new Error('SHA256 mismatch');
      validatePayload({url:entry.url, status:entry.status, mime:entry.mime, body, kind:entry.kind || 'unknown'});
      report.checked++;
    } catch (error) { report.errors.push({url:entry.url, reason:error.message}); }
  }
  for (const failure of manifest.failures || []) report.errors.push({...failure, category:'archive-failure'});
  for (const conflict of manifest.conflicts || []) report.errors.push({...conflict, category:'archive-conflict'});
  if (report.errors.length) report.status = 'failed';
  return {manifest, report};
}
function localTarget(route, originalBase, localBase) {
  const original = new URL(route, originalBase);
  if (original.origin !== new URL(originalBase).origin) throw new Error('Verification routes must belong to the primary site');
  return new URL(original.pathname + original.search + original.hash, localBase).href;
}
async function browserSmoke(manifest, localBase, outputDir, config = {}, dependencies = {}) {
  const local = new URL(localBase);
  if (!['http:','https:'].includes(local.protocol) || !['localhost','127.0.0.1','[::1]'].includes(local.hostname)) throw new Error('--url must point to a loopback local server');
  const settings = normalizeConfig(manifest.baseUrl, {...config, heuristics:{centerClick:false,scrollSteps:0,maxHover:0}});
  await fs.mkdir(outputDir, {recursive:true});
  const report = {status:'passed',cases:[],errors:[],note:'Local loading and configured actions only. L2 behavioral equivalence and L3 visual comparison still need reference evidence. Service Workers blocked for observable network isolation.'};
  let browser;
  try {
    const chromium = dependencies.chromium || require(require.resolve('playwright', {paths:[process.cwd(),__dirname]})).chromium;
    browser = await chromium.launch({headless:true});
    for (let r = 0; r < settings.routeList.length; r++) for (let v = 0; v < settings.viewports.length; v++) {
      const route = settings.routeList[r];
      const item = {route,viewport:settings.viewports[v],errors:[],actions:[],status:'passed'};
      report.cases.push(item);
      let context;
      try {
        context = await browser.newContext({viewport:item.viewport,...settings.context,serviceWorkers:'block'});
        await context.route('**/*', async intercept => {
          const url = new URL(intercept.request().url());
          if (url.origin === local.origin || !['http:','https:'].includes(url.protocol)) return intercept.continue();
          item.errors.push({type:'external-request',url:url.href});
          return intercept.abort('blockedbyclient');
        });
        if (typeof context.routeWebSocket !== 'function') throw new Error('Playwright with routeWebSocket is required for network verification');
        await context.routeWebSocket('**/*', socket => {
          const url = new URL(socket.url());
          const permitted = url.host === local.host && url.protocol === (local.protocol === 'https:' ? 'wss:' : 'ws:');
          if (permitted) socket.connectToServer();
          else {item.errors.push({type:'external-websocket',url:url.href});socket.close();}
        });
        const page = await context.newPage();
        page.on('pageerror',error=>item.errors.push({type:'pageerror',reason:error.message}));
        page.on('requestfailed',request=>item.errors.push({type:'requestfailed',url:request.url(),reason:request.failure()?.errorText}));
        page.on('response',response=>{
          if(response.status()>=400) item.errors.push({type:'http',url:response.url(),status:response.status()});
          const resource=response.request().resourceType();
          if(['script','stylesheet','image','font','media'].includes(resource) && /text\/html/i.test(response.headers()['content-type'] || '')) item.errors.push({type:'soft-404',url:response.url()});
        });
        const target = localTarget(route,manifest.baseUrl,localBase);
        await page.goto(target,{waitUntil:'domcontentloaded',timeout:settings.timeoutMs});
        await page.waitForTimeout(settings.settleMs);
        const sourceUrl=new URL(route);
        const routeActions=settings.routes[sourceUrl.pathname+sourceUrl.search] || settings.routes[sourceUrl.pathname] || settings.routes[route] || [];
        const actions=[{type:'snapshot',name:'initial'},...settings.actions,...routeActions,{type:'snapshot',name:'final'}];
        for(let a=0;a<actions.length;a++){
          try { item.actions.push(await runAction(page,actions[a],{outputDir,filenamePrefix:`r${r}-v${v}-a${a}`,timeoutMs:settings.timeoutMs})); }
          catch(error){item.actions.push({type:actions[a].type,status:'failed',reason:error.message});item.errors.push({type:'action',reason:error.message});}
        }
      } catch(error){item.errors.push({type:'navigation',reason:error.message});}
      finally {if(context)try{await context.close();}catch(error){item.errors.push({type:'close',reason:error.message});}}
      if(item.errors.length)item.status='failed';
    }
  }catch(error){report.errors.push({reason:error.message});}
  finally{if(browser)try{await browser.close();}catch(error){report.errors.push({reason:error.message});}}
  if(report.errors.length || report.cases.some(item=>item.status==='failed') || !report.cases.length)report.status='failed';
  return report;
}
async function main(args = process.argv.slice(2)) {
  if(!args.length || args.includes('--help')){console.log('Usage: node scripts/verify.js <mirror> [--url http://127.0.0.1:8080] [--routes routes.json] [--actions actions.json]\nAudits recorded files and optionally runs an external-network-blocked browser smoke check. Does not automatically claim visual equivalence.');return;}
  const root=args[0];const options={};
  for(let i=1;i<args.length;i++){
    if(!['--url','--routes','--actions'].includes(args[i]) || !args[i+1] || args[i+1].startsWith('--'))throw new Error(`Invalid option: ${args[i]}`);
    options[args[i].slice(2)]=args[++i];
  }
  const {manifest,report:assets}=await auditAssets(root);
  const result={assets,behavioralEquivalence:'not evaluated',visualEquivalence:'not evaluated'};
  const runDir=path.resolve(root,'verification',`${Date.now()}-${randomUUID().slice(0,8)}`);
  await fs.mkdir(runDir,{recursive:true});
  if(options.url){
    const config=options.actions?JSON.parse((await fs.readFile(options.actions,'utf8')).replace(/^\uFEFF/,'')):{};
    if(options.routes)config.routeList=JSON.parse((await fs.readFile(options.routes,'utf8')).replace(/^\uFEFF/,''));
    result.browser=await browserSmoke(manifest,options.url,runDir,config);
  }
  result.status=assets.status==='passed' && (!result.browser || result.browser.status==='passed')?'passed':'failed';
  result.reportPath=path.join(runDir,'report.json');
  await fs.writeFile(result.reportPath,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  if(result.status!=='passed')process.exitCode=1;
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={auditAssets,browserSmoke,localTarget};
