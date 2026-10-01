import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/ui/pill";
import type { CaseStudy } from "@/lib/case-studies";
import { tokenBg } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  study: CaseStudy;
}

export function WorkCard({ study }: WorkCardProps) {
  const tall = study.cardHeight === "tall";

  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--radius-card-sm)] px-5 pb-7 pt-6 sm:rounded-[var(--radius-card)] sm:px-6 sm:pb-9 sm:pt-8",
        tall
          ? "min-h-[420px] sm:min-h-[480px] md:min-h-[573px]"
          : "min-h-[360px] sm:min-h-[400px] md:min-h-[459px]",
      )}
      style={{ backgroundColor: tokenBg(study.thumbnailTone) }}
    >
      <p className="relative z-10 max-w-[90%] font-mono text-lg font-light leading-normal text-text-secondary sm:text-xl md:text-[32px]">
        {study.title}
      </p>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center",
          tall ? "h-[55%] sm:h-[70%]" : "h-[50%] sm:h-[65%]",
        )}
      >
        <div className="relative h-full w-[50%] max-w-[280px] sm:w-[55%] sm:max-w-[320px]">
          <Image
            src={study.thumbnailImage}
            alt=""
            fill
            className="object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 55vw, (max-width: 768px) 40vw, 320px"
          />
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-28 sm:gap-3 sm:pt-36 md:gap-6">
        {study.pills.map((pill) => (
          <Pill key={pill.label} label={pill.label} tone={pill.tone} />
        ))}
      </div>
    </Link>
  );
}
