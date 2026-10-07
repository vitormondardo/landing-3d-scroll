import Image from "next/image";
import { PACK } from "@/lib/constants";

/**
 * Static stand-in for the 3D pack: shown before the canvas loads, and kept
 * permanently without WebGL or with reduced motion. Sits where the pack rests
 * in the first chapter (right on desktop, upper-center on mobile).
 */
export function ProductPoster({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 grid place-items-start justify-items-center pt-[14svh] transition-opacity duration-700 md:place-items-center md:justify-items-end md:pt-0 md:pr-[14vw] ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src={PACK.texture}
        alt=""
        width={PACK.width}
        height={PACK.height}
        sizes="(min-width: 768px) 24vw, 40vw"
        className="h-[34svh] w-auto -rotate-6 drop-shadow-[0_30px_50px_rgb(0_0_0/0.6)] md:h-[64svh]"
      />
    </div>
  );
}
