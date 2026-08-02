import { useEffect, useState } from 'react';
import { content } from './data/content.js';
import { setupMotion, teardownMotion } from './motion.js';
import StartProject from './views/StartProject.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';

/* Dependency-free hash router: '#/start' and '#/admin' are views;
   every other hash (e.g. '#platform') is an in-page anchor on the landing. */
function useHashRoute() {
  const parse = () =>
    location.hash.startsWith('#/') ? location.hash.slice(2).split('?')[0] : 'home';
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (route !== 'home') window.scrollTo(0, 0);
  }, [route]);
  return route;
}

function useLanguage() {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const t = content[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.dataset.lang = lang;
  }, [lang]);
  return [lang, setLang];
}

function Header({ t, lang, setLang, solid }) {
  return (
    <header className={`site-header${solid ? ' site-header--solid' : ''}`}>
      <div className="site-header__inner">
        <a href="#home" className="brand" aria-label="NumidAI home">
          <img src="img/wordmark.png" alt="NumidAI" className="brand__mark" />
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#home">{t.nav.home}</a>
          <a href="#platform">{t.nav.platform}</a>
          <a href="#climate-analysis">{t.nav.solutions}</a>
          <a href="#dashboard">{t.nav.pricing}</a>
          <a href="#smart-city">{t.nav.resources}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#footer">{t.nav.contact}</a>
        </nav>
        <div className="header-actions">
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <a href="#cta" className="btn btn--ghost">
            {t.nav.login}
          </a>
          <a href="#cta" className="btn btn--primary">
            {t.nav.demo}
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ t }) {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <p className="eyebrow" data-reveal>
          {t.hero.eyebrow}
        </p>
        <h1 className="hero__title" data-reveal data-reveal-delay="0.05">
          <span>{t.hero.titleA}</span>
          <br />
          <span className="hero__title--soft">{t.hero.titleB}</span>
        </h1>
        <p className="hero__lede" data-reveal data-reveal-delay="0.15">
          {t.hero.subtitle}
        </p>
        <div className="hero__ctas" data-reveal data-reveal-delay="0.25">
          <a href="#/start" className="btn btn--primary">
            {t.hero.ctaPrimary} <span aria-hidden>→</span>
          </a>
          <a href="#cta" className="btn btn--outline">
            {t.hero.ctaSecondary}
          </a>
          <a href="#platform" className="btn btn--link">
            <span className="play-dot" aria-hidden />
            {t.hero.ctaTertiary}
          </a>
        </div>
        <div className="hero__scrollhint" aria-hidden>
          <span>{t.hero.scrollHint}</span>
          <span className="hero__scrollhint-line" />
        </div>
      </div>
    </section>
  );
}

