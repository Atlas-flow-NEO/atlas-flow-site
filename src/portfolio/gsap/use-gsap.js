import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap-config";
import { prefersReducedMotion } from "./gsap-config";
function useGsap(build, deps = []) {
  const scopeRef = useRef(null);
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    if (prefersReducedMotion()) return;
    let userCleanup;
    const ctx = gsap.context(() => {
      userCleanup = build(scope);
    }, scope);
    return () => {
      ctx.revert();
      if (typeof userCleanup === "function") userCleanup();
    };
  }, deps);
  return scopeRef;
}
function useGsapMatchMedia(build, deps = []) {
  const scopeRef = useRef(null);
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia();
    let cleanups = [];
    mm.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        mobile: "(max-width: 1024px)",
        desktop: "(min-width: 1025px)"
      },
      (context) => {
        const { reduced = false, mobile = false, desktop = false } = context.conditions;
        cleanups.push(build(scope, { mobile, desktop, reduced }));
      }
    );
    return () => {
      for (const fn of cleanups) if (typeof fn === "function") fn();
      cleanups = [];
      mm.revert();
    };
  }, deps);
  return scopeRef;
}
export {
  ScrollTrigger,
  useGsap,
  useGsapMatchMedia
};
