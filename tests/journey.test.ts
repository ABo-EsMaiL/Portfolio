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
    if(width>=768)assert.ok(end.x+end.width/2-end.width*.53-44>=snapshots[4].dock.x+48+12,'larger skill artwork clears the social hit area');
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
test('Hero clips to its reviewed upper-body crop while About reveals the complete same source',()=>{
  for(const width of [320,390,600,768,1024,1440]){
    const height=width<768?844:900,hero=journeyLayout(width,height,0),about=journeyLayout(width,height,1);
    assert.ok(Math.abs((hero.portraitBottom-hero.portrait.y)/hero.portrait.height-manifest.anchors.heroCrop.height/manifest.anchors.aboutCrop.height)<1e-8);
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
      if(bottom>hero.portraitBottom+1e-8){
        assert.equal(layout.portrait.y,hero.portrait.y,'no premature upward drift');
        assert.equal(layout.portrait.width,hero.portrait.width,'no premature shrink');
        assert.equal(layout.portraitBottom,hero.portraitBottom);
      }else{
        caught=true;assert.ok(Math.abs(layout.portraitBottom-bottom)<1e-8,'the frame pulls the shared crop bottom');
        assert.ok(layout.portrait.y+layout.portrait.height>=bottom-1e-8);
      }
      assert.ok(layout.portrait.y<=previousTop+1e-8,'the upward frame pull never bounces back down');previousTop=layout.portrait.y;
    }
    assert.ok(caught);
  }
});
