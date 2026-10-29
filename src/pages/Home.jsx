import { useEffect, useRef, useState } from 'react';
import { HOME } from '../i18n';
import { Arrow } from '../components/Icons.jsx';
import Words from '../components/Words.jsx';
import './Home.css';

const TECH = ['LangChain', 'LangGraph', 'CrewAI', 'Rasa', 'Botpress', 'Dialogflow', 'OpenAI', 'Claude', 'n8n', 'Power BI', 'Python', 'SQL', 'React', 'Next.js', 'Node.js', 'PostgreSQL'];

// Fait défiler jusqu'à la scène i du récit 3D.
function goScene(i) {
  const s = document.getElementById('af-story'); if (!s || !s.firstElementChild) return;
  const H = s.firstElementChild.offsetHeight, hh = (document.querySelector('header') || {}).offsetHeight || 0;
  window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - hh + i * H, behavior: 'smooth' });
}

function Tag({ children }) {
  return <div className="scene-tag"><span />{children}</div>;
}

export default function Home({ t, lang, theme }) {
  const [scene, setScene] = useState(0);
  const st = useRef();
  st.current = { page: 'home', rtl: lang === 'ar', light: theme === 'light' };

  // Le moteur 3D lit ces ids : af-gl, af-story, af-rail, af-hint et [data-copy].
  // Chargé à la demande : three.js pèse ~600 ko.
  useEffect(() => {
    let gl, dead = false;
    import('../lib/atlas-3d.js').then(m => { if (!dead) gl = m.start({ getState: () => st.current, onScene: setScene }); });
    return () => { dead = true; if (gl) gl.stop(); };
  }, []);

  const rail = [HOME[lang], t.groups[0], t.groups[1], t.groups[2], t.nav[3]];

  return (
    <>
      <canvas id="af-gl" aria-hidden="true" />
      <nav id="af-rail" aria-label={t.railLabel}>
        {rail.map((label, i) => (
          <button key={i} onClick={() => goScene(i)} aria-label={label} aria-current={scene === i}><span className={scene === i ? 'on' : ''} /></button>
        ))}
      </nav>
      <div id="af-hint" aria-hidden="true">{t.hint}<span /></div>

      <div id="af-story">
        <section className="scene">
          <div data-copy className="scene-copy wide">
            <p className="eyebrow hero-eyebrow">{t.eyebrow}</p>
            <h1 className="head scene-h1" aria-label={t.h1}><Words text={t.h1} /></h1>
            <p className="scene-p hero-p">{t.sub}</p>
            <div className="hero-btns">
              <a href="#contact" className="btn">{t.btn1}</a>
              <a href="#services" className="btn-ghost hero-ghost">{t.btn2}</a>
            </div>
          </div>
        </section>
        {t.sc.map(([tag, title, text], i) => (
          <section key={i} className={'scene ' + (i % 2 === 0 ? 'end' : 'start')}>
            <div data-copy className="scene-copy">
              <Tag>{tag}</Tag>
              <h2 className="head scene-h2" aria-label={title}><Words text={title} /></h2>
              <p className="scene-p">{text}</p>
              <a href="#services" className="btn-ghost">{t.btn2}<Arrow /></a>
            </div>
          </section>
        ))}
        <section className="scene">
          <div data-copy className="scene-copy">
            <Tag>{t.nav[3]}</Tag>
            <h2 className="head scene-h2" aria-label={t.svcCtaTitle}><Words text={t.svcCtaTitle} /></h2>
            <p className="scene-p">{t.contactSub}</p>
            <a href="#contact" className="btn">{t.cta}</a>
          </div>
        </section>
      </div>

      <div className="home-after">
        <div className="marquee" aria-hidden="true">
          <div className="mq">
            {[...TECH, ...TECH].map((x, i) => <span key={i}>{x}<span className="sep">/</span></span>)}
          </div>
        </div>
        <section id="reel" className="wrap reel">
          <h2 className="head">{t.reelTitle}</h2>
          <p>{t.reelSub}</p>
          <div className="rv reel-frame">
            <iframe src="/promo/index.html" title={t.reelTitle} loading="lazy" />
          </div>
        </section>
      </div>
    </>
  );
}
