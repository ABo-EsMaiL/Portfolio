"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
export default function Navigation({ label, stage }: { label:string; stage:string }) {
  const [expanded,setExpanded] = useState(true);
  const [active,setActive] = useState(stage);
  const ref = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const ignoreFocus = useRef(false);
  useEffect(()=>{
    const node=ref.current!,panel=node.querySelector<HTMLElement>('.capsule-panel')!,title=node.querySelector<HTMLElement>('.capsule-title')!;
    const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:.52;
    const width=(expanded?panel.scrollWidth:title.scrollWidth)+72;
    const size=gsap.to(node,{width,duration,ease:'power3.out',overwrite:true});
    const content=gsap.to(panel,{autoAlpha:expanded?1:0,x:expanded?0:-12,duration:duration*.7,overwrite:true});
    const indicator=gsap.to(title,{autoAlpha:expanded?0:1,x:expanded?8:0,duration:duration*.7,overwrite:true});
    return()=>{size.kill();content.kill();indicator.kill();};
  },[expanded]);
  useEffect(() => {
    const node = ref.current!; node.dataset.interactive = 'true';
    const fine=matchMedia('(hover:hover) and (pointer:fine)');
    function scroll() { if (!ref.current?.contains(document.activeElement) && !(fine.matches && ref.current?.matches(':hover'))) setExpanded(scrollY < 4); }
    function selected(event:Event) { const value=(event as CustomEvent<string>).detail;if(value==='Hero'||value==='About')setActive(value); }

    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('journey:stage',selected);
    return () => { window.removeEventListener('scroll',scroll);window.removeEventListener('journey:stage',selected);delete node.dataset.interactive; };
  },[]);
  return <nav ref={ref} className="capsule" aria-label="Portfolio stages" data-expanded={expanded}
    onPointerEnter={() => { if (!ref.current?.contains(document.activeElement) && matchMedia('(hover:hover) and (pointer:fine)').matches) setExpanded(true); }}
    onPointerLeave={() => { if (!ref.current?.contains(document.activeElement)) setExpanded(scrollY < 4); }}
    onFocusCapture={event => { if (ignoreFocus.current) { ignoreFocus.current=false; return; } if (event.target.matches(':focus-visible')) setExpanded(true); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setExpanded(false); if (document.activeElement !== toggle.current) { ignoreFocus.current=true; toggle.current?.focus({preventScroll:true}); } } }}>
    <div className="capsule-row"><span className="capsule-title">{active}</span>
      <div id="stage-navigation" className="capsule-panel" inert={!expanded} aria-hidden={!expanded}>
        <a className="capsule-wordmark" href="#hero-title" data-stage-link aria-label={label}><svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 26L15 5L25 26M9 19H22M15 5H23L28 10M22 19H28M25 26H30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><g fill="currentColor"><circle cx="28" cy="10" r="2"/><circle cx="28" cy="19" r="2"/><circle cx="30" cy="26" r="2"/></g></svg><span className="sr-only">{label}</span></a>
        <a href="#hero-title" data-stage-link aria-current={active==='Hero'?'location':undefined}>Hero</a>
        <a href="#about" data-stage-link aria-current={active==='About'?'location':undefined}>About</a>
      </div>
      <button ref={toggle} className="capsule-toggle" aria-label="Toggle navigation" aria-expanded={expanded} aria-controls="stage-navigation"
        onClick={() => setExpanded(value => !value)}><svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d={expanded ? 'M6 8L10 12L14 8' : 'M6 12L10 8L14 12'} fill="none" stroke="currentColor" strokeWidth="1.25" /></svg></button></div>

  </nav>;
}
