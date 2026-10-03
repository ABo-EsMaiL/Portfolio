"use client";
import { useEffect, useRef } from 'react';
import { mountHero } from '../lib/hero';
import type { Rect } from '../lib/content';
export default function Journey({ face, readyLabel, children }: { face:Rect; readyLabel:string; children:React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.dispatchEvent(new Event('portfolio:hydrated'));
    if (!ref.current) return;
    return mountHero(ref.current,face,readyLabel,async (host,image,params) => {
      const { createSpatialScene } = await import('../lib/scene');
      return createSpatialScene(host,image,params);
    });
  },[face,readyLabel]);
  return <div ref={ref} className="hero-world" data-phase="loading">{children}<span className="sr-only" data-live-status aria-live="polite" /></div>;
}
