/**
 * Two mutable objects bridge the DOM and the 3D scene without React state:
 *
 *  - `ScrollState`: written by GSAP ScrollTrigger (what the user scrolled to).
 *  - `SceneFrame`:  written once per frame by the scene rig (smoothed + sampled
 *    values) and only read by the scene components in their own `useFrame`.
 */
export interface ScrollState {
  /** Chapter position: 0 … chapters − 1 (fractional between chapters). */
  P: number;
  /** 0 → 1 while the product stage scrolls into view from the hero. */
  enter: number;
}

export function createScrollState(): ScrollState {
  return { P: 0, enter: 0 };
}

export interface SceneFrame {
  /** Seconds of animated time. */
  t: number;
  /** Smoothed chapter position and entrance. */
  P: number;
  enter: number;
  /** Visible half-extents at z = 0 and layout mode. */
  halfW: number;
  halfH: number;
  narrow: boolean;
  /** Smoothed pointer, −1 … 1 (mouse only). */
  mx: number;
  my: number;
  /** Pack transform. */
  px: number;
  py: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  /** Scene dressing. */
  coco: number;
  ice: number;
  spread: number;
  front: number;
  mist: number;
  /** Lights and tone. */
  warm: number;
  aqua: number;
  lime: number;
  exposure: number;
  /** Background color, 0–255 per channel. */
  bg: [number, number, number];
}

export function createSceneFrame(): SceneFrame {
  return {
    t: 0,
    P: 0,
    enter: 0,
    halfW: 3,
    halfH: 2,
    narrow: false,
    mx: 0,
    my: 0,
    px: 0,
    py: 0,
    s: 1,
    rx: 0,
    ry: 0,
    rz: 0,
    coco: 0,
    ice: 0,
    spread: 0,
    front: 0,
    mist: 0,
    warm: 1,
    aqua: 1,
    lime: 1,
    exposure: 1,
    bg: [16, 20, 20],
  };
}
