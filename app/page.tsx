import { HeroSketch } from "@/components/landing/hero-sketch";
import { WorkCard } from "@/components/landing/work-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllCaseStudies } from "@/lib/case-studies";

/**
 * Landing page — Figma frame 37:13
 */
export default async function HomePage() {
  const studies = await getAllCaseStudies();
  const left = studies.filter((_, i) => i % 2 === 0);
  const right = studies.filter((_, i) => i % 2 === 1);

  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col items-center px-6 pb-8 md:px-0">
        <div className="flex w-full max-w-[var(--page-max)] flex-col items-center gap-16 md:gap-[70px]">
          {/* Hero */}
          <section className="flex w-full flex-col items-center gap-12 md:gap-[69px]">
            <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
              <h1 className="max-w-[872px] font-display text-[40px] font-bold leading-normal text-text-primary md:text-[64px]">
                Hello, I&apos;m Ellis, a{" "}
                <span className="line-through decoration-solid">
                  product designer
                </span>{" "}
                <span className="text-text-accent">builder</span> using AI to
                drive innovation
              </h1>
              <HeroSketch />
            </div>

            <div className="flex flex-col items-center gap-3.5">
              <p className="font-mono text-lg font-semibold text-text-muted md:text-2xl">
                scroll to see work
              </p>
              <svg
                width="31"
                height="12"
                viewBox="0 0 31 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 1L15.5 10L30 1"
                  stroke="var(--grey-100)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </section>

          {/* Work thumbnails — Figma staggered 2-col */}
          <section
            id="work"
            aria-label="Selected work"
            className="grid w-full gap-10 md:grid-cols-2 md:gap-[95px]"
          >
            <div className="flex flex-col gap-10 md:gap-[95px]">
              {left.map((study) => (
                <WorkCard key={study.slug} study={study} />
              ))}
            </div>
            <div className="flex flex-col gap-10 md:pt-24 md:gap-[95px]">
              {right.map((study) => (
                <WorkCard key={study.slug} study={study} />
              ))}
            </div>
          </section>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
