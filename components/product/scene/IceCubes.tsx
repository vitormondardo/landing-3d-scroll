"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { PI_2, mulberry32 } from "@/lib/math";
import type { SceneFrame } from "../sceneState";
import { useEnvMap } from "./environment";
import { PALETTE } from "./palette";
import { frostCanvas, makeCondensation } from "./textures";

/** Orbit is flattened on wide screens so cubes never drift over the copy. */
const DESKTOP_X_SQUEEZE = 0.78;

interface IceConfig {
  angle: number;
  height: number;
  radiusJitter: number;
  size: number;
  squash: THREE.Vector3;
  rotation: THREE.Euler;
  spin: THREE.Vector3;
}

function createConfigs(count: number): IceConfig[] {
  const rnd = mulberry32(13);
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * PI_2 + rnd() * 0.4,
    height: rnd() * 2 - 1,
    radiusJitter: rnd() * 0.5,
    size: 0.34 + rnd() * 0.26,
    squash: new THREE.Vector3(1, 0.86 + rnd() * 0.14, 0.92 + rnd() * 0.12),
    rotation: new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI),
    spin: new THREE.Vector3((rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.3),
  }));
}

interface IceCubesProps {
  frame: SceneFrame;
  count: number;
  /** Cheaper ice (no transmission) for weak GPUs. */
  lite: boolean;
}

/** Translucent ice cubes orbiting the pack; they spread out on the "gelo" chapter. */
export function IceCubes({ frame, count, lite }: IceCubesProps) {
  const envMap = useEnvMap();
  const { configs, geometry, material, coreMaterial } = useMemo(() => {
    const condensation = makeCondensation(256, 256, 260, 9, 60);
    const material = lite
      ? new THREE.MeshPhysicalMaterial({
          color: 0xd9f7f4,
          roughness: 0.2,
          transparent: true,
          opacity: 0.55,
          roughnessMap: new THREE.CanvasTexture(frostCanvas()),
          normalMap: new THREE.CanvasTexture(condensation.normal),
          normalScale: new THREE.Vector2(0.6, 0.6),
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMap,
          envMapIntensity: 2.4,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0.28,
          roughnessMap: new THREE.CanvasTexture(frostCanvas()),
          transmission: 1,
          thickness: 0.7,
          ior: 1.31,
          specularIntensity: 1,
          attenuationColor: new THREE.Color(PALETTE.aqua),
          attenuationDistance: 2.6,
          normalMap: new THREE.CanvasTexture(condensation.normal),
          normalScale: new THREE.Vector2(0.6, 0.6),
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMap,
          envMapIntensity: 2.2,
        });
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(PALETTE.aqua).lerp(new THREE.Color(0xffffff), 0.5),
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return {
      configs: createConfigs(count),
      geometry: new RoundedBoxGeometry(1, 1, 1, 4, 0.13),
      material,
      coreMaterial,
    };
  }, [count, lite, envMap]);

  return (
    <>
      {configs.map((config, i) => (
        <IceCube key={i} config={config} frame={frame} geometry={geometry} material={material} coreMaterial={coreMaterial} />
      ))}
    </>
  );
}

interface IceCubeProps {
  config: IceConfig;
  frame: SceneFrame;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  coreMaterial: THREE.Material;
}

function IceCube({ config, frame, geometry, material, coreMaterial }: IceCubeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const rotation = useRef(config.rotation.clone());

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const { t, px, py, s, ice, spread, front, narrow } = frame;
    const ang = config.angle + t * 0.1;
    const radius = (1.25 + spread * 1.5 + config.radiusJitter) * s * (narrow ? 0.75 : 1);
    let z = Math.sin(ang) * radius * 0.85;
    if (z > 0) z *= front;
    z -= 0.2;
    m.position.set(
      px + Math.cos(ang) * radius * (narrow ? 1 : DESKTOP_X_SQUEEZE),
      py + config.height * (1.1 + spread * 0.7) * s + Math.sin(t * 0.9 + config.angle) * 0.08,
      z,
    );
    const r = rotation.current;
    r.x += config.spin.x * dt;
    r.y += config.spin.y * dt;
    r.z += config.spin.z * dt;
    m.rotation.copy(r);
    const size = config.size * ice * (narrow ? 0.85 : 1);
    m.scale.copy(config.squash).multiplyScalar(size);
    m.visible = size > 0.02;
  });

  return (
    <mesh ref={mesh} geometry={geometry} material={material}>
      <mesh geometry={geometry} material={coreMaterial} scale={0.58} />
    </mesh>
  );
}
