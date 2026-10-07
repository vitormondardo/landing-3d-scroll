"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BREAKPOINTS, SCENE } from "@/lib/constants";
import { sample, sampleVector, KEYFRAMES } from "../productKeyframes";
import type { SceneFrame, ScrollState } from "../sceneState";
import { PACK_H, PACK_W } from "./Pack";
import { PALETTE } from "./palette";

interface SceneRigProps {
  frame: SceneFrame;
  scroll: ScrollState;
  /** Freeze time-based motion (bobbing, orbit, pointer parallax). */
  still: boolean;
}

const NARROW_ASPECT = 5 / 6;
/**
 * Scene background. It must be `scene.background` (not only the clear color):
 * transmissive materials (ice, drops) refract what the scene background renders.
 */
const bg = new THREE.Color(PALETTE.night);

/**
 * Runs first every frame (priority −1). Turns scroll position into the
 * smoothed, sampled `SceneFrame` that all scene components read, frames the
 * camera for the viewport, and drives background and exposure.
 */
export function SceneRig({ frame, scroll, still }: SceneRigProps) {
  const size = useThree((s) => s.size);

  // Camera distance so the pack fills the stage the same way at any viewport.
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useEffect(() => {
    const aspect = size.width / size.height;
    const narrow = size.width <= BREAKPOINTS.md - 8 || aspect < NARROW_ASPECT;
    const tanH = Math.tan((SCENE.fov * Math.PI) / 360);
    const dist = narrow
      ? Math.max((PACK_H * 2.05) / (2 * tanH), (PACK_W * 2.9) / (2 * tanH * aspect))
      : Math.max((PACK_H * 1.34) / (2 * tanH), (PACK_W * 5.2) / (2 * tanH * aspect));
    frame.narrow = narrow;
    frame.halfH = tanH * dist;
    frame.halfW = frame.halfH * aspect;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
  }, [size, camera, frame]);

  // Mouse parallax. Listens on window because the copy overlays the canvas.
  const pointerRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const pointer = pointerRef.current;
    if (still) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [still]);

  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.background = bg;
    return () => {
      scene.background = null;
    };
  }, [scene]);

  const bgSample = useRef([0, 0, 0]);

  useFrame((state, dt) => {
    const follow = 1 - Math.exp(-dt * SCENE.damping);
    frame.t += still ? 0 : dt;
    frame.P += (scroll.P - frame.P) * follow;
    frame.enter += (scroll.enter - frame.enter) * follow;
    const pointer = pointerRef.current;
    frame.mx += (pointer.x - frame.mx) * (1 - Math.exp(-dt * 4));
    frame.my += (pointer.y - frame.my) * (1 - Math.exp(-dt * 4));

    const { P, halfW, halfH, narrow } = frame;
    const k = KEYFRAMES;
    const intro = 1 - frame.enter;

    frame.px = narrow ? 0 : sample(k.px, P) * halfW;
    frame.py = (narrow ? halfH * 0.26 : sample(k.py, P) * halfH) + intro * halfH * 0.5;
    frame.s = sample(k.s, P) * (0.88 + 0.12 * frame.enter);
    frame.rx = sample(k.rx, P);
    frame.ry = sample(k.ry, P);
    frame.rz = sample(k.rz, P);
    frame.coco = sample(k.coco, P);
    frame.ice = sample(k.ice, P);
    frame.spread = sample(k.spread, P);
    frame.front = sample(k.front, P);
    frame.mist = sample(k.mist, P);
    frame.warm = sample(k.warm, P);
    frame.aqua = sample(k.aqua, P);
    frame.lime = sample(k.lime, P);
    frame.exposure = sample(k.exposure, P);
    sampleVector(k.bg, P, bgSample.current);
    frame.bg[0] = bgSample.current[0];
    frame.bg[1] = bgSample.current[1];
    frame.bg[2] = bgSample.current[2];

    state.gl.toneMappingExposure = frame.exposure;
    bg.setRGB(frame.bg[0] / 255, frame.bg[1] / 255, frame.bg[2] / 255, THREE.SRGBColorSpace);

    state.camera.position.x = frame.mx * 0.18;
    state.camera.position.y = -frame.my * 0.12;
    state.camera.lookAt(0, 0, 0);
  }, -1);

  return null;
}
