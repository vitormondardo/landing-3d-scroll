"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { track } from "@/lib/analytics";
import { PACK } from "@/lib/constants";
import type { Flavor } from "@/lib/types";
import { PackSilhouette } from "@/components/ui/PackSilhouette";
import { PlaceholderTag } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface FlavorCardProps {
  flavor: Flavor;
  index: number;
}

/** One full-color flavor panel. All copy and color comes from content/flavors.ts. */
export function FlavorCard({ flavor, index }: FlavorCardProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { threshold: 0.5, once: true });

  useEffect(() => {
    if (seen) track("flavor_view", { flavor: flavor.slug });
  }, [seen, flavor.slug]);

  return (
    <article
      ref={ref}
      aria-labelledby={`flavor-${flavor.slug}`}
      style={{ backgroundColor: flavor.accent, color: flavor.accentInk }}
      className="relative flex h-full min-h-[34rem] flex-col justify-between overflow-hidden p-7 md:min-h-[40rem] md:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-label text-sm font-semibold opacity-60" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        {flavor.status === "placeholder" && <PlaceholderTag>sabor a confirmar</PlaceholderTag>}
      </div>

      <div className="mx-auto my-8 h-56 transition-transform duration-700 ease-(--ease-out-expo) group-hover/flavor:-rotate-3 group-hover/flavor:scale-105 md:h-72">
        {flavor.pack ? (
          <Image
            src={flavor.pack.src}
            alt={flavor.pack.alt}
            width={PACK.width}
            height={PACK.height}
            sizes="(min-width: 768px) 120px, 100px"
            className="h-full w-auto -rotate-3 drop-shadow-[0_18px_24px_rgb(0_0_0/0.25)]"
          />
        ) : (
          <PackSilhouette
            src={PACK.texture}
            color={flavor.accentInk}
            opacity={0.18}
            className="aspect-[465/1257] h-full -rotate-3"
          />
        )}
      </div>

      <div>
        <h3 id={`flavor-${flavor.slug}`} className="font-display text-h2 font-bold">
          {flavor.name}
        </h3>
        <p className="mt-3 max-w-xs opacity-80">{flavor.description}</p>
        <WhatsAppButton
          location="flavors"
          intent="flavor"
          flavor={flavor.name}
          variant="dark"
          className="mt-8"
          ariaLabel={`Pedir gelo de coco sabor ${flavor.name}`}
        >
          Pedir este sabor
        </WhatsAppButton>
      </div>
    </article>
  );
}
