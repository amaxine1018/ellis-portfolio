"use client";

import { useEffect, useState } from "react";

/**
 * Highlights the case-study section currently in focus.
 * Prefers the section that contains the reading line, otherwise the section
 * whose top is closest to that line.
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null,
  );
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];
    if (ids.length === 0) return;

    const update = () => {
      const marker = window.innerHeight * 0.35;
      let containing: string | null = null;
      let closest = ids[0];
      let closestDist = Number.POSITIVE_INFINITY;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) containing = id;
        const dist = Math.abs(rect.top - marker);
        if (dist < closestDist) {
          closestDist = dist;
          closest = id;
        }
      }

      const current = containing ?? closest;
      setActiveId((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [idsKey]);

  return activeId;
}
