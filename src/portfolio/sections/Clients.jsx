import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap, EASE } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';

// CLIENTS — 240vh : les logos traversent l'écran en profondeur (tunnel en perspective) autour de la phrase.
export function Clients() {
  const { clients, clientsHeading } = usePerson();
  const root = useGsapMatchMedia((scope, { mobile, reduced }) => {
    const grid = scope.querySelector('[data-grid]');
    const statement = scope.querySelector('[data-statement]');
    if (!grid) return;
    if (reduced || mobile) {
      if (statement) gsap.from(statement, { y: 20, opacity: 0, duration: 0.7, ease: EASE.out, scrollTrigger: { trigger: scope, start: 'top 80%', once: true } });
      return;
    }
    if (statement) gsap.from(statement, { yPercent: 40, opacity: 0, duration: 0.9, ease: EASE.mask, scrollTrigger: { trigger: scope, start: 'top 70%', once: true } });
    const st = { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true };
    gsap.fromTo(grid, { z: -2600 }, { z: 420, ease: 'none', scrollTrigger: st });
    Array.from(grid.children).forEach((row, i) => {
      gsap.fromTo(row, { yPercent: i % 2 === 0 ? -14 : 14, opacity: 0 }, { yPercent: i % 2 === 0 ? 14 : -14, opacity: 1, ease: 'none', scrollTrigger: { ...st } });
    });
  }, []);

  return (
    <section id="pf-clients" ref={root} aria-labelledby="pf-clients-heading" className="relative h-[240vh] w-full bg-[var(--paper-deep)] text-center">
      <div className="sticky top-0 z-10 flex h-screen w-full items-center justify-center">
        <div className="w-3/5 max-lg:w-4/5">
          <h3 id="pf-clients-heading" data-statement className="[font-size:var(--type-section)] leading-[1.2] text-[var(--fg)] max-lg:[font-size:clamp(1.75rem,7vw,7rem)] max-md:[font-size:clamp(1.5rem,8vw,7rem)]">{clientsHeading}</h3>
        </div>
      </div>
      <div className="sticky top-0 z-20 mt-[-100vh] flex h-screen w-full items-center justify-center overflow-hidden">
        <div data-grid aria-hidden="true" className="grid grid-cols-5 gap-[3vw] [perspective:350vw] max-md:grid-cols-3 max-md:gap-[6vw]">
          {clients.map(c => (
            <div key={c.name} className="flex h-[8vw] w-[14vw] items-center justify-center max-md:h-[22vw] max-md:w-[26vw]">
              <img src={c.image} alt="" className="h-[4vw] w-full object-contain opacity-70 max-md:h-[11vw]" />
            </div>
          ))}
        </div>
      </div>
      <ul className="sr-only">{clients.map(c => <li key={c.name}>{c.name}</li>)}</ul>
    </section>
  );
}
