import { useGsapMatchMedia } from './gsap/use-gsap';
import { gsap, ScrollTrigger } from './gsap/gsap-config';
import { usePerson } from './lib/person';

// Couche d'effets propre à chaque personnalité (overlays fixes + animations au scroll sur les titres).
// Tout est détruit au démontage avec le matchMedia ; rien ne tourne si prefers-reduced-motion.
export function PersonaFx() {
  const { personality: ps } = usePerson();

  const root = useGsapMatchMedia((fx, { reduced, desktop }) => {
    const pf = fx.closest('.pf');
    const bar = fx.querySelector('[data-progress]');
    if (!pf || reduced) return;
    const offs = [];

    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pf, start: 'top top', end: 'bottom bottom', scrub: true } });

    const heads = Array.from(pf.querySelectorAll('section:not(#pf-hero) h2'));
    if (ps.key === 'editorial') {
      // Volets lents : chaque titre se découvre de bas en haut, les visuels se resserrent au scroll.
      heads.forEach(h => gsap.fromTo(h, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
      pf.querySelectorAll('[data-plate] img').forEach(img => gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom bottom', scrub: true } }));
      const spot = fx.querySelector('[data-spot]');
      if (desktop && spot && matchMedia('(pointer: fine)').matches) {
        const x = gsap.quickTo(spot, '--x', { duration: 0.9, ease: 'power3.out' }), y = gsap.quickTo(spot, '--y', { duration: 0.9, ease: 'power3.out' });
        const move = e => { x(e.clientX); y(e.clientY); gsap.to(spot, { opacity: 1, duration: 0.6, overwrite: 'auto' }); };
        addEventListener('pointermove', move, { passive: true });
        offs.push(() => removeEventListener('pointermove', move));
      }
    }
    if (ps.key === 'data') {
      // Glitch bref à l'entrée de chaque titre.
      heads.forEach(h => ScrollTrigger.create({ trigger: h, start: 'top 85%', onEnter: () => { h.classList.remove('pf-glitch'); void h.offsetWidth; h.classList.add('pf-glitch'); } }));
      offs.push(() => heads.forEach(h => h.classList.remove('pf-glitch')));
    }
    if (ps.key === 'product') {
      // Titres qui rebondissent, boutons magnétiques (souris uniquement).
      heads.forEach(h => gsap.from(h, { scale: 0.86, rotate: -2.5, duration: 1.3, ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }));
      if (desktop && matchMedia('(pointer: fine)').matches) {
        pf.querySelectorAll('button, [data-magnetic]').forEach(b => {
          const x = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' }), y = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
          const move = e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.35); y((e.clientY - r.top - r.height / 2) * 0.35); };
          const leave = () => { x(0); y(0); };
          b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
          offs.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); gsap.set(b, { x: 0, y: 0 }); });
        });
      }
    }
    return () => offs.forEach(f => f());
  }, [ps.key]);

  return (
    <div ref={root} aria-hidden="true" className="pf-fx">
      <span data-progress className="pf-progress" />
      {ps.key === 'editorial' && <><span className="pf-grain" /><span data-spot className="pf-spot" /></>}
      {ps.key === 'data' && <span className="pf-scan" />}
    </div>
  );
}
