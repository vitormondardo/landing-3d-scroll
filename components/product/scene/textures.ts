import { PI_2, mulberry32, smoothstep } from "@/lib/math";

/** Procedural canvases used as normal/roughness/color maps. Client-only. */

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return [c, ctx];
}

/**
 * Condensation: a normal map of droplets plus a matching roughness map
 * (wet = glossy). Big drops sometimes leave a short trail.
 */
export function makeCondensation(
  w: number,
  h: number,
  count: number,
  seed: number,
  baseRough = 150,
): { normal: HTMLCanvasElement; rough: HTMLCanvasElement } {
  const rnd = mulberry32(seed);
  const S = 64;
  const [sprite, sctx] = canvas(S, S);
  const img = sctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x + 0.5 - S / 2) / (S / 2);
      const dy = (y + 0.5 - S / 2) / (S / 2);
      const d2 = dx * dx + dy * dy;
      const o = (y * S + x) * 4;
      if (d2 >= 1) {
        img.data[o + 3] = 0;
        continue;
      }
      const nz = Math.sqrt(1 - d2);
      img.data[o] = (dx * 0.85 * 0.5 + 0.5) * 255;
      img.data[o + 1] = (-dy * 0.85 * 0.5 + 0.5) * 255;
      img.data[o + 2] = nz * 255;
      img.data[o + 3] = 255 * smoothstep(1, 0.82, Math.sqrt(d2));
    }
  }
  sctx.putImageData(img, 0, 0);

  const [normal, n] = canvas(w, h);
  n.fillStyle = "rgb(128,128,255)";
  n.fillRect(0, 0, w, h);
  const [rough, r] = canvas(w, h);
  r.fillStyle = `rgb(${baseRough},${baseRough},${baseRough})`;
  r.fillRect(0, 0, w, h);
  r.fillStyle = "rgb(18,18,18)";

  for (let i = 0; i < count; i++) {
    const big = rnd() < 0.1;
    const rad = big ? 4 + rnd() * 8 : 0.8 + rnd() * 2.6;
    const x = rnd() * w;
    const y = rnd() * h;
    n.drawImage(sprite, x - rad, y - rad * 1.15, rad * 2, rad * 2.3);
    r.beginPath();
    r.ellipse(x, y, rad * 0.9, rad * 1.05, 0, 0, PI_2);
    r.fill();
    if (big && rnd() < 0.35) {
      const len = 20 + rnd() * 60;
      n.globalAlpha = 0.5;
      n.drawImage(sprite, x - rad * 0.35, y, rad * 0.7, len);
      n.globalAlpha = 1;
      r.fillRect(x - rad * 0.3, y, rad * 0.6, len);
    }
  }
  return { normal, rough };
}

export function coconutShellCanvas(): HTMLCanvasElement {
  const [c, g] = canvas(512, 256);
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#8cc443");
  grad.addColorStop(0.45, "#5f9e2f");
  grad.addColorStop(1, "#3a6b1d");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 256);
  const rnd = mulberry32(11);
  for (let i = 0; i < 46; i++) {
    g.fillStyle = `rgba(30,60,15,${0.04 + rnd() * 0.06})`;
    g.fillRect(rnd() * 512, 0, 2 + rnd() * 6, 256);
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = rnd() < 0.5 ? `rgba(220,240,160,${rnd() * 0.12})` : `rgba(20,40,10,${rnd() * 0.14})`;
    g.fillRect(rnd() * 512, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  return c;
}

export function coconutFaceCanvas(): HTMLCanvasElement {
  const [c, g] = canvas(512, 512);
  const ring = (radius: number, color: string) => {
    g.beginPath();
    g.arc(256, 256, radius, 0, PI_2);
    g.fillStyle = color;
    g.fill();
  };
  ring(256, "#4d8a24");
  ring(243, "#9cbf63");
  ring(236, "#d9caa0");
  const flesh = g.createRadialGradient(256, 256, 120, 256, 256, 226);
  flesh.addColorStop(0, "#fbf8ef");
  flesh.addColorStop(1, "#efe6cf");
  g.beginPath();
  g.arc(256, 256, 226, 0, PI_2);
  g.fillStyle = flesh;
  g.fill();
  const rnd = mulberry32(5);
  for (let i = 0; i < 900; i++) {
    const a = rnd() * PI_2;
    const rr = 140 + rnd() * 90;
    g.fillStyle = `rgba(190,170,120,${rnd() * 0.12})`;
    g.fillRect(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr, 1.5, 1.5);
  }
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.arc(256, 256, 134, 0, PI_2);
  g.fill();
  return c;
}

/** Internal cracks and frost streaks used as the ice roughness map. */
export function frostCanvas(): HTMLCanvasElement {
  const [c, g] = canvas(256, 256);
  g.fillStyle = "rgb(40,40,40)";
  g.fillRect(0, 0, 256, 256);
  const rnd = mulberry32(21);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(200,200,200,${0.15 + rnd() * 0.35})`;
    g.lineWidth = 0.5 + rnd() * 1.5;
    g.beginPath();
    let x = rnd() * 256;
    let y = rnd() * 256;
    g.moveTo(x, y);
    for (let k = 0; k < 5; k++) {
      x += (rnd() - 0.5) * 60;
      y += (rnd() - 0.5) * 60;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  for (let i = 0; i < 1500; i++) {
    g.fillStyle = `rgba(255,255,255,${rnd() * 0.15})`;
    g.fillRect(rnd() * 256, rnd() * 256, 1, 1);
  }
  return c;
}

export function softDotCanvas(): HTMLCanvasElement {
  const [c, g] = canvas(64, 64);
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.35, "rgba(255,255,255,0.45)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export function shadowCanvas(): HTMLCanvasElement {
  const [c, g] = canvas(128, 128);
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(0,0,0,0.55)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return c;
}
