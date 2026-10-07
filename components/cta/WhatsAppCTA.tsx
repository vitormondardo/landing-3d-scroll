import { finalCta } from "@/content/product";
import { SECTION_IDS } from "@/content/site";
import { PACK } from "@/lib/constants";
import { PackSilhouette } from "@/components/ui/PackSilhouette";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/** Final conversion: the page's one moment of full lime energy. */
export function WhatsAppCTA() {
  return (
    <section
      id={SECTION_IDS.cta}
      aria-labelledby="cta-title"
      className="py-section relative overflow-hidden bg-lime text-forest"
    >
      <PackSilhouette
        src={PACK.texture}
        color="#123C35"
        opacity={0.1}
        className="pointer-events-none absolute -right-10 -bottom-24 aspect-[465/1257] h-[90%] rotate-12 md:right-[8%] md:h-[120%]"
      />

      <Reveal stagger className="px-gutter relative mx-auto flex max-w-[1800px] flex-col items-center text-center">
        <Eyebrow className="text-forest/70">{finalCta.eyebrow}</Eyebrow>
        <h2 id="cta-title" className="mt-6 font-display text-display font-extrabold text-balance">
          {finalCta.title}
        </h2>
        <p className="mt-8 max-w-md text-lead text-forest/80">{finalCta.body}</p>
        <WhatsAppButton location="final_cta" intent="order" variant="dark" size="lg" className="mt-12">
          Pedir pelo WhatsApp
        </WhatsAppButton>
      </Reveal>
    </section>
  );
}