function About({ t }) {
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const v = document.getElementById('aboutVideo');
    if (!v) return;
    setPlaying(true);
    v.muted = false;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  return (
    <section id="about" className="about">
      <div className="about__grid">
        <figure className="about__media" data-reveal>
          <div className={`about__frame${playing ? ' is-playing' : ''}`}>
            <video
              id="aboutVideo"
              src="about-video.mp4"
              poster="img/about-poster.jpg"
              preload="metadata"
              playsInline
              controls={playing}
              controlsList="nodownload"
              onEnded={() => setPlaying(false)}
              aria-label={t.about.playLabel}
            />
            {!playing && (
              <button className="about__play" onClick={play} aria-label={t.about.playLabel}>
                <span className="about__play-btn" aria-hidden>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </figure>
        <div className="about__copy">
          <p className="eyebrow" data-reveal>
            {t.about.eyebrow}
          </p>
          <h2 className="section__title" data-reveal data-reveal-delay="0.05">
            {t.about.title}
          </h2>
          <p className="section__lede" data-reveal data-reveal-delay="0.15">
            {t.about.lede}
          </p>
          <div className="about__ctas" data-reveal data-reveal-delay="0.25">
            <button className="btn btn--primary" onClick={play}>
              {t.about.watch} <span aria-hidden>▶</span>
            </button>
            <a href="#cta" className="btn btn--outline-dark">
              {t.about.demo}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ t }) {
  return (
    <section className="trust" aria-label="Trust">
      <p data-reveal>{t.trust.label}</p>
      <div className="trust__marks" data-reveal data-reveal-delay="0.1" aria-hidden>
        {['ARCH', 'DEV', 'BUILD', 'GOV', 'EDU'].map((k) => (
          <span key={k} className="trust__mark">
            {k}
          </span>
        ))}
      </div>
    </section>
  );
}

function Platform({ t }) {
  return (
    <section id="platform" className="section">
      <div className="section__head">
        <p className="eyebrow" data-reveal>
          {t.platform.eyebrow}
        </p>
        <h2 className="section__title" data-reveal data-reveal-delay="0.05">
          {t.platform.title}
        </h2>
        <p className="section__lede" data-reveal data-reveal-delay="0.15">
          {t.platform.lede}
        </p>
      </div>
      <div className="platform__grid">
        <figure className="platform__figure" data-reveal>
          <div className="platform__frame">
            <img src="img/platform-preview.png" alt="NumidAI platform analyzing a building" />
          </div>
        </figure>
        <ul className="pillars" data-reveal data-reveal-delay="0.1">
          {t.platform.pillars.map((p) => (
            <li key={p.k} className="pillar">
              <span className="pillar__dot" />
              <div>
                <h3 className="pillar__k">{p.k}</h3>
                <p className="pillar__v">{p.v}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClimateAnalysis({ t }) {
  return (
    <section id="climate-analysis" className="section">
      <div className="split">
        <div className="split__copy">
          <p className="eyebrow" data-reveal>
            {t.climate.eyebrow}
          </p>
          <h2 className="section__title" data-reveal data-reveal-delay="0.05">
            {t.climate.title}
          </h2>
          <p className="section__lede" data-reveal data-reveal-delay="0.15">
            {t.climate.lede}
          </p>
          <ul className="check-list" data-reveal data-reveal-delay="0.2">
            {t.climate.capabilities.map((c) => (
              <li key={c}>
                <span className="check" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <figure className="split__figure" data-reveal data-reveal-delay="0.1">
          <div className="panel-frame">
            <img src="img/climate-analysis.png" alt="Site climate simulation view" />
          </div>
        </figure>
      </div>
    </section>
  );
}

function EnergyOptimization({ t }) {
  return (
    <section id="energy-optimization" className="section">
      <div className="split split--reverse">
        <figure className="split__figure" data-reveal>
          <div className="panel-frame">
            <img src="img/energy-optimization.png" alt="Energy optimization dashboard" />
          </div>
        </figure>
        <div className="split__copy">
          <p className="eyebrow" data-reveal>
            {t.energy.eyebrow}
          </p>
          <h2 className="section__title" data-reveal data-reveal-delay="0.05">
            {t.energy.title}
          </h2>
          <p className="section__lede" data-reveal data-reveal-delay="0.15">
            {t.energy.lede}
          </p>
          <dl className="metrics" data-reveal data-reveal-delay="0.2">
            {t.energy.metrics.map((m) => (
              <div key={m.v} className="metric">
                <dt className="metric__k">{m.k}</dt>
                <dd className="metric__v">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function CarbonAnalysis({ t }) {
  return (
    <section id="carbon-analysis" className="section">
      <div className="split">
        <div className="split__copy">
          <p className="eyebrow" data-reveal>
            {t.carbon.eyebrow}
          </p>
          <h2 className="section__title" data-reveal data-reveal-delay="0.05">
            {t.carbon.title}
          </h2>
          <p className="section__lede" data-reveal data-reveal-delay="0.15">
            {t.carbon.lede}
          </p>
          <dl className="metrics" data-reveal data-reveal-delay="0.2">
            {t.carbon.metrics.map((m) => (
              <div key={m.v} className="metric">
                <dt className="metric__k">{m.k}</dt>
                <dd className="metric__v">{m.v}</dd>
              </div>
            ))}
          </dl>
          <p className="micro-note" data-reveal data-reveal-delay="0.3">
            {t.illustrative}
          </p>
        </div>
        <figure className="split__figure" data-reveal data-reveal-delay="0.1">
          <div className="panel-frame">
            <img src="img/carbon-analysis.png" alt="Carbon analysis panel" />
          </div>
        </figure>
      </div>
    </section>
  );
}

function SmartCity({ t }) {
  return (
    <section id="smart-city" className="section section--wide">
      <div className="section__head section__head--center">
        <p className="eyebrow" data-reveal>
          {t.city.eyebrow}
        </p>
        <h2 className="section__title" data-reveal data-reveal-delay="0.05">
          {t.city.title}
        </h2>
        <p className="section__lede" data-reveal data-reveal-delay="0.15">
          {t.city.lede}
        </p>
      </div>
      <figure className="city-figure" data-reveal data-reveal-delay="0.1">
        <div className="panel-frame panel-frame--wide">
          <img src="img/smart-city-overview.png" alt="MENA sustainable smart city district" />
        </div>
      </figure>
    </section>
  );
}

function Dashboard({ t }) {
  return (
    <section id="dashboard" className="section section--wide">
      <div className="section__head section__head--center">
        <p className="eyebrow" data-reveal>
          {t.dashboard.eyebrow}
        </p>
        <h2 className="section__title" data-reveal data-reveal-delay="0.05">
          {t.dashboard.title}
        </h2>
        <p className="section__lede" data-reveal data-reveal-delay="0.15">
          {t.dashboard.lede}
        </p>
      </div>
      <figure className="dashboard-figure" data-reveal data-reveal-delay="0.1">
        <div className="panel-frame panel-frame--wide">
          <img src="img/dashboard-overview.png" alt="NumidAI dashboard overview" />
        </div>
      </figure>
    </section>
  );
}

function CTA({ t }) {
  return (
    <section id="cta" className="cta">
      <div className="cta__inner">
        <p className="eyebrow" data-reveal>
          {t.cta.eyebrow}
        </p>
        <h2 className="cta__title" data-reveal data-reveal-delay="0.05">
          {t.cta.title}
        </h2>
        <p className="cta__sub" data-reveal data-reveal-delay="0.15">
          {t.cta.subtitle}
        </p>
        <div className="cta__buttons" data-reveal data-reveal-delay="0.25">
          <a href="#/start" className="btn btn--primary">
            {t.cta.primary} <span aria-hidden>→</span>
          </a>
          <a href="#" className="btn btn--outline">
            {t.cta.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer id="footer" className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="img/wordmark.png" alt="NumidAI" className="brand__mark" />
          <p>{t.footer.tagline}</p>
        </div>
        <div className="footer__cols">
          {[t.footer.col1, t.footer.col2, t.footer.col3].map((col) => (
            <div key={col.title} className="footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer__bottom">
        <span>{t.footer.copyright}</span>
      </div>
    </footer>
  );
}

function BackgroundLayer() {
  // Relative paths (no leading slash) so `vite build --base=./` works when the
  // dist folder is served from a subpath or opened outside the site root.
  return (
    <>
      <div
        className="bg-fallback"
        style={{ backgroundImage: 'url(img/hero-building.png)' }}
        aria-hidden
      />
      <video
        id="bgv"
        className="bg-video"
        src="bg.mp4"
        poster="img/hero-building.png"
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className="bg-tint" aria-hidden />
      <div className="bg-grid" aria-hidden />
    </>
  );
}

export default function App() {
  const [lang, setLang] = useLanguage();
  const route = useHashRoute();
  const t = content[lang];

  useEffect(() => {
    if (route !== 'home') return undefined; // scene + scrub only on the landing
    setupMotion();
    return () => teardownMotion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, route]);

  return (
    <>
      {route === 'home' && <BackgroundLayer />}
      <div className={`page${route !== 'home' ? ' page--app' : ''}`}>
        <Header t={t} lang={lang} setLang={setLang} solid={route !== 'home'} />
        {route === 'start' && (
          <main>
            <StartProject lang={lang} />
          </main>
        )}
        {route === 'admin' && (
          <main>
            <AdminDashboard />
          </main>
        )}
        {route === 'home' && (
          <main>
            <Hero t={t} />
            <About t={t} />
            <TrustStrip t={t} />
            <Platform t={t} />
            <ClimateAnalysis t={t} />
            <EnergyOptimization t={t} />
            <CarbonAnalysis t={t} />
            <SmartCity t={t} />
            <Dashboard t={t} />
            <CTA t={t} />
          </main>
        )}
        <Footer t={t} />
      </div>
    </>
  );
}
