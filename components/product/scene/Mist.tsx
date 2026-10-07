"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/math";
import type { SceneFrame } from "../sceneState";
import { PALETTE } from "./palette";
import { softDotCanvas } from "./textures";

const TOP = 5;

/** Cold mist: soft aqua, white and lime motes drifting upward. */
export function Mist({ frame, count }: { frame: SceneFrame; count: number }) {
  const { geometry, material, speeds } = useMemo(() => {
    const rnd = mulberry32(31);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const aqua = new THREE.Color(PALETTE.aqua);
    const lime = new THREE.Color(PALETTE.lime);
    const white = new THREE.Color(0xffffff);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() * 2 - 1) * 8;
      positions[i * 3 + 1] = (rnd() * 2 - 1) * TOP;
      positions[i * 3 + 2] = -5 + rnd() * 7;
      const pick = rnd();
      c.copy(pick < 0.6 ? aqua : pick < 0.85 ? white : lime);
      colors.set([c.r, c.g, c.b], i * 3);
      speeds[i] = 0.05 + rnd() * 0.18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.07,
      map: new THREE.CanvasTexture(softDotCanvas()),
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material, speeds };
  }, [count]);

  useFrame((_, dt) => {
    material.opacity = frame.mist;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * dt;
      if (y > TOP) y = -TOP;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}
