import { useState } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { buildCopyReveals } from '../gsap/copy-reveal';
import { usePerson } from '../lib/person';

// FAQ — accordéon simple (une question ouverte à la fois, refermable), écrit à la main à la place de Radix.
export function Faq() {
  const { faqs, faqHeading } = usePerson();
  const [open, setOpen] = useState(0);

  const root = useGsapMatchMedia((scope, { reduced: rm }) => {
    const cleanup = buildCopyReveals(scope, rm);
    const rows = Array.from(scope.querySelectorAll('[data-faq-row]'));
    if (rm) gsap.set(rows, { opacity: 1, y: 0 });
    else rows.forEach(row => gsap.fromTo(row, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' } }));
    return cleanup;
  }, []);

  return (
    <section id="pf-faq" ref={root} aria-labelledby="pf-faq-heading" className="relative w-full bg-[var(--paper-deep)] px-[10vw] py-[6vw] text-white max-[1025px]:px-[5vw]">
      <div data-copy-wrapper="true" data-copy="chars" className="opacity-0">
        <h2 id="pf-faq-heading" className="text-center mb-[6vw] text-[5.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw]" style={{ lineHeight: 1.5 }}>{faqHeading}</h2>
      </div>
      <div className="mx-auto w-full">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div data-faq-row key={f.q} className="opacity-0 border-b border-white/10 py-8 max-md:py-5">
              <h3>
                <button
                  type="button"
                  id={`pf-faq-q${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`pf-faq-a${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full items-center justify-between gap-6 text-left text-[1.5vw] text-[var(--fg)] max-[1025px]:text-[2.6vw] max-md:text-[4.2vw] max-md:gap-4"
                >
                  {f.q}
                  <span aria-hidden="true" className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 max-[1025px]:size-11 max-md:size-9">
                    <span className={`absolute inset-0 origin-center rounded-full bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)] transition-transform duration-300 ease-in-out group-hover:scale-100 ${isOpen ? 'scale-100' : 'scale-0'}`} />
                    <span className={`absolute z-2 h-[2px] w-4 rounded-full max-md:w-3 ${isOpen ? 'bg-[var(--on-accent)]' : 'bg-white group-hover:bg-[var(--on-accent)]'}`} />
                    <span className={`absolute z-2 h-[2px] w-4 rounded-full transition-transform duration-300 ease-out max-md:w-3 ${isOpen ? 'rotate-0 bg-[var(--on-accent)]' : 'rotate-90 bg-white group-hover:bg-[var(--on-accent)]'}`} />
                  </span>
                </button>
              </h3>
              <div id={`pf-faq-a${i}`} role="region" aria-labelledby={`pf-faq-q${i}`} className="acc-panel" data-open={isOpen}>
                <div>
                  <div className="w-[80%] pt-4 pr-[3vw] max-[1025px]:w-full max-[1025px]:pr-0">
                    <p className="text-[1.25vw] leading-[1.6] text-white/80 max-[1025px]:text-[2.2vw] max-md:text-[3.8vw]">{f.a}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
