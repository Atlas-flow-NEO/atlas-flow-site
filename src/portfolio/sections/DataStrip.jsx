import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';

// Personnalité « data » : ticker défilant + compteurs KPI animés avec mini-histogrammes.
export function DataStrip() {
  const { personality: ps } = usePerson();
  const root = useGsapMatchMedia((scope, { reduced }) => {
    if (reduced) return;
    const st = { trigger: scope, start: 'top 75%', once: true };
    scope.querySelectorAll('[data-count]').forEach(el => {
      const n = { v: 0 }, to = +el.dataset.count;
      gsap.to(n, { v: to, duration: 2, ease: 'power3.out', snap: { v: 1 }, scrollTrigger: st, onUpdate: () => { el.textContent = n.v; } });
    });
    gsap.from(scope.querySelectorAll('[data-spark] i'), { scaleY: 0, duration: 0.9, stagger: 0.03, ease: 'power4.out', scrollTrigger: st });
    gsap.from(scope.querySelectorAll('[data-kpi]'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: st });
  }, []);
  const words = [...ps.ticker, ...ps.ticker];
  return (
    <section ref={root} aria-label="Indicateurs" className="pf-data relative z-[4] w-full bg-[var(--paper-deep)] py-[6vw] max-md:py-[14vw]">
      <div aria-hidden="true" className="pf-ticker">
        <div className="pf-ticker-row">{words.map((w, i) => <span key={i}>{w}<b>▲ {(i * 7) % 23 + 2}.{i % 10}%</b></span>)}</div>
      </div>
      <ul className="mt-[5vw] grid grid-cols-4 gap-px bg-white/15 px-0 max-[1025px]:grid-cols-2 max-md:mt-[10vw]">
        {ps.kpis.map(([v, unit, label], k) => (
          <li key={label} data-kpi className="flex flex-col gap-[1vw] bg-[var(--paper-deep)] px-[4vw] py-[3vw] max-[1025px]:px-[5vw] max-[1025px]:py-[6vw]">
            <span className="pf-mono text-[0.75rem] uppercase tracking-[0.2em] text-white/50">KPI_0{k + 1}</span>
            <span className="pf-mono text-[5vw] leading-none text-[var(--accent)] max-[1025px]:text-[10vw]"><span data-count={v}>{v}</span>{unit}</span>
            <span data-spark aria-hidden="true" className="pf-spark">{[3, 5, 4, 7, 6, 9, 8, 10].map((h, i) => <i key={i} style={{ height: `${(h + k) * 7}%` }} />)}</span>
            <span className="text-white/75">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
