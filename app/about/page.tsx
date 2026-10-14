import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ellis Aguilar is a hands-on designer and systems thinker advancing integrated product design at Northwestern’s Segal Design Institute.",
};

/**
 * About page — Figma frame 190:60
 */
export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />
      <main className="page-shell flex flex-1 flex-col items-center pb-8">
        <div className="page-content flex w-full flex-col items-center">
          <section
            aria-labelledby="about-heading"
            className="flex w-full max-w-[1270px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-[124px]"
          >
            <div className="relative aspect-square w-full max-w-[417px] shrink-0 overflow-hidden">
              <Image
                src="/assets/about/ellis-action-shot.png"
                alt="Ellis Aguilar working at a whiteboard covered in sticky notes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 417px"
                priority
              />
            </div>

            <div className="flex w-full max-w-[723px] flex-col gap-6">
              <h1
                id="about-heading"
                className="font-display text-[clamp(2rem,3vw+1rem,3rem)] font-bold leading-normal text-text-primary"
              >
                About Me
              </h1>
              <div className="font-body text-base font-normal leading-[30px] text-text-secondary">
                <p className="whitespace-pre-line">
                  <span className="font-bold">Ellis Aguilar</span>
                  {` is a hands-on designer and systems thinker currently advancing integrated product design at Northwestern’s Segal Design Institute. With a B.A. in Media Arts and Sciences from Wellesley College, they bring together a background in fine arts and computer science to explore how design can drive meaningful social change.

Their work is grounded in a commitment to accessibility, equity, and inclusive design. These values are shaped by both personal experience and time spent outdoors, where the relationship between user, tool, and environment becomes immediate and tangible.`}
                </p>
                <p className="mt-[30px]">
                  Whether navigating rocky single-track on a mountain bike or
                  repairing a derailleur for city commuters, Ellis draws insight
                  from the mechanics of movement and the demands of real-world
                  conditions. This same curiosity informs their approach to
                  digital systems, where they build interfaces that are
                  intuitive, resilient, and responsive to diverse needs.
                </p>
              </div>
            </div>
          </section>
        </div>

        <SiteFooter className="mt-16 md:mt-[85px]" />
      </main>
    </>
  );
}
