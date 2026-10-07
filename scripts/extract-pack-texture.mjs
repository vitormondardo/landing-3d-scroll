/**
 * One-off: extracts the embedded pack texture (WebP with alpha) from the 3D
 * prototype HTML and writes it to public/textures.
 *
 * Usage: node scripts/extract-pack-texture.mjs "<path to geloignite-3d.html>"
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const [source] = process.argv.slice(2);
if (!source) throw new Error("Pass the path to geloignite-3d.html");

const html = readFileSync(source, "utf8");
const match = html.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
if (!match) throw new Error("No embedded WebP texture found");

mkdirSync("public/textures", { recursive: true });
const out = "public/textures/pack-agua-de-coco.webp";
writeFileSync(out, Buffer.from(match[1], "base64"));
console.log("wrote", out);
