"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { smoothstep } from "@/lib/math";
import type { SceneFrame } from "../sceneState";
import { PACK_H } from "./Pack";
import { shadowCanvas } from "./textures";

/** Soft floor shadow under the pack. Only visible on the pale "sabor" chapter. */
export function ContactShadow({ frame }: { frame: SceneFrame }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas()),
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { px, py, s, coco } = frame;
    m.position.set(px, py - (PACK_H / 2) * s - 0.5, 0);
    m.scale.setScalar(s);
    material.opacity = smoothstep(0.4, 1, coco);
  });

  return (
    <mesh ref={mesh} material={material} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.8, 1.1]} />
    </mesh>
  );
}
