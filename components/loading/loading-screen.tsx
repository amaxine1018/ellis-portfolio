"use client";

import {
  AnimatePresence,
  animate,
  cubicBezier,
  mix,
  motion,
  motionValue,
  type AnimationSequence,
  type Variants,
} from "framer-motion";
import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { headerShapeScale } from "@/components/brand/header-shape";
import { LOGO_SLOT, LogoMark } from "@/components/brand/logo-mark";
import {
  BALL,
  BALL_CENTER,
  LOADER_FRAME,
  PERCH_CENTER,
  STRAND_WIDTH,
  STRANDS,
  WAVES,
  flowPath,
  headerPath,
  wavePath,
  type Stage,
} from "@/components/loading/loader-paths";

const EASE: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];
/** Fast start, long settle: a line snapping taut. */
const SNAP: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Shoved from below: instant velocity, decelerating into place. */
const PUSH: [number, number, number, number] = [0.2, 0.9, 0.3, 1];

/** Base box for the ball and logo; everything else is scale. */
const BOX = BALL.size;

/** Module scope survives client navigations but resets on a full load. */
let hasPlayed = false;

const overlay: Variants = {
  shown: { opacity: 1 },
  gone: { opacity: 0, transition: { duration: 0.35, ease: EASE } },
};

/** Set to `true` to turn the loading animation back on. */
export const LOADING_SCREEN_ENABLED = false;

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
    lineD: motionValue(""),
    lineWidth: motionValue(STRAND_WIDTH),
    lineOpacity: motionValue(1),
    purpleD: motionValue(""),
    purpleOpacity: motionValue(0),
    ballX: motionValue(0),
    ballY: motionValue(0),
    ballScale: motionValue(1),
    ballRotate: motionValue(0),
    strands: STRANDS.map(() => ({
      length: motionValue(1),
      offset: motionValue(0),
      opacity: motionValue(1),
    })),
    logoX: motionValue(0),
    logoY: motionValue(0),
    logoScale: motionValue(1),
    logoRotate: motionValue(0),
    squashX: motionValue(1),
    squashY: motionValue(1),
  };
}

type Values = ReturnType<typeof createValues>;

interface Layout extends Stage {
  /** Uniform scale for the ball and logo (frames 1–4). */
  unit: number;
  ball: { x: number; y: number };
  perch: { x: number; y: number };
  slot: { x: number; y: number; scale: number };
  header: { scale: number; top: number; right: number };
}

function measure(stage: HTMLElement): Layout {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const sx = width / LOADER_FRAME.width;
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
    ball: { x: BALL_CENTER[0] * sx, y: BALL_CENTER[1] * sy },
    perch: {
      x: Math.max(PERCH_CENTER[0] * sx, (BOX / 2) * unit + 12),
      y: PERCH_CENTER[1] * sy,
    },
    slot: { ...slot, scale: slotSize / BOX },
    header: {
      scale: headerScale,
      top: headerTop,
      right: headerRect?.right ?? width,
    },
  };
}

function applyStart(v: Values, l: Layout) {
  v.lineD.set(wavePath(WAVES.flat, l, { x: l.ball.x, unit: l.unit }));
  v.lineWidth.set(STRAND_WIDTH * l.sy);
  v.purpleD.set(flowPath(l, 0));
  v.ballX.set(l.ball.x);
  v.ballY.set(l.ball.y);
  v.ballScale.set(l.unit);
  v.logoX.set(l.ball.x);
  v.logoY.set(l.ball.y);
  v.logoScale.set(l.unit);
  v.stage.set(1);
}

/**
 * One timeline for all five Figma frames:
 * 1 tangled ball → 2 strands unwind into the wave → 3 logo leaps free →
 * 4 purple flows down to the wave → 5 purple becomes the header, logo hops in.
 */
/**
 * Progress (0–1) through the purple → header morph at which the rising edge
 * passes `point`, so the push hop starts on contact at any viewport size.
 */
