import { useEffect, useRef } from 'react';
import { SplitReveal } from '../gsap/split-reveal';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';

const IMG_TRAVEL = 30, TEXT_TRAVEL = 12, PARALLAX_LERP = 0.08;

// HERO — 300vh : la scène sticky se réduit de moitié au scroll et dévoile le marquee d'images derrière.
// Le visuel (photo dans le demo) est ici un portrait-constellation three.js chargé à la demande.
export function Hero() {
  const { site, projects, tone, personality: ps } = usePerson();
  const tag = useRef(null), mark = useRef(null);
  const stage = useRef(null), art = useRef(null), artInner = useRef(null), textWrap = useRef(null), marquee = useRef(null), canvas = useRef(null);

  useEffect(() => {
    let off = () => {}, dead = false;
    import('../lib/hero-constellation.js').then(m => { if (!dead && canvas.current) off = m.mountConstellation(canvas.current, tone, ps.shape); });
    return () => { dead = true; off(); };
  }, [tone, ps.shape]);

  const section = useGsapMatchMedia((scope, { reduced, desktop }) => {
    const artEl = art.current, stageEl = stage.current, marqueeEl = marquee.current;
    if (!artEl || !stageEl || !marqueeEl) return;
    if (reduced) {
      gsap.set(artEl, { opacity: 1, '--reveal': '125%' });
      gsap.set(marqueeEl, { filter: 'none', opacity: 1 });
      return;
    }
    const band = { at: -40 };
    artEl.style.setProperty('--reveal', '-40%');
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(band, { at: 125, duration: 3.5, ease: 'power2.out', onUpdate: () => artEl.style.setProperty('--reveal', `${band.at}%`) }, 0)
      .fromTo(artEl, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0)
      .fromTo(['#pf-header', '#pf-header-logo'], { yPercent: -50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.8);

    // Intro propre à chaque personnalité.
    const tagEl = tag.current, markEl = mark.current;
    if (ps.key === 'data' && tagEl) gsap.fromTo(tagEl, { scrambleText: { text: '' } }, { scrambleText: { text: ps.tag, chars: '01<>/_#', revealDelay: 0.3 }, duration: 1.6, delay: 0.6, ease: 'none' });
    if (ps.key === 'product' && tagEl) gsap.from(tagEl.children, { scale: 0, rotate: -12, duration: 1.1, stagger: 0.09, delay: 1.1, ease: 'elastic.out(1, 0.45)' });
    if (ps.key === 'editorial' && tagEl) gsap.from(tagEl, { clipPath: 'inset(0 100% 0 0)', duration: 1.8, delay: 0.9, ease: 'expo.inOut' });
    if (markEl) {
      gsap.fromTo(markEl, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 2.6, delay: 0.6, ease: 'expo.inOut' });
      gsap.to(markEl, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: scope, start: 'top top', end: '40% top', scrub: true } });
    }

    gsap.set(marqueeEl, { filter: 'blur(24px)', opacity: 0.35 });
    gsap.timeline({ scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } })
      .to(stageEl, { scale: 0.5, ease: 'power2.inOut', duration: 1 }, 0)
      .to(marqueeEl, { filter: 'blur(0px)', opacity: 1, ease: 'power2.out', duration: 0.18 }, 0.32);

    const artTarget = artInner.current, textTarget = textWrap.current;
    if (!desktop || !artTarget || !textTarget) return;
    const state = { imgX: 0, imgY: 0, textX: 0, textY: 0 }, goal = { ...state };
    const onMove = e => {
      const x = (e.clientX / innerWidth) * 2 - 1, y = (e.clientY / innerHeight) * 2 - 1;
      goal.imgX = -IMG_TRAVEL * x; goal.imgY = -IMG_TRAVEL * y; goal.textX = -TEXT_TRAVEL * x; goal.textY = -TEXT_TRAVEL * y;
    };
    let frame = 0;
    const tick = () => {
      for (const k in state) state[k] += (goal[k] - state[k]) * PARALLAX_LERP;
      gsap.set(artTarget, { x: state.imgX, y: state.imgY });
      gsap.set(textTarget, { x: state.textX, y: state.textY });
      frame = requestAnimationFrame(tick);
    };
    addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); gsap.set([artTarget, textTarget], { x: 0, y: 0 }); };
  }, []);

  const column = [...projects, ...projects].map(p => p.image);

  return (
    <section ref={section} id="pf-hero" aria-label="Introduction" className="relative h-[300vh] w-full">
      <div
        ref={stage}
        className="sticky top-0 z-2 flex h-[100svh] w-full items-center justify-between overflow-hidden px-[4vw] max-[1025px]:items-start max-[1025px]:px-[5vw] max-[1025px]:pt-[36vw] max-md:pt-[42vw]"
        style={{
          backgroundColor: 'var(--grad-8)',
          backgroundImage: [
            'radial-gradient(65% 55% at 92% 6%, var(--grad-1) 0%, transparent 65%)',
            'radial-gradient(60% 55% at 4% 82%, var(--grad-2) 0%, transparent 65%)',
            'radial-gradient(75% 80% at 48% 42%, var(--grad-3) 0%, transparent 70%)',
            'linear-gradient(180deg, var(--grad-4) 0%, var(--grad-5) 28%, var(--grad-3) 46%, var(--grad-6) 68%, var(--grad-7) 88%, var(--grad-8) 100%)',
          ].join(','),
        }}
      >
        <div ref={textWrap} className="relative z-[3] flex h-fit w-full justify-between max-[1025px]:flex-col max-[1025px]:gap-8">
          <div className="pf-hero-copy w-[45%] max-[1025px]:w-[70%] max-md:w-full">
            <p ref={tag} className="pf-tag mb-[1.5vw] max-[1025px]:mb-5">
              {ps.key === 'product' ? ps.tag.split(' · ').map(c => <span key={c} className="pf-chip">{c}</span>) : ps.tag}
            </p>
            <h1 className="[font-size:var(--type-hero)] leading-[1.1] text-[var(--fg)]">
              <SplitReveal text={site.heroHeadline} type="lines" trigger="immediate" delay={ps.key === 'editorial' ? 1.2 : 1} stagger={ps.reveal.stagger} from={ps.reveal.from} ease={ps.reveal.ease} duration={ps.reveal.duration} className="block" />
            </h1>
          </div>
          <div className="flex w-[12%] flex-col justify-between gap-[2vw] py-[2vw] text-end [font-size:var(--type-meta)] leading-[1.15] text-[var(--fg)] max-[1025px]:w-[60%] max-[1025px]:flex-col-reverse max-[1025px]:gap-5 max-[1025px]:text-start max-[1025px]:[font-size:clamp(1.1rem,3vw,2.4rem)] max-md:gap-[5vw] max-md:py-0 max-md:[font-size:clamp(1rem,4.2vw,2rem)]">
            <p className="text-white/70">{site.first}</p>
            {site.heroMeta.map(group => (
              <div key={group.lines.join(' ')}>
                {group.lines.map(line => <SplitReveal key={line} text={line} as="p" type="lines" trigger="immediate" delay={1.5} stagger={0.08} className="block" />)}
              </div>
            ))}
          </div>
        </div>
        {ps.key === 'editorial' && <div ref={mark} aria-hidden="true" className="pf-watermark">{site.first}</div>}
        <div ref={art} aria-hidden="true" className="hero-mask-reveal pointer-events-none absolute inset-y-0 right-[6%] z-[2] w-[52%] max-[1025px]:inset-x-0 max-[1025px]:top-auto max-[1025px]:bottom-0 max-[1025px]:h-[62%] max-[1025px]:w-full">
          <div ref={artInner} className="h-full w-full">
            <canvas ref={canvas} className="h-full w-full" />
          </div>
        </div>
      </div>

      <div ref={marquee} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full bg-[var(--paper-deep)]">
        <div className="sticky top-0 flex h-[100svh] w-full gap-[2.5vw] overflow-hidden px-[4vw] max-[1025px]:px-[5vw]">
          {['marquee-1', 'marquee-2'].map(cls => (
            <div key={cls} className={`${cls} flex h-fit w-1/2 flex-col gap-[2.5vw]`}>
              {column.map((src, i) => (
                <div key={i} className="relative h-[27vw] w-full overflow-hidden max-[1025px]:h-[45vw] max-md:h-[55vw]">
                  <img src={src} alt="" loading={i < 2 ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
