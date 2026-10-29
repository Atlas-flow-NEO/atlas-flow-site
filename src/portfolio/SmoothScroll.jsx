import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, refreshOnFontsReady } from './gsap/gsap-config';

// Lenis piloté par le ticker GSAP (une seule horloge pour le scroll et les ScrollTriggers).
// Monté uniquement sur les pages portfolio. Contrairement au demo, aucun clic sur a[href^="#"]
// n'est intercepté : le site route par hash. Au démontage tout est détruit pour rendre
// au reste du site un scroll natif intact.
export default function SmoothScroll() {
  useEffect(() => {
    const html = document.documentElement;
    let lenis = null, tick = null, failsafe = 0;

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new Lenis({ duration: 1.05, easing: t => 1 - Math.pow(1 - t, 3), wheelMultiplier: 1, touchMultiplier: 1.6, syncTouch: false });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Scroll retenu jusqu'à l'intro du hero, avec un plafond pour ne jamais bloquer la page.
      let released = false;
      const release = () => {
        if (released || !lenis) return;
        released = true;
        lenis.start();
        html.classList.remove('lenis-stopped');
        ScrollTrigger.refresh();
      };
      lenis.stop();
      html.classList.add('lenis-stopped');
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(release));
      failsafe = setTimeout(release, 2500);
    }
    refreshOnFontsReady();

    return () => {
      clearTimeout(failsafe);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // valeurs par défaut de GSAP
      lenis?.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
      html.classList.remove('lenis-stopped');
      ScrollTrigger.getAll().forEach(st => st.kill());
      document.body.removeAttribute('style'); // au cas où la modale contact était ouverte
    };
  }, []);
  return null;
}
