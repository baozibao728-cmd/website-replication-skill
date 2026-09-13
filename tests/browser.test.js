'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {capture}=require('../scripts/capture');
const {archive}=require('../scripts/archive');
const {createMirrorServer}=require('../scripts/serve');
const {auditAssets,browserSmoke}=require('../scripts/verify');
let chromium;
try{chromium=require(process.env.MIRROR_PLAYWRIGHT || 'playwright').chromium;}catch{}
test('real Chromium: capture two routes, archive CDN/query/API, close sources, replay locally', {skip:!chromium,timeout:60000},async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mirror-browser-test-'));
 const servers=[];
 t.after(async()=>{for(const server of servers)await new Promise(r=>{server.closeAllConnections();server.close(r);});await fs.rm(dir,{recursive:true,force:true});});
 async function listen(server){servers.push(server);await new Promise(r=>server.listen(0,'127.0.0.1',r));return `http://127.0.0.1:${server.address().port}`;}
 let sourceBase;
 const cdnBase=await listen(http.createServer((req,res)=>{
  if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(`document.querySelector('#load').onclick=async()=>{const r=await fetch('${sourceBase}/api?q=one');document.querySelector('#result').textContent=(await r.json()).text;};`);}
  else if(req.url==='/style.css'){res.setHeader('Content-Type','text/css');res.end('body{background-image:url("/pixel.svg?v=1")}');}
  else if(req.url.startsWith('/pixel.svg?')){res.setHeader('Content-Type','image/svg+xml');res.end('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="red"/></svg>');}
  else{res.writeHead(404);res.end();}
 }));
 sourceBase=await listen(http.createServer((req,res)=>{
  if(req.url==='/api?q=one'){res.setHeader('Content-Type','application/json');res.end('{"text":"Loaded offline"}');return;}
  if(!['/','/about'].includes(req.url)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type','text/html');res.end(`<!doctype html><html><head><link rel="icon" href="data:,"><link rel="stylesheet" href="${cdnBase}/style.css"></head><body><main><h1>${req.url}</h1><button id="load">Load</button><div id="result"></div><img src="${cdnBase}/pixel.svg?v=2"><a href="/about">About</a></main><script src="${cdnBase}/app.js"></script></body></html>`);
 }));
 const config={routeList:['/','/about'],viewports:[{width:800,height:600}],settleMs:100,timeoutMs:5000,heuristics:{scrollSteps:0,maxHover:0},actions:[{type:'click',selector:'#load'},{type:'waitForSelector',selector:'#result:has-text("Loaded offline")'}]};
 const captured=await capture(sourceBase+'/',path.join(dir,'HAR'),config,{chromium});assert.equal(captured.status,'passed',JSON.stringify(captured));assert.equal(captured.cases.length,2);
 assert.notEqual(captured.cases[0].har,captured.cases[1].har);
 const root=path.join(dir,'mirror');const manifest=await archive(captured.outputDir,root,{baseUrl:sourceBase+'/'});assert.equal(manifest.failures.length,0,JSON.stringify(manifest.failures));assert.equal(manifest.conflicts.length,0,JSON.stringify(manifest.conflicts));
 assert.ok(manifest.entries.some(e=>e.url===cdnBase+'/pixel.svg?v=1'));assert.ok(manifest.entries.some(e=>e.url===cdnBase+'/pixel.svg?v=2'));
 assert.equal((await auditAssets(root)).report.status,'passed');
 // Shut down both original servers. Only the mirror can serve the browser below.
 for(const server of servers)await new Promise(r=>{server.closeAllConnections();server.close(r);});servers.length=0;
 const localBase=await listen(createMirrorServer({root,spa:true}));
 const verified=await browserSmoke(manifest,localBase,path.join(dir,'verify'),config,{chromium});assert.equal(verified.status,'passed',JSON.stringify(verified));
 // Prove the verifier catches a remaining upstream reference instead of merely
 // testing a clean fixture. The original servers are already shut down.
 const homepage=manifest.entries.find(e=>e.url===sourceBase+'/');
 await fs.appendFile(path.join(root,homepage.file),'<script src="http://127.0.0.1:1/unmapped.js"></script>');
 const blocked=await browserSmoke(manifest,localBase,path.join(dir,'blocked'),{...config,routeList:['/']},{chromium});
 assert.equal(blocked.status,'failed');
 assert.ok(blocked.cases[0].errors.some(e=>e.type==='external-request' && e.url==='http://127.0.0.1:1/unmapped.js'));
});