function contactProgress(
  probe: SVGPathElement,
  from: string,
  to: string,
  point: DOMPoint,
) {
  const morph = mix(from, to);
  const ease = cubicBezier(...EASE);
  const restore = probe.getAttribute("d") ?? "";
  let hit = 0.3;
  for (let i = 0; i <= 50; i++) {
    probe.setAttribute("d", morph(ease(i / 50)));
    if (!probe.isPointInFill(point)) {
      hit = i / 50;
      break;
    }
  }
  probe.setAttribute("d", restore);
  return hit;
}

function buildSequence(
  v: Values,
  l: Layout,
  probe: SVGPathElement,
): AnimationSequence {
  const { sy, unit, ball, perch, slot } = l;
  const anchor = { x: ball.x, unit };
  const wave = (w: keyof typeof WAVES) =>
    wavePath(WAVES[w], l, w === "free" || w === "recoil" ? undefined : anchor);
  const flow = flowPath(l);
  const header = headerPath(l.header.right, l.header.scale, l.header.top);

  /** The slack line snaps taut into the wave; that snap launches the logo. */
  const pullAt = 1.5;
  const leapPeak = Math.min(ball.y, perch.y) - 110 * sy;
  /** The purple rising into the header shape shoves the logo up. */
  const pushAt = 3.5;
  const pushDuration = 0.8;
  const logoBottom = new DOMPoint(perch.x, perch.y + (BOX / 2) * unit);
  const hopAt =
    pushAt + pushDuration * contactProgress(probe, flow, header, logoBottom);
  const hopOvershoot = slot.y - 10 * l.header.scale;

  const strands: AnimationSequence = v.strands.flatMap((s, i) => {
    const at = 0.6 + i * 0.17;
    return [
      [s.length, [1, 0], { duration: 0.4, at, ease: EASE }],
      [s.offset, [0, 1], { duration: 0.4, at, ease: EASE }],
      [s.opacity, [1, 0], { duration: 0.08, at: at + 0.35 }],
    ];
  });

  return [
    // Phase 1: the ball idles, line taut.
    [v.ballRotate, [0, 3, -3, 0], { duration: 0.6, at: 0, ease: "easeInOut" }],

    // Phase 2: strands unwind outer → inner; their slack loosens the line.
    [v.ballRotate, [0, -25], { duration: pullAt - 0.6, at: 0.6, ease: "easeOut" }],
    [
      v.ballScale,
      [unit, unit * 1.04, unit * 0.96, unit],
      { duration: pullAt - 0.6, at: 0.6, ease: EASE },
    ],
    ...strands,
    [
      v.lineD,
      [wave("flat"), wave("sag"), wave("loose")],
      { duration: pullAt - 0.6, at: 0.6, times: [0, 0.35, 1], ease: EASE },
    ],
    [
      v.lineWidth,
      [STRAND_WIDTH * sy, 18 * sy],
      { duration: 0.8, at: 0.6, ease: EASE },
    ],
    [v.logoRotate, [0, 4, -4, 0], { duration: 0.3, at: pullAt - 0.4, ease: "easeInOut" }],

    // Phase 3: the line snaps into the wave and flings the logo up-left.
    [v.squashY, [1, 0.82], { duration: 0.1, at: pullAt - 0.1, ease: "easeOut" }],
    [v.squashX, [1, 1.12], { duration: 0.1, at: pullAt - 0.1, ease: "easeOut" }],
    [v.logoY, [ball.y, ball.y + 6 * sy], { duration: 0.1, at: pullAt - 0.1 }],
    [v.lineD, [wave("loose"), wave("free")], { duration: 0.3, at: pullAt, ease: SNAP }],
    [v.logoX, [ball.x, perch.x], { duration: 0.55, at: pullAt, ease: "linear" }],
    [
      v.logoY,
      [ball.y + 6 * sy, leapPeak, perch.y],
      { duration: 0.55, at: pullAt, times: [0, 0.45, 1], ease: ["easeOut", "easeIn"] },
    ],
    [v.squashY, [0.82, 1.14, 1], { duration: 0.3, at: pullAt, ease: "easeOut" }],
    [v.squashX, [1.12, 0.9, 1], { duration: 0.3, at: pullAt, ease: "easeOut" }],
    [v.logoRotate, [0, -360], { duration: 0.55, at: pullAt, ease: EASE }],
    [v.squashY, [1, 0.86, 1.04, 1], { duration: 0.23, at: pullAt + 0.55, ease: "easeOut" }],
    [v.squashX, [1, 1.1, 0.97, 1], { duration: 0.23, at: pullAt + 0.55, ease: "easeOut" }],
    [
      v.lineD,
      [wave("free"), wave("recoil"), wave("free")],
      { duration: 0.6, at: pullAt + 0.3, ease: "easeInOut" },
    ],

    // Phase 4: purple pours down to the wave; logo bobs on its perch.
    [v.purpleOpacity, [0, 1], { duration: 0.3, at: 2.4 }],
    [v.purpleD, [flowPath(l, 0), flow], { duration: 0.9, at: 2.4, ease: EASE }],
    [v.lineOpacity, [1, 0], { duration: 0.4, at: 2.7, ease: EASE }],
    [
      v.logoY,
      [perch.y, perch.y - 4 * sy, perch.y + 3 * sy, perch.y],
      { duration: 0.9, at: 2.5, ease: "easeInOut" },
    ],

    // Phase 5: purple rises into the header shape and pushes the logo up.
    [v.purpleD, [flow, header], { duration: pushDuration, at: pushAt, ease: EASE }],
    [v.logoX, [perch.x, slot.x], { duration: 0.32, at: hopAt, ease: PUSH }],
    [
      v.logoY,
      [perch.y, hopOvershoot, slot.y],
      { duration: 0.4, at: hopAt, times: [0, 0.7, 1], ease: [PUSH, "easeInOut"] },
    ],
    [v.logoScale, [unit, slot.scale], { duration: 0.32, at: hopAt, ease: PUSH }],
    [v.squashY, [1, 1.15, 0.95, 1], { duration: 0.45, at: hopAt, ease: "easeOut" }],
    [v.squashX, [1, 0.9, 1.04, 1], { duration: 0.45, at: hopAt, ease: "easeOut" }],
  ];
}

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

    const layout = measure(el);
    applyStart(v, layout);

    let cancelled = false;
    const controls = animate(buildSequence(v, layout, purple));
    controls.then(() => {
      if (!cancelled) onDone();
    });

    return () => {
      cancelled = true;
      controls.stop();
      el.removeEventListener("wheel", block);
      el.removeEventListener("touchmove", block);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- plays once per mount
  }, [v]);

  const box = { width: BOX, height: BOX, marginLeft: -BOX / 2, marginTop: -BOX / 2 };
  const ballStyle = {
    ...box,
    x: v.ballX,
    y: v.ballY,
    scale: v.ballScale,
    rotate: v.ballRotate,
  };

  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ opacity: v.stage }}>
      <motion.svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: v.purpleOpacity }}
      >
        <motion.path ref={purpleRef} d={v.purpleD} fill="var(--purple-50)" />
      </motion.svg>

      <StrandLayer values={v} behind style={ballStyle} />

      <motion.div
        className="absolute top-0 left-0"
        style={{
          ...box,
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

      <StrandLayer values={v} style={ballStyle} />

      <motion.svg
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ opacity: v.lineOpacity }}
      >
        <motion.path
          d={v.lineD}
          stroke="var(--navy-800)"
          strokeWidth={v.lineWidth}
          fill="none"
        />
      </motion.svg>
    </motion.div>
  );
}

function StrandLayer({
  values,
  behind = false,
  style,
}: {
  values: Values;
  behind?: boolean;
  style: ComponentProps<typeof motion.svg>["style"];
}) {
  return (
    <motion.svg
      className="absolute top-0 left-0 overflow-visible"
      viewBox={`${BALL.left} ${BALL.top} ${BALL.size} ${BALL.size}`}
      style={style}
    >
      {STRANDS.map((strand, i) =>
        Boolean(strand.behind) === behind ? (
          <g key={i} transform={strand.transform}>
            <motion.path
              d={strand.d}
              fill="none"
              stroke="var(--navy-800)"
              strokeWidth={STRAND_WIDTH}
              style={{
                pathLength: values.strands[i].length,
                pathOffset: values.strands[i].offset,
                opacity: values.strands[i].opacity,
              }}
            />
          </g>
        ) : null,
      )}
    </motion.svg>
  );
}