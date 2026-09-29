"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import type { CaseStudySection } from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

interface CaseStudyNavProps {
  sections: CaseStudySection[];
}

export function navLabel(section: CaseStudySection): string {
  const raw = section.label.trim();
  const lower = raw.toLowerCase();
  if (lower === "overview") return "Overview";
  if (lower === "problem") return "Problem";
  if (lower === "solution") return "Solution";
  if (lower === "outcome") return "Outcome";
  if (lower === "process") return "Process";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export function CaseStudyNav({ sections }: CaseStudyNavProps) {
  const navSections = useMemo(
    () => sections.filter((s) => s.nav !== false),
    [sections],
  );
  const ids = useMemo(() => navSections.map((s) => s.id), [navSections]);
  const activeId = useScrollSpy(ids);

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-8 flex flex-col gap-16"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-3.5 font-mono text-lg font-semibold text-text-muted hover:text-text-primary md:text-2xl"
      >
        <svg width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden>
          <path
            d="M10 1L2 11L10 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        back
      </Link>

      <ul className="flex flex-col gap-8 text-2xl text-text-primary">
        {navSections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "font-mono leading-normal transition-colors",
                  isActive ? "font-bold" : "font-light hover:font-medium",
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {navLabel(section)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
