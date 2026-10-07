import { BRAND_NAME } from "@/lib/constants";

export const SECTION_IDS = {
  hero: "inicio",
  product: "produto",
  benefits: "beneficios",
  flavors: "sabores",
  howItWorks: "como-usar",
  occasions: "ocasioes",
  cta: "pedido",
} as const;

export const navLinks = [
  { label: "Produto", href: `#${SECTION_IDS.product}` },
  { label: "Sabores", href: `#${SECTION_IDS.flavors}` },
  { label: "Como usar", href: `#${SECTION_IDS.howItWorks}` },
] as const;

export const seo = {
  title: `${BRAND_NAME} — Gelo de coco saborizado para drinks`,
  shortTitle: BRAND_NAME,
  description:
    "Gelo de água de coco para drinks em pack de 200 ml: gela e dá sabor ao mesmo tempo. Do congelador direto pro drink — peça pelo WhatsApp.",
  keywords: [
    "gelo de coco",
    "gelo saborizado",
    "gelo para drinks",
    "gelo de coco para drinks",
    "gelo saborizado para bebidas",
  ],
} as const;
