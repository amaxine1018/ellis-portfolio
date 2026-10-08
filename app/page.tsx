import { HeroSketch } from "@/components/landing/hero-sketch";
import { WorkCard } from "@/components/landing/work-card";
import { LoadingScreen } from "@/components/loading/loading-screen";
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
      <LoadingScreen />
      <SiteHeader active="home" />
      <main className="page-shell flex flex-1 flex-col items-center pb-8">
        <div className="page-content flex flex-col items-center gap-12 sm:gap-16 md:gap-[70px]">
          {/* Hero */}
          <section className="flex w-full flex-col items-center gap-8 md:gap-10">
            <div className="flex w-full flex-col items-center gap-8 md:gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex w-full max-w-[872px] items-center lg:py-[101px]">
                <h1 className="w-full font-display text-[clamp(2rem,5vw+0.5rem,4rem)] font-bold leading-normal text-text-primary">
                  Hello, I&apos;m Ellis, a{" "}
                  <span className="line-through decoration-solid">
                    product designer
                  </span>{" "}
                  <span className="text-text-highlight">builder</span> using AI to
                  drive innovation
                </h1>
              </div>
              <HeroSketch />
            </div>

            <div className="flex flex-col items-center gap-3.5">
              <p className="font-mono text-base font-semibold text-blue-100 sm:text-lg md:text-2xl">
                scroll to see work
              </p>
              <img
                src="/assets/scroll-arrow.svg"
                alt=""
                width={34}
                height={15}
                aria-hidden
              />
            </div>
          </section>

          {/* Work thumbnails — Figma staggered 2-col */}
          <section
            id="work"
            aria-label="Selected work"
            className="grid w-full gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-[95px]"
          >
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[95px]">
              {left.map((study) => (
                <WorkCard key={study.slug} study={study} />
              ))}
            </div>
            <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 md:pt-16 lg:gap-[95px] lg:pt-24">
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
