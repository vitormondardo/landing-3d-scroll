/**
 * Domain types shared by content, components and (future) CMS/catalog integrations.
 * Content lives in `content/*` and only depends on these types, so swapping the
 * static data for a CMS fetch later does not require touching components.
 */

/** Marks data that still needs confirmation from the company. */
export type ContentStatus = "confirmed" | "placeholder";

export interface Flavor {
  /** Stable id, also used for analytics and WhatsApp messages. */
  slug: string;
  name: string;
  description: string;
  /** Accent color used for backgrounds, illustration tint and the 3D tint. */
  accent: string;
  /** Text color with AA contrast on top of `accent`. */
  accentInk: string;
  /** Pack artwork (WebP with alpha). Flavors without it show a tinted placeholder. */
  pack?: { src: string; alt: string };
  status: ContentStatus;
}

export type ChapterAlign = "start" | "end" | "center";

export interface ProductChapter {
  id: string;
  eyebrow: string;
  title: string;
  /** Highlighted tail of the title (rendered in the accent color). */
  titleAccent: string;
  body: string;
  /** Desktop placement relative to the product. */
  align: ChapterAlign;
  /** Optional key/value facts rendered as a definition list. */
  specs?: { label: string; value: string }[];
}

export interface Benefit {
  title: string;
  body: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Occasion {
  title: string;
  body: string;
  /** Optional photo. Without one, a solid color composition is used. */
  image?: { src: string; alt: string };
  tone: "coconut" | "forest" | "night" | "ice";
}

export type WhatsAppIntent = "general" | "order" | "flavor" | "event";

export type CtaLocation =
  | "navbar"
  | "hero"
  | "flavors"
  | "occasions"
  | "final_cta"
  | "floating"
  | "footer";
