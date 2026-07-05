"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fade up on scroll — apply to any element ref */
export function useScrollFadeUp(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { opacity: 0, y: 40 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top bottom+=${(1 - threshold) * 100}%`,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
      once: true,
    });

    return () => st.kill();
  }, [threshold]);

  return ref;
}

/** Stagger fade-up for children */
export function useStaggerFadeUp(threshold = 0.2, stagger = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = el.children;
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 30 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top bottom+=${(1 - threshold) * 100}%`,
      onEnter: () =>
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          ease: "power2.out",
        }),
      once: true,
    });

    return () => st.kill();
  }, [threshold, stagger]);

  return ref;
}

/** Count-up animation */
export function useCountUp(end: number, duration = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(end);
      return;
    }

    gsap.set(el, { textContent: 0 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom+=80%",
      onEnter: () => {
        gsap.to(el, {
          textContent: end,
          duration,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: () => {
            const val = parseInt(el!.textContent || "0");
            el!.textContent = val.toLocaleString();
          },
        });
      },
      once: true,
    });

    return () => st.kill();
  }, [end, duration]);

  return ref;
}
