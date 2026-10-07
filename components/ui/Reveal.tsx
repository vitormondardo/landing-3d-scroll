"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { MEDIA, MOTION } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";

interface RevealProps {
  as?: "div" | "ol" | "ul" | "section";
  className?: string;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: boolean;
  /** Start position of the trigger (ScrollTrigger syntax). */
  start?: string;
  children: ReactNode;
}

/**
 * The single reveal used across the site: fade + short rise, once.
 * Skipped for reduced motion — content is always rendered visible in HTML.
 */
export function Reveal({ as: Tag = "div", className, stagger = false, start = "top 85%", children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`not ${MEDIA.reducedMotion}`, () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y: MOTION.revealDistance,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: stagger ? MOTION.stagger : 0,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as RefObject<HTMLDivElement & HTMLOListElement>} className={className}>
      {children}
    </Tag>
  );
}
