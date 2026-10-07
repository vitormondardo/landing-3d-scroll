"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PACK, SCENE } from "@/lib/constants";
import { mulberry32, smoothstep } from "@/lib/math";
import type { SceneFrame } from "../sceneState";
import { useEnvMap } from "./environment";
import { PALETTE } from "./palette";
import { makeCondensation } from "./textures";

const PACK_ASPECT = PACK.width / PACK.height;
export const PACK_H = SCENE.packHeight;
export const PACK_W = PACK_H * PACK_ASPECT;
/** Half the thickness of the filled pack, at its belly. */
const HALF_T = 0.2;
const SIDE_SEGMENTS: [number, number] = [48, 160];

const lump = (u: number, v: number, s: number) =>
  0.01 * Math.sin(u * 7 + v * 4 + s) + 0.008 * Math.sin(u * 13 - v * 9 + s * 2.1) + 0.006 * Math.sin(v * 21 + u * 5 + s * 0.7);

/** Height of the pillow surface above the pack plane at (x, y). */
function surfaceZ(x: number, y: number, sign: 1 | -1): number {
  const u = x / (PACK_W / 2);
  const v = y / (PACK_H / 2);
  const seed = sign > 0 ? 1.3 : 4.7;
  const side = Math.pow(Math.max(0, 1 - u * u), 0.6);
  const ends = smoothstep(0, 0.2, 1 - Math.abs(v));
  const belly = 0.78 + 0.22 * Math.cos(v * Math.PI * 0.5);
  const body = side * ends * belly;
  return sign * (HALF_T * body + lump(u, v, seed) * Math.min(1, body * 3));
}

function createSide(sign: 1 | -1): THREE.PlaneGeometry {
  const g = new THREE.PlaneGeometry(PACK_W, PACK_H, ...SIDE_SEGMENTS);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, surfaceZ(p.getX(i), p.getY(i), sign));
  g.computeVertexNormals();
  return g;
}

interface Drop {
  x: number;
  y: number;
  sign: 1 | -1;
  r: number;
  slide: boolean;
  speed: number;
}

/** Reads the texture's alpha so drops only land on the pack, never on the empty margin. */
function createAlphaLookup(image: CanvasImageSource & { width: number; height: number }) {
  const c = document.createElement("canvas");
  c.width = image.width;
  c.height = image.height;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  return (u: number, v: number) => {
    const x = Math.min(c.width - 1, Math.floor(u * c.width));
    const y = Math.min(c.height - 1, Math.floor((1 - v) * c.height));
    return data[(y * c.width + x) * 4 + 3];
  };
}

function createDrops(count: number, alphaAt: (u: number, v: number) => number): Drop[] {
  const rnd = mulberry32(7);
  const drops: Drop[] = [];
  for (let guard = 0; drops.length < count && guard < 40000; guard++) {
    const u = 0.05 + rnd() * 0.9;
    const v = 0.1 + rnd() * 0.8;
    if (alphaAt(u, v) < 220) continue;
    const big = rnd() < 0.13;
    drops.push({
      x: (u - 0.5) * PACK_W,
      y: (v - 0.5) * PACK_H,
      sign: drops.length < count * 0.72 ? 1 : -1,
      r: big ? 0.032 + rnd() * 0.03 : 0.009 + rnd() * 0.017,
      slide: big && rnd() < 0.55,
      speed: 0.035 + rnd() * 0.07,
    });
  }
  return drops;
}

interface PackProps {
  frame: SceneFrame;
  src: string;
  dropCount: number;
  /** Cheaper drops (no transmission) for weak GPUs. */
  lite: boolean;
  /** Let the big drops run down the plastic. */
  slideDrops: boolean;
}

