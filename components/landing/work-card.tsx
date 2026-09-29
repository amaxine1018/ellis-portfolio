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
        "group relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] px-6 pb-9 pt-8",
        tall ? "min-h-[480px] md:min-h-[573px]" : "min-h-[400px] md:min-h-[459px]",
      )}
      style={{ backgroundColor: tokenBg(study.thumbnailTone) }}
    >
      <p className="relative z-10 max-w-[90%] font-mono text-xl font-light leading-normal text-text-secondary md:text-[32px]">
        {study.title}
      </p>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex justify-center",
          tall ? "h-[70%]" : "h-[65%]",
        )}
      >
        <div className="relative h-full w-[55%] max-w-[320px]">
          <Image
            src={study.thumbnailImage}
            alt=""
            fill
            className="object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 70vw, 320px"
          />
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap gap-3 md:gap-6">
        {study.pills.map((pill) => (
          <Pill key={pill.label} label={pill.label} tone={pill.tone} />
        ))}
      </div>
    </Link>
  );
}
