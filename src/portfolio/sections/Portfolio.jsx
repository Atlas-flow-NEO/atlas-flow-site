import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';

// PORTFOLIO — 360vh, scène sticky : chaque projet monte par-dessus le précédent (assombri), scrub + snap.
// Une nappe en ellipse monte derrière la scène à l'entrée de la section.
export function Portfolio() {
  const { projects, workHeading, personality } = usePerson();
  const SEGMENTS = projects.length - 1;

  const root = useGsapMatchMedia((scope, { reduced }) => {
    const plates = Array.from(scope.querySelectorAll('[data-plate]'));
    const dots = Array.from(scope.querySelectorAll('[data-dot]'));
    const bar = scope.querySelector('[data-bar-fill]');
    const clip = scope.querySelector('[data-clip]');
    const rows = Array.from(scope.querySelectorAll('[data-row]'));
    if (!bar || !clip || !plates.length) return;
    const css = getComputedStyle(scope);
    const on = css.getPropertyValue('--on-accent').trim() || '#ffffff';
    const off = css.getPropertyValue('--grad-hot').trim();

    gsap.set(clip, { clipPath: 'ellipse(150% 100% at 50% 100%)' });
    const clipWindow = { start: 'top bottom', end: '30% bottom' };
    gsap.to(clip, { clipPath: 'ellipse(60% 100% at 50% 100%)', ease: 'power2.out', scrollTrigger: { trigger: scope, ...clipWindow, scrub: true } });
    if (!reduced) gsap.to(clip, { yPercent: innerWidth > 1024 ? -70 : -50, ease: 'none', scrollTrigger: { trigger: scope, ...clipWindow, scrub: true } });

    gsap.set(bar, { scaleY: 0 });
    gsap.set(dots[0], { backgroundColor: on, borderColor: on });
    gsap.set(dots.slice(1), { backgroundColor: off, borderColor: on, opacity: 0.6 });
    gsap.set(plates, { filter: 'brightness(1)' });
    if (reduced) gsap.set(plates.slice(1), { opacity: 0 });
    else gsap.set(plates.slice(1), { yPercent: 100, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope, start: '10% top', end: 'bottom bottom', scrub: true,
        ...(reduced ? {} : { snap: { snapTo: 1 / SEGMENTS, duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' } }),
      },
    });
    tl.to(bar, { scaleY: 1, ease: 'none', duration: SEGMENTS }, 0);
    for (let i = 0; i < SEGMENTS; i++) {
      if (reduced) tl.to(plates[i + 1], { opacity: 1, ease: 'none', duration: 1 }, i);
      else {
        tl.to(plates[i + 1], { yPercent: 0, y: 0, ease: 'power2.inOut', duration: 1 }, i);
        tl.to(plates[i], { filter: 'brightness(0.3)', ease: 'power2.inOut', duration: 1 }, i);
      }
      tl.set(dots[i + 1], { backgroundColor: on, borderColor: on, opacity: 1 }, i + 1);
    }
    gsap.from(rows, { y: 24, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: scope, start: 'top 70%', once: true } });
  }, [projects]);

  const ground = 'bg-[linear-gradient(90deg,var(--grad-hot)_0%,var(--accent-red)_100%)]';
  return (
    <section id="pf-portfolio" ref={root} aria-labelledby="pf-portfolio-heading" className="relative w-full pt-[8vw] text-[var(--on-accent)] max-[1025px]:pt-[30vw]">
      <div data-clip aria-hidden="true" className={`absolute left-0 top-0 z-2 h-[50vh] w-full ${ground} will-change-[clip-path]`} />
      <div className={`sticky top-0 z-3 flex h-[100svh] w-full flex-col items-center justify-center gap-[5vw] overflow-hidden ${ground} px-[4vw] max-[1025px]:gap-12 max-[1025px]:px-[5vw] max-md:gap-[12vw]`}>
        <h2 id="pf-portfolio-heading" className="text-center [font-size:var(--type-section)] max-[1025px]:[font-size:clamp(2.25rem,6.5vw,6.5rem)] max-md:[font-size:clamp(1.75rem,9vw,6.5rem)]">{workHeading}</h2>
        <div className="flex w-full items-center gap-[4vw] max-[1025px]:flex-col max-[1025px]:items-start max-[1025px]:gap-16 max-md:gap-[10vw]">
          <div className="relative w-[32%] max-[1025px]:w-[50%] max-md:w-full">
            <div aria-hidden="true" className="absolute left-1 top-[2.5vw] h-[21vw] w-px bg-current opacity-20 max-[1025px]:top-[1vw] max-[1025px]:h-[33vw] max-md:h-[62vw]" />
            <div data-bar-fill aria-hidden="true" className="absolute left-1 top-[2.5vw] h-[21vw] w-px origin-top bg-current max-[1025px]:top-[1vw] max-[1025px]:h-[33vw] max-md:h-[62vw]" />
            <div className="flex flex-col max-[1025px]:gap-[4vw] max-md:gap-[10vw]">
              {projects.map(p => (
                <div key={p.id} data-row className="relative flex h-[7vw] items-center gap-[1.2vw] max-[1025px]:h-[11vw] max-md:h-[15vw] max-md:gap-[5vw]">
                  <span data-dot aria-hidden="true" className="mt-[-1.5vw] size-[10px] shrink-0 rounded-full border max-[1025px]:mt-[-4vw] max-md:mt-[-7vw]" />
                  <div>
                    <h3 className="font-normal text-[1.5vw] max-[1025px]:text-[3.5vw] max-md:text-[5vw]">{p.title}</h3>
                    <p className="text-[1vw] opacity-80 max-[1025px]:text-[2.5vw] max-md:text-[3.8vw]">{p.tags.join('  •  ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[38vw] w-full overflow-hidden rounded-xl max-[1025px]:h-[52vw] max-[1025px]:rounded-lg">
            {projects.map((p, i) => (
              <div key={p.id} data-plate style={{ zIndex: i + 1 }} className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl bg-[var(--paper-deep)] max-[1025px]:rounded-lg">
                {personality.key === 'product' && <div className="pf-win-bar absolute inset-x-0 top-0 z-[1]" aria-hidden="true"><i /><i /><i /><span>{p.tags[0].toLowerCase()}.atlasflow.ma</span></div>}
                {personality.key === 'data' && <span className="pf-mono absolute left-4 top-4 z-[1] rounded bg-black/60 px-2 py-1 text-[0.75rem] text-[var(--accent)]" aria-hidden="true">{`#0${i + 1} · ${p.tags.join(' / ')}`}</span>}
                <img src={p.image} alt={`${p.title} — ${p.tags.join(', ')}`} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-[-10%] left-0 h-[60vh] w-full overflow-hidden max-[1025px]:bottom-[-13%]">
        <div className={`absolute bottom-[35%] left-[-7.5%] z-2 h-[40vh] w-[115%] ${ground} blur-2xl max-[1025px]:bottom-[50%] max-[1025px]:left-[-10%] max-[1025px]:w-[120%] max-[1025px]:blur-lg`} />
      </div>
      <div aria-hidden="true" className="h-[calc(360vh-8vw-100svh)]" />
    </section>
  );
}
