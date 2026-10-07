"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { featuredFlavor } from "@/content/flavors";
import { SECTION_IDS } from "@/content/site";
import { MEDIA, PACK, SCENE } from "@/lib/constants";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { ProductFeatures } from "./ProductFeatures";
import { ProductPoster } from "./ProductPoster";
import { useProductScrollTimeline } from "./ProductScrollController";
import { createScrollState } from "./sceneState";

// three.js + R3F live in their own chunk, fetched only when the section is near.
const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

/**
 * Scroll-driven product presentation:
 *   - a sticky full-height stage holds the pack (poster → WebGL when ready);
 *   - chapters scroll over it in normal document flow;
 *   - ScrollTriggers write the scroll position; the scene animates from it.
 * Without WebGL or with reduced motion the poster stays and all copy is still there.
 */
export function ProductExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const scroll = useMemo(() => createScrollState(), []);

  const isDesktop = useMediaQuery(MEDIA.desktop);
  const reducedMotion = useReducedMotion();
  const webgl = useWebGLSupport();
  const near = useInView(sectionRef, { rootMargin: SCENE.preloadMargin, once: true });
  const visible = useInView(sectionRef);
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);

  useProductScrollTimeline(sectionRef, scroll);

  const show3D = webgl === true && !reducedMotion && near;

  return (
    <section ref={sectionRef} id={SECTION_IDS.product} aria-labelledby="product-title" className="relative bg-night">
      <h2 id="product-title" className="sr-only">
        O produto
      </h2>

      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <ProductPoster hidden={sceneReady} />
        {show3D && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
            <ProductScene
              scroll={scroll}
              packSrc={featuredFlavor.pack?.src ?? PACK.texture}
              isDesktop={isDesktop}
              active={visible}
              still={reducedMotion}
              onReady={handleReady}
            />
          </div>
        )}
      </div>

      <ProductFeatures paleChapter={sceneReady} />
    </section>
  );
}
