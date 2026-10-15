import { createPortal } from "react-dom";

/**
 * Test hint UI for the hero sketch.
 * Delete this file and its call sites in hero-sketch.tsx to remove the experiment.
 * Set DRAW_HINTS_ENABLED to false to hide the hints without deleting them.
 */

export const DRAW_HINTS_ENABLED = true;

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

/**
 * "Draw on me!" bubble — Figma vector 291:66 plus label 285:46.
 * Render inside the unscaled 332.819px sticky frame so it scales with the note.
 */
export function DrawOnMeBubble({ visible }: { visible: boolean }) {
  if (!DRAW_HINTS_ENABLED || !visible) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      <img
        src="/assets/draw-on-me-bubble.svg"
        alt=""
        width={207.213}
        height={113.1}
        className="absolute top-[60.46px] left-[207.55px] max-w-none"
      />
      <p className="absolute top-[90px] left-[251.16px] whitespace-nowrap font-mono text-xl font-light leading-none text-black">
        Draw on me!
      </p>
    </div>
  );
}
