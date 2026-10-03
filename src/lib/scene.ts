import * as THREE from 'three';
import manifest from '../../public/assets/portrait-manifest.json';
import { createEmbeddingCloud } from './embedding';
import { journeyFrameHeight, journeyLayout } from './journey';
import heroUi from '../../content/hero-ui.json';

export type SceneParams = { presence: number; aura: number; progress: number; intro?: number };
const TEXTURE_URL = '/assets/portrait-scene-960.webp';
const clamp = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

export async function createSpatialScene(host: HTMLElement, image: HTMLImageElement, params: SceneParams): Promise<{
  render(seconds: number): void; resize(): void; dispose(): void;
  info(): { drawCalls: number; points: number };
}> {
  const { heroCrop, aboutCrop } = manifest.anchors;
  for (const crop of [heroCrop, aboutCrop]) {
    if (!Object.values(crop).every(Number.isFinite) || crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0
      || crop.x + crop.width > 1 || crop.y + crop.height > 1) throw new Error('Invalid spatial portrait crop');
  }
  if (!image.complete || !image.naturalWidth) throw new Error('Spatial portrait must be decoded');

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  const scene = new THREE.Scene();
  // Pixel orthographic registration keeps the photograph and DOM detection anchors aligned.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
  camera.position.z = 1500;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.scene = 'hero-about';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  const resources = new Set<{ dispose(): void }>();
  function own<T extends { dispose(): void }>(resource: T): T { resources.add(resource); return resource; }
  const pointer = new THREE.Vector2(), pointerTarget = new THREE.Vector2();
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  function movePointer(event: PointerEvent) {
    if (!finePointer.matches || event.pointerType === 'touch') return;
    pointerTarget.set(Math.max(-1,Math.min(1,event.clientX / innerWidth * 2 - 1)),Math.max(-1,Math.min(1,1 - event.clientY / innerHeight * 2)));
  }
  function resetPointer() { pointerTarget.set(0,0); }
  window.addEventListener('pointermove',movePointer,{passive:true});
  window.addEventListener('blur',resetPointer);
  document.documentElement.addEventListener('pointerleave',resetPointer);
  let disposed = false;
  let rejectLoad: ((reason: Error) => void) | undefined;
  function dispose() {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener('webglcontextlost', onLost);
    window.removeEventListener('pointermove',movePointer);
    window.removeEventListener('blur',resetPointer);
    document.documentElement.removeEventListener('pointerleave',resetPointer);
    rejectLoad?.(new Error('Spatial scene disposed during texture load'));
    resources.forEach(resource => resource.dispose());
    scene.clear();
    renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    canvas.remove();
  }
  function onLost(event: Event) {
    event.preventDefault();
    dispose();
    host.dispatchEvent(new CustomEvent('spatial-lost', { bubbles: true }));
  }
  canvas.addEventListener('webglcontextlost', onLost);
  host.append(canvas);
  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      rejectLoad = reject;
      const pending = new THREE.TextureLoader().load(TEXTURE_URL, loaded => {
        if (disposed || !host.isConnected) {
          loaded.dispose();
          reject(new Error('Spatial host removed during texture load'));
        } else resolve(loaded);
      }, undefined, reject);
      own(pending);
    });
    rejectLoad = undefined;
    if (disposed || !host.isConnected) throw new Error('Spatial host unavailable');
    texture.colorSpace = THREE.SRGBColorSpace;
    const plane = own(new THREE.PlaneGeometry(1, 1));
    const bottomClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 10000);
    const leftClip = new THREE.Plane(new THREE.Vector3(1, 0, 0),10000),rightClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0),10000);
    const portraitMaterial = own(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .01,
      depthWrite: false, toneMapped: false, clippingPlanes: [bottomClip,leftClip,rightClip] }));
    const portrait = new THREE.Mesh(plane, portraitMaterial);
    portrait.position.z = 12;
    portrait.renderOrder = 2;
    scene.add(portrait);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc1d3cb, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(-400, 600, 800); scene.add(key);
    const fill = new THREE.DirectionalLight(0xe0d8f5, .9);
    fill.position.set(500, -100, 400); scene.add(fill);

    const monitor = new THREE.Group(); scene.add(monitor);
    const silver = own(new THREE.MeshStandardMaterial({ color: 0xb4c3cf, roughness: .26, metalness: .55, transparent: true }));
    const lavender = own(new THREE.MeshStandardMaterial({ color: 0xd9d2e7, roughness: .42, metalness: .18, transparent: true }));
    const screenTexture=own(new THREE.TextureLoader().load('/assets/world-substrate.svg',loaded=>{if(disposed)loaded.dispose();}));
    screenTexture.colorSpace=THREE.SRGBColorSpace;
    const screenMaterial = own(new THREE.MeshBasicMaterial({ map:screenTexture, color:0xffffff, toneMapped:false, transparent: true }));
    const monitorMaterials: (THREE.MeshStandardMaterial | THREE.MeshBasicMaterial)[] = [silver, lavender, screenMaterial];
    const box = own(new THREE.BoxGeometry(1, 1, 1));
    const screenPlane = own(new THREE.PlaneGeometry(1, 1));
    function part(geometry: THREE.BufferGeometry, material: THREE.Material, order = 3) {
      const mesh = new THREE.Mesh(geometry, material); mesh.renderOrder = order; monitor.add(mesh); return mesh;
    }
    // A rounded, bevelled ring is actual depth geometry, not a flat border or an unreviewed model.
    function roundedRect(path: THREE.Path, x: number, y: number, w: number, h: number, r: number) {
      path.moveTo(x + r, y); path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r);
      path.lineTo(x + w, y + h - r); path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
      path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
    }
    const shape = new THREE.Shape(); roundedRect(shape, -.5, -.5, 1, 1, .025);
    const hole = new THREE.Path(); roundedRect(hole, -.484, -.477, .968, .954, .014); shape.holes.push(hole);
    const bezel = part(own(new THREE.ExtrudeGeometry(shape, { depth: .025, bevelEnabled: true,
      bevelSize: .0025, bevelThickness: .0025, bevelSegments: 2, curveSegments: 6 })), silver,1);
    const back = part(box, lavender, 0);
    const screen = part(screenPlane, screenMaterial, 0);
    const neck = part(box, silver, 0);
    const foot = part(own(new THREE.CylinderGeometry(.5, .5, 1, 32)), lavender, 0);
    const indicatorMaterial = own(new THREE.MeshBasicMaterial({ color: 0x8bbaa7, transparent: true, toneMapped: false }));
    monitorMaterials.push(indicatorMaterial);
    const indicator = part(own(new THREE.SphereGeometry(1, 8, 6)), indicatorMaterial);

    const cableGroup = new THREE.Group(); scene.add(cableGroup);
    const cableSegments = 128, radialSegments = 8;
    const domains = heroUi.skillDomains;
    const packets: { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; cable: number; phase: number; slot:number }[] = [];
    const packetPlane = own(new THREE.PlaneGeometry(1, 1));
    const bitMaterials=['0','1'].map(bit=>{
      const tile=document.createElement('canvas');tile.width=64;tile.height=64;
      const ctx=tile.getContext('2d');if(!ctx)throw new Error('Binary pulse canvas unavailable');
      ctx.font='600 54px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#356b5d';ctx.fillText(bit,32,34);
      const map=own(new THREE.CanvasTexture(tile));map.colorSpace=THREE.SRGBColorSpace;
      return own(new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,toneMapped:false}));
    });
    const binaryPulses:{mesh:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;cable:number;phase:number}[]=[];
    const fieldMarks=new Set(['database','text','network','pipeline']);
    const names=[...new Set(domains.flatMap(domain=>domain.skills.map(skill=>skill.icon)))].filter(name=>!fieldMarks.has(name));
    const icons=new Map(await Promise.all(names.map(async name=>{
      const image=new Image();own({dispose:()=>image.removeAttribute('src')});
      try{image.src=`/assets/skills/${name}${name==='vision'||name==='opencv'?'-reference.png':'.svg'}`;await image.decode();return [name,image] as const;}
      catch{return [name,null] as const;} // Optional artwork failure retains a field symbol and the real skill name.
    })));
    if(disposed||!host.isConnected)throw new Error('Spatial host unavailable during skill preparation');
    function packetTexture(skill:typeof domains[number]['skills'][number]) {
      const {icon:mark,color}=skill,locale=document.documentElement.lang;
      const label=(skill.label as Record<string,string>)[locale]??skill.label.en;
      const tile = document.createElement('canvas'); tile.width = 384; tile.height = 512;tile.dataset.skill=label;
      const ctx = tile.getContext('2d'); if (!ctx) throw new Error('Skill packet canvas unavailable');
      ctx.scale(2,2);ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=7;ctx.lineCap='round';
      const icon=icons.get(mark);
      // Shrink artwork to 60%, not the readable labels or independent contact targets.
      if(icon){const scale=152*.6/Math.max(icon.naturalWidth,icon.naturalHeight),w=icon.naturalWidth*scale,h=icon.naturalHeight*scale;ctx.drawImage(icon,96-w/2,88-h/2,w,h);}
      else{
        ctx.save();ctx.translate(9.6,30.4);ctx.scale(.9,.9);ctx.beginPath();
        if(mark==='vision'){ctx.rect(57,28,78,72);ctx.moveTo(73,64);ctx.lineTo(96,45);ctx.lineTo(119,64);ctx.lineTo(96,83);ctx.closePath();}
        else if(mark==='text'){ctx.roundRect(54,24,84,66,12);ctx.moveTo(76,90);ctx.lineTo(67,109);ctx.lineTo(101,90);ctx.moveTo(73,47);ctx.lineTo(119,47);ctx.moveTo(73,67);ctx.lineTo(109,67);}
        else if(mark==='database'){ctx.ellipse(96,35,38,12,0,0,Math.PI*2);ctx.moveTo(58,35);ctx.lineTo(58,90);ctx.ellipse(96,90,38,12,0,0,Math.PI);ctx.lineTo(134,35);}
        else if(mark==='pipeline'){ctx.roundRect(51,38,32,54,5);ctx.moveTo(83,65);ctx.lineTo(110,65);ctx.roundRect(110,38,32,54,5);ctx.moveTo(95,57);ctx.lineTo(105,65);ctx.lineTo(95,73);}
        else{for(const [x,y] of [[63,32],[129,32],[96,68],[63,104],[129,104]]){ctx.moveTo(x,y);ctx.lineTo(96,68);ctx.moveTo(x+9,y);ctx.arc(x,y,9,0,Math.PI*2);}}
        ctx.stroke();ctx.restore();
      }
      ctx.fillStyle='#263e48';ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=document.documentElement.dir==='rtl'?'rtl':'ltr';ctx.font=`600 40px ${getComputedStyle(host).fontFamily}`;
      const lines:string[]=[];let line='';
      for(const word of label.split(/\s+/)){const next=line?`${line} ${word}`:word;if(line&&ctx.measureText(next).width>184){lines.push(line);line=word;}else line=next;}
      lines.push(line);lines.forEach((line,i)=>ctx.fillText(line,96,190+i*40,184));
      const map = own(new THREE.CanvasTexture(tile)); map.colorSpace = THREE.SRGBColorSpace; return map;
    }
    const skillMaps=domains.map(domain=>domain.skills.map(packetTexture));
    const cables = domains.map((domain, index) => {
      const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
      const tail=new THREE.LineCurve3(new THREE.Vector3(),new THREE.Vector3()),path=new THREE.CurvePath<THREE.Vector3>();path.add(curve);
      const material = own(new THREE.MeshStandardMaterial({ color: domain.color, roughness: .48, metalness: .12, transparent: true }));
      const mesh = new THREE.Mesh(own(new THREE.TubeGeometry(curve, cableSegments, .0028, radialSegments, false)), material);
      mesh.renderOrder = 1; cableGroup.add(mesh);
      bitMaterials.forEach((material,bit)=>{const mesh=new THREE.Mesh(packetPlane,material);mesh.renderOrder=1;cableGroup.add(mesh);binaryPulses.push({mesh,cable:index,phase:index*.31+bit*.43});});
      const socket = new THREE.Mesh(box, lavender); socket.renderOrder = 3; cableGroup.add(socket);
      for (let i = 0; i < 3; i++) {
        const tileMaterial = own(new THREE.MeshBasicMaterial({ map: skillMaps[index][i],
          transparent: true, depthWrite: false, toneMapped: false }));
        const tile = new THREE.Mesh(packetPlane, tileMaterial); tile.renderOrder = 1;
        cableGroup.add(tile); packets.push({ mesh: tile, cable: index, phase: i / 3,slot:i });
      }
      return { curve, tail, path, mesh, material, socket };
    });

    const mint = new THREE.Color('#9EBFB4');
    const { positions, phases, segments } = createEmbeddingCloud();
    const geometry = own(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const pointMaterial = own(new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,toneMapped:false,
      uniforms: { time: { value: 0 }, strength: { value: 0 }, dpr: { value: 1 }, cyan: { value: mint } },
      vertexShader: `uniform float time; uniform float dpr; attribute float phase; varying float fade;
        void main(){vec3 p=position;
          p.xy+=vec2(sin(time*.12+phase),cos(time*.1+phase))*.002;
          vec4 view=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*view;
          gl_PointSize=(1.8+sin(phase)*.4)*dpr;
          fade=.55*(1.-smoothstep(.4,.5,abs(p.x)));}`,
      fragmentShader: `uniform vec3 cyan; uniform float strength; varying float fade;
        void main(){float r=length(gl_PointCoord-.5); if(r>.5) discard;
          float core=1.-smoothstep(.08,.5,r);
          gl_FragColor=vec4(cyan,core*fade*strength);
          #include <colorspace_fragment>
        }`,
    }));
    const points = new THREE.Points(geometry, pointMaterial);
    const lineGeometry=own(new THREE.BufferGeometry());
    lineGeometry.setAttribute('position',new THREE.BufferAttribute(segments,3));
    const lineMaterial=own(new THREE.LineBasicMaterial({color:mint,transparent:true,opacity:0,depthWrite:false}));
    const links=new THREE.LineSegments(lineGeometry,lineMaterial);
    const cloud=new THREE.Group();cloud.add(points,links);scene.add(cloud);
    let width = 1, height = 1, lastProgress = -1, lastIntro = -1;
    let layout = journeyLayout(width, height, 0);
    function registerLayout(progress: number) {
      lastIntro=clamp(params.intro??1);
      layout = journeyLayout(width, height, progress,journeyFrameHeight(width,innerHeight),lastIntro,innerHeight); lastProgress = progress;
      const p = layout.portrait, m = layout.monitor, crop = layout.crop;
      const uv = plane.getAttribute('uv');
      // TextureLoader flips Y; shared source rectangles have a top-left origin.
      for (let i = 0; i < uv.count; i++) uv.setXY(i, crop.x + (i % 2) * crop.width,
        1 - crop.y - (i < 2 ? 0 : crop.height));
      uv.needsUpdate = true;
      portrait.position.set(p.x + p.width / 2 - width / 2, height / 2 - p.y - p.height / 2, 12);
      portrait.scale.set(p.width, p.height, 1);
      const aperture=layout.aperture;
      bottomClip.constant=layout.portraitBottom-height/2;
      leftClip.constant=width/2-aperture.x;rightClip.constant=aperture.x+aperture.width-width/2;
      monitor.position.set(m.x + m.width / 2 - width / 2, height / 2 - m.y - m.height / 2, 0);
      // The entire bevel stays behind the portrait; its top edge cannot cut through the head.
      bezel.scale.set(m.width, m.height, m.width); bezel.position.z = 9-m.width*.0275;
      back.scale.set(m.width * .99, m.height * .99, m.width * .026); back.position.z = -10-m.width*.026;
      screen.scale.set(m.width * .968, m.height * .954, 1); screen.position.z = 1;
      neck.scale.set(m.width * .055, m.height * .22, m.width * .03);
      neck.position.set(0, -m.height * .59, -12); neck.rotation.x = -.12;
      foot.scale.set(m.width * .32, m.width * .015, m.width * .16);
      foot.position.set(0, -m.height * .71, 0); foot.rotation.x = .12;
      indicator.scale.setScalar(Math.max(1, m.width * .0025)); indicator.position.set(m.width * .43, -m.height * .488, 27);
      cableGroup.position.copy(monitor.position); cableGroup.scale.setScalar(m.width);
      const badge=layout.aboutStacked?52:60;
      packets.forEach(({mesh})=>mesh.scale.set(badge/m.width,badge*4/3/m.width,1));
      binaryPulses.forEach(({mesh})=>mesh.scale.set(14/m.width,14/m.width,1));
      cloud.position.set(portrait.position.x,height/2-p.y-p.width*.3,4); cloud.scale.set(p.width*1.45,p.width*1.45,2);
      canvas.dataset.screen = String(layout.screen); canvas.dataset.cables = String(layout.cables);
    }
    function resize() {
      if (disposed) return;
      width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
      const mobile = width < 768,feedStacked=width<1200;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      pointMaterial.uniforms.dpr.value = dpr;
      geometry.setDrawRange(0, mobile ? 450 : 1200);
      lineGeometry.setDrawRange(0,mobile ? Math.floor(segments.length/6*.4)*2 : segments.length/3);
      registerLayout(clamp(params.progress));
      const m = journeyLayout(width,height,1,journeyFrameHeight(width,innerHeight)).monitor, halfHeight = m.height / m.width / 2;
      // Existing paths extend beyond this review into the next viewport; no next section is implemented.
      const reach = (height+Math.max(innerHeight*.8,500)-m.y-m.height)/m.width;
      for (let i = 0; i < cables.length; i++) {
        const { curve, tail, path, mesh, socket } = cables[i];
        if (i === 0) {
          curve.v0.set(-.51, .04, .018); curve.v1.set(-.53, .04, .045);
          curve.v2.set(mobile ? -.36 : -.53, -halfHeight - reach * .18, .08);
          curve.v3.set(mobile ? -.1 : -.53, -halfHeight - reach, .03);
          socket.scale.set(.032, .026, .035); socket.rotation.z = 0;
        } else {
          const x = i === 1 ? -.17 : .19, endX = i === 1 ? -.28 : .4;
          curve.v0.set(x, -halfHeight - .008, .015); curve.v1.set(x, -halfHeight - reach * .22, .065);
          curve.v2.set(endX, -halfHeight - reach * .55, .09); curve.v3.set(endX, -halfHeight - reach, .03);
          socket.scale.set(.026, .032, .035);
        }
        path.curves=[curve];
        if(feedStacked){
          // Visible ingress occupies the skill strip; complete tails skirt the larger CV copy.
          const port=i===0?-.34:i===1?-.17:.29,edge=(width*(i===0?.015:i===1?.03:.985)-(m.x+m.width/2))/m.width;
          // Phone outlets live under the bezel: a side outlet would push its entire skill feed off-screen.
          socket.scale.set(.026,.032,.035);
          curve.v0.set(port,-halfHeight-.008,.015);
          // Tangents follow the connector axis and join the vertical tail without a hard elbow.
          curve.v1.set(port,-halfHeight-.12,.03);
          curve.v2.set(edge,-halfHeight-.25,.03);curve.v3.set(edge,-halfHeight-.38,.03);
          tail.v1.copy(curve.v3);tail.v2.set(edge,-halfHeight-reach,.03);tail.updateArcLengths();path.add(tail);
        }
        // TubeGeometry samples by arc length; invalidate the curve cache after changing its controls.
        curve.updateArcLengths();path.updateArcLengths();
        socket.position.copy(curve.v0);
        resources.delete(mesh.geometry); mesh.geometry.dispose();
        mesh.geometry = own(new THREE.TubeGeometry(path, cableSegments, .0028, radialSegments, false));
      }
    }
    let previousSeconds = 0;
    function render(seconds: number) {
      if (disposed) return;
      const presence = clamp(params.presence), aura = clamp(params.aura) * presence;
      const progress = clamp(params.progress); if (progress !== lastProgress || clamp(params.intro??1) !== lastIntro) registerLayout(progress);
      portraitMaterial.opacity = presence;
      portrait.visible = presence > 0;
      const screenPresence = presence * layout.screen, cablePresence = presence * layout.cables;
      monitor.visible = screenPresence > 0; cableGroup.visible = cablePresence > 0;
      for (let i = 0; i < monitorMaterials.length; i++) monitorMaterials[i].opacity = screenPresence;

      const cloudPresence = aura * (1 - layout.transition*.7);
      cloud.visible = cloudPresence > 0;
      const time=Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
      const dt=Math.max(0,Math.min(.05,time-previousSeconds));previousSeconds=time;
      if (!finePointer.matches) resetPointer();
      pointer.lerp(pointerTarget,1-Math.exp(-dt*5));
      cloud.rotation.set(pointer.y*.09+Math.sin(time*.08)*.025,pointer.x*.15+Math.sin(time*.06)*.035,Math.sin(time*.05)*.012);
      lineMaterial.opacity=cloudPresence*.09;
      pointMaterial.uniforms.strength.value = cloudPresence*.35;
      pointMaterial.uniforms.time.value = time;
      for (let i = 0; i < cables.length; i++) {
        const cable = cables[i]; cable.material.opacity = cablePresence;
        // The entire wire is already rendered. The camera exposes it; scrolling never extrudes it.
        cable.mesh.geometry.setDrawRange(0,Infinity);
        cable.socket.visible = cablePresence > .01;
      }
      for (let i = 0; i < packets.length; i++) {
        const packet = packets[i], entry = .09 * layout.cables;
        const cycle = time * (layout.aboutStacked ? .17 : .105);
        const u = (1 - ((cycle + (layout.aboutStacked ? 0 : packet.phase)) % 1)) * layout.cables - entry;
        const tile = packet.mesh, cable = cables[packet.cable],curve=layout.aboutStacked?cable.curve:cable.path;
        const maps=skillMaps[packet.cable],index=(Math.floor(cycle+(layout.aboutStacked?0:packet.phase))*3+packet.slot)%maps.length;
        tile.material.map=maps[index];
        tile.visible = cablePresence > .02 && (!layout.aboutStacked || Math.floor(cycle) % 3 === Math.round(packet.phase * 3));
        if (u >= 0) curve.getPointAt(u, tile.position);
        else {
          // Pass under the front bezel into the screen, then fade instead of stopping at the plug.
          tile.position.copy(cable.curve.v0);
          if (packet.cable === 0) tile.position.x -= u;
          else tile.position.y -= u;
        }
        tile.position.z += .027;
        if(layout.aboutStacked){
          const halfWidth=26,halfHeight=52*2/3;
          const x=width/2+monitor.position.x+tile.position.x*layout.monitor.width;
          const y=height/2-monitor.position.y-tile.position.y*layout.monitor.width;
          const overlapsDock=x-halfWidth<layout.dock.x+56&&x+halfWidth>layout.dock.x&&y-halfHeight<layout.dock.y+220&&y+halfHeight>layout.dock.y;
          const m=layout.monitor,overlapsStand=x+halfWidth>m.x+m.width*.34&&x-halfWidth<m.x+m.width*.66&&y+halfHeight>m.y+m.height&&y-halfHeight<m.y+m.height*1.23;
          tile.visible=tile.visible&&!overlapsDock&&!overlapsStand&&x>=halfWidth&&x<=width-halfWidth&&y+halfHeight<layout.aboutY-24;
        }
        tile.rotation.set(0, Math.sin(time * .3 + packet.phase) * .09, Math.sin(time * .2 + packet.phase) * .05);
        tile.material.opacity = cablePresence * clamp((u + entry) / .025) * clamp((layout.cables - u) / .075);
      }
      bitMaterials.forEach(material=>material.opacity=cablePresence);
      for(let i=0;i<binaryPulses.length;i++){
        const {mesh:binary,cable,phase}=binaryPulses[i],u=(1-((time*.22+phase)%1))*layout.cables;
        binary.visible=cablePresence>.02&&u>.05&&u<layout.cables-.04;
        cables[cable].path.getPointAt(u,binary.position);binary.position.z+=.033;
      }
      renderer.render(scene, camera);
    }
    resize();
    // Prepare programs asynchronously while the DOM portrait and intro remain usable.
    await renderer.compileAsync(scene,camera);
    if (disposed || !host.isConnected) throw new Error('Spatial scene disposed during shader preparation');
    return { render, resize, dispose, info: () => ({
      drawCalls: disposed ? 0 : renderer.info.render.calls,
      points: disposed ? 0 : renderer.info.render.points,
    }) };
  } catch (error) {
    dispose();
    throw error;
  }
}
