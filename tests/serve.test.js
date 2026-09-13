'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {createMirrorServer,localUrl}=require('../scripts/serve');
const {archive,digest}=require('../scripts/archive');
const {auditAssets}=require('../scripts/verify');
async function setup(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mirror-serve-test-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}
async function start(t,options){const server=createMirrorServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>{server.closeAllConnections();server.close(r);}));return server.address().port;}
function request(port,url,options={}){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path:url,method:options.method||'GET',headers:options.headers||{}},res=>{const chunks=[];res.on('data',d=>chunks.push(d));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString()}));});req.on('error',reject);req.end(options.body);});}
test('static fallback, malformed URI, containment, HEAD, Range and isolation',async t=>{
 const dir=await setup(t),root=path.join(dir,'site');await fs.mkdir(root);await fs.mkdir(path.join(dir,'site-other'));await fs.writeFile(path.join(dir,'site-other','secret'),'outside');
 await fs.writeFile(path.join(root,'index.html'),'<html>home</html>');await fs.writeFile(path.join(root,'video.mp4'),'0123456789');
 const port=await start(t,{root,spa:true});
 assert.equal((await request(port,'/route',{headers:{Accept:'text/html'}})).status,200);
 for(const url of ['/missing.js','/missing.wasm','/api/unknown'])assert.equal((await request(port,url,{headers:{Accept:'text/html'}})).status,404);
 assert.equal((await request(port,'/%ZZ')).status,400);
 assert.equal((await request(port,'/..%2Fsite-other/secret')).status,403);
 assert.equal((await request(port,'/video.mp4',{method:'HEAD'})).body,'');
 const ranged=await request(port,'/video.mp4',{headers:{Range:'bytes=2-4'}});assert.equal(ranged.status,206);assert.equal(ranged.body,'234');
 assert.equal((await request(port,'/video.mp4',{headers:{Range:'bytes=99-100'}})).status,416);
 assert.equal((await request(port,'/')).headers['cross-origin-embedder-policy'],undefined);
 const isolated=await start(t,{root,isolate:true});assert.equal((await request(isolated,'/')).headers['cross-origin-embedder-policy'],'require-corp');
});
test('archive-to-server preserves query/CDN/POST and rewrites text without changing archived hashes',async t=>{
 const dir=await setup(t),root=path.join(dir,'mirror'),input=path.join(dir,'capture.har');
 const record=(url,text,mime='text/plain',method='GET',body)=>({request:{url,method,...(body!==undefined?{postData:{text:body}}:{})},response:{status:200,content:{mimeType:mime,text,size:Buffer.byteLength(text)}}});
 const entries=[record('https://site.test/','<html><script src="https://cdn.test/app.js"></script></html>','text/html'),record('https://site.test/image?w=1','one'),record('https://site.test/image?w=2','two'),record('https://cdn.test/app.js','const origin="https://site.test/";','text/javascript'),record('https://cdn.test/css/style.css','body{background:url(../image.png?v=2)}','text/css'),record('https://site.test/api','{"ok":1}','application/json','POST','{"id":1}')];
 await fs.writeFile(input,JSON.stringify({log:{entries}}));const manifest=await archive(input,root,{baseUrl:'https://site.test/'});assert.equal(manifest.failures.length,0);
 const port=await start(t,{root,spa:true});
 assert.equal((await request(port,'/image?w=1')).body,'one');assert.equal((await request(port,'/image?w=2')).body,'two');assert.equal((await request(port,'/image?w=3')).status,404);
 assert.match((await request(port,'/')).body,/_mirror\//);
 assert.equal((await request(port,localUrl('https://cdn.test/app.js','https://site.test'))).body,'const origin="/";');
 assert.match((await request(port,localUrl('https://cdn.test/css/style.css','https://site.test'))).body,/_mirror\/.+\/image.png\?v=2/);
 assert.equal((await request(port,'/api',{method:'POST',body:'{"id":1}'})).body,'{"ok":1}');assert.equal((await request(port,'/api',{method:'POST',body:'{"id":2}'})).status,404);
 assert.equal((await auditAssets(root)).report.status,'passed');
 const asset=manifest.entries[0];assert.equal(digest(await fs.readFile(path.join(root,asset.file))),asset.sha256);
 await fs.writeFile(path.join(root,asset.file),'corrupted');assert.equal((await auditAssets(root)).report.status,'failed');
});
