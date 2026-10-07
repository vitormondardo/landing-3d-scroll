"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { hero } from "@/content/product";
import { SECTION_IDS } from "@/content/site";
import { BRAND_NAME, MEDIA, MOTION, PACK } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not ${MEDIA.reducedMotion}`, () => {
        const tl = gsap.timeline({ defaults: { ease: MOTION.ease, duration: MOTION.duration } });
        tl.from("[data-hero-line]", { yPercent: 110, stagger: MOTION.stagger * 1.5, duration: 1.1 })
          .from("[data-hero-fade]", { autoAlpha: 0, y: MOTION.revealDistance, stagger: MOTION.stagger }, "-=0.7")
          .from("[data-hero-cube]", { autoAlpha: 0, y: 60, rotate: -8, duration: 1.4 }, "-=1");

        // The cube drifts down as the user scrolls, handing over to the 3D section.
        gsap.to("[data-hero-cube]", {
          yPercent: 35,
          rotate: 12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id={SECTION_IDS.hero}
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden pt-24 md:pt-28"
    >
      <div className="px-gutter mx-auto grid w-full max-w-[1800px] flex-1 grid-rows-[1fr_auto] items-end gap-10 pb-10 md:grid-cols-12 md:grid-rows-1 md:pb-16">
        <div className="md:col-span-8">
          <Eyebrow className="text-forest-soft">
            <span data-hero-fade className="inline-block">
              {BRAND_NAME} · {hero.eyebrow}
            </span>
          </Eyebrow>

          <h1 id="hero-title" className="mt-6 font-display text-display font-extrabold">
            <Line>{hero.titleStart}</Line>
            <Line>
              <span className="text-forest-2">{hero.titleEmphasis}</span>
            </Line>
            <Line>{hero.titleEnd}</Line>
          </h1>

          <p data-hero-fade className="mt-8 max-w-md text-lead text-forest-soft text-pretty">
            {hero.lead}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href={`#${SECTION_IDS.product}`} variant="primary" size="lg">
              Experimente
              <ArrowIcon />
            </ButtonLink>
            <WhatsAppButton location="hero" intent="order" variant="ghost" size="lg">
              Pedir pelo WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        <div className="flex justify-center md:col-span-4 md:justify-end">
          <div data-hero-cube className="relative -rotate-6">
            <Image
              src={PACK.texture}
              alt={PACK.alt}
              width={PACK.width}
              height={PACK.height}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 26vw, (min-width: 768px) 30vw, 40vw"
              className="h-[34svh] w-auto drop-shadow-[0_30px_40px_rgb(18_60_53/0.35)] md:h-[62svh]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children }: { children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span data-hero-line className="block">
        {children}
      </span>
    </span>
  );
}
