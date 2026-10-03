import { resolveContent } from '../lib/content';
import { authoredFaceBox } from '../lib/journey';
import Journey from '../components/Journey';
import Navigation from '../components/Navigation';
import heroUi from '../../content/hero-ui.json';

export default function Home() {
  const { data, text } = resolveContent();
  if (!data.portrait.aboutCrop || !data.portrait.faceBox) throw new Error('Reviewed portrait anchors required');
  const face=authoredFaceBox(data.portrait.faceBox,data.portrait.aboutCrop);
  return <Journey face={face} readyLabel={text(data.hero.hint)}>
    <Navigation label={data.profile.displayName} stage="Hero" />
    <div className="resource-loader" aria-hidden="true"><div className="tensor-loader">{Array.from({length:9},(_,i)=><i key={i} />)}</div><span>Preparing the scene</span></div>
    <div className="journey-track">
      <main id="hero" className="hero-shell world-stage" tabIndex={-1}>
        <div className="world-light" aria-hidden="true" />
        <div className="spatial-layer" aria-hidden="true" />
        <header className="identity"><p className="identity-overline">AI &amp; software engineering</p><h1 id="hero-title" tabIndex={-1}>{heroUi.headingLines.map((copy,index,lines)=>{const words=text(copy).split(' ');return <span className="headline-line" key={index}><span>{words.slice(0,-1).join(' ')} </span><span>{words.at(-1)}{index<lines.length-1?' ':''}</span></span>;})}</h1></header>
        <section className="hero-copy" aria-label="Engineering focus"><p className="hero-name">{text(heroUi.heroName)}</p><p className="role">{text(data.hero.subtitle)}</p><ul className="focus-tags">{heroUi.focusTags.map(tag=><li key={tag.en}>{text(tag)}</li>)}</ul></section>
        <div className="hero-actions"><p className="pitch-title">{text(heroUi.pitchTitle)}</p><p className="engineering-note">{text(heroUi.pitchBody)}</p><a className="action" href="#about" data-discovery-cta>{text(data.hero.cta)}<span aria-hidden="true">↗</span></a></div>
        <figure className="portrait-stage"><div className="portrait-motion">
          {/* The full source-derived texture is cropped by the shared measured geometry, not replaced. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="portrait-image" src="/assets/portrait-scene-960.webp" width={960} height={1280} fetchPriority="high" decoding="async" alt={text(data.portrait.alt)} />
          {[0,1,2].map(index=><svg className={`detection-hud detection-hud-${index}`} key={index} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect className="hud-surface" x="0" y="0" width="100" height="100" rx="3" fill="currentColor" fillOpacity=".055" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><path d="M0 22V0H22M78 0H100V22M100 78V100H78M22 100H0V78" fill="none" stroke="currentColor" strokeWidth="5" vectorEffect="non-scaling-stroke" /><path className="hud-scan" d="M4 50H96" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>)}
          <p className="portrait-error">Portrait unavailable</p>
        </div></figure>
        <div className="monitor-fallback" aria-hidden="true"><span /></div>
        <p className="scan-status" aria-hidden="true">Finding the engineer</p>
        <div className="social-dock" aria-hidden="true" />
        <ul className="socials" aria-label="Social links">{data.socials.map(link=><li key={link.id}><a href={link.url} data-social={link.id} aria-label={text(link.label)} rel={link.kind==='email'?undefined:'noopener noreferrer'}>
          <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">{link.id==='linkedin'?<><path d="M5 9V20M10 20V9H14V11C16 7 21 9 21 14V20M5 4V5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>:link.id==='github'?<path d="M8 21V17C4 17 3 14 3 11C3 8 5 6 7 5L7 2L11 4H13L17 2V5C20 7 21 9 21 12C21 15 19 17 16 17V21M8 18C5 20 3 17 2 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />:link.id==='facebook'?<path d="M14 21V13H17L17.5 9H14V7C14 5.8 14.4 5 16 5H18V2H15C11.6 2 10 4 10 7V9H7V13H10V21Z" fill="currentColor" />:<><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M4 7L12 13L20 7" fill="none" stroke="currentColor" strokeWidth="1.5" /></>}</svg><span className="social-name">{text(link.label)}</span>
        </a></li>)}</ul>
        <section id="about" className="about-copy" tabIndex={-1} aria-labelledby="about-title">
          <figure className="about-portrait">
            {/* Same source in the static fallback; the enhanced journey moves its existing portrait instead. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/portrait-scene-960.webp" width={960} height={1280} loading="lazy" alt="" />
          </figure>
          <p className="about-eyebrow">The engineer behind the systems</p><h2 id="about-title">{data.profile.fullName}</h2><p className="about-role">{text(data.profile.role)}</p><p className="intro-copy">{text(data.about.bio)}</p><div className="about-stack"><span>Python</span><span>FastAPI</span><span>TensorFlow</span><span>Docker</span></div>
        </section>
        <p className="gesture-hint">Scroll to unfold the story <span aria-hidden="true">↓</span></p>
        <p className="scene-caption" aria-hidden="true">Skills feed the system</p>
        <ul className="sr-only" aria-label="CV skills feeding the system">{heroUi.skillDomains.flatMap(domain=>domain.skills).map(skill=><li key={skill.label.en}>{text(skill.label)}</li>)}</ul>
      </main>
    </div>
  </Journey>;
}