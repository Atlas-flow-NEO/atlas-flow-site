import { useEffect } from 'react';
import { Arrow, CheckList } from '../components/Icons.jsx';
import Art from '../components/Art.jsx';
import './Projects.css';

// Expertise associée à chaque projet (index dans t.groups).
const EXPERTISE = [2, 2, 0];

export default function Projects({ t }) {
  const n = t.projects.length;
  // Pile de cartes : chaque carte recule et s'assombrit quand la suivante la recouvre.
  useEffect(() => {
    const on = () => {
      const cards = [...document.querySelectorAll('.pj-card')];
      cards.forEach((c, i) => {
        const nx = cards[i + 1]; if (!nx) return;
        const k = Math.max(0, Math.min(1, 1 - (nx.getBoundingClientRect().top - c.getBoundingClientRect().top) / c.offsetHeight));
        c.style.setProperty('--k', k.toFixed(3));
      });
    };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <div className="pj">
      <div className="wrap pj-intro">
        <div>
          <div className="eyebrow pj-eyebrow">{t.nav[2]}</div>
          <h1 className="head">{t.projectsTitle}</h1>
        </div>
        <p>{t.pIntro}</p>
      </div>

      <div className="wrap pj-list">
        {t.projects.map(([tag, title, text], i) => (
          <article key={i} className={'pj-card' + (i % 2 ? ' flip-img' : '')} style={{ top: `calc(96px + ${i * 22}px)` }}>
            <Art kind={i} label={title} />
            <div className="pj-body">
              <div className="pj-meta">
                <span className="head pj-idx">{`0${i + 1} / 0${n}`}</span>
                <span className="pj-tag">{tag}</span>
              </div>
              <h2 className="head">{title}</h2>
              <p className="pj-text">{text}</p>
              <div><div className="label pj-lbl">{t.pFeatL}</div><CheckList items={t.pFeats[i]} /></div>
              <div className="pj-foot">
                <div><div className="label">{t.pExpL}</div><div className="pj-exp">{t.groups[EXPERTISE[i]]}</div></div>
                <a href="#contact" className="pj-link">{t.pSimilar}<Arrow /></a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="wrap pj-cta">
        <h2 className="head">{t.svcCtaTitle}</h2>
        <p>{t.contactSub}</p>
        <a href="#contact" className="btn btn-lg">{t.cta}</a>
      </div>
    </div>
  );
}
