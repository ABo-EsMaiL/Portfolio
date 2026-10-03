export type IntroPhase = 'loading' | 'entering' | 'hunting' | 'locked' | 'unresolved' | 'resolving' | 'ready';
export const clampProgress = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
export function createIntroGate(onPhase: (phase: IntroPhase) => void) {
  let phase: IntroPhase = 'loading';
  let pendingProgress = 0;
  let handoffs = 0;
  return {
    advance(next: IntroPhase) { if (phase !== 'resolving' && phase !== 'ready') { phase = next; onPhase(phase); } },
    interrupt(progress: number) {
      pendingProgress = clampProgress(progress);
      if (phase === 'ready' || phase === 'resolving') return false;
      phase = 'resolving'; onPhase(phase); return true;
    },
    ready() { if (phase === 'ready') return false; phase = 'ready'; handoffs++; onPhase(phase); return true; },
    get state() { return { phase, pendingProgress, handoffs }; },
  };
}
export function authoredFaceBox(face: { x:number; y:number; width:number; height:number }, crop: { x:number; y:number; width:number; height:number }) {
  return { x: (face.x - crop.x) / crop.width, y: (face.y - crop.y) / crop.height,
    width: face.width / crop.width, height: face.height / crop.height };
}

export function journeyLayout(width:number,height:number,progress:number,frameHeight=height) {
  const p=clampProgress(progress),mobile=width<768,stacked=width<1024;
  const h=Math.min(height,frameHeight);
  const smooth=(start:number,end:number)=>{const t=clampProgress((p-start)/(end-start));return t*t*(3-2*t);};
  const t=smooth(0,.82),screen=1,cables=1;
  const mix=(a:number,b:number)=>a+(b-a)*t;
  // Keep full-source UVs; a reversible upper-body reveal and the screen share one bottom boundary.
  const crop={x:.1875,y:.01171875,width:.625,height:.890625};
  const monitorWidth=mobile?Math.min(width*.92,480):Math.min(width*.46,700);
  const monitorHeight=monitorWidth*.62;
  const heroWidth=stacked?Math.min(width*.8,h*.36):Math.min(width*.52,h*.72,680);
  // Fit the entire available source body to the aperture; the head remains above its top edge.
  const bodyHeight=monitorHeight*.977/(1-.248),bodyWidth=bodyHeight*.75*crop.width/crop.height;

  // Social hit targets and the larger skill artwork need distinct, tightly spaced lanes.
  const aboutCenter=mobile?width/2:Math.max(width*.32,monitorWidth*.53+121);
  const heroTop=stacked?Math.max(h*.30,Math.min(306,Math.max(258,width*.494))):h*.10+Math.min(272,Math.max(192,width*.183));
  // The tall readable About stage must not expose the initial bezel/stand below the Hero viewport.
  const startBottom=Math.max(height*1.1,heroTop+heroWidth*1.9+10);
  const wideScreen=Math.max(width*1.3,(startBottom+h*.15)/.62);
  // The final bezel starts below the authored face box, not across the neck/head.
  const endTop=h*(mobile?.13:.12)+bodyHeight*.248;
  const monitor={x:mix((width-wideScreen)/2,aboutCenter-monitorWidth/2),
    y:mix(startBottom-wideScreen*.62,endTop),width:mix(wideScreen,monitorWidth),height:mix(wideScreen*.62,monitorHeight)};
  const scale=monitor.width/wideScreen,startCenterY=startBottom-wideScreen*.62/2;
  const camera={scale,x:monitor.x+monitor.width/2-width/2,y:monitor.y+monitor.height/2-height/2-(startCenterY-height/2)*scale};
  const aperture={x:monitor.x+monitor.width*.016,y:monitor.y+monitor.height*.023,width:monitor.width*.968,height:monitor.height*.954};
  const heroBottom=heroTop+heroWidth,startApertureBottom=startBottom-wideScreen*.62*.023,endBottom=endTop+monitorHeight*.977;
  // Hold the person still until the aperture reaches the Hero hem; only then does the frame pull it.
  const catchAt=clampProgress((startApertureBottom-heroBottom)/(startApertureBottom-endBottom));
  const follow=clampProgress((t-catchAt)/(1-catchAt)),settle=follow*follow*(3-2*follow);
  const portraitWidth=heroWidth+(bodyWidth-heroWidth)*settle,portraitHeight=portraitWidth/.75*crop.height/crop.width;
  const center=monitor.x+monitor.width/2;
  const portraitBottom=Math.min(heroBottom,aperture.y+aperture.height);
  const visibleHeight=heroWidth+(bodyHeight-heroWidth)*settle;
  const portrait={x:center-portraitWidth/2,y:follow===0?heroTop:portraitBottom-visibleHeight,width:portraitWidth,height:portraitHeight};
  return {portrait,portraitBottom,monitor,aperture,camera,crop,screen,cables,transition:t,mobile,stacked,frameHeight:h,
    aboutY:mobile?endTop+monitorHeight*1.23+140:h*.2,
    heroSocial:{x:stacked?width*.5-128:width*(width<1200?.04:.065),y:h*(stacked?.90:.82)},
    dock:{x:mobile?8:16,y:mobile?endTop+32:h*.43}};
}
