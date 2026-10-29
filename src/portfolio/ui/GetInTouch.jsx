import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, prefersReducedMotion } from '../gsap/gsap-config';
import { usePerson } from '../lib/person';
import { cn } from '../lib/cn';
import { ContactButton } from './ContactButton';

const Ctx = createContext(null);

// Modale « Me contacter » partagée par le header et le footer du portfolio.
// Rendue dans <body> via un portail : le wrapper porte data-tone pour garder les couleurs de la personne.
export function GetInTouchProvider({ children }) {
  const person = usePerson();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const invokerRef = useRef(null);

  const openModal = useCallback(() => {
    invokerRef.current = document.activeElement;
    setMounted(true);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || !mounted || !rootRef.current) return;
    const rootEl = rootRef.current;
    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';
    gsap.set(rootEl.querySelector('[data-modal-stage]'), { opacity: 1, scale: 1 });
    gsap.set(rootEl.querySelector('[data-modal-overlay]'), { opacity: 1 });
    rootEl.focus();
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted || !rootRef.current) return;
    const rootEl = rootRef.current;
    const inner = rootEl.querySelector('[data-modal-stage]');
    const overlay = rootEl.querySelector('[data-modal-overlay]');
    const restore = () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
      if (invokerRef.current?.isConnected) invokerRef.current.focus();
    };
    if (prefersReducedMotion()) {
      gsap.set(inner, { opacity: 0, scale: 0.8 });
      gsap.set(overlay, { opacity: 0 });
      restore();
      return;
    }
    const tl = gsap.timeline({ onComplete: restore });
    tl.to([inner, overlay], { opacity: 0, duration: 0.7, ease: 'power1.in' }, 0).to(inner, { scale: 0.8, duration: 0.7, ease: 'power1.in' }, 0);
    return () => { tl.kill(); restore(); };
  }, [open, mounted]);

  return (
    <Ctx.Provider value={openModal}>
      {children}
      {mounted && createPortal(
        <div data-tone={person.tone} className="pf-portal">
          <div
            ref={rootRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pf-modal-title"
            aria-hidden={open ? undefined : true}
            tabIndex={-1}
            className={cn('fixed inset-0 z-[9999] focus-visible:outline-none', open ? 'pointer-events-auto' : 'pointer-events-none')}
          >
            <div data-modal-stage className="relative z-1 flex h-screen w-screen items-center justify-center px-[4vw] max-md:px-4 will-change-[transform,opacity]">
              <button data-modal-overlay type="button" aria-label="Fermer la fenêtre" onClick={closeModal} className="absolute inset-0 cursor-pointer backdrop-blur-lg bg-black/40" />
              <div className="relative w-full max-w-[75vw] h-[75vh] overflow-y-auto rounded-[2vw] bg-white/5 backdrop-blur-lg border border-white/10 text-white p-[3vw] max-[1025px]:max-w-[85vw] max-[1025px]:p-8 max-md:max-w-full max-md:p-6 max-md:rounded-3xl">
                <div className="absolute top-[2vw] right-[2vw] max-[1025px]:top-6 max-[1025px]:right-6 max-md:top-4 max-md:right-4">
                  <button type="button" aria-label="Fermer" onClick={closeModal} className="group relative shrink-0 size-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer max-[1025px]:size-11 max-md:size-9">
                    <div className="absolute inset-0 w-full h-full bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)]" />
                    <span className="absolute h-0.5 z-2 w-4 rounded-full bg-[var(--on-accent)] rotate-45 max-md:w-3 group-hover:rotate-[225deg] duration-500 ease-in-out motion-reduce:transition-none" />
                    <span className="absolute h-0.5 z-2 w-4 rounded-full bg-[var(--on-accent)] -rotate-45 max-md:w-3 group-hover:rotate-[135deg] duration-500 ease-in-out motion-reduce:transition-none" />
                  </button>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-[3vw] items-start max-[1025px]:grid-cols-1 max-[1025px]:gap-8 pt-[4vw]">
                  <div>
                    <h2 id="pf-modal-title" className="text-[4.8vw] leading-[1.1] max-[1025px]:text-[5vw] max-md:text-[8vw]">Me contacter</h2>
                    <p className="mt-[1vw] text-[1.1vw] text-white max-[1025px]:text-[2.4vw] max-md:text-[4vw]">Écrivez à {person.site.first}</p>
                  </div>
                  <ContactForm email={person.site.email} />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

export function ModalContactButton({ bordered, className }) {
  const openModal = useContext(Ctx);
  const { site } = usePerson();
  return <ContactButton label={site.ctaLabel} bordered={bordered} onClick={openModal} className={className} />;
}

const FIELD = 'w-full rounded-full h-14 pl-5 pr-4 text-sm text-white outline-none transition-all border bg-white/15 border-white/15 focus:border-[var(--accent)] placeholder:text-white/45';
const FIELDS = [['name', 'text', 'Votre nom*'], ['email', 'email', 'Adresse e-mail*'], ['phone', 'tel', 'Téléphone (+212…)'], ['subject', 'text', 'Sujet*'], ['message', 'text', 'Votre message*']];

// Formulaire simplifié (pas de backend) : prépare un e-mail vers la personne.
function ContactForm({ email }) {
  const [sent, setSent] = useState(false);
  const onSubmit = e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const body = `${f.message}\n\n${f.name} — ${f.email}${f.phone ? ' — ' + f.phone : ''}`;
    location.href = `mailto:${email}?subject=${encodeURIComponent(f.subject || 'Contact')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form onSubmit={onSubmit} className="space-y-[1.2vw] max-[1025px]:space-y-[4vw]">
      {FIELDS.map(([name, type, ph]) => (
        <div key={name} className="w-full">
          <label className="sr-only" htmlFor={'pf-f-' + name}>{ph}</label>
          <input id={'pf-f-' + name} name={name} type={type} placeholder={ph} required={ph.endsWith('*')} className={FIELD} />
        </div>
      ))}
      <button type="submit" className="mt-[2vw] flex h-[3.5vw] items-center rounded-full px-[2.4vw] text-[1.2vw] bg-linear-to-r from-[var(--accent-hot)] to-[var(--accent-red)] text-[var(--on-accent)] max-[1025px]:h-[8vw] max-[1025px]:px-[4vw] max-[1025px]:text-[2.5vw] max-md:h-[12vw] max-md:text-[4vw]">
        {sent ? 'Message prêt, merci !' : 'Envoyer'}
      </button>
    </form>
  );
}
