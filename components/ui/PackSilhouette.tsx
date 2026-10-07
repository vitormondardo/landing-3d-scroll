interface PackSilhouetteProps {
  /** Pack artwork URL; only its alpha shape is used. */
  src: string;
  /** Fill color of the silhouette. */
  color: string;
  className?: string;
  opacity?: number;
}

/**
 * The pack's outline filled with a flat color, via CSS masking. Stands in for
 * flavors whose packaging artwork doesn't exist yet and works as a large
 * decorative shape without loading another image.
 */
export function PackSilhouette({ src, color, className = "", opacity = 1 }: PackSilhouetteProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: color,
        opacity,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
