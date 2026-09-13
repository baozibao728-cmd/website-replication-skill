'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const {archive, canonicalUrl, validatePayload, fetchComplete, digest} = require('../scripts/archive');

async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mirror-archive-test-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  return dir;
}
function entry(url, text, mime = 'text/javascript', more = {}) {
  return {request: {url, method: 'GET'}, response: {status: 200, content: {text, mimeType: mime, size: Buffer.byteLength(text)}}, ...more};
}
test('valid small document is kept; HTML resource, error status and invalid signatures are rejected', () => {
  assert.doesNotThrow(() => validatePayload({url: 'https://a.test/', status: 200, mime: 'text/html', body: Buffer.from('<html>OK</html>'), kind: 'page'}));
  for (const input of [
    {url: 'https://a.test/a.js', status: 200, mime: 'text/html', body: Buffer.from('<html>' + 'x'.repeat(6000))},
    {url: 'https://a.test/a.js', status: 404, mime: 'text/plain', body: Buffer.from('Not Found')},
    {url: 'https://a.test/a.wasm', status: 200, mime: 'application/wasm', body: Buffer.from('wrong')},
    {url: 'https://a.test/a.js', status: 206, mime: 'text/javascript', body: Buffer.from('partial')},
  ]) assert.throws(() => validatePayload(input));
});
test('CDN content type takes precedence over source filename extension', () => {
  const body=Buffer.concat([Buffer.from('RIFF'),Buffer.alloc(4),Buffer.from('WEBPVP8 ')]);
  validatePayload({url:'https://cdn.test/photo.png?fm=webp',status:200,mime:'image/webp',body});
  assert.throws(()=>validatePayload({url:'https://cdn.test/photo.png?fm=webp',status:200,mime:'image/webp',body:Buffer.from('invalid')}),/webp signature/);
});
test('query identity, CDN origins, documents, POST keys and atomic resume survive HAR import', async t => {
  const dir = await fixture(t); const input = path.join(dir, 'capture.har'); const out = path.join(dir, 'mirror');
  const entries = [
    entry('https://a.test/', '<html>OK</html>', 'text/html', {_resourceType: 'document'}),
    entry('https://a.test/image?size=1', 'small', 'image/jpeg'),
    entry('https://a.test/image?size=2', 'large', 'image/jpeg'),
    entry('https://cdn.test/app.js?token=abc&v=2', 'window.a=1;'),
    entry('https://a.test/api', '{"id":1}', 'application/json', {request: {url:'https://a.test/api', method:'POST', postData:{text:'{"id":1}'}}}),
  ];
  await fs.writeFile(input, JSON.stringify({log:{entries}}));
  const first = await archive(input, out, {baseUrl:'https://a.test/'});
  assert.equal(first.entries.length, 5); assert.equal(first.failures.length, 0);
  assert.ok(first.origins.includes('https://cdn.test'));
  assert.notEqual(first.entries[1].file, first.entries[2].file);
  assert.equal(first.entries[4].requestBodyHash, digest('{"id":1}'));
  await fs.writeFile(path.join(out, first.entries[3].file), 'corrupt');
  const rerun = await archive(input, out, {baseUrl:'https://a.test/'});
  assert.equal(await fs.readFile(path.join(out, rerun.entries[3].file), 'utf8'), 'window.a=1;');
  assert.equal(rerun.entries.length, 5);
  assert.equal(canonicalUrl('https://a.test/x?b=2&a=1&a=3#frag'), 'https://a.test/x?b=2&a=1&a=3');
});
test('missing bodies do not fetch implicitly; truncated HAR and conflicting variants are reported', async t => {
  const dir = await fixture(t); const input=path.join(dir,'record.har');
  const incomplete = entry('https://a.test/b.js','half'); incomplete.response.content.size=100;
  await fs.writeFile(input,JSON.stringify({log:{entries:[
    {request:{url:'http://127.0.0.1:1/no-body.js',method:'GET'},response:{status:200,content:{mimeType:'text/javascript'}}},
    incomplete, entry('https://a.test/a.js','first'), entry('https://a.test/a.js','second'),
  ]}}));
  const result=await archive(input,path.join(dir,'mirror'),{baseUrl:'https://a.test/'});
  assert.equal(result.entries.length,1);assert.equal(result.failures.length,2);assert.equal(result.conflicts.length,1);
  assert.match(result.failures[0].reason,/body missing/);
  assert.match(await fs.readFile(path.join(dir,'mirror','MISSING.log'),'utf8'),/size mismatch/);
});
test('redirects are preserved and binary embed is decoded',async t=>{
  const dir=await fixture(t);const input=path.join(dir,'capture.har');
  const wasm=Buffer.from([0,97,115,109,1,0,0,0]);
  await fs.writeFile(input,JSON.stringify({log:{entries:[
    {request:{url:'https://a.test/old',method:'GET'},response:{status:302,redirectURL:'/new',content:{}}},
    {request:{url:'https://a.test/x.wasm',method:'GET'},response:{status:200,content:{mimeType:'application/wasm',text:wasm.toString('base64'),encoding:'base64',size:8}}},
  ]}}));
  const result=await archive(input,path.join(dir,'mirror'),{baseUrl:'https://a.test/'});
  assert.equal(result.entries[0].redirectUrl,'https://a.test/new');
  assert.deepEqual(await fs.readFile(path.join(dir,'mirror',result.entries[1].file)),wasm);
});
test('network downloader follows redirects and rejects incomplete transport / HTTP 404',async t=>{
  const server=http.createServer((req,res)=>{
    if(req.url==='/redirect'){res.writeHead(302,{Location:'/ok'});res.end();}
    else if(req.url==='/ok'){res.writeHead(200,{'Content-Type':'text/javascript'});res.end('valid');}
    else if(req.url==='/truncated'){res.writeHead(200,{'Content-Type':'application/wasm','Content-Length':100});res.write(Buffer.from([0,97,115,109]));res.socket.destroy();}
    else{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not Found');}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>new Promise(r=>{server.closeAllConnections();server.close(r);}));
  const base=`http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetchComplete(base+'/redirect',{attempts:1})).body.toString(),'valid');
  await assert.rejects(fetchComplete(base+'/truncated',{attempts:1,timeoutMs:2000}));
  await assert.rejects(fetchComplete(base+'/gone',{attempts:1}),/HTTP 404/);
});
