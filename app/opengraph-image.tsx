import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/content/product";
import { BRAND_NAME, LOGO } from "@/lib/constants";

export const alt = `${BRAND_NAME} — gelo de coco saborizado para drinks`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", LOGO.dark));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const logoHeight = 150;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f8f5ec",
          color: "#123c35",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
            {`${BRAND_NAME} · ${hero.eyebrow}`}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only supports <img> */}
          <img
            src={logoSrc}
            alt=""
            height={logoHeight}
            width={Math.round((logoHeight * LOGO.width) / LOGO.height)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 0.95, letterSpacing: -3, fontWeight: 800 }}>
          <span>{hero.titleStart}</span>
          <span style={{ color: "#17665c" }}>{hero.titleEmphasis}</span>
          <span>{hero.titleEnd}</span>
        </div>
      </div>
    ),
    size,
  );
}
