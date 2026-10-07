"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { SCENE } from "@/lib/constants";
import { createSceneFrame, type ScrollState } from "./sceneState";
import { Coconuts } from "./scene/Coconuts";
import { StudioEnvironment } from "./scene/environment";
import { ContactShadow } from "./scene/ContactShadow";
import { IceCubes } from "./scene/IceCubes";
import { Lighting } from "./scene/Lighting";
import { Mist } from "./scene/Mist";
import { Pack } from "./scene/Pack";
import { SceneRig } from "./scene/SceneRig";

export interface ProductSceneProps {
  scroll: ScrollState;
  /** URL of the pack artwork (WebP with alpha). */
  packSrc: string;
  isDesktop: boolean;
  /** Pause rendering while the section is off-screen. */
  active: boolean;
  /** Freeze idle motion (reduced motion). */
  still: boolean;
  /** Called once everything (textures included) is on the GPU. */
  onReady?: () => void;
}

/** Fires after the Suspense boundary above it resolved, i.e. the pack texture loaded. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/**
 * The only WebGL entry point. Loaded with next/dynamic (ssr: false) so three.js
 * never ships in the initial bundle. Mobile gets a lighter scene: fewer drops,
 * ice cubes and mist motes, and no transmission passes.
 */
export default function ProductScene({ scroll, packSrc, isDesktop, active, still, onReady }: ProductSceneProps) {
  const budget = isDesktop ? SCENE.desktop : SCENE.mobile;
  const frame = useMemo(() => createSceneFrame(), []);
  const [dpr, setDpr] = useState<number>(budget.dpr);
  const [lowPower, setLowPower] = useState(false);

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: SCENE.fov, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setLowPower(true);
        }}
        onIncline={() => setDpr(budget.dpr)}
      />
      <SceneRig frame={frame} scroll={scroll} still={still} />
      <Suspense fallback={null}>
        <StudioEnvironment>
          <Lighting frame={frame} />
          <Pack
            frame={frame}
            src={packSrc}
            dropCount={budget.drops}
            lite={!isDesktop}
            slideDrops={!still && !lowPower}
          />
          <IceCubes frame={frame} count={budget.ice} lite={!isDesktop} />
          <Coconuts frame={frame} />
          <Mist frame={frame} count={budget.mist} />
          <ContactShadow frame={frame} />
          <ReadySignal onReady={onReady} />
        </StudioEnvironment>
      </Suspense>
    </Canvas>
  );
}
