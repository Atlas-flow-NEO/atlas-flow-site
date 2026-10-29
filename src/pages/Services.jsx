import { useEffect } from 'react';
import { Icon } from '../components/Icons.jsx';
import Art from '../components/Art.jsx';
import Words from '../components/Words.jsx';
import './Services.css';

const GROUP_ICONS = [
  'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01M8 14l-2 2 2 2M16 14l2 2-2 2',
];

// Visuels 3D des groupes (index dans SHAPES de lib/project-art.js) : agents, data, web.
const ART = [3, 4, 5];

export default function Services({ t }) {
  // --p : progression du groupe dans la fenêtre (0 → 1), lue par le CSS (chiffre qui se remplit, visuel qui tourne).
  useEffect(() => {
    const on = () => document.querySelectorAll('.svc-group').forEach(g => {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--p', Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height * .5))).toFixed(3));
    });
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div className="dark-band"><div className="wrap svc-intro">
        <div className="eyebrow">{t.nav[0]}</div>
        <h1 className="head kin" aria-label={t.servicesTitle}><Words text={t.servicesTitle} /></h1>
        <p>{t.servicesSub}</p>
      </div></div>

      {[0, 1, 2].map(g => (
        <section key={g} className={'svc-group' + (g === 1 ? ' alt' : '')}>
          <div className="wrap svc-grid">
            <div className="svc-side">
              <div className="head svc-num">{'0' + (g + 1)}</div>
              <div className="svc-title">
                <span><Icon d={GROUP_ICONS[g]} size={28} style={{ color: 'var(--acc,#C8FF3A)' }} /></span>
                <h2 className="head">{t.groups[g]}</h2>
              </div>
              <p>{t.gdesc[g]}</p>
              <Art kind={ART[g]} label={t.groups[g]} className="pj-img svc-art art-host" />
            </div>
            <div className="svc-cards">
              {t.cards.slice(g * 2, g * 2 + 2).map(([title, text, tags], k) => (
                <article key={title} className="svc-card" style={{ '--d': k }}>
                  <h3 className="head">{title}</h3>
                  <p>{text}</p>
                  <ul>{tags.map((tag, j) => <li key={tag} style={{ '--j': j }}>{tag}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="dark-band"><div className="wrap svc-cta">
        <h2 className="head">{t.svcCtaTitle}</h2>
        <a href="#contact" className="btn btn-lg">{t.cta}</a>
      </div></div>
    </>
  );
}
