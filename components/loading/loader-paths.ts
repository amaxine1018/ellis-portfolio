import { HEADER_SHAPE } from "@/components/brand/header-shape";

/**
 * Geometry for the loading sequence, in Figma "Loading State" frame space
 * (1280×832, page 160:622). Animated paths share one command structure per
 * shape so Motion can interpolate `d` number-for-number.
 */
export const LOADER_FRAME = { width: 1280, height: 832 } as const;

type Pt = readonly [number, number];

/** Ball of yarn = logo (Union 160:703) at this box, wrapped by the strands below. */
export const BALL = { left: 591, top: 214, size: 150 } as const;
export const BALL_CENTER: Pt = [BALL.left + BALL.size / 2, BALL.top + BALL.size / 2];

/** Logo landing spot in frames 3–4 (160:666 / 160:632). */
export const PERCH_CENTER: Pt = [82 + 75, 168 + 75];

export interface Strand {
  d: string;
  transform: string;
  /** Drawn beneath the logo (Vector 8 sits under the Union in Figma). */
  behind?: boolean;
}

/** Frame 1 scribble strokes, outermost loop first (unwind order). */
export const STRANDS: Strand[] = [
  {
    // Vector 12
    d: "M1.69262 107.999C1.69262 107.999 38.8818 99.4507 54.2362 70.9803C69.5905 42.5099 56.8443 2.26008 56.8443 2.26008",
    transform:
      "translate(657.601 267.148) rotate(105.2) scale(1 -1) translate(-31.753 -55.133)",
  },
  {
    // Vector 10
    d: "M3.97052 104.983C3.97052 104.983 32.9212 86.9693 39.8689 61.3963C46.8167 35.8233 37.3801 2.01321 37.3801 2.01321",
    transform:
      "translate(666.745 250.841) rotate(105.2) scale(1 -1) translate(-23.198 -53.503)",
  },
  {
    // Vector 8
    d: "M74.2224 119.386C74.2224 119.386 21.2222 106.386 11.7223 72.3855C2.22233 38.3855 11.7224 1.8855 11.7224 1.8855",
    transform: "translate(630.28 226.62)",
    behind: true,
  },
  {
    // Vector 9
    d: "M2.43834 115.954C2.43834 115.954 39.969 103.066 55.9383 84.9536C71.9076 66.8411 63.4383 0.953572 63.4383 0.953572",
    transform: "translate(615.56 222.55)",
  },
];

export const STRAND_WIDTH = 15;

/** 13 points: M p0, then four cubics (right edge → left edge). */
type Wave = readonly Pt[];

/** Frame 1 flat line (Vector 11) with its dip under the ball. */
const WAVE_FLAT: Wave = [
  [1284, 287.99],
  [1100.8, 287.94], [917.6, 287.89], [734.48, 287.84],
  [734.48, 287.84], [694.85, 315.34], [666.02, 315.46],
  [637.2, 315.57], [596.98, 288.05], [596.98, 288.05],
  [396.3, 288.03], [195.6, 288.01], [-5, 287.99],
];

/** The ball's weight pulling the line down as the first strands loosen. */
const WAVE_SAG: Wave = [
  [1284, 288],
  [1100, 289], [917, 291], [740, 293],
  [720, 294], [700, 338], [666, 338],
  [632, 338], [612, 294], [592, 293],
  [396, 291], [195, 289], [-5, 288],
];

/** Frame 2 wave (160:682), the strand still looped around the ball. */
const WAVE_LOOSE: Wave = [
  [1284, 141.99],
  [1262.03, 141.99], [548.53, 152.49], [612.53, 293.49],
  [711.03, 303.99], [762.03, 259.99], [711.03, 338.49],
  [660.03, 416.99], [347.53, 178.49], [186.03, 202.49],
  [26.98, 226.13], [-5, 321.99], [-5, 321.99],
];

/** Frame 3 wave (160:665); its first cubic is split in half to match point count. */
const WAVE_FREE: Wave = [
  [1284, 486.99],
  [1283.05, 486.99], [1165.55, 419.37], [1023.74, 351.74],
  [881.93, 284.12], [715.8, 216.49], [618.55, 216.49],
  [424.05, 216.49], [354.55, 350.49], [222.05, 398.99],
  [71.05, 454.26], [-5, 321.99], [-5, 321.99],
];

