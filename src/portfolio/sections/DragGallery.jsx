import { useRef } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';

const slug = t => t.replace(/\[.*?\]/g, '').trim().toLowerCase().normalize('NFD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// Personnalité « produit » : projets dans des fenêtres de navigateur, rangée à faire glisser
// (défilement natif au doigt / trackpad, glisser-déposer à la souris), entrée en ressort.
export function DragGallery() {
  const { projects } = usePerson();
  const track = useRef(null);
  const root = useGsapMatchMedia((scope, { reduced }) => {
    if (reduced) return;
    gsap.from(scope.querySelectorAll('[data-win]'), { y: 120, rotate: i => (i % 2 ? 6 : -6), opacity: 0, duration: 1.4, stagger: 0.1, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: scope, start: 'top 70%', once: true } });
  }, []);

  const drag = useRef(null);
  const down = e => { if (e.pointerType !== 'mouse') return; drag.current = { x: e.clientX, s: track.current.scrollLeft }; track.current.classList.add('is-drag'); };
  const move = e => { if (drag.current) track.current.scrollLeft = drag.current.s - (e.clientX - drag.current.x); };
  const up = () => { drag.current = null; track.current?.classList.remove('is-drag'); };

  return (
    <section ref={root} aria-label="Galerie de projets" className="relative w-full overflow-hidden bg-[var(--paper-deep)] py-[8vw] max-md:py-[16vw]">
      <div className="mb-[3vw] flex items-end justify-between gap-6 px-[4vw] max-[1025px]:px-[5vw] max-md:mb-[8vw]">
        <h2 className="text-[4.5vw] leading-[1.05] max-[1025px]:text-[7vw] max-md:text-[9vw]">Faites glisser,<br />explorez.</h2>
        <span className="pf-chip shrink-0">← glisser →</span>
      </div>
      <div ref={track} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} tabIndex={0} aria-label="Projets, défilement horizontal"
        className="pf-drag no-scrollbar flex gap-[2.5vw] overflow-x-auto px-[4vw] pb-[2vw] max-[1025px]:gap-[5vw] max-[1025px]:px-[5vw]">
        {projects.map(p => (
          <figure key={p.id} data-win className="pf-win">
            <div className="pf-win-bar" aria-hidden="true"><i /><i /><i /><span>{slug(p.title)}.atlasflow.ma</span></div>
            <img src={p.image} alt={`${p.title} — ${p.tags.join(', ')}`} draggable="false" className="aspect-[16/10] w-full object-cover" />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
              <span>{p.title}</span>
              <span className="flex gap-2">{p.tags.map(t => <span key={t} className="pf-chip pf-chip-sm">{t}</span>)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
