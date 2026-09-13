const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {createMirrorServer}=require('./lib/serve.cjs');
const root=path.join(__dirname,'mirror');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const raw=createMirrorServer({root:path.join(root,'_assets')});
const entry=manifest.entries.find(e=>e.url===manifest.baseUrl);
const hero=manifest.entries.find(e=>e.url.endsWith('/1uq8b6yni-tzr.js'));
const heroCode=require('./astra-quality.cjs')(fs.readFileSync(path.join(root,hero.file),'utf8'));
const sw=fs.readFileSync(path.join(__dirname,'worker.js'),'utf8').replace('/*MANIFEST*/',JSON.stringify(manifest));
const boot='<!doctype html><meta charset="utf-8"><title>Astra 本地镜像</title><style>body{background:#03090d;color:white;font:16px system-ui;display:grid;place-items:center;height:90vh}</style><p>正在启动本地镜像…</p><script>navigator.serviceWorker.register("/mirror-worker.js").then(()=>navigator.serviceWorker.ready).then(()=>{if(navigator.serviceWorker.controller)location.replace("/index/gpt-6-astra/");else navigator.serviceWorker.addEventListener("controllerchange",()=>location.replace("/index/gpt-6-astra/"),{once:true});}).catch(e=>document.querySelector("p").textContent=e.message)</script>';
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store'});return res.end(boot);}
 if(u.pathname==='/mirror-worker.js'){res.writeHead(200,{'Content-Type':'application/javascript','Service-Worker-Allowed':'/','Cache-Control':'no-store'});return res.end(sw);}
 if(u.pathname==='/index/gpt-6-astra/'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});return fs.createReadStream(path.join(root,entry.file)).pipe(res);}
 if(u.pathname.startsWith('/__asset/')){const name=u.pathname.slice(9);const e=manifest.entries.find(x=>x.file==='_assets/'+name);if(!e){res.writeHead(404);return res.end('Missing asset');}if(e===hero){res.writeHead(200,{'Content-Type':e.mime,'Cache-Control':'no-store'});return res.end(heroCode);}req.url='/'+name;const write=res.writeHead;res.writeHead=function(status,h){return write.call(this,status,{...h,'Content-Type':e.mime});};return raw.emit('request',req,res);}
 res.writeHead(404);res.end('Not archived');
}).listen(Number(process.env.PORT||8080),'127.0.0.1',()=>console.log('http://127.0.0.1:'+(process.env.PORT||8080)+'/'));
