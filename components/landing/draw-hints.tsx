import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Test hint UI for the hero sketch.
 * Delete this file and its call sites in hero-sketch.tsx to remove the experiment.
 * Set DRAW_HINTS_ENABLED to false to hide the hints without deleting them.
 */

export const DRAW_HINTS_ENABLED = true;

/** Intro shake on the sharpie image. Remove with this file. */
export const SHARPIE_NUDGE_CLASS = "sharpie-nudge";

export function SharpieNudgeStyle() {
  if (!DRAW_HINTS_ENABLED) return null;

  return (
    <style>{`
      @keyframes sharpie-nudge {
        0% { transform: translate3d(0, 0, 0) rotate(0deg); }
        1% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        2% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        3% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        3.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        4.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        5%, 9% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
        10% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        11% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        12% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        12.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        13.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        14%, 34% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
        35% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        36% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        37% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        37.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        38.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        39%, 43% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
        44% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        45% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        46% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        46.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        47.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        48%, 68% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
        69% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        70% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        71% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        71.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        72.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        73%, 77% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
        78% { transform: translate3d(-0.35%, -8%, 0) rotate(-0.35deg); }
        79% { transform: translate3d(0.35%, -9%, 0) rotate(0.35deg); }
        80% { transform: translate3d(-0.2%, -7%, 0) rotate(-0.2deg); }
        80.8% { transform: translate3d(0.2%, -9%, 0) rotate(0.2deg); }
        81.4% {
          transform: translate3d(0, -8%, 0) rotate(0deg);
          animation-timing-function: cubic-bezier(0.45, 0, 1, 0.6);
        }
        82%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); animation-timing-function: linear; }
      }
      .sharpie-nudge {
        animation: sharpie-nudge 6s linear 1;
        transform-origin: center;
      }
      @media (prefers-reduced-motion: reduce) {
        .sharpie-nudge { animation: none; }
      }
    `}</style>
  );
}

/**
 * Orange "Click to draw" pill — Figma 285:49.
 * Follows the pointer and replaces the cursor while hovering the sharpie.
 */
export function ClickToDrawPill({
  x,
  y,
}: {
  x: number | null;
  y: number | null;
}) {
  if (!DRAW_HINTS_ENABLED || x == null || y == null) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <span
      aria-hidden
      className="pointer-events-none fixed z-50 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-orange-100 px-4 py-1 font-mono text-xl font-bold leading-none text-text-inverse"
      style={{ left: x, top: y }}
    >
      Click to draw
    </span>,
    document.body,
  );
}

/** Tail tip inside the bubble image. The mouth sits at this point in the 332.819px note. */
const BUBBLE_TIP_X = 1.608;
const BUBBLE_TIP_Y = 111.536;
const BUBBLE_MOUTH_X = 207.55 + BUBBLE_TIP_X;
const BUBBLE_MOUTH_Y = 60.46 + BUBBLE_TIP_Y;
const NOTE_WIDTH = 332.819;
const VIEWPORT_PAD = 8;

/**
 * "Draw on me!" bubble — Figma vector 291:66 plus label 285:46.
 * Stays at design size on every screen. Scales toward the mouth only when it
 * would be clipped by the viewport. Render outside the note's scale transform.
 */
export function DrawOnMeBubble({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!DRAW_HINTS_ENABLED || !visible) return;
    const node = ref.current;
    if (!node) return;

    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = "scale(1)";
      const rect = el.getBoundingClientRect();
      const tipX = rect.left + BUBBLE_TIP_X;
      const tipY = rect.top + BUBBLE_TIP_Y;
      const ratio = (span: number, available: number) =>
        span <= 1 ? 1 : Math.max(0, available) / span;
      const next = Math.min(
        1,
        ratio(rect.right - tipX, window.innerWidth - VIEWPORT_PAD - tipX),
        ratio(tipX - rect.left, tipX - VIEWPORT_PAD),
        ratio(tipY - rect.top, tipY - VIEWPORT_PAD),
        ratio(rect.bottom - tipY, window.innerHeight - VIEWPORT_PAD - tipY),
      );
      el.style.transform = `scale(${next})`;
      setScale((current) =>
        Math.abs(current - next) < 0.005 ? current : next,
      );
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(document.documentElement);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [visible]);

  if (!DRAW_HINTS_ENABLED || !visible) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-20"
      style={{
        left: `calc(${BUBBLE_MOUTH_X}px * 100cqw / ${NOTE_WIDTH}px - ${BUBBLE_TIP_X}px)`,
        top: `calc(${BUBBLE_MOUTH_Y}px * 100cqw / ${NOTE_WIDTH}px - ${BUBBLE_TIP_Y}px)`,
        width: 207.213,
        height: 113.1,
        transformOrigin: `${BUBBLE_TIP_X}px ${BUBBLE_TIP_Y}px`,
        transform: `scale(${scale})`,
      }}
    >
      <img
        src="/assets/draw-on-me-bubble.svg"
        alt=""
        width={207.213}
        height={113.1}
        className="absolute inset-0 h-full w-full max-w-none"
      />
      <p className="absolute top-[29.54px] left-[43.61px] whitespace-nowrap font-mono text-xl font-light leading-none text-black">
        Draw on me!
      </p>
    </div>
  );
}
