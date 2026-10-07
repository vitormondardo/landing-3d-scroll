"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneFrame } from "../sceneState";
import { PALETTE } from "./palette";

/**
 * Warm top key, two aqua rims and a lime glint that follows the pointer.
 * The strength of each light follows the current chapter. Reflections come
 * from the studio environment (see environment.tsx).
 */
export function Lighting({ frame }: { frame: SceneFrame }) {
  const warm = useRef<THREE.DirectionalLight>(null);
  const rimA = useRef<THREE.DirectionalLight>(null);
  const rimB = useRef<THREE.DirectionalLight>(null);
  const glint = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const { warm: w, aqua, lime, px, py, mx, my, t } = frame;
    if (warm.current) warm.current.intensity = w;
    if (rimA.current) rimA.current.intensity = aqua;
    if (rimB.current) rimB.current.intensity = aqua * 0.45;
    if (glint.current) {
      glint.current.intensity = lime * (0.85 + 0.15 * Math.sin(t * 2.1));
      glint.current.position.set(px + 2.2 + mx * 1.2, py - 1.6 - my * 0.8, 3.2);
    }
  });

  return (
    <>
      <ambientLight color={PALETTE.aqua} intensity={0.15} />
      <directionalLight color="#f2f7f6" intensity={0.7} position={[0.5, 0.5, 6]} />
      <directionalLight ref={warm} color={PALETTE.warm} intensity={1.6} position={[-4, 5, 5]} />
      <directionalLight ref={rimA} color={PALETTE.aqua} intensity={2.4} position={[5, 1.5, -4]} />
      <directionalLight ref={rimB} color={PALETTE.aqua} intensity={1} position={[-5, -1, -3]} />
      <pointLight ref={glint} color={PALETTE.lime} intensity={1.2} distance={14} decay={1.4} position={[2.2, -1.6, 3.2]} />
    </>
  );
}
