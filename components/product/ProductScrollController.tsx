"use client";

import type { RefObject } from "react";
import { productChapters } from "@/content/product";
import { track } from "@/lib/analytics";
import { MEDIA } from "@/lib/constants";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { ScrollState } from "./sceneState";

const LAST_CHAPTER = productChapters.length - 1;

/**
 * Connects the page scroll to the 3D scene and the chapter copy.
 * Must be called from the component that owns `sectionRef` (a child's effect
 * would run before the parent's ref is attached).
 *
 *  - `enter`: 0 → 1 while the sticky stage rises into view from the hero.
 *  - `P`: chapter position. Chapter i is centered in the viewport exactly when
 *    P = i, so the scene's keyframes line up with the copy being read.
 *  - Each chapter's copy fades in/out around its own scroll position.
 *  - One `product_view` analytics event per chapter reached.
 *
 * Nothing here renders the scene: it only writes `scroll` (read by the rig).
 */
export function useProductScrollTimeline(sectionRef: RefObject<HTMLElement | null>, scroll: ScrollState): void {
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(`not ${MEDIA.reducedMotion}`, () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            scroll.enter = self.progress;
          },
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            scroll.P = self.progress * LAST_CHAPTER;
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-chapter]", section).forEach((chapter) => {
          const inner = chapter.querySelector("[data-chapter-inner]");
          gsap
            .timeline({
              scrollTrigger: { trigger: chapter, start: "top 75%", end: "bottom 25%", scrub: true },
            })
            .fromTo(inner, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: "power2.out" })
            .to(inner, { autoAlpha: 1, duration: 0.6 })
            .to(inner, { autoAlpha: 0, y: -48, ease: "power2.in" });
        });
      });

      productChapters.forEach((chapter) => {
        const el = section.querySelector(`[data-chapter="${chapter.id}"]`);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          once: true,
          onEnter: () => track("product_view", { chapter: chapter.id }),
        });
      });

      return () => mm.revert();
    },
    { dependencies: [scroll], scope: sectionRef },
  );
}
