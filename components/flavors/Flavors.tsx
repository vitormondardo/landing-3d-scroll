import { flavors } from "@/content/flavors";
import { SECTION_IDS } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FlavorCard } from "./FlavorCard";

/**
 * Horizontal, snap-scrolling strip of full-bleed flavor panels on mobile;
 * an edge-to-edge row on desktop. Renders nothing until flavors exist.
 */
export function Flavors() {
  if (flavors.length === 0) return null;

  return (
    <section id={SECTION_IDS.flavors} aria-labelledby="flavors-title" className="py-section">
      <div className="px-gutter mx-auto max-w-[1800px]">
        <Reveal>
          <SectionHeading
            id="flavors-title"
            eyebrow="Sabores"
            title={
              <>
                Escolha o sabor <span className="text-forest-2">do seu copo.</span>
              </>
            }
            lead="Peça o seu direto pelo WhatsApp."
          />
        </Reveal>
      </div>

      <ul
        aria-label="Lista de sabores"
        className="mt-16 flex snap-x snap-mandatory gap-3 overflow-x-auto px-(--spacing-gutter) pb-4 [scrollbar-width:none] md:mt-24 md:grid md:snap-none md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
        style={{ gridTemplateColumns: `repeat(${Math.min(flavors.length, 4)}, minmax(0, 1fr))` }}
      >
        {flavors.map((flavor, index) => (
          <li key={flavor.slug} className="group/flavor w-[82vw] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none">
            <FlavorCard flavor={flavor} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}
