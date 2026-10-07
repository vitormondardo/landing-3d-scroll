import { productChapters } from "@/content/product";
import type { ChapterAlign } from "@/lib/types";
import { LIGHT_CHAPTER } from "./productKeyframes";

/** Desktop placement around the pack. Mobile: pack on top, copy panel at the bottom. */
const ALIGN: Record<ChapterAlign, string> = {
  start: "md:items-center md:justify-start",
  end: "md:items-center md:justify-end",
  center: "md:items-end md:justify-center md:text-center md:pb-24",
};

interface ProductFeaturesProps {
  /** True when the 3D scene is on screen, so the "sabor" chapter has a pale background. */
  paleChapter: boolean;
}

/**
 * The real, readable content of the product section. It scrolls in normal
 * flow over the sticky product stage, so it works without JS, without WebGL
 * and with reduced motion.
 */
export function ProductFeatures({ paleChapter }: ProductFeaturesProps) {
  return (
    <ol className="relative z-10 -mt-[100svh]">
      {productChapters.map((chapter, index) => {
        const light = paleChapter && index === LIGHT_CHAPTER;
        return (
          <li
            key={chapter.id}
            data-chapter={chapter.id}
            className={`px-gutter mx-auto flex min-h-svh max-w-[1800px] items-end justify-center pt-24 pb-[calc(var(--spacing-cta-bar)+1rem)] md:pb-0 ${ALIGN[chapter.align]}`}
          >
            <div
              data-chapter-inner
              className={`w-full max-w-none rounded-2xl p-5 backdrop-blur-md md:max-w-md md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none lg:max-w-lg ${
                light ? "bg-ice/80 text-forest" : "bg-night/70 text-coconut"
              }`}
            >
              <p className={`font-label text-eyebrow font-semibold uppercase ${light ? "text-forest-2" : "text-lime"}`}>
                {chapter.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-h2 font-extrabold text-balance">
                {chapter.title}{" "}
                <span className={light ? "text-forest-2" : "text-aqua"}>{chapter.titleAccent}</span>
              </h3>
              <p className={`mt-4 text-lead text-pretty ${light ? "text-forest-soft" : "text-night-soft"}`}>
                {chapter.body}
              </p>
              {chapter.specs && (
                <dl className={`mt-6 grid grid-cols-[auto_1fr] gap-x-6 border-t ${light ? "border-forest/20" : "border-coconut/20"}`}>
                  {chapter.specs.map((spec) => (
                    <div key={spec.label} className="contents">
                      <dt
                        className={`font-label border-b py-3 text-xs font-semibold uppercase tracking-[0.14em] ${
                          light ? "border-forest/20 text-forest-soft" : "border-coconut/20 text-night-soft"
                        }`}
                      >
                        {spec.label}
                      </dt>
                      <dd className={`border-b py-3 text-sm font-semibold ${light ? "border-forest/20" : "border-coconut/20"}`}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
