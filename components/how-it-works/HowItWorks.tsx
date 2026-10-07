import { steps } from "@/content/product";
import { SECTION_IDS } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  return (
    <section id={SECTION_IDS.howItWorks} aria-labelledby="how-title" className="py-section bg-ice text-forest">
      <div className="px-gutter mx-auto grid max-w-[1800px] gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            id="how-title"
            eyebrow="Como usar"
            title={
              <>
                Simples <span className="text-forest-2">assim.</span>
              </>
            }
            lead="Sem preparo. O gelo já vem pronto no pack de 200 ml."
            className="lg:sticky lg:top-32"
          />
        </Reveal>

        <Reveal as="ol" stagger className="lg:col-span-6 lg:col-start-7">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-6 border-t border-forest/15 py-10 md:gap-10 md:py-14">
              <span className="font-display text-h1 font-extrabold leading-none text-forest-2" aria-hidden="true">
                {index + 1}
              </span>
              <div className="pt-2">
                <h3 className="font-display text-h3 font-bold">{step.title}</h3>
                <p className="mt-3 text-lead text-forest-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
