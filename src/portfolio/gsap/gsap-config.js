import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrambleTextPlugin);
  registered = true;
}
const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  /** The reference's signature text-mask curve: slow settle, decisive arrival. */
  mask: "expo.out"
};
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function refreshOnFontsReady() {
  if (typeof document === "undefined") return;
  if (!("fonts" in document)) return;
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
export {
  EASE,
  Flip,
  ScrollTrigger,
  SplitText,
  gsap,
  prefersReducedMotion,
  refreshOnFontsReady
};
