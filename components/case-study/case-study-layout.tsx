import Image from "next/image";
import { Pill } from "@/components/ui/pill";
import type { CaseStudy } from "@/lib/case-studies/types";
import { tokenBg } from "@/lib/case-studies";
import { CaseStudyNav } from "./case-study-nav";
import { CaseStudySections } from "./case-study-sections";

interface CaseStudyLayoutProps {
  study: CaseStudy;
}

/**
 * Case study layout — Figma frame 59:87
 * Sticky left nav from content sections; main column is content-driven.
 */
export function CaseStudyLayout({ study }: CaseStudyLayoutProps) {
  const heroImages =
    study.heroImages && study.heroImages.length > 0
      ? study.heroImages
      : [study.thumbnailImage];

  return (
    <div className="page-shell flex flex-col gap-8 pb-16 sm:gap-10 sm:pb-24 lg:flex-row lg:items-start lg:gap-[170px]">
      <aside className="hidden w-[125px] shrink-0 pt-[120px] lg:block lg:self-stretch">
        <CaseStudyNav sections={study.sections} variant="sidebar" />
      </aside>

      <div className="min-w-0 flex-1 pt-4 sm:pt-6 lg:max-w-[960px] lg:pt-8">
        <div className="mb-6 sm:mb-8 lg:hidden">
          <CaseStudyNav sections={study.sections} variant="mobile" />
        </div>

        <header className="mb-10 flex flex-col gap-10 sm:mb-14 sm:gap-14 md:mb-[56px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {study.pills
                .filter((p) => !/^\d{4}$/.test(p.label))
                .map((pill) => (
                  <Pill key={pill.label} label={pill.label} tone={pill.tone} />
                ))}
            </div>

            <div className="flex flex-col gap-6 sm:gap-8 md:gap-[45px]">
              <h1 className="font-display text-[clamp(2rem,4vw+0.75rem,4rem)] font-bold leading-normal text-text-primary">
                {study.title}
              </h1>

              <div
                className="relative flex h-[180px] w-full items-end justify-center gap-3 overflow-hidden rounded-[var(--radius-card-sm)] px-3 pt-6 sm:h-[220px] sm:gap-4 sm:rounded-[var(--radius-card)] sm:px-4 sm:pt-8 md:h-[368px] md:gap-6 md:px-10"
                style={{
                  backgroundColor: tokenBg(
                    study.heroTone ?? study.thumbnailTone,
                  ),
                }}
              >
                {heroImages.slice(0, 3).map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative h-[85%] w-[28%] max-w-[255px]"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-contain object-bottom"
                      sizes="(max-width: 768px) 28vw, 255px"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 font-mono text-sm font-normal leading-relaxed text-text-accent sm:gap-8 sm:text-base sm:leading-[30px] md:flex-row md:gap-12 lg:gap-[140px]">
            <MetaBlock label="TOOLS" value={study.meta.tools} className="md:w-[218px]" />
            <MetaBlock label="TEAM" value={study.meta.team} className="md:w-[177px]" />
            <MetaBlock
              label="DURATION"
              value={study.meta.duration}
              className="md:w-[136px]"
            />
          </div>
        </header>

        <CaseStudySections sections={study.sections} />
      </div>
    </div>
  );
}

function MetaBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
}
