"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in view.
 * Used by the case-study sticky nav (Phase 7 wiring ready now).
 */
export function useScrollSpy(
  sectionIds: string[],
  options?: { rootMargin?: string; threshold?: number | number[] },
): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null,
  );

  const idsKey = sectionIds.join("|");
  const rootMargin = options?.rootMargin ?? "-20% 0px -55% 0px";

  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];
    if (ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }

        if (visible.size === 0) return;

        const next =
          [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        setActiveId(next);
      },
      {
        rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [idsKey, rootMargin]);

  return activeId;
}
