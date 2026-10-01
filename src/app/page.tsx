import { resolveContent } from '../lib/content';

export default function Home() {
  const { data, text } = resolveContent();
  return <main id="hero" className="hero-shell">
    <nav className="capsule" aria-label="Portfolio stages"><a href="#hero-title" aria-current="location">Identity <span aria-hidden="true">↗</span></a></nav>
    <section className="identity" aria-labelledby="hero-title">
      <p className="eyebrow">{text(data.profile.location)}</p>
      <h1 id="hero-title" tabIndex={-1}>{text(data.hero.heading)}</h1>
      <p className="role">{text(data.hero.subtitle)}</p>
      <p className="intro-copy">{text(data.about.bio)}</p>
      <p className="discovery-question">{text(data.hero.question)}</p>
      <a className="action" href="#hero-title">{text(data.hero.cta)} <span aria-hidden="true">↗</span></a>
      <p className="gesture-hint">{text(data.hero.hint)}</p>
      <ul className="socials" aria-label="Social links">{data.socials.map(link => <li key={link.id}><a href={link.url} rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}>{text(link.label)}</a></li>)}</ul>
    </section>
    <div className="portrait-unavailable" role="img" aria-label="Portrait is being prepared"><span>Portrait preparation in progress</span></div>
  </main>;
}
