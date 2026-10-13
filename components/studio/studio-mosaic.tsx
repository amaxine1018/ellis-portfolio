"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Column-major order matches the Studio frame: left stack, then middle, then right.
 * Desktop column breaks keep that grouping; narrower widths reflow with CSS columns.
 */
const STUDIO_IMAGES = [
  {
    src: "/assets/studio/dsc-0148.jpg",
    width: 500,
    height: 745,
    alt: "Person standing under a flowering tree in a light blue top",
  },
  {
    src: "/assets/studio/img-4495.jpg",
    width: 1000,
    height: 800,
    alt: "Framed artwork of orange silhouettes lying on grass",
  },
  {
    src: "/assets/studio/gargola.jpg",
    width: 600,
    height: 600,
    alt: "Illustrated poster reading Soy una Gargola",
  },
  {
    src: "/assets/studio/hightea.png",
    width: 800,
    height: 1000,
    alt: "Illustrated High Tea poster with mushrooms and characters",
  },
  {
    src: "/assets/studio/img-8327.jpg",
    width: 900,
    height: 747,
    alt: "Painting of a figure with a sunburst behind them",
  },
  {
    src: "/assets/studio/img-4473.jpg",
    width: 600,
    height: 750,
    alt: "Painting of a person running through a green field",
  },
  {
    src: "/assets/studio/exhibition.png",
    width: 500,
    height: 607,
    alt: "Painting of a figure among large green leaves",
  },
  {
    src: "/assets/studio/jg-mockup-tag.png",
    width: 1000,
    height: 750,
    alt: "Clothing tag resting on yellow fabric",
  },
  {
    src: "/assets/studio/afterglow-25.png",
    width: 600,
    height: 750,
    alt: "Afterglow poster of a cyclist riding through a purple landscape",
  },
  {
    src: "/assets/studio/afterglow.png",
    width: 500,
    height: 625,
    alt: "Afterglow poster of a cyclist against a yellow sky",
  },
  {
    src: "/assets/studio/serenity.jpg",
    width: 600,
    height: 600,
    alt: "Charcoal sketch of a person with curly hair and glasses",
  },
  {
    src: "/assets/studio/dsc-0781.jpg",
    width: 1000,
    height: 671,
    alt: "Bare tree branches against a purple night sky",
  },
  {
    src: "/assets/studio/lnf-hor.png",
    width: 1500,
    height: 750,
    alt: "Lovers n Friends poster of two figures on a red background",
  },
] as const;

/** First image of the middle and right stacks in STUDIO_IMAGES. */
const DESKTOP_COLUMN_STARTS = new Set([4, 8]);

type StudioImage = (typeof STUDIO_IMAGES)[number];

export function StudioMosaic() {
  const [active, setActive] = useState<StudioImage | null>(null);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <>
      <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
        {STUDIO_IMAGES.map((image, index) => (
          <figure
            key={image.src}
            className={cn(
              "mb-6 break-inside-avoid",
              DESKTOP_COLUMN_STARTS.has(index) && "lg:break-before-column",
            )}
          >
            <button
              type="button"
              className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
              onClick={() => setActive(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="eager"
                className="block h-auto w-full"
              />
            </button>
          </figure>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-10"
          onClick={() => setActive(null)}
        >
          {/* Original file, not the compressed grid thumbnail. */}
          <img
            src={active.src}
            alt={active.alt}
            width={active.width}
            height={active.height}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
