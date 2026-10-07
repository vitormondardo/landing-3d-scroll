"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks, SECTION_IDS } from "@/content/site";
import { BRAND_NAME, LOGO } from "@/lib/constants";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const SCROLLED_OFFSET = 24;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${
        scrolled ? "border-b border-forest/10 bg-coconut/90 text-forest backdrop-blur-md" : "border-b border-transparent text-forest"
      }`}
    >
      <nav aria-label="Principal" className="px-gutter mx-auto flex h-16 max-w-[1800px] items-center justify-between md:h-20">
        <a href={`#${SECTION_IDS.hero}`} className="flex items-center gap-3" aria-label={`${BRAND_NAME} — início`}>
          <Image
            src={LOGO.dark}
            alt=""
            width={LOGO.width}
            height={LOGO.height}
            loading="eager"
            sizes="72px"
            className="h-11 w-auto md:h-14"
          />
          <span className="font-display text-lg font-bold tracking-tight max-[359px]:hidden md:text-xl">{BRAND_NAME}</span>
        </a>

        <ul className="hidden items-center gap-10 text-sm md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <WhatsAppButton location="navbar" intent="order" variant="dark" showIcon={false} className="h-10! px-5! max-md:hidden">
          Pedir
        </WhatsAppButton>
        <a href={`#${SECTION_IDS.flavors}`} className="text-sm underline-offset-4 hover:underline md:hidden">
          Sabores
        </a>
      </nav>
    </header>
  );
}
