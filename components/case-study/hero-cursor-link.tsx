"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Pill } from "@/components/ui/pill";

/**
 * Wraps a case study hero in an external link. While a mouse or pen hovers it,
 * the native cursor is hidden and a blue pill follows the pointer — the same
 * interaction as the "Click to draw" pill on the landing sketch.
 * Touch input just gets the link.
 */
export function HeroCursorLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const track = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className="block cursor-none rounded-[var(--radius-media-sm)] outline-offset-4 sm:rounded-[var(--radius-media)]"
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={() => setPos(null)}
    >
      {children}
      {pos && typeof document !== "undefined"
        ? createPortal(
            <span
              aria-hidden
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{ left: pos.x, top: pos.y }}
            >
              <Pill label={label} tone="navy" />
            </span>,
            document.body,
          )
        : null}
    </a>
  );
}
