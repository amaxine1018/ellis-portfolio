"use client";

import {
  AnimatePresence,
  animate,
  motion,
  motionValue,
  type AnimationSequence,
  type Variants,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { headerShapeScale } from "@/components/brand/header-shape";
import { LOGO_SLOT, LogoMark } from "@/components/brand/logo-mark";
import {
  LOADER_FRAME,
  headerPath,
  type Stage,
} from "@/components/loading/loader-paths";

const EASE: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

/** Logo size in the Figma loading frames; everything else is scale. */
const BOX = 150;

/** Where the logo comes to rest on the left (Frame 7), in Figma frame space. */
const PERCH_X = 82 + 75;
/** How far above a straight line the jump into the header arcs, in Figma px. */
const JUMP_LIFT = 90;

/**
 * The purple's bottom edge, sized from Frames 4–8 (crests around y 216,
 * troughs around y 444). Three sine waves of different lengths and speeds
 * stacked together, so the hills come out uneven and keep changing shape.
 * `length` is px crest to crest, `period` seconds per cycle (negative runs
 * the other way).
 */
const WAVE_BASE = 330;
const WAVES = [
  { amplitude: 98, length: 875, period: 3.6, phase: 0.41 },
  { amplitude: 18, length: 530, period: -5.2, phase: 2.1 },
];

/** Module scope survives client navigations but resets on a full load. */
let hasPlayed = false;

const overlay: Variants = {
  shown: { opacity: 1 },
  gone: { opacity: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Set to `false` to turn the loading animation off. */
export const LOADING_SCREEN_ENABLED = true;

export function LoadingScreen() {
  if (!LOADING_SCREEN_ENABLED) return null;
  return <LoadingOverlay />;
}

function LoadingOverlay() {
  const [visible, setVisible] = useState(() => !hasPlayed);

  return (
    <>
      <noscript>
        <style>{"[data-loading-screen]{display:none}"}</style>
      </noscript>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="loading-screen"
            data-loading-screen
            aria-hidden
            className="fixed inset-0 z-50 overflow-hidden bg-bg-base"
            variants={overlay}
            initial={false}
            animate="shown"
            exit="gone"
          >
            <Sequence onDone={() => setVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function createValues() {
  return {
    stage: motionValue(0),
    /** 0 → 1: the purple drops in from the top edge */
    reach: motionValue(0),
    /** logo centre x while it's rolling on the wave */
    rollX: motionValue(0),
    /** 0 → 1: off the wave in one arc into the header slot */
    jump: motionValue(0),
    /** 0 → 1: the wave becomes the header shape */
    morph: motionValue(0),
    logoX: motionValue(0),
    logoY: motionValue(0),
    logoScale: motionValue(1),
    logoRotate: motionValue(0),
    squashX: motionValue(1),
    squashY: motionValue(1),
  };
}

interface Layout extends Stage {
  /** Uniform scale for the logo while it's on the wave. */
  unit: number;
  slot: { x: number; y: number; scale: number };
  header: { scale: number; top: number; right: number };
}

function measure(stage: HTMLElement): Layout {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const sx = width / LOADER_FRAME.width;
  // Height follows width on desktop, but phones get a taller wave so the
  // logo still has room to roll along it.
  const sy = Math.min(Math.max(sx, 0.55), 1.25, height / 500);
  const unit = sy;

  const headerEl = document.querySelector<HTMLElement>("[data-site-header]");
  const logoEl = document.querySelector<HTMLElement>("[data-site-logo]");
  const headerRect = headerEl?.getBoundingClientRect();
  const headerScale = headerShapeScale(headerRect?.width ?? width);
  const headerTop = headerRect?.top ?? 0;

  const logoRect = logoEl?.getBoundingClientRect();
  const slotSize = logoRect?.width ?? LOGO_SLOT.size * headerScale;
  const slot = logoRect
    ? { x: logoRect.left + slotSize / 2, y: logoRect.top + slotSize / 2 }
    : {
        x: (LOGO_SLOT.left + LOGO_SLOT.size / 2) * headerScale,
        y: (LOGO_SLOT.top + LOGO_SLOT.size / 2) * headerScale + headerTop,
      };

  return {
    width,
    height,
    sx,
    sy,
    unit,
    slot: { ...slot, scale: slotSize / BOX },
    header: {
      scale: headerScale,
      top: headerTop,
      right: headerRect?.right ?? width,
    },
  };
}

/** Sample columns across the screen; the purple edge is drawn through them. */
function columns(width: number) {
  const count = Math.max(24, Math.ceil(width / 8));
  return Array.from({ length: count + 1 }, (_, i) => (i / count) * width);
}

/**
 * Bottom edge of the header shape at each column, found by probing the real
 * outline, so the wave can melt into it point for point.
 */
function headerEdge(probe: SVGPathElement, d: string, xs: number[], max: number) {
  const restore = probe.getAttribute("d") ?? "";
  probe.setAttribute("d", d);
  const point = new DOMPoint();
  const edge = xs.map((x) => {
    point.x = Math.min(Math.max(x, 0.5), xs[xs.length - 1] - 0.5);
    let lo = 0;
    let hi = max;
    for (let i = 0; i < 14; i++) {
      point.y = (lo + hi) / 2;
      if (probe.isPointInFill(point)) lo = point.y;
      else hi = point.y;
    }
    return lo;
  });
  probe.setAttribute("d", restore);
  return edge;
}

/**
 * The Figma "Loading State" frames as one sequence: the purple drops in and
 * swells as a sine wave while the logo rolls in from the right over its hills
 * (6 → 4 → 7), then jumps in one arc into its header slot as the wave pulls
 * up into the header shape (5).
 */
function Sequence({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const purpleRef = useRef<SVGPathElement>(null);
  const [v] = useState(createValues);

  useLayoutEffect(() => {
    const el = ref.current;
    const purple = purpleRef.current;
    if (!el || !purple) return;
    hasPlayed = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }

    const block = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", block, { passive: false });
    el.addEventListener("touchmove", block, { passive: false });

    const l = measure(el);
    const { sx, sy, unit, slot } = l;
    const xs = columns(l.width);
    const header = headerEdge(
      purple,
      headerPath(l.header.right, l.header.scale, l.header.top),
      xs,
      l.height,
    );

    const parts = WAVES.map((p) => ({
      amplitude: p.amplitude,
      k: (2 * Math.PI) / (p.length * sx),
      w: (2 * Math.PI) / p.period,
      phase: p.phase,
    }));
    /** The wave's height at x, `t` seconds in. */
    const wave = (x: number, t: number) => {
      let y = WAVE_BASE;
      for (const p of parts) y += p.amplitude * Math.sin(p.k * x - p.w * t + p.phase);
      return y * sy * v.reach.get();
    };

    const radius = (BOX / 2) * unit;
    /**
     * Centre height for a wheel of `radius` resting on the wave at x: the
     * highest it can sit without sinking into the hill anywhere under it.
     */
    const restY = (x: number, t: number) => {
      let y = Infinity;
      for (let i = -8; i <= 8; i++) {
        const dx = (i / 8) * radius;
        y = Math.min(y, wave(x + dx, t) - Math.sqrt(radius * radius - dx * dx));
      }
      return y;
    };

    const enterX = l.width + radius;
    const perchX = Math.max(PERCH_X * sx, radius + 12);
    const lift = JUMP_LIFT * sy;

    let raf = 0;
    const t0 = performance.now();
    let air = { x: 0, y: 0 };
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const morph = v.morph.get();

      let d = `M0 0 L${l.width} 0`;
      for (let i = xs.length - 1; i >= 0; i--) {
        const y = wave(xs[i], t) * (1 - morph) + header[i] * morph;
        d += ` L${xs[i].toFixed(1)} ${Math.max(0, y).toFixed(1)}`;
      }
      purple.setAttribute("d", `${d} Z`);

      // On the ground it rolls: one radian of turn per radius travelled,
      // landing upright at the perch.
      const x = v.rollX.get();
      const ground = { x, y: restY(x, t) };
      // One jump: a straight line to the slot, bowed upward into an arc.
      const jump = v.jump.get();
      if (jump === 0) air = ground;
      v.logoX.set(air.x + (slot.x - air.x) * jump);
      v.logoY.set(air.y + (slot.y - air.y) * jump - lift * Math.sin(Math.PI * jump));
      v.logoScale.set(unit + (slot.scale - unit) * jump);
      v.logoRotate.set(((x - perchX) / radius) * (180 / Math.PI));

      raf = requestAnimationFrame(frame);
    };

    v.rollX.set(enterX);
    v.stage.set(1);
    raf = requestAnimationFrame(frame);

    // a beat after the purple has settled
    const rollAt = 1;
    const roll = 1.8;
    const landAt = rollAt + roll;
    const jumpAt = landAt + 0.2;
    const jump = 0.6;

    const sequence: AnimationSequence = [
      [v.reach, [0, 1], { duration: 0.6, at: 0, ease: EASE }],
      [v.rollX, [enterX, perchX], { duration: roll, at: rollAt, ease: [0.25, 0.1, 0.25, 1] }],
      [v.squashY, [1, 0.9, 1.03, 1], { duration: 0.18, at: landAt - 0.05, ease: "easeOut" }],
      [v.squashX, [1, 1.06, 0.99, 1], { duration: 0.18, at: landAt - 0.05, ease: "easeOut" }],

      // Crouch, then spring up off the wave.
      [v.squashY, [1, 0.82], { duration: 0.1, at: jumpAt - 0.1, ease: "easeOut" }],
      [v.squashX, [1, 1.1], { duration: 0.1, at: jumpAt - 0.1, ease: "easeOut" }],
      [v.jump, [0, 1], { duration: jump, at: jumpAt, ease: [0.3, 0.6, 0.4, 1] }],
      [v.squashY, [0.82, 1.14, 1], { duration: 0.3, at: jumpAt, ease: "easeOut" }],
      [v.squashX, [1.1, 0.92, 1], { duration: 0.3, at: jumpAt, ease: "easeOut" }],

      // The wave pulls up into the header under it, and it lands in its slot.
      [v.morph, [0, 1], { duration: 0.6, at: jumpAt + 0.05, ease: EASE }],
      [v.squashY, [1, 0.9, 1.03, 1], { duration: 0.3, at: jumpAt + jump - 0.03, ease: "easeOut" }],
      [v.squashX, [1, 1.06, 0.99, 1], { duration: 0.3, at: jumpAt + jump - 0.03, ease: "easeOut" }],
    ];

    let cancelled = false;
    const controls = animate(sequence);
    controls.then(() => {
      cancelAnimationFrame(raf);
      if (!cancelled) onDone();
    });

    return () => {
      cancelled = true;
      controls.stop();
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", block);
      el.removeEventListener("touchmove", block);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- plays once per mount
  }, [v]);

  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ opacity: v.stage }}>
      <svg className="absolute inset-0 h-full w-full">
        <path ref={purpleRef} fill="var(--purple-50)" />
      </svg>

      <motion.div
        className="absolute top-0 left-0"
        style={{
          width: BOX,
          height: BOX,
          marginLeft: -BOX / 2,
          marginTop: -BOX / 2,
          x: v.logoX,
          y: v.logoY,
          scale: v.logoScale,
          rotate: v.logoRotate,
        }}
      >
        <motion.div
          className="size-full"
          style={{ scaleX: v.squashX, scaleY: v.squashY, originY: 1 }}
        >
          <LogoMark className="size-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
