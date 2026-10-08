import Image from "next/image";
import Link from "next/link";
import { BoostThumb } from "@/components/landing/boost-thumb";
import { Pill } from "@/components/ui/pill";
import type { CaseStudy } from "@/lib/case-studies";
import { tokenBg } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  study: CaseStudy;
}

export function WorkCard({ study }: WorkCardProps) {
  const tall = study.cardHeight === "tall";
  const boostMotion = study.thumbnailMotion === "boost-intro";

  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--radius-card-sm)] px-5 pb-7 pt-6 sm:rounded-[var(--radius-card)] sm:px-6 sm:pb-9 sm:pt-8",
        tall
          ? "min-h-[420px] sm:min-h-[480px] md:min-h-[573px]"
          : "min-h-[360px] sm:min-h-[400px] md:min-h-[459px]",
      )}
      style={{
        backgroundColor: boostMotion
          ? undefined
          : tokenBg(study.thumbnailTone),
      }}
    >
      {boostMotion ? (
        <div className="pointer-events-none absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-[1.02]">
          <BoostThumb />
        </div>
      ) : null}

      <p
        className={cn(
          "relative z-10 max-w-[90%] font-mono text-lg font-medium leading-normal sm:text-xl md:text-[32px]",
          boostMotion ? "text-white" : "text-text-secondary",
        )}
      >
        {study.title}
      </p>

      {!boostMotion ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center",
            tall ? "h-[55%] sm:h-[70%]" : "h-[50%] sm:h-[65%]",
          )}
        >
          <div
            className={cn(
              "relative h-full transition-transform duration-300 group-hover:scale-[1.02]",
              tall
                ? "w-[70%] max-w-[395px] sm:w-[75%]"
                : "w-[55%] max-w-[320px] sm:w-[60%]",
            )}
          >
            <Image
              src={study.thumbnailImage}
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, 395px"
            />
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-28 sm:gap-3 sm:pt-36 md:gap-6">
        {study.pills.map((pill) => (
          <Pill key={pill.label} label={pill.label} tone={pill.tone} />
        ))}
      </div>
    </Link>
  );
}
