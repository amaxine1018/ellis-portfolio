import Image from "next/image";
import type { CaseStudySection } from "@/lib/case-studies/types";

interface CaseStudySectionsProps {
  sections: CaseStudySection[];
}

export function CaseStudySections({ sections }: CaseStudySectionsProps) {
  return (
    <div className="flex flex-col gap-24">
      {sections.map((section) => {
        const quoteAfterMedia = Boolean(
          section.mediaBlocks?.length && section.quote,
        );
        const quoteInline = Boolean(section.quote && !quoteAfterMedia);

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28"
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="flex flex-col gap-6">
              <p className="font-mono text-xl font-light text-text-primary">
                {section.label}
              </p>
              <h2
                id={`${section.id}-heading`}
                className="font-display text-[28px] font-bold leading-normal text-text-primary md:text-[40px]"
              >
                {section.title}
              </h2>

              {section.body ? (
                <p className="whitespace-pre-line font-mono text-xl font-light leading-[30px] text-text-primary">
                  {section.body}
                </p>
              ) : null}

              {quoteInline ? <Quote text={section.quote!} /> : null}

              {section.bodyAfter ? (
                <p className="font-mono text-xl font-light leading-[30px] text-text-primary">
                  {section.bodyAfter}
                </p>
              ) : null}

              {section.mediaBlocks?.map((block) => (
                <div
                  key={block.caption}
                  className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-12"
                >
                  <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-[var(--radius-media)] bg-grey-50 md:h-[381px] md:w-[513px]">
                    {block.image ? (
                      <Image
                        src={block.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="513px"
                      />
                    ) : null}
                  </div>
                  <p className="font-display text-[28px] font-bold leading-normal text-text-primary md:text-[36px]">
                    {block.caption}
                  </p>
                </div>
              ))}

              {quoteAfterMedia ? <Quote text={section.quote!} /> : null}

              {section.media ? (
                <div className="relative h-[240px] w-full overflow-hidden rounded-[var(--radius-media)] bg-grey-50 md:h-[381px]">
                  <Image
                    src={section.media}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="943px"
                  />
                </div>
              ) : section.id === "process" && !section.mediaBlocks?.length ? (
                <div className="h-[240px] w-full rounded-[var(--radius-media)] bg-grey-50 md:h-[381px]" />
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
    <div className="flex items-stretch gap-6">
      <div
        className="w-[3px] shrink-0 self-stretch bg-text-accent"
        aria-hidden
      />
      <p className="font-mono text-xl font-medium italic leading-[37px] text-text-accent md:text-2xl">
        {text}
      </p>
    </div>
  );
}
