import Image from "next/image";
import { occasions } from "@/content/product";
import { SECTION_IDS } from "@/content/site";
import type { Occasion } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const TONES: Record<Occasion["tone"], string> = {
  coconut: "bg-coconut-deep text-forest",
  ice: "bg-ice text-forest",
  forest: "bg-forest text-coconut",
  night: "bg-night-deep text-coconut ring-1 ring-coconut/15 ring-inset",
};

const MARQUEE_WORDS = ["caipirinha", "gin tônica", "rum", "vodka", "suco", "água com gás", "drink autoral"];

export function Occasions() {
  return (
    <section id={SECTION_IDS.occasions} aria-labelledby="occasions-title" className="py-section overflow-hidden bg-night text-coconut">
      <div className="px-gutter mx-auto max-w-[1800px]">
        <Reveal>
          <SectionHeading
            id="occasions-title"
            eyebrow="Ocasiões"
            title={
              <>
                Para qualquer copo, <span className="text-aqua">qualquer hora.</span>
              </>
            }
          />
        </Reveal>
      </div>

      {/* Decorative marquee — the same words are in the cards below for screen readers. */}
      <div aria-hidden="true" className="mt-16 flex whitespace-nowrap font-display text-h1 font-extrabold text-coconut/10 md:mt-24">
        <div className="animate-marquee flex shrink-0">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span key={i} className="px-6 md:px-10">
              {word} <span>·</span>
            </span>
          ))}
        </div>
      </div>

      <Reveal as="ul" stagger className="px-gutter mx-auto mt-16 grid max-w-[1800px] gap-3 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {occasions.map((occasion) => (
          <li
            key={occasion.title}
            className={`relative flex min-h-72 flex-col justify-end overflow-hidden p-7 md:min-h-96 ${TONES[occasion.tone]}`}
          >
            {occasion.image && (
              <Image
                src={occasion.image.src}
                alt={occasion.image.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            <div className="relative">
              <h3 className="font-display text-h3 font-bold">{occasion.title}</h3>
              <p className="mt-3 max-w-xs opacity-80">{occasion.body}</p>
            </div>
          </li>
        ))}
      </Reveal>

      <div className="px-gutter mx-auto mt-12 flex max-w-[1800px] justify-center">
        <WhatsAppButton location="occasions" intent="event" variant="primary">
          Pedir para um evento
        </WhatsAppButton>
      </div>
    </section>
  );
}
