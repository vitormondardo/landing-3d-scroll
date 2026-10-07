/**
 * Builds transparent logo assets from the source JPG (ignitev6_sem_fundo.jpg),
 * whose "transparent" checkerboard is baked into the pixels.
 *
 *   public/images/logo-ignite-v6.png        dark logo for light backgrounds
 *   public/images/logo-ignite-v6-light.png  coconut-colored logo for dark backgrounds
 *   app/icon.png, app/apple-icon.png        favicons
 *
 * Usage: node scripts/build-logo.mjs
 */
import sharp from "sharp";

const SOURCE = "ignitev6_sem_fundo.jpg";
/** Checkerboard squares are ~205 and 255; the skull is ~84, text ~0. */
const BG_CUTOFF = 190;
const SKULL_TONE = 84;
const MATTE = 230; // average checkerboard tone, used to un-blend edges
const COCONUT = [248, 245, 236]; // #F8F5EC — dark-mode logo
const FOREST = [18, 60, 53]; // #123C35 — main logo

const { data, info } = await sharp(SOURCE).raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const dark = Buffer.alloc(width * height * 4);
const light = Buffer.alloc(width * height * 4);

for (let p = 0; p < width * height; p++) {
  const L = (data[p * 3] + data[p * 3 + 1] + data[p * 3 + 2]) / 3;
  const a = Math.min(Math.max((BG_CUTOFF - L) / (BG_CUTOFF - SKULL_TONE), 0), 1);
  // Foreground tone with the background blended out of anti-aliased edges.
  const fg = a > 0 ? Math.min(Math.max((L - MATTE * (1 - a)) / a, 0), 255) : 0;

  // Main variant: forest green; the skull keeps a softer tone like the original.
  const t = fg / 255;
  for (let c = 0; c < 3; c++) dark[p * 4 + c] = Math.round(FOREST[c] + (255 - FOREST[c]) * t * 0.9);
  dark[p * 4 + 3] = Math.round(a * 255);

  // Light variant: single coco color; skull rendered softer than the lettering.
  const strength = 1 - 0.4 * Math.min(fg / SKULL_TONE, 1);
  for (let c = 0; c < 3; c++) light[p * 4 + c] = COCONUT[c];
  light[p * 4 + 3] = Math.round(a * strength * 255);
}

const raw = { raw: { width, height, channels: 4 } };
const trimOpts = { background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 };

const darkPng = await sharp(dark, raw).png().toBuffer();
const { info: trimInfo } = await sharp(darkPng).trim(trimOpts).toBuffer({ resolveWithObject: true });
const crop = {
  left: -(trimInfo.trimOffsetLeft ?? 0),
  top: -(trimInfo.trimOffsetTop ?? 0),
  width: trimInfo.width,
  height: trimInfo.height,
};

for (const [buffer, out] of [
  [dark, "public/images/logo-ignite-v6.png"],
  [light, "public/images/logo-ignite-v6-light.png"],
]) {
  await sharp(buffer, raw).extract(crop).png({ compressionLevel: 9, palette: false }).toFile(out);
}

// Favicons: dark logo centered on a coco square.
for (const [size, out] of [
  [256, "app/icon.png"],
  [180, "app/apple-icon.png"],
]) {
  const inner = Math.round(size * 0.86);
  const logo = await sharp(dark, raw).extract(crop).resize(inner, inner, { fit: "inside" }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: COCONUT[0], g: COCONUT[1], b: COCONUT[2], alpha: 1 } } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);
}

console.log("crop", crop);
