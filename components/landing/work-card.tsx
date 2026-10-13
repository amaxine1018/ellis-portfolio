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
  const comingSoon = study.thumbnailLayout === "coming-soon";
  const className = cn(
    "group relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--radius-card-sm)] px-5 pb-5 pt-6 sm:rounded-[var(--radius-card)] sm:px-9 sm:pb-9 sm:pt-8",
    tall ? "aspect-[623/573]" : "aspect-[622/459]",
  );
  const style = {
    backgroundColor: boostMotion ? undefined : tokenBg(study.thumbnailTone),
  };

  const card = (
    <>
      {boostMotion ? (
        <div className="pointer-events-none absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-[1.02]">
          <BoostThumb />
        </div>
      ) : null}

      {comingSoon ? null : (
        <p
          className={cn(
            "relative z-10 max-w-[90%] font-mono text-lg font-medium leading-normal sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px]",
            boostMotion ? "text-white" : "text-text-secondary",
          )}
        >
          {study.title}
        </p>
      )}

      {study.thumbnailLayout === "logo" ? (
        <div className="pointer-events-none absolute top-[36.649%] left-[17.697%] z-0 h-[30.192%] w-[63.403%] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
          <img
            src={study.thumbnailImage}
            alt=""
            className="absolute top-[-75.72%] left-[-38.02%] h-[271.1%] w-[178.07%] max-w-none object-contain"
          />
        </div>
      ) : null}

      {study.thumbnailLayout === "device" ? (
        <div className="pointer-events-none absolute top-[25.48%] left-[26.485%] z-0 h-[74.52%] w-[46.067%] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
          <img
            src={study.thumbnailImage}
            alt=""
            className="absolute top-[-19.34%] left-[-114.34%] h-[171.11%] w-[327.92%] max-w-none object-contain"
          />
        </div>
      ) : null}

      {comingSoon ? (
        <p className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6 text-center font-mono text-[clamp(2rem,5vw,4rem)] font-normal italic leading-normal text-grey-100">
          Coming Soon
        </p>
      ) : null}

      {!boostMotion && !study.thumbnailLayout ? (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div
            className={cn(
              "relative transition-transform duration-300 group-hover:scale-[1.02]",
              tall
                ? "h-[55%] w-[70%] max-w-[395px] sm:h-[60%] sm:w-[75%]"
                : "h-[50%] w-[55%] max-w-[320px] sm:h-[55%] sm:w-[60%]",
            )}
          >
            <Image
              src={study.thumbnailImage}
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, 395px"
            />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-10 mt-auto flex flex-wrap gap-1.5 pt-2 sm:gap-2 sm:pt-4 md:pt-2 lg:gap-4 lg:pt-10 xl:gap-6 xl:pt-36",
          comingSoon && "opacity-25",
        )}
      >
        {study.pills.map((pill) => (
          <Pill key={pill.label} label={pill.label} tone={pill.tone} />
        ))}
      </div>
    </>
  );

  if (comingSoon) {
    return (
      <div className={className} style={style}>
        {card}
      </div>
    );
  }

  return (
    <Link href={`/work/${study.slug}`} className={className} style={style}>
      {card}
    </Link>
  );
}
