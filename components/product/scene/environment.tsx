"use client";

import { useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { PALETTE } from "./palette";

/**
 * Studio reflections tinted with the brand light: warm top, aqua and lime
 * strips. Built from plain planes (no HDR download) and prefiltered once.
 *
 * It is handed to materials as an explicit `envMap` — since three r163 a
 * material's `envMapIntensity` only applies to its own `envMap`, not to
 * `scene.environment`, and the ice/drops/pack rely on different intensities.
 */
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x0a1111);

  const strip = (w: number, h: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, k: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }),
    );
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };

  strip(14, 3.5, 0, 8, 2, PALETTE.warm, 3);
  strip(6, 2, 0, 5, 8, 0xffffff, 2.5);
  strip(2.5, 12, -9, 1, 2, PALETTE.aqua, 5);
  strip(1.6, 9, 9, 0, 2, PALETTE.lime, 3.5);
  strip(9, 5, 0, 1, -9, 0xffffff, 1.6);
  strip(10, 3, 0, -6, 4, PALETTE.aqua, 1.4);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(env, 0.035).texture;
  pmrem.dispose();
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return texture;
}

const EnvMapContext = createContext<THREE.Texture | null>(null);

/** Provides the studio environment to the scene and sets it as `scene.environment`. */
export function StudioEnvironment({ children }: { children: ReactNode }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const envMap = useMemo(() => createStudioEnvironment(gl), [gl]);

  useEffect(() => {
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
    };
  }, [scene, envMap]);

  return <EnvMapContext.Provider value={envMap}>{children}</EnvMapContext.Provider>;
}

/** The studio environment texture, for materials that need their own `envMapIntensity`. */
export function useEnvMap(): THREE.Texture {
  const envMap = useContext(EnvMapContext);
  if (!envMap) throw new Error("useEnvMap must be used inside <StudioEnvironment>");
  return envMap;
}
