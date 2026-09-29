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
    <div className="mx-auto flex w-full max-w-[1512px] flex-col gap-10 px-6 pb-24 pt-6 md:flex-row md:gap-16 md:px-[66px] md:pt-8">
      <aside className="hidden w-[125px] shrink-0 lg:block">
        <CaseStudyNav sections={study.sections} />
      </aside>

      <div className="min-w-0 flex-1 md:max-w-[960px]">
        {/* Mobile back + section jump */}
        <div className="mb-8 lg:hidden">
          <CaseStudyNav sections={study.sections} />
        </div>

        <header className="mb-14 flex flex-col gap-14 md:mb-[56px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {study.pills
                .filter((p) => !/^\d{4}$/.test(p.label))
                .map((pill) => (
                  <Pill key={pill.label} label={pill.label} tone={pill.tone} />
                ))}
            </div>

            <div className="flex flex-col gap-8 md:gap-[45px]">
              <h1 className="font-display text-[40px] font-bold leading-normal text-text-primary md:text-[64px]">
                {study.title}
              </h1>

              <div
                className="relative flex h-[220px] w-full items-end justify-center gap-4 overflow-hidden rounded-[var(--radius-card)] px-4 pt-8 md:h-[368px] md:gap-6 md:px-10"
                style={{ backgroundColor: tokenBg(study.thumbnailTone) }}
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
                      sizes="255px"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 font-mono text-base font-normal leading-[30px] text-text-accent md:flex-row md:gap-[140px]">
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
