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

export const journeyFrameHeight=(width:number,viewportHeight:number)=>width>=640&&viewportHeight<600?viewportHeight:Math.max(viewportHeight,width<768?844:900);

export function journeyLayout(width:number,height:number,progress:number,frameHeight=height,intro=1,viewportHeight=frameHeight) {
  const p=clampProgress(progress),mobile=width<768,stacked=width<1200,compact=width>=900&&stacked,aboutStacked=width<1200;
  const h=Math.min(height,frameHeight);
  const smooth=(start:number,end:number)=>{const t=clampProgress((p-start)/(end-start));return t*t*(3-2*t);};
  const t=smooth(0,.82),screen=1,cables=1;
  const mix=(a:number,b:number)=>a+(b-a)*t;
  // Keep full-source UVs; a reversible upper-body reveal and the screen share one bottom boundary.
  const crop={x:.1875,y:.01171875,width:.625,height:.890625};
  const landscape=width>=640&&h<600;
  const monitorWidth=aboutStacked?Math.min(width*(width<640?.92:.78),560,landscape?h*.88:Infinity):Math.min(width*.46,700);
  const monitorHeight=monitorWidth*.62;

  // Fit the entire available source body to the aperture; the head remains above its top edge.
  const bodyHeight=monitorHeight*.977/(1-.248),bodyWidth=bodyHeight*.75*crop.width/crop.height;

  // Social hit targets and the larger skill artwork need distinct, tightly spaced lanes.
  const aboutCenter=aboutStacked?width/2:Math.max(width*.32,monitorWidth*.53+121);
  const endTop=(landscape?96:h*(mobile?.13:.12))+bodyHeight*.248;
  const viewport=Math.min(h,viewportHeight);
  const preferredTop=stacked?(landscape?viewport*.48:Math.max(viewport*.31,Math.min(306,Math.max(230,width*.34)))):h*.10+Math.min(272,Math.max(192,width*.183));
  const heroHeight=stacked?Math.min(viewport-preferredTop,width*1.78):Math.min(width*.52,h*.72,680);
  const heroWidth=stacked?heroHeight*.75*crop.width/crop.height:heroHeight;
  const heroTop=stacked?viewport-heroHeight:preferredTop;
  // The tall readable About stage must not expose the initial bezel/stand below the Hero viewport.
  const startBottom=Math.max(height*1.1,heroTop+heroWidth*1.9+10);
  const wideScreen=Math.max(width*1.3,(startBottom+h*.15)/.62);
  // The final bezel starts below the authored face box, not across the neck/head.

  const heroCenter=width<640?width*.43:width/2;
  const monitor={x:mix(heroCenter-wideScreen/2,aboutCenter-monitorWidth/2),
    y:mix(startBottom-wideScreen*.62,endTop),width:mix(wideScreen,monitorWidth),height:mix(wideScreen*.62,monitorHeight)};
  const scale=monitor.width/wideScreen,startCenterY=startBottom-wideScreen*.62/2;
  const camera={scale,x:monitor.x+monitor.width/2-width/2-(heroCenter-width/2)*scale,y:monitor.y+monitor.height/2-height/2-(startCenterY-height/2)*scale};
  const aperture={x:monitor.x+monitor.width*.016,y:monitor.y+monitor.height*.023,width:monitor.width*.968,height:monitor.height*.954};
  const heroBottom=heroTop+heroHeight,startApertureBottom=startBottom-wideScreen*.62*.023,endBottom=endTop+monitorHeight*.977;
  // Hold the person still until the aperture reaches the Hero hem; only then does the frame pull it.
  const catchAt=clampProgress((startApertureBottom-heroBottom)/(startApertureBottom-endBottom));
  const follow=clampProgress((t-catchAt)/(1-catchAt)),settle=stacked?follow:follow*follow*(3-2*follow);
  const portraitWidth=heroWidth+(bodyWidth-heroWidth)*settle,portraitHeight=portraitWidth/.75*crop.height/crop.width;
  const center=monitor.x+monitor.width/2;
  const heldBottom=Math.min(heroBottom,aperture.y+aperture.height);
  const visibleHeight=heroHeight+(bodyHeight-heroHeight)*settle;
  const portrait={x:center-portraitWidth/2,y:follow===0?heroTop:heldBottom-visibleHeight,width:portraitWidth,height:portraitHeight};
  // Wide views reveal the pre-existing source to the physical aperture, not a floating square hem.
  const portraitBottom=stacked||follow>0?heldBottom:Math.min(portrait.y+portrait.height,aperture.y+aperture.height);
  const entrance=clampProgress(intro),bottom=Math.min(h,viewportHeight);
  // The automatic entrance uses the whole photograph at the visible bottom, not the tall scroll stage.
  const entranceHeight=Math.min(bottom*.8,width*1.2,720),entranceWidth=entranceHeight*.75;
  const entranceMix=(a:number,b:number)=>a+(b-a)*entrance;
  const displayedCrop=entrance===1?crop:{x:crop.x*entrance,y:crop.y*entrance,width:entranceMix(1,crop.width),height:entranceMix(1,crop.height)};
  const displayedWidth=entranceMix(entranceWidth,portrait.width);
  const displayedPortrait=entrance===1?portrait:{x:entranceMix(width/2,center)-displayedWidth/2,y:entranceMix(bottom-entranceHeight,portrait.y),width:displayedWidth,height:displayedWidth/.75*displayedCrop.height/displayedCrop.width};
  const aboutX=aboutStacked?(width-Math.min(width*.84,840))/2:Math.max(width*.61,aboutCenter+monitorWidth/2+40);
  const actionX=compact?Math.max(80,width*.065):width*(stacked?.68:.065);
  const copyX=compact?heroCenter+heroWidth/2+16:width*(stacked?.68:.69);
  return {portrait:displayedPortrait,portraitBottom:entrance===1?portraitBottom:entranceMix(bottom,portraitBottom),monitor,aperture,camera,crop:displayedCrop,screen,cables,transition:t,mobile,stacked,compact,aboutStacked,frameHeight:h,
    aboutX,aboutWidth:aboutStacked?Math.min(width*.84,840):Math.min(600,width-aboutX-width*.05),
    aboutY:aboutStacked?endTop+monitorHeight*1.23+140:h*.2,
    heroCopy:{x:copyX,y:stacked?heroTop+(compact?42:16):h*.57,width:compact?width-copyX-24:width*.29},
    heroActions:{x:actionX,y:stacked?heroTop+(compact?(landscape?24:64):128):h*.57,width:compact?heroCenter-heroWidth/2-actionX-24:width*(stacked?.29:.25)},
    heroSocial:{x:stacked?(mobile?8:16):width*.065,y:stacked?Math.min(heroTop+16,viewport-216):h*.82,vertical:stacked},
    dock:{x:mobile?8:16,y:aboutStacked?endTop+32:h*.43}};
}
