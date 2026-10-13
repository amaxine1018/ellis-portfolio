import Image from "next/image";
import { Radio_Canada_Big } from "next/font/google";
import type { ReactNode } from "react";
import { BenchmarkCharts } from "@/components/case-study/benchmark-charts";
import type {
  CaseStudyImage,
  CaseStudyMediaBlock,
  CaseStudySection,
  CaseStudyStat,
  CaseStudyStatTone,
} from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

const radioCanada = Radio_Canada_Big({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const STAT_TONE: Record<
  CaseStudyStatTone,
  { border: string; value: string; icon: string }
> = {
  alert: {
    border: "border-boost-alert",
    value: "text-boost-alert",
    icon: "/assets/case-studies/reimagining/icon-warning-orange.svg",
  },
  caution: {
    border: "border-boost-caution",
    value: "text-boost-caution",
    icon: "/assets/case-studies/reimagining/icon-warning-amber.svg",
  },
  positive: {
    border: "border-boost-positive",
    value: "text-boost-positive",
    icon: "/assets/case-studies/reimagining/icon-check.svg",
  },
};

interface CaseStudySectionsProps {
  sections: CaseStudySection[];
}

export function CaseStudySections({ sections }: CaseStudySectionsProps) {
  return (
    <div className="flex flex-col gap-16 sm:gap-20 md:gap-24">
      {sections.map((section) => {
        const quoteAfterMedia = Boolean(
          section.mediaBlocks?.length && section.quote,
        );
        const quoteInline = Boolean(section.quote && !quoteAfterMedia);
        const portrait = section.mediaLayout === "portrait";
        const row = section.mediaLayout === "row";
        const split = section.mediaLayout === "split";
        const stacked =
          !row &&
          !split &&
          (section.mediaLayout === "stack" || Boolean(section.images?.length));

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 sm:scroll-mt-28"
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              <p className="font-mono text-base font-light text-text-primary sm:text-xl">
                {section.label}
              </p>
              <h2
                id={`${section.id}-heading`}
                className="font-display text-[clamp(1.5rem,2vw+0.75rem,2.5rem)] font-bold leading-normal text-text-primary"
              >
                {section.titleLink ? (
                  <TitleWithLink title={section.title} link={section.titleLink} />
                ) : (
                  section.title
                )}
              </h2>

              {section.extraTitle ? (
                <p className="font-display text-[clamp(1.5rem,2vw+0.75rem,2.5rem)] font-bold leading-normal text-text-primary">
                  {section.extraTitle}
                </p>
              ) : null}

              {section.body || section.bullets?.length ? (
                <div
                  className={cn(
                    "font-mono text-base leading-relaxed text-text-primary sm:text-xl sm:leading-[30px]",
                    section.bodyWeight === "regular" ? "font-normal" : "font-light",
                  )}
                >
                  {section.body ? <RichText text={section.body} /> : null}
                  {section.bullets?.length ? (
                    <ul className="mt-[30px] list-disc pl-[30px]">
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              {quoteInline ? <Quote text={section.quote!} /> : null}

              {section.bodyAfter ? (
                <RichText
                  text={section.bodyAfter}
                  className="font-mono text-base font-light leading-relaxed text-text-primary sm:text-xl sm:leading-[30px]"
                />
              ) : null}

              {!portrait && section.mediaBlocks?.length ? (
                <LandscapeBlocks blocks={section.mediaBlocks} />
              ) : null}

              {quoteAfterMedia ? <Quote text={section.quote!} /> : null}

              {section.media ? (
                <div className="relative h-[200px] w-full overflow-hidden rounded-[var(--radius-media-sm)] bg-grey-50 sm:h-[240px] sm:rounded-[var(--radius-media)] md:h-[381px]">
                  <Image
                    src={section.media}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 943px"
                  />
                </div>
              ) : section.id === "process" &&
                !section.mediaBlocks?.length &&
                !section.images?.length ? (
                <div className="h-[200px] w-full rounded-[var(--radius-media-sm)] bg-grey-50 sm:h-[240px] sm:rounded-[var(--radius-media)] md:h-[381px]" />
              ) : null}
            </div>

            {portrait && section.mediaBlocks?.length ? (
              <div className="mt-8 flex flex-col gap-10 sm:mt-12 sm:gap-12">
                {section.mediaBlocks.map((block) => (
                  <PortraitBlock key={block.caption} block={block} />
                ))}
              </div>
            ) : null}

            {section.statRows?.length ? (
              <div className="mt-8 flex flex-col gap-6 sm:mt-12 sm:gap-12">
                {section.statRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {row.map((stat) => (
                      <StatCard key={`${stat.title}-${stat.value}-${stat.detail}`} stat={stat} />
                    ))}
                  </div>
                ))}
              </div>
            ) : null}

            {row && section.images?.length ? (
              <div className="mt-8 flex flex-col items-start gap-8 sm:mt-12 sm:flex-row sm:gap-12">
                {section.images.map((image) => {
                  const src = imageSrc(image);
                  return (
                    <div
                      key={src}
                      className="relative aspect-[278/554] w-full max-w-[279px] overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="279px"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {section.charts?.length ? (
              <BenchmarkCharts
                legend={section.legend ?? []}
                charts={section.charts}
              />
            ) : null}

            {split && section.images?.length ? (
              <SplitImages images={section.images} />
            ) : null}

            {stacked && section.images?.length ? (
              <div className={stackSpacing(section.mediaSpacing)}>
                {section.images.map((image) => (
                  <StackedImage
                    key={imageSrc(image)}
                    image={image}
                    rounded={Boolean(section.roundedImages)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function LandscapeBlocks({ blocks }: { blocks: CaseStudyMediaBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <div
          key={block.caption}
          className="flex flex-col items-start gap-5 sm:gap-6 lg:flex-row lg:items-center lg:gap-12"
        >
          <div className="relative h-[200px] w-full max-w-[513px] shrink-0 overflow-hidden rounded-[var(--radius-media-sm)] bg-grey-50 sm:h-[240px] sm:rounded-[var(--radius-media)] md:h-[320px] lg:h-[381px] lg:w-[513px]">
            {block.image ? (
              <Image
                src={block.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 513px"
              />
            ) : null}
          </div>
          <p className="font-display text-[clamp(1.375rem,2vw+0.5rem,2.25rem)] font-bold leading-normal text-text-primary">
            {block.caption}
          </p>
        </div>
      ))}
    </>
  );
}

function imageSrc(image: CaseStudyImage): string {
  return typeof image === "string" ? image : image.src;
}

function stackSpacing(spacing: CaseStudySection["mediaSpacing"]): string {
  if (spacing === "compact") return "mt-6 flex flex-col gap-6";
  if (spacing === "medium") return "mt-8 flex flex-col gap-8 sm:mt-12 sm:gap-12";
  return "mt-10 flex flex-col gap-12 sm:mt-16 sm:gap-16";
}

function StackedImage({
  image,
  rounded,
}: {
  image: CaseStudyImage;
  rounded: boolean;
}) {
  const src = imageSrc(image);
  const asset = typeof image === "string" ? null : image;
  const radius = rounded
    ? "rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)]"
    : "";

  if (asset?.frame) {
    return (
      <div
        className={cn("relative w-full overflow-hidden", radius)}
        style={{ aspectRatio: asset.frame }}
      >
        <img
          src={src}
          alt={asset.alt ?? ""}
          className="absolute left-0 w-full max-w-none"
          style={{
            height: asset.crop?.height ?? "100%",
            top: asset.crop?.top ?? "0%",
          }}
        />
      </div>
    );
  }

  const size = imageSize(image);
  return (
    <Image
      src={src}
      alt={asset?.alt ?? ""}
      width={size.width}
      height={size.height}
      className={cn("h-auto w-full", radius)}
      sizes="(max-width: 1024px) 100vw, 943px"
    />
  );
}

function TitleWithLink({
  title,
  link,
}: {
  title: string;
  link: NonNullable<CaseStudySection["titleLink"]>;
}) {
  const phraseAt = link.phrase ? title.indexOf(link.phrase) : -1;
  if (link.phrase && phraseAt >= 0) {
    return (
      <>
        {title.slice(0, phraseAt)}
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-800 underline decoration-1 underline-offset-[0.15em]"
        >
          {link.phrase}
        </a>
        {title.slice(phraseAt + link.phrase.length)}
      </>
    );
  }

  return (
    <>
      <span className="block">{title}</span>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {link.label}
      </a>
    </>
  );
}

function imageSize(image: CaseStudyImage): { width: number; height: number } {
  if (typeof image === "string") return { width: 906, height: 595 };
  return { width: image.width, height: image.height };
}

function SplitImages({ images }: { images: CaseStudyImage[] }) {
  return (
    <div className="mt-10 flex flex-col gap-6 sm:mt-16 sm:flex-row sm:gap-16">
      {images.map((image) => {
        const src = imageSrc(image);
        const asset = typeof image === "string" ? null : image;
        return (
          <div
            key={src}
            className="relative w-full overflow-hidden rounded-[var(--radius-media-sm)] sm:min-w-0 sm:rounded-[var(--radius-media)]"
            style={{
              aspectRatio: asset?.frame ?? "1 / 1",
              flexGrow: asset?.width ?? 1,
              flexBasis: 0,
            }}
          >
            <div
              className="absolute left-0 w-full"
              style={{
                top: asset?.crop?.top ?? "0%",
                height: asset?.crop?.height ?? "100%",
              }}
            >
              <Image
                src={src}
                alt={asset?.alt ?? ""}
                fill
                className="object-cover"
                style={{ objectPosition: asset?.position ?? "center" }}
                sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RichText({ text, className }: { text: string; className?: string }) {
  return <p className={cn("whitespace-pre-line", className)}>{richChildren(text)}</p>;
}

function richChildren(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function PortraitBlock({ block }: { block: CaseStudyMediaBlock }) {
  const width = block.width ?? 305;

  return (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12">
      <div className="w-full shrink-0" style={{ maxWidth: width }}>
        {block.image ? (
          block.aspect ? (
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: block.aspect }}
            >
              <Image
                src={block.image}
                alt=""
                fill
                className="object-cover object-center"
                sizes={`${width}px`}
              />
            </div>
          ) : (
            <Image
              src={block.image}
              alt=""
              width={width}
              height={Math.round(width * (625 / 305))}
              className="h-auto w-full"
              sizes={`${width}px`}
            />
          )
        ) : (
          <div className="aspect-[305/625] w-full bg-grey-50" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="font-display text-[clamp(1.5rem,2vw+0.5rem,2.25rem)] font-bold leading-normal text-text-primary">
          {block.caption}
        </p>
        {block.body ? (
          <p className="font-mono text-base font-light leading-relaxed text-text-primary sm:text-xl sm:leading-[30px]">
            {block.body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: CaseStudyStat }) {
  const tone = STAT_TONE[stat.tone];

  return (
    <article
      className={cn(
        radioCanada.className,
        "@container flex flex-col items-center gap-4 rounded-[20px] border-[8px] bg-white px-4 py-8 text-center sm:gap-6 sm:border-[10px] sm:px-6 sm:py-10",
        tone.border,
      )}
      style={{ boxShadow: "var(--shadow-stat)" }}
    >
      <p className="text-[clamp(1.5rem,11cqi,2.5rem)] font-bold leading-none tracking-[-0.02em] text-black">
        {stat.title}
      </p>
      <div className="flex items-end justify-center gap-2.5">
        <p
          className={cn(
            "text-[clamp(2.25rem,16cqi,4rem)] font-bold leading-[0.71] tracking-[-0.03em] whitespace-nowrap",
            tone.value,
          )}
        >
          {stat.value}
        </p>
        <img src={tone.icon} alt="" className="mb-0.5 shrink-0" />
      </div>
      <p className="text-[clamp(0.875rem,5cqi,1.5rem)] leading-none tracking-[-0.02em] text-black">
        {stat.detail}
      </p>
    </article>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <div className="flex items-stretch gap-4 sm:gap-6">
      <div
        className="w-[3px] shrink-0 self-stretch bg-text-highlight"
        aria-hidden
      />
      <p className="font-mono text-base font-medium italic leading-relaxed text-text-highlight sm:text-xl sm:leading-[37px] md:text-2xl">
        {text}
      </p>
    </div>
  );
}
