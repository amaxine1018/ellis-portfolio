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
      let passed: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) containing = id;
        if (rect.top <= marker) passed = id;
      }

      const current = containing ?? passed ?? ids[0];
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
