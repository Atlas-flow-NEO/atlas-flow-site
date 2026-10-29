import { gsap, SplitText } from "./gsap-config";
function buildCopyReveals(scope, reduced) {
  const copyWrappers = Array.from(scope.querySelectorAll("[data-copy-wrapper]"));
  if (!copyWrappers.length) return () => void 0;
  if (reduced) {
    for (const wrap of copyWrappers) {
      gsap.set(wrap, { opacity: 0, y: 24 });
      gsap.to(wrap, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: wrap, start: "top 85%", once: true }
      });
    }
    return () => void 0;
  }
  const splits = [];
  let timer = 0;
  let ran = false;
  const build = () => {
    for (const wrap of copyWrappers) {
      const child = wrap.firstElementChild;
      if (!child) continue;
      const chars = wrap.dataset.copy === "chars";
      const st = chars ? SplitText.create(child, {
        type: "lines,chars",
        mask: "chars",
        charsClass: "char++",
        reduceWhiteSpace: false
      }) : SplitText.create(child, { type: "lines", mask: "lines", reduceWhiteSpace: false });
      splits.push(st);
      if (chars) {
        st.masks?.forEach((m) => {
          const el = m;
          el.style.paddingInline = "0.04em";
          el.style.marginInline = "-0.04em";
          el.style.boxSizing = "content-box";
        });
      }
      gsap.set(wrap, { opacity: 1 });
      gsap.fromTo(
        chars ? st.chars ?? [] : st.lines ?? [],
        { yPercent: 100, xPercent: 0, rotate: 0, opacity: 1 },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.5,
          stagger: chars ? 0.015 : 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: wrap, start: "top 85%" }
        }
      );
    }
  };
  const go = () => {
    if (ran) return;
    ran = true;
    window.clearTimeout(timer);
    build();
  };
  timer = window.setTimeout(go, 300);
  void document.fonts?.ready.then(go, go);
  return () => {
    ran = true;
    window.clearTimeout(timer);
    splits.forEach((s) => s.revert());
  };
}
export {
  buildCopyReveals
};
