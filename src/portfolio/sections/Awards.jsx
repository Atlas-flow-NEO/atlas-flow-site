import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { buildCopyReveals } from '../gsap/copy-reveal';
import { useReducedMotion } from '../lib/use-reduced-motion';
import { pluck } from '../lib/string-pluck';
import { usePerson } from '../lib/person';

// Filet « corde » : on le tire en passant la souris, il vibre et joue une note au relâchement.
function StringLine({ reduced }) {
  const wrapRef = useRef(null), pathRef = useRef(null);
  const amp = useRef(0), phase = useRef(Math.PI / 2), frame = useRef(null);

  const draw = useCallback(bow => {
    const w = wrapRef.current?.offsetWidth;
    if (w != null) pathRef.current?.setAttribute('d', `M 0 50 Q ${0.5 * w} ${50 + bow} ${w} 50`);
  }, []);

  useEffect(() => {
    draw(0);
    const onResize = () => draw(amp.current);
    addEventListener('resize', onResize, { passive: true });
    return () => { removeEventListener('resize', onResize); if (frame.current != null) cancelAnimationFrame(frame.current); frame.current = null; };
  }, [draw, reduced]);

  const keepAlive = () => {
    if (frame.current != null) cancelAnimationFrame(frame.current);
    phase.current = Math.PI / 2;
    frame.current = requestAnimationFrame(keepAlive);
  };
  const release = () => {
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = null;
    pluck(amp.current);
    draw(amp.current);
    const settle = () => {
      draw(amp.current * Math.sin(phase.current));
      amp.current *= 0.95;
      phase.current += 0.5;
      if (Math.abs(amp.current) > 0.1) frame.current = requestAnimationFrame(settle);
      else { phase.current = Math.PI / 2; amp.current = 0; draw(0); frame.current = null; }
    };
    settle();
  };

  return (
    <span ref={wrapRef} className="relative block h-px w-full">
      {!reduced && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[-50px] block h-[100px] cursor-grab active:cursor-grabbing"
          onMouseEnter={keepAlive}
          onMouseMove={e => { amp.current += e.movementY / 2; draw(amp.current); }}
          onMouseLeave={release}
        />
      )}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-50px] h-[100px] w-full">
        <path ref={pathRef} d="M 0 50" strokeWidth={2} fill="none" stroke="rgba(255, 255, 255, 0.4)" />
      </svg>
    </span>
  );
}

