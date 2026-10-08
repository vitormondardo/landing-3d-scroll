/**
 * Central configuration. Every company-specific value lives here (or in the
 * matching NEXT_PUBLIC_* env var) — never hardcode them in components.
 *
 * Values in [BRACKETS] or `null` are placeholders still to be provided by the
 * company. `null` fields are simply not rendered. See docs/CONTENT_TODO.md.
 */

// ─── Company ────────────────────────────────────────────────────────────────
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Coco Ice";

/** International format, digits only: 55 + DDD + number (e.g. 5511999999999). */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const INSTAGRAM_URL: string | null = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? null;

/** e.g. "Grande São Paulo". Hidden while null. */
export const DELIVERY_REGION: string | null = process.env.NEXT_PUBLIC_DELIVERY_REGION ?? null;

/** Not displayed anywhere until provided. Kept for the future catalog/checkout. */
export const PRODUCT_PRICE: string | null = null;

/** Placeholder flavors are shown (clearly labeled) until the real list is confirmed. */
export const SHOW_PLACEHOLDER_FLAVORS = true;

// ─── 3D ─────────────────────────────────────────────────────────────────────
/** Pack artwork (WebP with alpha) used by the 3D scene and the static poster. */
export const PACK = {
  texture: "/textures/pack-agua-de-coco.webp",
  /** Intrinsic size of the texture; the 3D pack keeps this aspect ratio. */
  width: 465,
  height: 1257,
  alt: "Embalagem Coco Ice Gelo para Drinks, sabor Água de Coco, 200 ml",
} as const;

export const SCENE = {
  fov: 30,
  /** Damping factor applied when the scene follows scroll state (higher = snappier). */
  damping: 5,
  /** Distance (in viewport heights) before the product section where the canvas starts loading. */
  preloadMargin: "100% 0px",
  /** Pack height in world units; everything else is sized relative to it. */
  packHeight: 3.7,
  /** Per-device budgets. Mobile gets a lighter scene. */
  desktop: { dpr: 1.75, drops: 170, ice: 8, mist: 280 },
  mobile: { dpr: 1.5, drops: 80, ice: 5, mist: 120 },
} as const;

// ─── Motion ─────────────────────────────────────────────────────────────────
export const MOTION = {
  ease: "power3.out",
  duration: 0.9,
  stagger: 0.08,
  revealDistance: 24,
  /** Scroll length of the pinned product section, in viewport heights per chapter. */
  productVhPerChapter: 100,
  scrub: 0.8,
} as const;

// ─── Breakpoints (mirror Tailwind's defaults) ──────────────────────────────
export const BREAKPOINTS = {
  md: 768,
  lg: 1024,
} as const;

export const MEDIA = {
  desktop: `(min-width: ${BREAKPOINTS.md}px)`,
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;
