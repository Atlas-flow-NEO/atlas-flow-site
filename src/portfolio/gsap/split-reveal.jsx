import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText, EASE, prefersReducedMotion } from "./gsap-config";
import { cn } from "../lib/cn";
function SplitReveal({
  text,
  as: Tag = "div",
  type = "lines",
  className,
  trigger = "immediate",
  stagger = 0.045,
  delay = 0,
  scrubTarget,
  from = 110,
  ease = EASE.mask,
  duration = 0.95
}) {
  const elRef = useRef(null);
  const splitRef = useRef(null);
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    let ready = Promise.resolve();
    if ("fonts" in document) ready = document.fonts.ready;
    let disposed = false;
    ready.then(() => {
      if (disposed || !el.isConnected) return;
      splitRef.current?.revert();
      const wantsLines = type.includes("lines");
      const split = SplitText.create(el, {
        type,
        mask: wantsLines ? "lines" : "words",
        // Leaves the full string on an aria-label and hides the generated
        // spans, so a screen reader announces a sentence rather than letters.
        aria: "auto",
        // Words carry their trailing space, which is otherwise trimmed and
        // visibly collapses gaps between masked words.
        wordDelimiter: " "
      });
      splitRef.current = split;
      const units = wantsLines ? split.lines : split.words;
      if (!units.length) return;
      const ctx = gsap.context(() => {
        if (trigger === "drift") {
          gsap.fromTo(
            units,
            { yPercent: 0 },
            {
              yPercent: from,
              ease: "none",
              stagger,
              scrollTrigger: {
                trigger: scrubTarget?.current ?? el,
                start: "top top",
                end: "bottom center",
                scrub: true
              }
            }
          );
          return;
        }
        gsap.set(units, { yPercent: from, opacity: 0 });
        gsap.to(units, {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease,
          ...trigger === "scroll" ? {
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
          } : {}
        });
      }, el);
      el.__gsapCtx = ctx;
    });
    return () => {
      disposed = true;
      const target = el;
      target.__gsapCtx?.revert();
      delete target.__gsapCtx;
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, [text, type, trigger, stagger, delay, from, scrubTarget, ease, duration]);
  return <Tag ref={elRef} className={cn(className)}>{text}</Tag>;
}
export {
  SplitReveal
};
