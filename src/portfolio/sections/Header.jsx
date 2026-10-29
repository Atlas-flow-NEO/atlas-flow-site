import { useEffect, useState } from 'react';
import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';
import { ModalContactButton } from '../ui/GetInTouch';

// Barre du portfolio, posée sous le header Atlas Flow : retour à l'équipe, nom, contact.
// Se cache en descendant, revient en remontant.
export function Header() {
  const { site } = usePerson();
  const [blurred, setBlurred] = useState(false);

  const root = useGsapMatchMedia((scope, { reduced }) => {
    const bar = scope.querySelector('[data-bar]');
    if (!bar || reduced) return;
    const last = { y: scrollY }, hidden = { v: false };
    const onScroll = () => {
      const y = scrollY, delta = y - last.y;
      last.y = y;
      if (delta > 0 && y > 0 && !hidden.v) { hidden.v = true; gsap.to(bar, { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }); }
      else if (delta < 0 && hidden.v) { hidden.v = false; gsap.to(bar, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); gsap.set(bar, { yPercent: 0, autoAlpha: 1 }); };
  }, []);

  useEffect(() => {
    const on = () => setBlurred(scrollY > innerHeight * 0.4);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  return (
    <div id="pf-header" ref={root} className="fixed inset-x-0 top-[var(--af-hdr)] z-[39] w-full">
      <div data-bar className={`flex items-center justify-between gap-4 px-[4vw] py-[1.2vw] transition-[backdrop-filter] duration-500 ease-out max-[1025px]:px-[5vw] max-[1025px]:py-[3vw] max-md:py-3 ${blurred ? 'backdrop-blur-lg' : ''}`}>
        <div id="pf-header-logo" className="flex items-center gap-[1.5vw] max-md:gap-3">
          <a href="#team" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-4 py-2 text-[0.95rem] text-white/85 transition-colors hover:border-[var(--accent)] hover:text-white max-md:px-3 max-md:text-[0.85rem]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Équipe
          </a>
          <span className="text-[1.6vw] leading-none max-[1025px]:text-[3.4vw] max-md:text-[5vw]">{site.first}<span className="text-[var(--accent)]">.</span></span>
        </div>
        <ModalContactButton bordered className="shrink-0" />
      </div>
    </div>
  );
}
