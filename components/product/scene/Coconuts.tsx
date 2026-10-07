"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PI_2 } from "@/lib/math";
import type { SceneFrame } from "../sceneState";
import { useEnvMap } from "./environment";
import { coconutFaceCanvas, coconutShellCanvas, makeCondensation } from "./textures";

const R = 0.6;
const HALF_PI = Math.PI / 2;

/** A whole coconut and an open half that rise in on the "sabor" chapter. */
export function Coconuts({ frame }: { frame: SceneFrame }) {
  const envMap = useEnvMap();
  const root = useRef<THREE.Group>(null);
  const whole = useRef<THREE.Group>(null);
  const half = useRef<THREE.Group>(null);

  const m = useMemo(() => {
    const shell = new THREE.CanvasTexture(coconutShellCanvas());
    shell.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.CanvasTexture(coconutFaceCanvas());
    face.colorSpace = THREE.SRGBColorSpace;
    const cond = makeCondensation(512, 256, 500, 17, 120);
    return {
      shell: new THREE.MeshPhysicalMaterial({
        map: shell,
        roughness: 0.55,
        roughnessMap: new THREE.CanvasTexture(cond.rough),
        normalMap: new THREE.CanvasTexture(cond.normal),
        normalScale: new THREE.Vector2(0.6, 0.6),
        clearcoat: 0.7,
        clearcoatRoughness: 0.2,
        envMap,
        envMapIntensity: 0.9,
      }),
      face: new THREE.MeshStandardMaterial({ map: face, roughness: 0.55, alphaTest: 0.5, side: THREE.DoubleSide }),
      flesh: new THREE.MeshStandardMaterial({ color: 0xf6f1e4, roughness: 0.5, side: THREE.BackSide }),
      water: new THREE.MeshPhysicalMaterial({
        color: 0xe6f6f2,
        roughness: 0.04,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1,
        envMap,
        envMapIntensity: 1.5,
      }),
      calyx: new THREE.MeshStandardMaterial({ color: 0x8a7d3e, roughness: 0.8 }),
      stem: new THREE.MeshStandardMaterial({ color: 0x5f7a2a, roughness: 0.7 }),
    };
  }, [envMap]);

  useFrame(() => {
    const g = root.current;
    const w = whole.current;
    const h = half.current;
    if (!g || !w || !h) return;
    const { coco, px, py, s, halfH, narrow, t, mx, my } = frame;
    g.visible = coco > 0.01;
    if (!g.visible) return;
    const rise = (1 - coco) * -halfH * 1.6;
    const scale = (narrow ? 0.7 : 0.85) * (0.6 + coco * 0.4);
    const dir = narrow ? 1 : -1; // on desktop the pack is on the right, coconuts gather at its left
    w.position.set(px + 1.0 * s, py - 1.0 + rise, -0.7);
    w.scale.setScalar(scale);
    w.rotation.set(0.25, t * 0.15 + 0.6, -0.2);
    h.position.set(px + dir * 1.05 * s, py - 1.25 + rise * 1.2, 0.75);
    h.scale.setScalar(scale);
    h.rotation.set(0.95 + my * 0.1, 0.3 + mx * 0.2, 0.25 * dir);
  });

  return (
    <group ref={root} visible={false}>
      <group ref={whole}>
        <mesh material={m.shell} scale={[1, 1.1, 1]}>
          <sphereGeometry args={[R, 64, 48]} />
        </mesh>
        <mesh material={m.calyx} position={[0, R * 1.08, 0]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.13, 24, 12]} />
        </mesh>
        <mesh material={m.stem} position={[0.02, R * 1.1 + 0.12, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.028, 0.05, 0.26, 12]} />
        </mesh>
      </group>
      <group ref={half}>
        <mesh material={m.shell}>
          <sphereGeometry args={[R, 64, 32, 0, PI_2, HALF_PI, HALF_PI]} />
        </mesh>
        <mesh material={m.face} rotation={[-HALF_PI, 0, 0]}>
          <circleGeometry args={[R, 72]} />
        </mesh>
        <mesh material={m.flesh}>
          <sphereGeometry args={[R * 0.53, 48, 24, 0, PI_2, HALF_PI, HALF_PI]} />
        </mesh>
        <mesh material={m.water} position={[0, -0.07, 0]} rotation={[-HALF_PI, 0, 0]}>
          <circleGeometry args={[R * 0.5, 48]} />
        </mesh>
      </group>
    </group>
  );
}
