"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Drives Lenis from GSAP's ticker so Lenis and ScrollTrigger share one frame. */
function GsapLenisSync() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [lenis]);

  return null;
}

/**
 * Lenis smooth scroll, disabled entirely for prefers-reduced-motion.
 * Touch devices keep native scrolling (syncTouch: false).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  // Lenis is mounted as a sibling so toggling it never remounts the page tree.
  // Descendants still reach the instance through Lenis' root store.
  return (
    <>
      {!reducedMotion && (
        <ReactLenis root options={{ autoRaf: false, anchors: true, lerp: 0.1, syncTouch: false }}>
          <GsapLenisSync />
        </ReactLenis>
      )}
      {children}
    </>
  );
}
