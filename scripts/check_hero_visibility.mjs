// Native Edge/CDP visibility check, without Playwright focus emulation.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const child=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--remote-debugging-port=9224',`--user-data-dir=D:/AI_Engineer/Portfolio/tmp/visibility-browser-${process.pid}`,'--window-size=1000,800','--no-first-run','--no-default-browser-check','http://127.0.0.1:3000/'],{stdio:'ignore'});
let ws;const pending=new Map();let id=0;const states=[];
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(new Error(`CDP timeout ${method}`));},10000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params,...(sessionId?{sessionId}:{})}));});}
try{
 let info;for(let n=0;n<80;n++){try{info=await (await fetch('http://127.0.0.1:9224/json/version')).json();break;}catch{await new Promise(r=>setTimeout(r,100));}}assert(info,'Owned native Edge endpoint not ready');
 ws=new WebSocket(info.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 ws.onmessage=({data})=>{const m=JSON.parse(data);const p=pending.get(m.id);if(p){pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}};
 const {targetInfos}=await send('Target.getTargets');const page=targetInfos.find(t=>t.type==='page'&&t.url.startsWith('http://127.0.0.1:3000'));assert(page);
 const {sessionId}=await send('Target.attachToTarget',{targetId:page.targetId,flatten:true});
 const smoke=await send('Runtime.evaluate',{expression:'1',returnByValue:true,timeout:1000},sessionId);
 assert.equal(smoke.result.value,1,'Native evaluation smoke check');
 states.push({label:'protocol-smoke',value:smoke.result.value});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable',{},sessionId);await send('Runtime.enable',{},sessionId);
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.heroDraws=0;for(const key of ['drawArrays','drawElements']){const old=WebGL2RenderingContext.prototype[key];WebGL2RenderingContext.prototype[key]=function(...args){window.heroDraws++;return Reflect.apply(old,this,args);};}`},sessionId);
 await send('Page.reload',{ignoreCache:true},sessionId);await send('Target.activateTarget',{targetId:page.targetId});await send('Page.bringToFront',{},sessionId);
 const state=()=>evaluate(`({hidden:document.hidden,draws:window.heroDraws,readyState:document.readyState,root:{...document.querySelector('.hero-world')?.dataset}})`);
 // Poll from Node: timers/RAF in the target are precisely what native backgrounding can suspend.
 async function waitFor(label,predicate,limit=10000){
   const started=Date.now();let last;
   while(Date.now()-started<limit){const value=await state();const signature=JSON.stringify([value.hidden,value.root.phase,value.root.webgl]);
     if(signature!==last){states.push({label,...value});last=signature;}
     if(predicate(value))return value;await new Promise(r=>setTimeout(r,50));
   }throw new Error(`Native ${label} timeout: ${JSON.stringify(await state())}`);
 }
 const visible=await waitFor('ready',s=>s.root.phase==='ready');assert.equal(visible.root.webgl,'true');
 const other=await send('Target.createTarget',{url:'about:blank',newWindow:false,background:false});await send('Target.activateTarget',{targetId:other.targetId});
 const hidden=await waitFor('hidden',s=>s.hidden,3000);await new Promise(r=>setTimeout(r,350));const idle=await state();states.push({label:'hidden-idle',...idle});assert.equal(hidden.draws,idle.draws,'Hidden GPU draws continued');
 await send('Target.activateTarget',{targetId:page.targetId});await send('Page.bringToFront',{},sessionId);
 await waitFor('resumed',s=>!s.hidden&&s.draws>idle.draws);
 const result={status:'PASS',browser:info.Browser,method:'Owned native headed Edge, real tab activation, no visibility/focus property override',states};await writeFile('docs/hero-visibility.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){await writeFile('docs/hero-visibility.json',JSON.stringify({status:'FAIL',error:error.message,states},null,2));throw error;}
finally{if(ws?.readyState===WebSocket.OPEN){try{await send('Browser.close');}catch{/* Endpoint closes with owned browser. */}ws.close();}for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error('Owned browser closed'));}pending.clear();if(!ws)child.kill();}
