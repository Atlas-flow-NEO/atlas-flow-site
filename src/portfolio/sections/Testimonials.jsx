import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap, Flip } from '../gsap/gsap-config';
import { buildCopyReveals } from '../gsap/copy-reveal';
import { usePerson } from '../lib/person';

// TÉMOIGNAGES — une carte, des avatars en anneau réordonnés avec Flip, swipe sur mobile.
export function Testimonials() {
  const { testimonials, testimonialsHeading } = usePerson();
  const [index, setIndex] = useState(0);
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const bodyRef = useRef(null), ringRef = useRef(null), flipState = useRef(null), indexRef = useRef(0), pointerStart = useRef(null);
  indexRef.current = index;

  const root = useGsapMatchMedia((scope, { reduced: rm }) => {
    const cleanup = buildCopyReveals(scope, rm);
    const fades = Array.from(scope.querySelectorAll('.testimonial-fade'));
    if (rm) gsap.set(fades, { opacity: 1, y: 0 });
    else gsap.fromTo(fades, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: scope, start: 'top 70%', once: true } });
    return cleanup;
  }, []);

  const n = testimonials.length;
  const orderOf = i => { let h = (i - index + n) % n; if (h > Math.floor(n / 2)) h -= n; return h; };

  const select = useCallback(next => {
    const target = ((next % n) + n) % n;
    if (target === indexRef.current) return;
    const body = bodyRef.current;
    const commit = () => {
      if (!reduced && ringRef.current) flipState.current = Flip.getState(ringRef.current.querySelectorAll('button'));
      setIndex(target);
    };
    if (!body || reduced) return commit();
    gsap.killTweensOf(body);
    gsap.to(body, { opacity: 0, y: 0, duration: 0.25, ease: 'power1.out', overwrite: true, onComplete: commit });
  }, [reduced, n]);

  useLayoutEffect(() => {
    if (flipState.current) { Flip.from(flipState.current, { duration: 0.6, ease: 'power3.out', absolute: true, scale: true }); flipState.current = null; }
    if (bodyRef.current && !reduced) gsap.fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
  }, [index, reduced]);

  const onPointerUp = e => {
    if (pointerStart.current === null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) > 100) select(dx < 0 ? index + 1 : index - 1);
  };
  const t = testimonials[index];
  const navBtn = 'size-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[var(--on-accent)] transition-colors cursor-pointer relative group overflow-hidden max-md:size-10';
  const navFill = <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)] group-hover:scale-100 scale-0 ease-in-out origin-center rounded-full duration-300" />;

  return (
    <section ref={root} id="pf-testimonials" className="w-full bg-[var(--paper-deep)] py-[7vw] px-[4vw] text-white max-[1025px]:px-[5vw] max-[1025px]:py-[12vw]">
      <div className="w-full flex flex-col gap-[6vw] max-[1025px]:gap-[12vw]">
        <div className="w-[65%] mx-auto max-[1025px]:w-full">
          <div data-copy-wrapper="true" data-copy="chars" className="opacity-0">
            <h2 className="text-center text-[5.2vw] max-[1025px]:text-[7vw] max-md:text-[9vw]" style={{ lineHeight: 1.2 }}>{testimonialsHeading}</h2>
          </div>
        </div>
        <div className="relative max-md:mt-10">
          <div
            onPointerDown={e => { pointerStart.current = e.clientX; }}
            onPointerUp={onPointerUp}
            className="testimonial-fade opacity-0 relative w-3/5 mx-auto rounded-[2vw] border border-white/10 bg-white/5 overflow-hidden h-[30vw] max-[1025px]:w-full max-[1025px]:rounded-[5vw] max-[1025px]:h-[52vw] max-md:h-[105vw] touch-pan-y"
          >
            <div ref={bodyRef} key={t.name} className="pt-[8vw] pb-[4vw] px-[6vw] w-full h-full flex flex-col items-center justify-center gap-[2.5vw] text-center max-[1025px]:pt-[14vw] max-[1025px]:px-[8vw] max-[1025px]:gap-[4vw] max-md:pt-[22vw] max-md:px-[7vw] max-md:pb-[8vw] max-md:gap-[6vw]">
              <div className="flex flex-col gap-[0.4vw] max-md:gap-2">
                <p aria-live="polite" className="text-[2.6vw] text-[var(--accent)] max-[1025px]:text-[4vw] max-md:text-[6vw]">{t.name}</p>
                <p className="text-[1.145vw] text-white max-[1025px]:text-[2.2vw] max-md:text-[3.6vw]">{t.role}</p>
              </div>
              <p className="text-[1.145vw] leading-[1.6] text-white/70 w-[82%] max-[1025px]:text-[2.2vw] max-[1025px]:w-full max-md:text-[3.6vw]">&ldquo;{t.quote}&rdquo;</p>
            </div>
          </div>
          <div ref={ringRef} className="testimonial-fade opacity-0 flex w-full justify-center items-center absolute -top-[2vw] left-1/2 -translate-x-1/2 max-md:-top-[6vw]">
            {testimonials.map((item, i) => {
              const h = orderOf(i), active = h === 0;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Voir le témoignage de ${item.name}`}
                  aria-current={active ? 'true' : undefined}
                  style={{ order: h, zIndex: active ? 10 : n - Math.abs(h), transform: `scale(${active ? 1.6 : 1})` }}
                  className={`w-[5vw] h-[5vw] rounded-full overflow-hidden [clip-path:circle(50%)] cursor-pointer max-[1025px]:w-[9vw] max-[1025px]:h-[9vw] max-md:w-[12vw] max-md:h-[12vw] ${active
                    ? 'bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)] p-[0.3vw] mx-[2vw] max-md:mx-[4vw]'
                    : `opacity-60 hover:opacity-100 ${h < 0 ? '-mr-[1vw]' : '-ml-[1vw]'}`}`}
                >
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover object-top rounded-full" />
                </button>
              );
            })}
          </div>
          <div className="testimonial-fade opacity-0 flex justify-center gap-3 mt-[3vw] max-md:mt-[8vw]">
            <button type="button" onClick={() => select(index - 1)} aria-label="Témoignage précédent" className={navBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-2"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {navFill}
            </button>
            <button type="button" onClick={() => select(index + 1)} aria-label="Témoignage suivant" className={navBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-2"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {navFill}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