/** The product: a pillow-shaped pack textured with the real artwork, wet with condensation. */
export function Pack({ frame, src, dropCount, lite, slideDrops }: PackProps) {
  const envMap = useEnvMap();
  const group = useRef<THREE.Group>(null);
  const drops = useRef<THREE.InstancedMesh>(null);
  const texture = useTexture(src, (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }) as THREE.Texture;

  const { front, back, frontMat, backMat, dropMat, dropGeo, dropData, positions } = useMemo(() => {
    const image = texture.image as CanvasImageSource & { width: number; height: number };
    const alphaAt = createAlphaLookup(image);
    const condensation = makeCondensation(512, Math.round(512 / PACK_ASPECT), 2600, 3);
    const normal = new THREE.CanvasTexture(condensation.normal);
    const rough = new THREE.CanvasTexture(condensation.rough);
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: rough,
      roughness: 0.8,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      sheen: 0.45,
      sheenColor: new THREE.Color(PALETTE.aqua),
      sheenRoughness: 0.45,
      envMap,
      envMapIntensity: 1,
      alphaTest: 0.5,
      side: THREE.FrontSide,
    });
    const backMat = frontMat.clone();
    backMat.side = THREE.BackSide;
    backMat.color = new THREE.Color(0xd8e4e2);

    const dropMat = lite
      ? new THREE.MeshPhysicalMaterial({
          color: 0xe8fffb,
          roughness: 0.05,
          transparent: true,
          opacity: 0.45,
          clearcoat: 1,
          clearcoatRoughness: 0.02,
          envMap,
          envMapIntensity: 2.2,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.03,
          transmission: 1,
          thickness: 0.35,
          ior: 1.33,
          clearcoat: 1,
          clearcoatRoughness: 0.02,
          envMap,
          envMapIntensity: 1.8,
          attenuationColor: new THREE.Color(PALETTE.aqua),
          attenuationDistance: 2.5,
        });

    const dropData = createDrops(dropCount, alphaAt);
    return {
      front: createSide(1),
      back: createSide(-1),
      frontMat,
      backMat,
      dropMat,
      dropGeo: new THREE.SphereGeometry(1, 20, 14),
      dropData,
      positions: dropData.map((d) => d.y),
    };
  }, [texture, dropCount, lite, envMap]);

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      p: new THREE.Vector3(),
      s: new THREE.Vector3(),
    }),
    [],
  );

  const placeDrop = (mesh: THREE.InstancedMesh, i: number) => {
    const d = dropData[i];
    const y = positions[i];
    tmp.p.set(d.x, y, surfaceZ(d.x, y, d.sign) + d.sign * d.r * 0.2);
    tmp.s.set(d.r, d.r * 1.2, d.r * 0.5);
    tmp.m.compose(tmp.p, tmp.q, tmp.s);
    mesh.setMatrixAt(i, tmp.m);
  };

  useLayoutEffect(() => {
    const mesh = drops.current;
    if (!mesh) return;
    for (let i = 0; i < dropData.length; i++) placeDrop(mesh, i);
    mesh.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- placeDrop only reads memoized data
  }, [dropData]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const { px, py, s, rx, ry, rz, t, narrow } = frame;
    const bob = Math.sin(t * 1.2) * 0.07;
    g.position.set(px, py + bob, 0);
    g.scale.setScalar(narrow ? s * 0.92 : s);
    g.rotation.set(rx + frame.my * 0.2, ry + frame.mx * 0.4 + Math.sin(t * 0.6) * 0.05, rz + Math.sin(t * 0.8) * 0.015);

    const mesh = drops.current;
    if (!slideDrops || !mesh) return;
    let moved = false;
    for (let i = 0; i < dropData.length; i++) {
      const d = dropData[i];
      if (!d.slide) continue;
      positions[i] -= d.speed * dt;
      if (positions[i] < -PACK_H * 0.38) positions[i] = PACK_H * (0.05 + Math.random() * 0.3);
      placeDrop(mesh, i);
      moved = true;
    }
    if (moved) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh geometry={front} material={frontMat} />
      <mesh geometry={back} material={backMat} />
      <instancedMesh ref={drops} args={[dropGeo, dropMat, dropData.length]} />
    </group>
  );
}
