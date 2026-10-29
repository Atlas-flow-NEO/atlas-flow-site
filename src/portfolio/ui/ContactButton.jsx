import { useEffect, useRef } from 'react';
import { gsap, SplitText, EASE, prefersReducedMotion } from '../gsap/gsap-config';
import { cn } from '../lib/cn';

// Pilule blanche : au survol le point sombre grossit et remplit le bouton, le libellé roule caractère par caractère.
export function ContactButton({ label, onClick, bordered = false, className }) {
  const root = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const rootEl = root.current, labelEl = labelRef.current;
    if (!rootEl || !labelEl || prefersReducedMotion()) return;
    const split = SplitText.create(labelEl, { type: 'chars', aria: 'hidden' });
    const chars = split.chars;
    if (!chars.length) return () => split.revert();
    let off = () => {};
    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 0, textShadow: 'currentcolor 0 1.3em', willChange: 'transform' });
      const tl = gsap.timeline({ paused: true });
      tl.to(chars, { yPercent: -100, duration: 0.45, stagger: { each: 0.028, from: 'start' }, ease: EASE.mask });
      const onEnter = () => tl.play(), onLeave = () => tl.reverse();
      rootEl.addEventListener('pointerenter', onEnter);
      rootEl.addEventListener('pointerleave', onLeave);
      rootEl.addEventListener('focus', onEnter);
      rootEl.addEventListener('blur', onLeave);
      off = () => {
        rootEl.removeEventListener('pointerenter', onEnter);
        rootEl.removeEventListener('pointerleave', onLeave);
        rootEl.removeEventListener('focus', onEnter);
        rootEl.removeEventListener('blur', onLeave);
      };
    }, rootEl);
    return () => { off(); ctx.revert(); split.revert(); };
  }, [label]);

  return (
    <button
      ref={root}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group relative flex w-fit items-center justify-center gap-[0.9vw] h-[3.5vw] px-[2vw] rounded-full overflow-hidden whitespace-nowrap font-medium text-[1.5vw] bg-white transition-colors duration-500 ease-out text-[#111111] hover:text-white motion-reduce:transition-none max-[1025px]:gap-[1.6vw] max-[1025px]:h-[8vw] max-[1025px]:px-[3.5vw] max-[1025px]:font-normal max-[1025px]:text-[3vw] max-md:gap-[2.4vw] max-md:h-[12vw] max-md:px-[5vw] max-md:text-[4.2vw]',
        bordered && 'border border-white/20',
        className,
      )}
    >
      <span aria-hidden="true" className="relative z-10 flex size-[0.5vw] shrink-0 items-center justify-center max-[1025px]:size-[1.5vw] max-md:size-[2.3vw]" style={{ marginTop: '0.08em' }}>
        <span className="absolute inset-0 rounded-full bg-[var(--paper-deep)] transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.785,0.135,0.15,0.86)] group-hover:scale-[120] motion-reduce:transition-none" />
      </span>
      <span aria-hidden="true" className="invisible block h-[1.3em] leading-[1.3] font-normal [font-size:1.15vw] max-[1025px]:text-[3vw] max-md:text-[4.2vw]">{label}</span>
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 z-20 block h-[1.3em] -translate-x-1/2 -translate-y-1/2 overflow-hidden font-normal [font-size:1.15vw] max-[1025px]:text-[3vw] max-md:text-[4.2vw]" style={{ marginTop: '0.08em' }}>
        <span ref={labelRef} className="block leading-[1.3]">{label}</span>
      </span>
      <span aria-hidden="true" className="block w-[0.5vw] shrink-0 max-[1025px]:w-[1.5vw] max-md:w-[2.3vw]" />
    </button>
  );
}
