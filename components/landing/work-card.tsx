import Link from "next/link";
import { BoostThumb } from "@/components/landing/boost-thumb";
import type { CaseStudy } from "@/lib/case-studies";
import { tokenBg } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  study: CaseStudy;
}

const pct = (n: number) => `${n}%`;

/** Thumbnail tile with its caption underneath: client / status year. */
export function WorkCard({ study }: WorkCardProps) {
  const tall = study.cardHeight === "tall";
  const comingSoon = study.thumbnailLayout === "coming-soon";
  const art = study.thumbnailArt;
  const motion = study.thumbnailMotion === "boost-intro";

  const tile = (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-card)]",
        tall ? "aspect-[623/475]" : "aspect-[622/403]",
      )}
      style={{
        backgroundColor: motion ? undefined : tokenBg(study.thumbnailTone),
      }}
    >
      {motion ? (
        <div className="pointer-events-none absolute inset-0 transition-transform duration-300 group-hover:scale-[1.02]">
          <BoostThumb />
        </div>
      ) : art ? (
        <div
          className="pointer-events-none absolute overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            left: pct(art.box.left),
            top: pct(art.box.top),
            width: pct(art.box.width),
            height: pct(art.box.height),
          }}
        >
          <img
            src={art.src}
            alt=""
            className="absolute max-w-none"
            style={{
              left: pct(art.crop?.left ?? 0),
              top: pct(art.crop?.top ?? 0),
              width: pct(art.crop?.width ?? 100),
              height: pct(art.crop?.height ?? 100),
            }}
          />
        </div>
      ) : null}

      {comingSoon ? (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-[clamp(2rem,5vw,4rem)] font-normal italic leading-normal text-grey-100">
          Coming Soon
        </p>
      ) : null}
    </div>
  );

  const caption = (
    <p className="font-mono text-base leading-normal text-navy-800 sm:text-xl">
      <span className="font-semibold">{study.client}</span>{" "}
      <span className="font-extralight">
        / {study.status} {study.year}
      </span>
    </p>
  );

  const body = (
    <>
      {tile}
      {caption}
    </>
  );

  if (comingSoon) {
    return <div className="flex w-full flex-col gap-4">{body}</div>;
  }

  return (
    <Link
      href={`/work/${study.slug}`}
      aria-label={`${study.title} — ${study.client}, ${study.status} ${study.year}`}
      className="group relative z-10 flex w-full cursor-pointer touch-manipulation flex-col gap-4"
    >
      {body}
    </Link>
  );
}
