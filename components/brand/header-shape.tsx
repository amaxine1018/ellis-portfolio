/** Purple "Top" shape on the 1512px landing frame (Figma 37:14 / 160:658). */
export const HEADER_SHAPE = {
  frameWidth: 1512,
  lobeWidth: 276,
  height: 181.831,
  bandLeft: 275,
  bandHeight: 47.5,
  lobePath:
    "M154.5 171.5C80.5 203.163 0 159 0 80.5V0H276V47.5C185.5 47.5 228.5 139.837 154.5 171.5Z",
} as const;

/** Matches the `min(Npx, calc(100cqw * N / 1512))` sizing used in the header. */
export function headerShapeScale(containerWidth: number) {
  return Math.min(1, containerWidth / HEADER_SHAPE.frameWidth);
}

const fluid = (px: number) =>
  `min(${px}px, calc(100cqw * ${px} / ${HEADER_SHAPE.frameWidth}))`;

/**
 * Curved lobe keeps its aspect ratio; the flat right band stretches to the
 * container. Must sit inside an element with `container-type: inline-size`.
 */
export function HeaderShape() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0"
      style={{ height: fluid(HEADER_SHAPE.height) }}
    >
      <svg
        className="absolute top-0 left-0 h-full"
        style={{ width: fluid(HEADER_SHAPE.lobeWidth) }}
        viewBox={`0 0 ${HEADER_SHAPE.lobeWidth} ${HEADER_SHAPE.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        aria-hidden
      >
        <path d={HEADER_SHAPE.lobePath} fill="var(--purple-50)" />
      </svg>
      <svg
        className="absolute top-0"
        style={{
          left: fluid(HEADER_SHAPE.bandLeft),
          width: `calc(100% - ${fluid(HEADER_SHAPE.bandLeft)})`,
          height: fluid(HEADER_SHAPE.bandHeight),
        }}
        viewBox={`0 0 100 ${HEADER_SHAPE.bandHeight}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect
          width="100"
          height={HEADER_SHAPE.bandHeight}
          fill="var(--purple-50)"
        />
      </svg>
    </div>
  );
}
