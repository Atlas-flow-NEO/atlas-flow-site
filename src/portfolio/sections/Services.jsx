import { Fragment, useRef, useState } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { buildCopyReveals } from '../gsap/copy-reveal';
import { useReducedMotion } from '../lib/use-reduced-motion';
import { usePerson } from '../lib/person';

// SERVICES — 275vh : texte d'intro, puis une rangée de cartes sticky qui défile horizontalement au scroll.
// La carte survolée se remplit du dégradé de la personne (masque radial animé).
export function Services() {
  const { services, servicesHeading, servicesStatement } = usePerson();
  const fillRefs = useRef([]);
  const revealValues = useRef(services.map((_, t) => ({ value: t === 0 ? 100 : -40 })));
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const root = useGsapMatchMedia((scope, { reduced: rm }) => {
    const row = scope.querySelector('[data-services-row]');
    const cleanupCopy = buildCopyReveals(scope, rm);
    if (!row) return cleanupCopy;
    if (rm) { gsap.set(row, { clearProps: 'transform' }); return cleanupCopy; }
    const w = innerWidth;
    const from = w > 1025 ? 70 : 50;
    const to = w > 1025 ? -33 : w > 541 ? -65 : -77;
    gsap.fromTo(row, { xPercent: from }, { xPercent: to, ease: 'none', scrollTrigger: { trigger: scope, start: 'top 20%', end: 'bottom bottom', scrub: true } });
    return cleanupCopy;
  }, []);

  const tweenReveal = (i, value, duration) => gsap.to(revealValues.current[i], {
    value, duration, ease: 'power2.out',
    onUpdate: () => fillRefs.current[i]?.style.setProperty('--reveal', `${revealValues.current[i].value}%`),
  });
  const enterCard = index => () => {
    if (index === active) return;
    const duration = reduced ? 0 : 0.45;
    tweenReveal(active, -40, duration);
    tweenReveal(index, 100, duration);
    setActive(index);
  };

  return (
    <section id="pf-services" ref={root} aria-label="Services" className={`relative w-full bg-[var(--paper-deep)] text-white ${reduced ? '' : 'h-[275vh]'}`}>
      <div className="relative pt-[6vw] px-[4vw] w-[60%] max-[1025px]:w-[85%] max-md:w-full max-[1025px]:px-[5vw] max-[1025px]:pt-[15vw]">
        <div data-copy-wrapper="true" data-copy="chars" className="opacity-0">
          <h2 className="text-[5.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw]" style={{ lineHeight: 1.2 }}>
            {servicesHeading.split('\n').map((line, i) => <Fragment key={line}>{i > 0 && <br />}{line}</Fragment>)}
          </h2>
        </div>
        <div className="w-[75%] max-[1025px]:w-full mt-[1.5vw] max-[1025px]:mt-[5vw]">
          <div data-copy-wrapper="true" className="opacity-0">
            <p className="text-[1.25vw] max-[1025px]:text-[2.5vw] max-md:text-[4.5vw]" style={{ lineHeight: 1.5 }}>{servicesStatement}</p>
          </div>
        </div>
      </div>
      <div className={reduced ? 'w-full pb-[6vw]' : 'w-full h-screen sticky top-0 overflow-hidden flex flex-col max-md:mt-[-30vw]'}>
        <div className={reduced ? '' : 'relative flex-1 flex items-center'}>
          <div
            data-services-row
            className={reduced
              ? 'grid grid-cols-3 gap-[1.6vw] px-[4vw] pt-[5vw] max-[1025px]:grid-cols-2 max-md:grid-cols-1'
              : 'flex gap-[1.6vw] px-[4vw] will-change-transform max-[1025px]:gap-[2.5vw] max-md:gap-[6vw]'}
          >
            {services.map((s, i) => (
              <div
                key={s.title}
                onMouseEnter={enterCard(i)}
                onFocus={enterCard(i)}
                tabIndex={0}
                className={`relative rounded-lg flex flex-col justify-between bg-[#11141C] overflow-hidden border border-white/20 transition-colors duration-300 ${active === i ? 'text-[var(--on-accent)]' : 'text-white'} ${reduced
                  ? 'p-[1.6vw] min-h-[22vw] max-[1025px]:min-h-[32vw] max-[1025px]:p-[3vw] max-md:min-h-0 max-md:p-[5vw]'
                  : 'w-[27vw] h-[30vw] shrink-0 p-[1.6vw] max-[1025px]:w-[55vw] max-[1025px]:h-[65vw] max-[1025px]:p-[3vw] max-md:w-[75vw] max-md:h-[85vw] max-md:p-[5vw] group'}`}
              >
                <div
                  ref={el => { fillRefs.current[i] = el; el?.style.setProperty('--reveal', `${revealValues.current[i].value}%`); }}
                  className="absolute inset-0 bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)] radial-mask-bg-fill"
                />
                <div className="relative flex justify-end">
                  <div className={`w-[3vw] h-[3vw] rounded-full flex items-center justify-center border border-current/30 max-[1025px]:w-[7vw] max-[1025px]:h-[7vw] max-md:w-[9vw] max-md:h-[9vw] duration-300 ease-out overflow-hidden relative ${active === i ? 'bg-[var(--paper-deep)] text-white' : ''}`}>
                    <div className="group-hover:translate-x-[150%] group-hover:translate-y-[-150%] duration-300 ease-out"><ArrowIcon /></div>
                    <div className="absolute translate-x-[-150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0 duration-300 ease-out"><ArrowIcon /></div>
                  </div>
                </div>
                <div className="relative">
                  <h3 className="text-[2.5vw] mb-[1vw] max-[1025px]:text-[5vw] max-md:text-[6.5vw]" style={{ lineHeight: 1.5 }}>{s.title}</h3>
                  <ul className="space-y-[0.4vw] pl-[0.5vw] max-[1025px]:space-y-[1vw] max-md:space-y-[1.8vw]">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-[0.7vw] text-[1.25vw] max-[1025px]:text-[3vw] max-md:text-[4vw]" style={{ lineHeight: 1.5 }}>
                        <span aria-hidden="true" className="size-1.5 bg-current rounded-full shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7h10v10" /><path d="M7 17 17 7" />
    </svg>
  );
}
