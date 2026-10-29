import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PEOPLE, TEAM } from '../portfolio/people.js';
import { Arrow } from '../components/Icons.jsx';
import './Team.css';

// Page Équipe : une carte par personne vers #team/<id>. Aziz (lead) au centre et mis en avant ;
// chaque carte porte une mini-constellation vivante à la forme de sa personnalité.
export default function Team({ t }) {
  const grid = useRef(null);

  useEffect(() => {
    const el = grid.current, cards = Array.from(el.querySelectorAll('.tm-card'));
    const offs = [];
    let dead = false;
    import('../portfolio/lib/hero-constellation.js').then(m => {
      if (dead) return;
      cards.forEach(c => offs.push(m.mountConstellation(c.querySelector('canvas'), c.dataset.tone, c.dataset.shape, c.dataset.lead ? 2600 : 1600)));
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => { dead = true; offs.forEach(f => f()); };

    // Entrée : Aziz d'abord, puis les deux autres qui s'ouvrent de chaque côté.
    const lead = cards.find(c => c.dataset.lead), rest = cards.filter(c => c !== lead);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(lead, { y: 80, scale: 0.92, opacity: 0, duration: 1.3 })
      .from(rest, { x: i => (i ? 60 : -60), y: 40, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.25);

    // Survol : légère inclinaison 3D vers le pointeur (souris uniquement).
    if (matchMedia('(pointer: fine)').matches) cards.forEach(c => {
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3.out' }), ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const move = e => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 8); };
      const leave = () => { rx(0); ry(0); };
      c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave);
      offs.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); });
    });
    return () => { dead = true; tl.kill(); offs.forEach(f => f()); gsap.set(cards, { clearProps: 'all' }); };
  }, []);

  return (
    <section className="wrap tm">
      <div className="eyebrow">{t.nav[4]}</div>
      <h1 className="head tm-title">{t.teamTitle}</h1>
      <p className="tm-sub">{t.teamSub}</p>
      <div ref={grid} className="tm-grid">
        {TEAM.map((id, i) => {
          const p = PEOPLE[id], lead = id === 'aziz';
          return (
            <a key={id} href={'#team/' + id} className={'tm-card' + (lead ? ' tm-lead' : '')} data-tone={p.tone} data-shape={p.personality.shape} data-persona={p.personality.key} data-lead={lead || undefined}>
              <canvas className="tm-art" aria-hidden="true" />
              <span className="tm-num">{'0' + (i + 1)}{lead && <span className="tm-badge">Lead</span>}</span>
              <span className="tm-initial head" aria-hidden="true">{p.site.first[0]}</span>
              <span className="tm-name head">{p.site.first}</span>
              <span className="tm-role">{p.site.role}</span>
              <span className="tm-cta">{t.teamCta}<Arrow size={18} /></span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
