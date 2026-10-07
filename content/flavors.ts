import { PACK, SHOW_PLACEHOLDER_FLAVORS } from "@/lib/constants";
import type { Flavor } from "@/lib/types";

/**
 * Edit this list to add/remove flavors — components read from it only.
 * Status "placeholder" = not confirmed by the company yet (rendered with a
 * visible "sabor a confirmar" label). Replace descriptions with real copy.
 * To add a flavor's pack: drop a WebP with alpha in public/textures and set `pack`.
 */
const ALL_FLAVORS: Flavor[] = [
  {
    slug: "agua-de-coco",
    name: "Água de Coco",
    description: "Leve e refrescante, com o final adocicado do coco. Pack de 200 ml.",
    accent: "#66E0D0",
    accentInk: "#0B2A25",
    pack: { src: PACK.texture, alt: PACK.alt },
    status: "confirmed",
  },
  {
    slug: "coco-limao",
    name: "Coco + Limão",
    description: "[DESCRIÇÃO DO SABOR]",
    accent: "#C8F169",
    accentInk: "#1B2608",
    status: "placeholder",
  },
  {
    slug: "coco-morango",
    name: "Coco + Morango",
    description: "[DESCRIÇÃO DO SABOR]",
    accent: "#FF6B5E",
    accentInk: "#2A0B08",
    status: "placeholder",
  },
  {
    slug: "coco-maracuja",
    name: "Coco + Maracujá",
    description: "[DESCRIÇÃO DO SABOR]",
    accent: "#F0A92E",
    accentInk: "#2B1A02",
    status: "placeholder",
  },
];

export const flavors: Flavor[] = SHOW_PLACEHOLDER_FLAVORS
  ? ALL_FLAVORS
  : ALL_FLAVORS.filter((flavor) => flavor.status === "confirmed");

/** The flavor whose pack is shown in the 3D scene and the hero. */
export const featuredFlavor: Flavor = ALL_FLAVORS.find((f) => f.pack) ?? ALL_FLAVORS[0];
