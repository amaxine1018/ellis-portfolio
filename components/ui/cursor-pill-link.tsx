"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Same shape and type as a hovered nav button, in navy so it stays readable
 * over orange imagery like the Boost hero.
 */
export const CURSOR_PILL_CLASS =
  "rounded-full border-2 border-navy-800 bg-navy-800 px-5 py-0.5 font-mono text-xl font-light leading-tight text-text-inverse";

/**
 * A link whose cursor becomes a pill label (e.g. "Open prototype") while a
 * mouse is over it, like the sharpie's "Click to draw". Touch screens just
 * get a normal link.
 */
export function CursorPillLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const track = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn("block", pos ? "cursor-none" : "cursor-pointer", className)}
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={() => setPos(null)}
    >
      {children}
      {pos && typeof document !== "undefined"
        ? createPortal(
            <span
              aria-hidden
              className={cn(
                "pointer-events-none fixed z-50 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap",
                CURSOR_PILL_CLASS,
              )}
              style={{ left: pos.x, top: pos.y }}
            >
              {label}
            </span>,
            document.body,
          )
        : null}
    </a>
  );
}
