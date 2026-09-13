const manifest=/*MANIFEST*/;
const base=new URL(manifest.baseUrl).origin;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin&&(u.pathname==='/'||u.pathname.startsWith('/__asset/')||u.pathname==='/mirror-worker.js'))return;
 e.respondWith((async()=>{
  const original=u.origin===self.location.origin?base+u.pathname+u.search:u.href;
  if(/cloudflareinsights|browser-intake-datadoghq|ab.chatgpt.com|\/cdn-cgi\//.test(original))return new Response(null,{status:204});
  if(original.includes('chatgpt.com/ces/'))return Response.json({});
  if(u.searchParams.has('_rsc'))return new Response(null,{status:204});
  let candidates=manifest.entries.filter(x=>x.url===original&&(x.method||'GET')===e.request.method);
  if(candidates.length>1){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await e.request.clone().arrayBuffer()))).map(v=>v.toString(16).padStart(2,'0')).join('');candidates=candidates.filter(x=>x.requestBodyHash===hash);}
  let match=candidates[0];
  if(!match&&u.hostname==='images.ctfassets.net')match=manifest.entries.find(x=>x.url.split('?')[0]===original.split('?')[0]);
  if(!match&&e.request.mode==='navigate'&&u.origin===self.location.origin)return Response.redirect(original,302);
  if(!match)return new Response('Not archived: '+original,{status:404,headers:{'Content-Type':'text/plain'}});
  const headers=new Headers();if(e.request.headers.has('range'))headers.set('range',e.request.headers.get('range'));
  return fetch('/__asset/'+match.file.split('/').pop(),{headers});
 })());
});
