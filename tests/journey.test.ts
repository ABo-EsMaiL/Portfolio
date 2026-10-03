import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authoredFaceBox, clampProgress, createIntroGate, journeyLayout } from '../src/lib/journey.ts';
import manifest from '../public/assets/portrait-manifest.json' with { type:'json' };
test('every active phase resolves once; repeated input retains latest native progress', () => {
  for (const phase of ['loading','entering','hunting','locked','unresolved'] as const) {
    const gate = createIntroGate(() => {}); gate.advance(phase);
    assert.equal(gate.interrupt(.2),true);assert.equal(gate.interrupt(.6),false);
    gate.advance('hunting');assert.equal(gate.state.phase,'resolving');
    assert.equal(gate.ready(),true);assert.equal(gate.ready(),false);
    assert.equal(gate.state.handoffs,1);assert.equal(gate.state.pendingProgress,.6);
    gate.advance('entering');assert.equal(gate.state.phase,'ready');
  }
});
test('normalized source geometry maps exactly into the measured Hero window', () => {
  const result = authoredFaceBox(manifest.anchors.faceBox,manifest.anchors.heroCrop);
  for (const key of ['x','y','width','height'] as const) assert.ok(Math.abs(result[key] - manifest.heroFaceBox[key]) < 1e-12);
  assert.equal(clampProgress(Infinity),0);assert.equal(clampProgress(-1),0);assert.equal(clampProgress(2),1);
});
test('intermediate screens center in their column while desktop keeps the accepted left screen and right About',()=>{
  for(const width of [700,767,768,780,790,1036,1100,1190,1440]){
    const hero=journeyLayout(width,1300,0,900),about=journeyLayout(width,1300,1,900);
    const center=width<1200?width/2:Math.max(width*.32,Math.min(width*.46,700)*.53+121);
    assert.ok(Math.abs(about.monitor.x+about.monitor.width/2-center)<1e-8,'screen centered in its responsive visual column');
    if(width>=1024)assert.ok(hero.portraitBottom>=900,'no square-cut hem floating within the Hero viewport');
    if(width<1200)assert.ok(about.aboutY>=about.monitor.y+about.monitor.height*1.23+80,'copy below the complete monitor and skill ingress');
  }
});
test('phone source fills the visible bottom and tablet composition has no 1024px discontinuity',()=>{
  for(const [width,viewport] of [[320,568],[390,844],[440,956]]){
    const hero=journeyLayout(width,1300,0,Math.max(viewport,844),1,viewport);
    assert.ok(Math.abs(hero.portraitBottom-viewport)<1e-8,'no half-empty phone viewport or floating square hem');
    assert.ok(Math.abs(hero.portrait.y+hero.portrait.height-viewport)<1e-8,'the available source stays fully visible');
    const captured=journeyLayout(width,1300,.7,Math.max(viewport,844),1,viewport);
    assert.ok(captured.portrait.width<hero.portrait.width,'person visibly travels after the frame catches its viewport-grounded hem');
  }
  const tablets=[1000,1020,1025,1038].map(width=>journeyLayout(width,1300,0,900));
  for(const layout of tablets){assert.equal(layout.stacked,true);assert.equal(layout.compact,true);assert.ok(Math.abs(layout.portrait.x+layout.portrait.width/2-(layout.monitor.x+layout.monitor.width/2))<1e-8);assert.ok(layout.heroActions.x<layout.portrait.x);assert.ok(layout.heroCopy.x>layout.portrait.x+layout.portrait.width);}
  for(let i=1;i<tablets.length;i++)assert.ok(Math.abs(tablets[i].portrait.width-tablets[i-1].portrait.width)<10);
});
test('full-source entrance rests on the visible viewport bottom and settles into the unchanged journey',()=>{
  for(const [width,viewportHeight] of [[320,844],[390,600],[390,844],[768,900],[1024,900],[1440,900],[1920,900]]){
    const frameHeight=Math.max(viewportHeight,width<768?844:900),height=frameHeight+400;
    const entrance=journeyLayout(width,height,0,frameHeight,0,viewportHeight),hero=journeyLayout(width,height,0,frameHeight);
    assert.deepEqual(entrance.crop,{x:0,y:0,width:1,height:1});
    assert.ok(entrance.portrait.y>=80,'the complete head clears navigation');
    assert.ok(Math.abs(entrance.portrait.y+entrance.portrait.height-viewportHeight)<1e-8,'no floating lower edge');
    assert.equal(entrance.portraitBottom,viewportHeight);
    for(let n=0;n<=100;n++){
      const layout=journeyLayout(width,height,0,frameHeight,n/100,viewportHeight);
      assert.ok(Math.abs(layout.portrait.width/layout.portrait.height-.75*layout.crop.width/layout.crop.height)<1e-12,'no image distortion during reframe');
      assert.ok(layout.portraitBottom<=Math.max(viewportHeight,hero.portraitBottom)+1e-8);
    }
    for(const p of [0,.25,.5,.75,1])assert.deepEqual(journeyLayout(width,height,p,frameHeight,1,viewportHeight),journeyLayout(width,height,p,frameHeight,undefined,viewportHeight));
  }
});
test('shared camera/crop geometry is finite, aspect-preserving and deterministic in both directions',()=>{
  for(const width of [320,390,768,1440]){
    const height=width<768?844:900;
    const snapshots=[0,.25,.5,.75,1].map(p=>journeyLayout(width,height,p));
    for(const p of [1,.75,.5,.25,0]){
      const layout=journeyLayout(width,height,p);assert.deepEqual(layout,snapshots[[0,.25,.5,.75,1].indexOf(p)]);
      for(const rect of [layout.portrait,layout.monitor]){for(const value of Object.values(rect))assert.ok(Number.isFinite(value));assert.ok(rect.width>0&&rect.height>0);}
      assert.ok(Math.abs(layout.portrait.width/layout.portrait.height-.75*layout.crop.width/layout.crop.height)<1e-12);
      assert.ok(layout.screen>=0&&layout.screen<=1);assert.ok(layout.cables>=0&&layout.cables<=1);
    }
    assert.equal(snapshots[0].screen,1);assert.equal(snapshots[4].screen,1);assert.equal(snapshots[4].cables,1);
    assert.equal(snapshots[0].camera.scale,1);
    const start=snapshots[0].monitor,end=snapshots[4].monitor;
    assert.ok(start.x<0&&start.y<0&&start.x+start.width>width&&start.y+start.height>height,'Hero fills the same screen before zooming out');
    assert.ok(end.width<start.width);
    for(let i=1;i<snapshots.length;i++)assert.ok(snapshots[i].monitor.width<=snapshots[i-1].monitor.width);
    if(width>=768){const stacked=snapshots[4].aboutStacked;assert.ok(end.x+end.width/2-end.width*(stacked?.34:.53)-(stacked?26:44)>=snapshots[4].dock.x+48+12,'actual skill ingress clears the social hit area');}
    assert.ok(snapshots[4].portrait.y<snapshots[4].monitor.y);
  }
});
test('full source body and wires pre-exist; the complete portrait fits the final screen',()=>{
  for(const width of [320,390,600,768,1024,1440]){
    const h=width<768?844:900,hero=journeyLayout(width,h,0);
    for(let n=0;n<=100;n++){
      const layout=journeyLayout(width,h,n/100);
      assert.deepEqual(layout.crop,manifest.anchors.aboutCrop);assert.equal(layout.cables,1);
      assert.ok(layout.portrait.width>0);
    }
    const end=journeyLayout(width,h,1);
    if(width>=768)assert.ok(end.portrait.width<hero.portrait.width);
    assert.ok(Math.abs(end.portrait.y+end.portrait.height-end.aperture.y-end.aperture.height)<1e-8,'full source body meets the screen bottom without cropping');
    assert.ok(end.portrait.x>=end.aperture.x&&end.portrait.x+end.portrait.width<=end.aperture.x+end.aperture.width);
    if(width<768)assert.ok(end.aboutY>=end.monitor.y+end.monitor.height*1.23+23);
    assert.equal(hero.camera.y,0);
  }
});
test('the initial monitor stays beyond the entire tall mobile stage, not just its visible viewport',()=>{
  for(const width of [320,390,600]){
    const layout=journeyLayout(width,1240,0,844),screen=layout.monitor;
    assert.ok(screen.y+screen.height>1240);
    assert.ok(screen.y<0&&screen.x<0&&screen.x+screen.width>width);
  }
});
test('compact Hero shows the complete source to the viewport bottom and desktop keeps its accepted framing',()=>{
  for(const width of [320,390,600,768,1024,1440]){
    const height=width<768?844:900,hero=journeyLayout(width,height,0),about=journeyLayout(width,height,1);
    if(width<1200)assert.ok(Math.abs((hero.portraitBottom-hero.portrait.y)/hero.portrait.height-1)<1e-8);
    else assert.ok(hero.portraitBottom>hero.portrait.y+hero.portrait.width,'wide Hero source has no square-cut hem');
    assert.ok(Math.abs(about.portraitBottom-about.portrait.y-about.portrait.height)<1e-8);
    for(let n=0;n<=100;n++){
      const layout=journeyLayout(width,height,n/100);
      assert.ok(layout.portraitBottom<=layout.aperture.y+layout.aperture.height+1e-8);
      assert.ok(layout.portraitBottom>layout.portrait.y);
    }
  }
});
test('the portrait waits for the aperture to catch its hem, then follows that bottom without a detached crop',()=>{
  for(const width of [320,390,600,768,1024,1440,1920]){
    const h=width<768?844:900,hero=journeyLayout(width,h,0);
    let caught=false,previousTop=hero.portrait.y;
    for(let n=0;n<=1000;n++){
      const layout=journeyLayout(width,h,n/1000),bottom=layout.aperture.y+layout.aperture.height;
      assert.ok(Math.abs(layout.portrait.x+layout.portrait.width/2-layout.monitor.x-layout.monitor.width/2)<1e-8,'portrait is centered inside the moving screen');
      const catchBottom=hero.stacked?hero.portraitBottom:hero.portrait.y+hero.portrait.width;
      if(bottom>catchBottom+1e-8){
        assert.equal(layout.portrait.y,hero.portrait.y,'no premature upward drift');
        assert.equal(layout.portrait.width,hero.portrait.width,'no premature shrink');
        if(width<640)assert.equal(layout.portraitBottom,hero.portraitBottom);
      }else{
        caught=true;assert.ok(Math.abs(layout.portraitBottom-bottom)<1e-8,'the frame pulls the shared aperture bottom');
        assert.ok(layout.portrait.y+layout.portrait.height>=bottom-1e-8);
      }
      assert.ok(layout.portrait.y<=previousTop+1e-8,'the upward frame pull never bounces back down');previousTop=layout.portrait.y;
    }
    assert.ok(caught);
  }
});
