import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fixed=new Map([
  ['/', 'docs/engineering-world-study.html'],
  ['/engineering-world-study.html', 'docs/engineering-world-study.html'],
  ['/favicon.svg', 'public/favicon.svg'],
  ['/content/en.json', 'content/en.json'],
  ['/content/hero-ui.json', 'content/hero-ui.json'],
  ['/vendor/three.module.js', 'node_modules/three/build/three.module.js'],
  ['/vendor/three.core.js', 'node_modules/three/build/three.core.js'],
  ['/vendor/gsap.min.js', 'node_modules/gsap/dist/gsap.min.js'],
]);
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
  try{
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
    const url=new URL(req.url,'http://127.0.0.1'),pathname=decodeURIComponent(url.pathname);
    let relative=fixed.get(pathname);
    if(!relative&&pathname.startsWith('/assets/')){
      const absolute=path.resolve(root,'public','.'+pathname),assets=path.join(root,'public','assets')+path.sep;
      if(absolute.startsWith(assets))relative=path.relative(root,absolute);
    }
    if(!relative){res.writeHead(404);res.end('Not found');return;}
    const bytes=await readFile(path.join(root,relative));
    res.writeHead(200,{'Content-Type':types[path.extname(relative)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(3003,'127.0.0.1',()=>console.log('Engineering study ready: http://127.0.0.1:3003/'));