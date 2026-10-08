import { benefits } from "@/content/product";
import { SECTION_IDS } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Benefits() {
  return (
    <section
      id={SECTION_IDS.benefits}
      aria-labelledby="benefits-title"
      className="py-section bg-forest-glow text-coconut"
    >
      <div className="px-gutter mx-auto max-w-[1800px]">
        <Reveal>
          <SectionHeading
            id="benefits-title"
            eyebrow="Por que Coco Ice"
            title={
              <>
                Mais que gelo.
                <span className="block text-lime">Um detalhe no drink.</span>
              </>
            }
          />
        </Reveal>

        <Reveal as="ol" stagger className="mt-20 grid gap-16 md:mt-28 md:grid-cols-3 md:gap-10">
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className="border-t border-coconut/20 pt-6">
              <span className="font-label text-sm font-semibold text-aqua" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-h3 font-bold">{benefit.title}</h3>
              <p className="mt-4 max-w-xs text-coconut/75 text-pretty">{benefit.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
