import type { Metadata } from "next";
import { StudioMosaic } from "@/components/studio/studio-mosaic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "A studio of paintings, posters, and photographs by Ellis Aguilar.",
};

/**
 * Studio page — Figma frame 190:179
 */
export default function StudioPage() {
  return (
    <>
      <SiteHeader active="studio" />
      <main className="page-shell flex flex-1 flex-col items-center pb-8">
        <div className="page-content flex w-full flex-col gap-8 pt-[15px] md:gap-[54px]">
          <h1 className="text-center font-display text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-normal text-text-primary">
            I enjoy making things, welcome to my{" "}
            <span className="italic">studio</span>:
          </h1>
          <StudioMosaic />
        </div>
        <SiteFooter className="mt-16 md:mt-[85px]" />
      </main>
    </>
  );
}