// AWARDS — liste ; sur desktop une vignette suit la ligne survolée (rebond) et change d'image.
export function Awards() {
  const { awards, awardsHeading, projects } = usePerson();
  const reduced = useReducedMotion();
  const listRef = useRef(null), plateRef = useRef(null), cardRef = useRef(null);
  const rowRefs = useRef([]), imgRefs = useRef([]);

  const root = useGsapMatchMedia((scope, { reduced: rm, desktop }) => {
    const rows = rowRefs.current.filter(Boolean), imgs = imgRefs.current.filter(Boolean);
    const host = plateRef.current, card = cardRef.current, list = listRef.current;
    const cleanups = [buildCopyReveals(scope, rm)];

    const rules = Array.from(scope.querySelectorAll('[data-rule]'));
    if (rm) gsap.set(rules, { scaleX: 1 });
    else rules.forEach(r => gsap.to(r, { scaleX: 1, duration: 0.8, ease: 'power2.inOut', scrollTrigger: { trigger: r, start: 'top 85%', toggleActions: 'play none none none' } }));

    if (desktop && rows.length === awards.length && host && card && imgs.length === awards.length && list) {
      gsap.set(card, { y: 0 });
      gsap.set(imgs, { opacity: 1 });
      imgs.forEach((img, i) => gsap.set(img, { zIndex: i + 1 }));
      gsap.set(imgs[0], { scale: 1.05 });
      gsap.set(imgs.slice(1), { scale: 0 });
      let z = imgs.length, activeIndex = -1, shown = false, last = null;
      const show = () => { if (shown) return; shown = true; gsap.to(host, { opacity: 1, duration: rm ? 0 : 0.4, ease: 'power2.out' }); };
      const hide = () => { if (!shown) return; shown = false; activeIndex = -1; gsap.to(host, { opacity: 0, duration: rm ? 0 : 0.4, ease: 'power2.out' }); };
      const showIndex = t => {
        const row = rows[t];
        if (row) {
          const cardY = gsap.getProperty(card, 'y');
          const cr = card.getBoundingClientRect(), rr = row.getBoundingClientRect();
          const targetY = rr.top + rr.height / 2 - (cr.top + cr.height / 2 - cardY);
          if (rm) gsap.set(card, { y: targetY });
          else gsap.to(card, { y: targetY, duration: 0.65, ease: 'back.out(1.6)' });
        }
        const img = imgs[t];
        if (img) {
          gsap.set(img, { zIndex: ++z });
          gsap.killTweensOf(img);
          if (rm) gsap.set(img, { scale: 1.05 });
          else { gsap.set(img, { scale: 0 }); gsap.to(img, { scale: 1.05, duration: 0.45, ease: 'power2.out' }); }
        }
        activeIndex = t;
      };
      const hit = (x, y) => {
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i].getBoundingClientRect();
          if (y >= r.top && y < r.bottom && x >= r.left && x < r.right) return i;
        }
        return null;
      };
      const insideList = e => { const r = list.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom; };
      const onMove = e => {
        last = { x: e.clientX, y: e.clientY };
        const i = hit(e.clientX, e.clientY);
        if (i !== null) { show(); if (i !== activeIndex) showIndex(i); }
        else if (insideList(e)) show();
        else hide();
      };
      const onScroll = () => { if (!last) return; const i = hit(last.x, last.y); if (i !== null && i !== activeIndex) showIndex(i); };
      addEventListener('mousemove', onMove, { passive: true });
      addEventListener('scroll', onScroll, { passive: true });
      list.addEventListener('mouseleave', hide, { passive: true });
      cleanups.push(() => {
        removeEventListener('mousemove', onMove);
        removeEventListener('scroll', onScroll);
        list.removeEventListener('mouseleave', hide);
        gsap.killTweensOf([card, host, ...imgs]);
      });
    }
    return () => cleanups.forEach(fn => fn());
  }, [reduced]);

  return (
    <section ref={root} id="pf-awards" className="relative w-full bg-[var(--paper-deep)] py-[7vw] text-white">
      <div className="flex w-full items-center gap-[4vw] px-[4vw] max-[1025px]:px-[5vw]">
        <div className="w-full">
          <div data-copy="chars" data-copy-wrapper="true" className="opacity-0">
            <h2 className="mb-[4vw] text-[5.5vw] max-[1025px]:text-[7vw] max-md:text-[9vw]" style={{ lineHeight: 1.2 }}>
              {awardsHeading.split('\n').map((l, i) => <Fragment key={l}>{i > 0 && <br />}{l}</Fragment>)}
            </h2>
          </div>
          <div ref={listRef} className="w-full">
            {awards.map((a, i) => (
              <Fragment key={a.title}>
                {i > 0 && <div data-rule className="relative h-px w-full origin-left scale-x-0"><StringLine reduced={reduced} /></div>}
                <div ref={el => { rowRefs.current[i] = el; }} className="relative py-8">
                  <div data-copy="lines" data-copy-wrapper="true" className="opacity-0">
                    <h3 className="text-[1.8vw] max-[1025px]:text-[3.4vw] max-md:text-[5.5vw]" style={{ lineHeight: 1.5 }}>{a.title}</h3>
                  </div>
                  <div data-copy="lines" data-copy-wrapper="true" className="opacity-0">
                    <p className="mt-3 text-[1.25vw] tracking-wide text-white/30 max-[1025px]:text-[2.2vw] max-md:text-[3.6vw]" style={{ lineHeight: 1.5 }}>{a.meta}</p>
                  </div>
                </div>
              </Fragment>
            ))}
            <div data-rule className="relative h-px w-full origin-left scale-x-0"><StringLine reduced={reduced} /></div>
          </div>
        </div>
        <div ref={plateRef} aria-hidden="true" className="pointer-events-none absolute right-[10%] flex w-[40vw] justify-center opacity-0 max-[1025px]:hidden">
          <div ref={cardRef} className="relative h-[22vw] w-[40vw] overflow-hidden rounded-lg bg-[var(--paper-deep)] shadow-2xl will-change-transform">
            {awards.map((a, i) => (
              <div key={a.title} ref={el => { imgRefs.current[i] = el; }} className="absolute inset-0">
                <img src={projects[i % projects.length].image} alt="" className="h-full w-full rounded-lg object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
