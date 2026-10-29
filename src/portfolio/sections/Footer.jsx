import { useGsapMatchMedia } from '../gsap/use-gsap';
import { gsap } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';
import { ModalContactButton } from '../ui/GetInTouch';

// Carte vitrée qui remonte en scrub à l'arrivée du footer (desktop seulement).
function FooterScrubCard({ children, className }) {
  const ref = useGsapMatchMedia((root, { reduced: rm, mobile }) => {
    if (rm || mobile || innerWidth <= 1025) { gsap.set(root, { opacity: 1, yPercent: 0 }); return; }
    gsap.fromTo(root, { yPercent: 20, opacity: 1 }, { yPercent: 0, opacity: 1, ease: 'power1.out', scrollTrigger: { trigger: root.closest('footer') || root, start: 'top 60%', end: 'bottom bottom', scrub: true } });
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

// Vague floue du demo (footer-bg.svg), recolorée aux tokens de la personne.
const Glow = () => (
  <svg viewBox="0 0 1920 900" fill="none" aria-hidden="true" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-20 left-0 opacity-70 right-0 h-auto w-full max-md:bottom-0 max-md:scale-[5]">
    <defs>
      <filter id="pf-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="90" /></filter>
    </defs>
    <g filter="url(#pf-glow)">
      <path d="M271.377 463.923C63.9045 335.035 -273.752 357.928 -416.648 385.485L-217.619 1201.72H947.805L1996.83 1231.01L2291.37 587.619C2297.7 580.796 2247.65 529.477 1996.83 378.777C1683.28 190.403 1212.96 311.851 1065.54 464.66C918.123 617.469 530.718 625.031 271.377 463.923Z" style={{ fill: 'var(--accent-hot)' }} />
      <path d="M2291.37 587.617C2297.7 580.794 2247.65 529.475 1996.81 378.775C1683.28 190.401 1212.96 311.849 1065.54 464.658C918.122 617.467 530.717 625.029 271.377 463.921C63.9033 335.034 -273.754 357.926 -416.649 385.482" style={{ stroke: 'var(--accent-red)' }} strokeWidth="62.7" />
    </g>
  </svg>
);

export function Footer() {
  const { site, socials, footerHeadline } = usePerson();
  const year = new Date().getFullYear();
  const link = 'under-multi';
  return (
    <footer id="pf-footer" className="relative overflow-hidden px-[4vw] pt-[10vw] max-[1025px]:px-[5vw] max-md:pt-[20vw]">
      <Glow />
      <div className="relative z-[1]">
        <FooterScrubCard className="flex flex-col justify-between gap-20 rounded-[2rem] border border-white/30 bg-black/5 px-12 py-12 backdrop-blur-2xl max-[1025px]:items-center max-[1025px]:gap-10 max-[1025px]:px-8 max-[1025px]:py-14 max-md:gap-8 max-md:px-6">
          <div className="flex items-start justify-between gap-24 max-[1025px]:flex-col-reverse max-[1025px]:items-center max-[1025px]:gap-10 max-md:gap-16">
            <p className="whitespace-nowrap text-[8vw] leading-[0.9] max-[1025px]:text-[14vw] max-md:text-[20vw]">{site.first}<span className="text-[var(--accent)]">.</span></p>
            <div className="flex flex-col items-end gap-[2vw] max-[1025px]:items-center max-[1025px]:gap-5 max-md:gap-[7vw]">
              <p className="w-[75%] text-end [font-size:clamp(1.75rem,3.4vw,3.75rem)] leading-[1.15] max-[1025px]:w-full max-[1025px]:text-center max-[1025px]:[font-size:clamp(2rem,5vw,4rem)] max-md:[font-size:clamp(2rem,7.5vw,4.5rem)]">{footerHeadline}</p>
              <ModalContactButton />
            </div>
          </div>
          <div className="flex w-full items-end justify-between gap-36 max-[1025px]:flex-col max-[1025px]:items-center max-[1025px]:gap-10 max-[1025px]:text-center">
            <div className="w-fit">
              <h4 className="mb-5 text-[1.25vw] uppercase max-[1025px]:text-[2.4vw] max-md:text-[4vw]">Me joindre</h4>
              <ul className="space-y-2 text-[1.25vw] max-[1025px]:text-[2.4vw] max-md:text-[4vw]">
                <li className="under-multi-parent w-fit max-[1025px]:mx-auto"><a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className={link}>{site.phone}</a></li>
                <li className="under-multi-parent w-fit max-[1025px]:mx-auto"><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
              </ul>
            </div>
            <ul className="flex gap-4">
              {socials.map(s => (
                <li key={s.label} className="group">
                  <a href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={`${s.label} (nouvel onglet)`} className="relative isolate block overflow-hidden rounded-full border border-white bg-white/5 p-2.5 transition-all duration-300 ease-in-out group-hover:scale-[0.95]">
                    <span className="absolute inset-0 z-[-1] origin-center scale-0 rounded-full bg-white transition-transform duration-300 ease-in-out group-hover:scale-100" />
                    <img src={s.icon} alt="" className="size-5 object-contain transition-all duration-300 ease-in-out group-hover:invert" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </FooterScrubCard>
        <div className="flex items-end justify-between gap-10 py-8 pt-12 text-lg text-[var(--on-accent)] max-md:flex-col max-md:items-center max-md:gap-2 max-md:text-center max-md:text-sm max-md:py-6 max-md:pt-8">
          <p>© {year} {site.first} — Atlas Flow</p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
