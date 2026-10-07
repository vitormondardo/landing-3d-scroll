"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/content/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Persistent conversion point.
 *   Mobile: full-width bar fixed to the bottom (body reserves its height).
 *   Desktop: pill bottom-right, shown after the hero.
 * Hidden while the final CTA is on screen to avoid two identical buttons.
 */
export function FloatingWhatsApp() {
  const [pastHero, setPastHero] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(SECTION_IDS.hero);
    const final = document.getElementById(SECTION_IDS.cta);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setPastHero(!entry.isIntersecting);
        if (entry.target === final) setFinalVisible(entry.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (final) observer.observe(final);
    return () => observer.disconnect();
  }, []);

  const desktopVisible = pastHero && !finalVisible;

  return (
    <>
      {/* Mobile bar — always present so it never shifts layout. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-coconut/10 bg-night/92 px-4 pt-2.5 backdrop-blur-md transition-transform duration-500 md:hidden ${
          finalVisible ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
        inert={finalVisible}
      >
        <WhatsAppButton location="floating" intent="order" className="w-full" ariaLabel="Pedir pelo WhatsApp">
          Pedir pelo WhatsApp
        </WhatsAppButton>
      </div>

      {/* Desktop pill */}
      <div
        className={`fixed right-8 bottom-8 z-50 hidden transition-[opacity,transform] duration-500 ease-(--ease-out-expo) md:block ${
          desktopVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        inert={!desktopVisible}
      >
        <WhatsAppButton location="floating" intent="order" size="md" className="shadow-[0_12px_32px_-10px_rgb(16_20_20/0.55)]">
          Pedir pelo WhatsApp
        </WhatsAppButton>
      </div>
    </>
  );
}
