import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIntroGate, clampProgress, journeyLayout } from './journey';
import type { Rect } from './content';

type Scene = { render(seconds:number):void;resize():void;dispose():void;info():{drawCalls:number;points:number} };
export type SceneFactory=(host:HTMLElement,image:HTMLImageElement,params:{presence:number;aura:number;progress:number})=>Promise<Scene>;
export function mountHero(root:HTMLElement,face:Rect,readyLabel:string,sceneFactory?:SceneFactory) {
  gsap.registerPlugin(ScrollTrigger);
  const stage=root.querySelector<HTMLElement>('.world-stage')!,track=root.querySelector<HTMLElement>('.journey-track')!;
  const image=root.querySelector<HTMLImageElement>('.portrait-image')!,portrait=root.querySelector<HTMLElement>('.portrait-stage')!;
  const motion=root.querySelector<HTMLElement>('.portrait-motion')!,layer=root.querySelector<HTMLElement>('.spatial-layer')!;
  const hud=Array.from(root.querySelectorAll<SVGElement>('.detection-hud'));
  const identity=root.querySelector<HTMLElement>('.identity')!,copy=root.querySelector<HTMLElement>('.hero-copy')!;
  const actions=root.querySelector<HTMLElement>('.hero-actions')!,about=root.querySelector<HTMLElement>('.about-copy')!;
  const socials=Array.from(root.querySelectorAll<HTMLElement>('.socials li'));
  const dock=root.querySelector<HTMLElement>('.social-dock')!,monitor=root.querySelector<HTMLElement>('.monitor-fallback')!;
  const hint=root.querySelector<HTMLElement>('.gesture-hint')!,caption=root.querySelector<HTMLElement>('.scene-caption')!;
  const scan=root.querySelector<HTMLElement>('.scan-status')!,status=root.querySelector<HTMLElement>('[data-live-status]')!;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),params={presence:0,aura:0,progress:0},reveal={value:0};
  let scene:Scene|undefined,intro:gsap.core.Timeline|undefined,navigation:gsap.core.Tween|undefined,loader:gsap.core.Tween|undefined;
  let disposed=false,paused=false,activeStage='Hero',enhanced=!reduce.matches;
  const context=gsap.context(()=>{},root);
  const smooth=(p:number,start:number,end:number)=>{const t=clampProgress((p-start)/(end-start));return t*t*(3-2*t);};
  const range=()=>Math.max(1,track.offsetHeight-stage.clientHeight);
  const progress=()=>clampProgress((scrollY-root.offsetTop)/range());

  const frameHeight=()=>Math.min(stage.clientHeight,Math.max(innerHeight,stage.clientWidth<768?844:900));
  const gate=createIntroGate(phase=>{if(disposed)return;root.dataset.phase=phase;status.textContent=phase==='ready'?readyLabel:phase==='locked'?'Face located':phase==='hunting'?'Finding the engineer':'Preparing the scene';});
  function stats(){if(scene){const info=scene.info();root.dataset.drawCalls=String(info.drawCalls);root.dataset.points=String(info.points);}}
  function box(rect=face){const layout=journeyLayout(stage.clientWidth,stage.clientHeight,0,frameHeight());return{x:layout.portrait.width*rect.x,y:layout.portrait.height*rect.y,width:layout.portrait.width*rect.width,height:layout.portrait.height*rect.height,scaleX:1,scaleY:1};}
  function measure(){
    if(!enhanced)return;
    stage.style.height='';track.style.height='';
    const h=frameHeight(),layout=journeyLayout(stage.clientWidth,stage.clientHeight,1,h);
    root.style.setProperty('--frame-height',`${h}px`);
    root.style.setProperty('--about-top',`${layout.aboutY}px`);
    // Let larger phone copy be read by native scrolling after the spatial transition, not tiny type.
    const needed=Math.max(stage.clientHeight,layout.aboutY+about.offsetHeight+32);
    stage.style.height=`${Math.ceil(needed)}px`;track.style.height=`${Math.ceil(needed)+innerHeight*1.8}px`;
  }
  function renderJourney(){
    if(disposed||!enhanced)return;
    const p=params.progress,layout=journeyLayout(stage.clientWidth,stage.clientHeight,p,frameHeight()),r=layout.portrait,crop=layout.crop,h=layout.frameHeight;
    gsap.set(portrait,{x:r.x,y:r.y,width:r.width,height:r.height});
    const fullWidth=r.width/crop.width,fullHeight=r.height/crop.height;
    gsap.set(image,{width:fullWidth,height:fullHeight,x:-crop.x*fullWidth,y:-crop.y*fullHeight});
    const aperture=layout.aperture;
    const clip=Math.max(0,r.y+r.height-layout.portraitBottom),left=Math.max(0,aperture.x-r.x),right=Math.max(0,r.x+r.width-aperture.x-aperture.width);
    motion.style.clipPath=`inset(0 ${right}px ${clip}px ${left}px)`;
    const heroAlpha=(1-smooth(p,.1,.49))*reveal.value,aboutAlpha=smooth(p,.78,.94);
    const camera=layout.camera;
    const project=(x:number,y:number)=>({x:camera.x+(x-stage.clientWidth/2)*(camera.scale-1),y:camera.y+(y-stage.clientHeight/2)*(camera.scale-1),scale:camera.scale,transformOrigin:'0 0'});
    // Fade the visual headline without removing the page's sole h1 from the accessibility tree.
    const headline=project(stage.clientWidth*.06,h*(layout.stacked?.115:.10));
    headline.y-=layout.transition*h*.44;
    gsap.set(identity,{...headline,opacity:(1-smooth(p,.05,.3))*reveal.value});
    // Native alpha masking puts the live WebGL photograph above the headline without a second canvas/photo.
    identity.style.setProperty('--portrait-mask-width',`${fullWidth/camera.scale}px`);
    identity.style.setProperty('--portrait-mask-height',`${fullHeight/camera.scale}px`);
    identity.style.setProperty('--portrait-mask-x',`${(r.x-crop.x*fullWidth-(stage.clientWidth*.06+headline.x))/camera.scale}px`);
    identity.style.setProperty('--portrait-mask-y',`${(r.y-crop.y*fullHeight-(h*(layout.stacked?.115:.10)+headline.y))/camera.scale}px`);
    gsap.set(copy,{...project(stage.clientWidth*(layout.stacked?.04:.69),h*(layout.stacked?.715:stage.clientWidth<1200?.44:.57)),autoAlpha:heroAlpha});
    gsap.set(actions,{...project(stage.clientWidth*(layout.stacked?0:.065),h*(layout.stacked?.825:stage.clientWidth<1200?.40:.57)),autoAlpha:heroAlpha});
    gsap.set(about,{autoAlpha:aboutAlpha,y:(1-aboutAlpha)*24});about.inert=aboutAlpha<.95;actions.inert=heroAlpha<.95;
    gsap.set(monitor,{x:layout.monitor.x,y:layout.monitor.y,width:layout.monitor.width,height:layout.monitor.height,opacity:layout.screen});
    const train=smooth(p,.24,.77);
    const socialStep=!layout.stacked&&stage.clientWidth<1200?60:68;
    socials.forEach((item,i)=>{const delay=clampProgress((train-i*.055)/(1-i*.055)),start=layout.heroSocial;
      gsap.set(item,{x:start.x+i*socialStep+(layout.dock.x+2-start.x-i*socialStep)*delay,y:start.y+(layout.dock.y+6+i*52-start.y)*delay,autoAlpha:reveal.value});
      item.style.setProperty('--social-icon-size',`${30-4*delay}px`);item.style.setProperty('--social-icon-inset',`${1+2*delay}px`);
      gsap.set(item.querySelector('.social-name'),{opacity:1-train});});
    gsap.set(dock,{x:layout.dock.x,y:layout.dock.y,opacity:smooth(p,.62,.83)});
    gsap.set(hint,{autoAlpha:heroAlpha});gsap.set(caption,{autoAlpha:smooth(p,.62,.83)});
    if(gate.state.phase==='ready'){gsap.set(hud,{...box(),opacity:.8*(1-smooth(p,0,.14))});gsap.set(scan,{opacity:0});}
    root.dataset.progress=String(p);root.dataset.cables=String(layout.cables);
    const next=p>.57?'About':'Hero';
    if(next!==activeStage){activeStage=next;root.dataset.stage=next;window.dispatchEvent(new CustomEvent('journey:stage',{detail:next}));}
    scene?.render(gsap.ticker.time);stats();
  }
  function endpoint(){
    reveal.value=1;params.presence=1;params.aura=1;root.dataset.loading='false';loader?.kill();
    gsap.set(motion,{opacity:1,scale:1});gate.ready();root.dataset.handoffs=String(gate.state.handoffs);
    if(enhanced){params.progress=progress();renderJourney();}else{about.inert=false;actions.inert=false;}
  }
  function interrupt(){if(!gate.interrupt(progress()))return;intro?.kill();endpoint();}
  function intent(event:Event){
    const target=event.target instanceof Element?event.target:null;
    if(event.defaultPrevented||target?.closest('input,textarea,[contenteditable=true]'))return;
    if(event instanceof KeyboardEvent&&!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))return;
    if(event instanceof KeyboardEvent&&event.key===' '&&target?.closest('button'))return;
    navigation?.kill();interrupt();
  }
  function navigate(event:Event){
    const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[data-stage-link],a[data-discovery-cta]'):null;
    const target=link?document.getElementById(link.hash.slice(1)):null;
    if(!link||!target||!enhanced)return;
    event.preventDefault();interrupt();navigation?.kill();
    const position={y:scrollY},y=root.offsetTop+(target.id==='about'?range():0);
    navigation=gsap.to(position,{y,duration:.9,ease:'power2.inOut',onUpdate:()=>window.scrollTo(0,position.y),onComplete:()=>{history.replaceState(null,'',link.hash);target.focus({preventScroll:true});}});
  }
  function tick(seconds:number){scene?.render(seconds);}
  function visibility(){if(document.hidden){gsap.ticker.remove(tick);if(intro?.isActive()){paused=true;intro.pause();}}else{if(scene)gsap.ticker.add(tick);if(paused&&gate.state.phase!=='ready'){intro?.resume();paused=false;}}}
  function resize(){measure();scene?.resize();if(gate.state.phase==='ready')renderJourney();else if(enhanced){renderJourney();if(gate.state.phase==='locked')gsap.set(hud,box());}}
  function lost(){root.dataset.webgl='false';root.dataset.drawCalls='0';root.dataset.points='0';gsap.ticker.remove(tick);scene?.dispose();scene=undefined;}
  function preference(){if(!reduce.matches)return;intro?.kill();navigation?.kill();loader?.kill();lost();enhanced=false;trigger.kill();context.revert();root.classList.remove('is-enhanced');
    gsap.set([stage,track,image,motion,portrait,identity,copy,actions,about,monitor,hint,caption,dock,scan,...hud,...socials,...root.querySelectorAll('.social-name')],{clearProps:'all'});endpoint();}
  root.dataset.phase='loading';root.dataset.webgl='false';root.dataset.progress='0';root.dataset.stage='Hero';root.dataset.bound='true';
  if(enhanced){root.classList.add('is-enhanced');about.inert=true;measure();renderJourney();gsap.set(motion,{opacity:.15});}
  const trigger=ScrollTrigger.create({start:()=>root.offsetTop,end:()=>root.offsetTop+range(),onUpdate:self=>{params.progress=self.progress;if(gate.state.phase!=='ready'&&self.progress>0)interrupt();renderJourney();}});
  window.addEventListener('wheel',intent,{passive:true});window.addEventListener('touchmove',intent,{passive:true});window.addEventListener('keydown',intent);window.addEventListener('resize',resize);
  document.addEventListener('visibilitychange',visibility);root.addEventListener('click',navigate);root.addEventListener('hero:resolve',interrupt);layer.addEventListener('spatial-lost',lost);reduce.addEventListener('change',preference);
  const pending=setTimeout(()=>{if(disposed||gate.state.phase!=='loading'||!enhanced)return;root.dataset.loading='true';loader=gsap.to('.tensor-loader i',{y:-10,opacity:.35,duration:.4,stagger:{each:.06,repeat:-1,yoyo:true},ease:'sine.inOut'});},150);
  const timeout=setTimeout(()=>{if(gate.state.phase==='loading')endpoint();},3500);
  void Promise.all([image.decode(),document.fonts.ready]).then(()=>{
    if(disposed)return;clearTimeout(pending);clearTimeout(timeout);root.dataset.loading='false';loader?.kill();resize();ScrollTrigger.refresh();
    if(!enhanced||scrollY>0||location.hash||gate.state.phase==='ready')endpoint();
    else if(gate.state.phase==='loading')context.add(()=>{
      gsap.set(hud,{opacity:0});
      const hunts=[{x:.14,y:.3,width:.32,height:.18},{x:.48,y:.2,width:.32,height:.24},{x:.27,y:.38,width:.46,height:.2}];
      hud.forEach((frame,i)=>gsap.set(frame,box(hunts[i])));
      intro=gsap.timeline({onComplete:endpoint})
        .call(()=>gate.advance('entering'),[],0)
        .to(motion,{opacity:1,duration:.65,ease:'power2.out'},0)
        .to(params,{presence:1,aura:1,duration:.65},0)
        .call(()=>gate.advance('hunting'),[],.55)
        .to(hud,{opacity:.8,duration:.2,stagger:.08},.55);
      hud.forEach((frame,i)=>{intro!.to(frame,{...box(hunts[(i+1)%3]),duration:.6,ease:'power1.inOut'},.75+i*.12).to(frame,{...box(),duration:.6,ease:'power2.inOut'},1.45+i*.06);});
      intro.call(()=>{gate.advance('locked');scan.textContent='Identity found';},[],2.17)
        .to(hud,{color:'#258064',filter:'drop-shadow(0 0 5px rgba(255,255,255,.9))',opacity:1,duration:.15},2.17)
        .to(reveal,{value:1,duration:.55,onUpdate:renderJourney,ease:'power2.out'},2.22)
        .to(hud,{opacity:.6,duration:.4},2.55)
        .to(scan,{opacity:0,duration:.3},2.8);
      if(document.hidden){paused=true;intro.pause();}
    });
    if(sceneFactory&&enhanced&&!root.dataset.imageFailed){void sceneFactory(layer,image,params).then(created=>{if(disposed||!enhanced){created.dispose();return;}scene=created;scene.render(gsap.ticker.time);root.dataset.webgl='true';stats();if(!document.hidden)gsap.ticker.add(tick);}).catch(lost);}
    if(location.hash==='#about'&&enhanced){window.scrollTo(0,root.offsetTop+range());params.progress=1;renderJourney();}
  }).catch(()=>{if(disposed)return;clearTimeout(pending);clearTimeout(timeout);root.dataset.imageFailed='true';endpoint();});
  return()=>{disposed=true;clearTimeout(pending);clearTimeout(timeout);intro?.kill();navigation?.kill();loader?.kill();trigger.kill();gsap.ticker.remove(tick);scene?.dispose();context.revert();
    window.removeEventListener('wheel',intent);window.removeEventListener('touchmove',intent);window.removeEventListener('keydown',intent);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);
    root.removeEventListener('click',navigate);root.removeEventListener('hero:resolve',interrupt);layer.removeEventListener('spatial-lost',lost);reduce.removeEventListener('change',preference);root.dataset.bound='false';root.classList.remove('is-enhanced');};
}