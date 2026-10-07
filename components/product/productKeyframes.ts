import { lerp, smoothstep } from "@/lib/math";

/**
 * One value per chapter for every animated property of the scene. `sample`
 * blends between neighbouring chapters but lets each one "hold" briefly, so the
 * product rests while its copy is read and moves while you scroll between.
 *
 * Chapters: 0 pack · 1 gelo (translúcido) · 2 sabor (cenário claro, cocos) · 3 no copo
 */
const PI = Math.PI;

export const KEYFRAMES = {
  /** Pack x as a share of the visible half-width — opposite the copy. */
  px: [0.42, -0.4, 0.4, -0.4],
  /** Pack y as a share of the visible half-height. */
  py: [0, 0, 0.04, 0],
  ry: [-0.35, 0.55, -0.45, 2 * PI - 0.35],
  rx: [0.04, -0.06, 0.08, 0.02],
  rz: [0.1, -0.16, 0.08, -0.06],
  s: [1, 0.9, 0.8, 1],
  coco: [0, 0, 1, 0],
  ice: [0.55, 1, 0.45, 0.6],
  spread: [0.15, 1, 0.3, 0.5],
  front: [0, 1, 0.25, 0.2],
  warm: [0.9, 0.4, 1.3, 1.9],
  aqua: [2.4, 3.6, 1.0, 1.0],
  lime: [1.2, 1.8, 0.6, 0.35],
  mist: [0.7, 1, 0.12, 0.55],
  /** #101414 → deep green night → pale coconut → warm dark green. */
  bg: [
    [16, 20, 20],
    [9, 23, 22],
    [228, 238, 230],
    [11, 26, 23],
  ],
  exposure: [1.1, 1.12, 1.0, 1.08],
} as const;

type Scalar = readonly number[];
type Vector = readonly (readonly number[])[];

function segment(length: number, P: number): { i: number; t: number } {
  const i = Math.min(length - 1, Math.max(0, Math.floor(P)));
  if (i >= length - 1) return { i: length - 1, t: 0 };
  return { i, t: smoothstep(0.12, 0.88, P - i) };
}

export function sample(values: Scalar, P: number): number {
  const { i, t } = segment(values.length, P);
  return t === 0 ? values[i] : lerp(values[i], values[i + 1], t);
}

export function sampleVector(values: Vector, P: number, out: number[]): void {
  const { i, t } = segment(values.length, P);
  const a = values[i];
  const b = t === 0 ? a : values[i + 1];
  for (let k = 0; k < a.length; k++) out[k] = lerp(a[k], b[k], t);
}

/** Chapter whose background is pale: its copy switches to dark ink. */
export const LIGHT_CHAPTER = 2;
