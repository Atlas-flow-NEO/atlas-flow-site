import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { buildCopyReveals } from '../gsap/copy-reveal';
import { usePerson } from '../lib/person';

const Svg = ({ children }) => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mb-[2.5vw] max-[1025px]:mb-[4vw]" aria-hidden="true">{children}</svg>
);
const ICONS = {
  rocket: () => <Svg><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></Svg>,
  sparkles: () => <Svg><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></Svg>,
  zap: () => <Svg><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></Svg>,
};

// Trois cartes ; au survol un filet couleur se dessine sous la carte.
export function WorkWithMe() {
  const { workWithMe } = usePerson();
  const root = useGsapMatchMedia((scope, { reduced: rm }) => {
    const cleanups = [buildCopyReveals(scope, rm)];
    const rules = Array.from(scope.querySelectorAll('[data-rule-fill]'));
    gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
    const rule = (i, show) => {
      const t = rules[i];
      if (!t) return;
      gsap.killTweensOf(t);
      gsap.set(t, { transformOrigin: show ? 'left center' : 'right center' });
      gsap.to(t, { scaleX: show ? 1 : 0, duration: 0.55, ease: 'power2.out' });
    };
    const cards = Array.from(scope.querySelectorAll('[data-work-card]'));
    cards.forEach((card, i) => {
      const on = () => rule(i, true), off = () => rule(i, false);
      card.addEventListener('mouseenter', on);
      card.addEventListener('mouseleave', off);
      cleanups.push(() => { card.removeEventListener('mouseenter', on); card.removeEventListener('mouseleave', off); });
    });
    if (rm) gsap.set(cards, { opacity: 1, yPercent: 0 });
    else gsap.fromTo(cards, { opacity: 0, yPercent: 10 }, { opacity: 1, yPercent: 0, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: scope, start: 'top top' } });
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section id="pf-work-with-me" ref={root} aria-label={workWithMe.heading} className="relative w-full bg-[var(--paper-deep)] text-white pt-[25vw] pb-[10vw] max-[1025px]:pt-[65vw]">
      <div className="text-center mb-[5vw] max-md:mb-[10vw] px-[4vw]">
        <div data-copy-wrapper="true" data-copy="chars" className="opacity-0">
          <h2 className="text-[5.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw]" style={{ lineHeight: 1.5 }}>{workWithMe.heading}</h2>
        </div>
        <div data-copy-wrapper="true" className="opacity-0">
          <p className="text-[1.25vw] text-white mt-[1.5vw] max-[1025px]:text-[2.5vw] max-md:text-[4.5vw] max-md:mt-[2vw]" style={{ lineHeight: 1.5 }}>{workWithMe.sub}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 max-[1025px]:grid-cols-1">
        {workWithMe.cards.map(card => {
          const Icon = ICONS[card.icon];
          return (
            <div key={card.title} data-work-card className="relative px-[4vw] pt-[2vw] pb-[3vw] h-[32vw] flex flex-col justify-between max-[1025px]:h-auto max-[1025px]:py-[6vw] max-[1025px]:px-[5vw]">
              <div>
                <Icon />
                <h3 className="text-[2vw] mb-[2.5vw] max-[1025px]:text-[4.2vw] max-md:text-[5.8vw] max-[1025px]:mb-[2vw]" style={{ lineHeight: 1.5 }}>{card.title}</h3>
                <p className="text-[1.25vw] text-white/80 max-[1025px]:text-[2.8vw] max-md:text-[4vw]" style={{ lineHeight: 1.5 }}>{card.body}</p>
              </div>
              <div className="relative mt-[3vw] h-px w-full bg-white/20">
                <span data-rule-fill className="absolute inset-0 h-px w-full bg-[var(--accent)] will-change-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
