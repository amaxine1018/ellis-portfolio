import Image from "next/image";
import type { CaseStudySection } from "@/lib/case-studies/types";

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
                {section.title}
              </h2>

              {section.body ? (
                <p className="whitespace-pre-line font-mono text-base font-light leading-relaxed text-text-primary sm:text-xl sm:leading-[30px]">
                  {section.body}
                </p>
              ) : null}

              {quoteInline ? <Quote text={section.quote!} /> : null}

              {section.bodyAfter ? (
                <p className="font-mono text-base font-light leading-relaxed text-text-primary sm:text-xl sm:leading-[30px]">
                  {section.bodyAfter}
                </p>
              ) : null}

              {section.mediaBlocks?.map((block) => (
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
              ) : section.id === "process" && !section.mediaBlocks?.length ? (
                <div className="h-[200px] w-full rounded-[var(--radius-media-sm)] bg-grey-50 sm:h-[240px] sm:rounded-[var(--radius-media)] md:h-[381px]" />
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <div className="flex items-stretch gap-4 sm:gap-6">
      <div
        className="w-[3px] shrink-0 self-stretch bg-text-accent"
        aria-hidden
      />
      <p className="font-mono text-base font-medium italic leading-relaxed text-text-accent sm:text-xl sm:leading-[37px] md:text-2xl">
        {text}
      </p>
    </div>
  );
}