/** Recoil overshoot of frame 3 right after the logo lets go. */
const WAVE_RECOIL: Wave = [
  [1284, 490],
  [1283, 490], [1165, 422], [1023, 350],
  [881, 278], [716, 198], [618.5, 198],
  [424, 198], [354, 362], [222, 414],
  [71, 470], [-5, 325], [-5, 325],
];

export const WAVES = {
  flat: WAVE_FLAT,
  sag: WAVE_SAG,
  loose: WAVE_LOOSE,
  free: WAVE_FREE,
  recoil: WAVE_RECOIL,
} as const;

export interface Stage {
  width: number;
  height: number;
  sx: number;
  sy: number;
}

const n = (v: number) => Math.round(v * 100) / 100;

/** Wave points this close to the ball wrap it, so they scale with the ball. */
const BALL_REACH = 120;

/**
 * `anchor` keeps points around the ball at ball scale, so the dip and loop
 * hug it when the viewport's aspect differs from the Figma frame.
 */
export function wavePath(
  wave: Wave,
  { sx, sy }: Stage,
  anchor?: { x: number; unit: number },
) {
  const mapX = (x: number) =>
    anchor && Math.abs(x - BALL_CENTER[0]) < BALL_REACH
      ? anchor.x + (x - BALL_CENTER[0]) * anchor.unit
      : x * sx;
  const p = wave.map(([x, y]) => `${n(mapX(x))} ${n(y * sy)}`);
  return `M${p[0]} C${p[1]} ${p[2]} ${p[3]} C${p[4]} ${p[5]} ${p[6]} C${p[7]} ${p[8]} ${p[9]} C${p[10]} ${p[11]} ${p[12]}`;
}

/**
 * Purple fill: M a C b c d L e L f L g C h i j C k l a Z.
 * Bottom edge follows the wave; top edge is the viewport top.
 */
interface Fill {
  a: Pt; b: Pt; c: Pt; d: Pt; e: Pt; f: Pt; g: Pt;
  h: Pt; i: Pt; j: Pt; k: Pt; l: Pt;
}

function fillPath(f: Fill) {
  const p = (pt: Pt) => `${n(pt[0])} ${n(pt[1])}`;
  return `M${p(f.a)} C${p(f.b)} ${p(f.c)} ${p(f.d)} L${p(f.e)} L${p(f.f)} L${p(f.g)} C${p(f.h)} ${p(f.i)} ${p(f.j)} C${p(f.k)} ${p(f.l)} ${p(f.a)} Z`;
}

/** Frame 4 purple (160:631), optionally collapsed toward the top edge. */
export function flowPath({ width, sx, sy }: Stage, reach = 1) {
  const s = (x: number, y: number): Pt => [x * sx, y * sy * reach];
  return fillPath({
    a: s(226, 434),
    b: s(93.5, 482.5),
    c: s(0, 366),
    d: s(0, 366),
    e: [0, 0],
    f: [width, 0],
    g: [width, 487 * sy * reach],
    h: [width, 487 * sy * reach],
    i: s(813, 216.5),
    j: s(618.5, 216.5),
    k: s(424, 216.5),
    l: s(358.5, 385.5),
  });
}

/**
 * Frame 5: the header's lobe + band as one outline, at the same scale and
 * offset the live `HeaderShape` renders at.
 */
export function headerPath(width: number, scale: number, top: number) {
  const s = (x: number, y: number): Pt => [x * scale, y * scale + top];
  const band = HEADER_SHAPE.bandHeight;
  const lobe = HEADER_SHAPE.lobeWidth;
  return fillPath({
    a: s(154.5, 171.5),
    b: s(80.5, 203.163),
    c: s(0, 159),
    d: s(0, 80.5),
    e: s(0, 0),
    f: [width, top],
    g: [width, band * scale + top],
    h: [width, band * scale + top],
    i: s(lobe, band),
    j: s(lobe, band),
    k: s(185.5, band),
    l: s(228.5, 139.837),
  });
}
