import Image from "next/image";

/**
 * Hero sketch — Figma Sketch 96:38 / Portrait 42:123 / sharpie 117:26
 * Portrait→Sharpie gap 8px; sharpie 415.5×58.5 flush on ledge.
 */
export function HeroSketch() {
  return (
    <div className="relative mx-auto flex w-full max-w-[min(100%,455px)] flex-col items-center gap-2">
      {/* Sticky note / portrait — sketch inset so it only sits on the yellow post-it */}
      <div className="relative isolate h-[280px] w-full sm:h-[320px] md:h-[450px]">
        <Image
          src="/assets/portrait-v2.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 90vw, 455px"
          priority
        />
        {/* Yellow post-it region ≈ Figma padding box; sketch sized to stay inside it */}
        <div className="absolute inset-0 flex items-start justify-center px-[18%] pt-[16%] sm:px-[20%] sm:pt-[18%] md:justify-start md:px-0 md:pb-[56px] md:pl-[92px] md:pr-[140px] md:pt-[88px]">
          <div className="relative aspect-square w-full max-w-[180px] sm:max-w-[210px] md:max-w-none md:size-[290px]">
            <Image
              src="/assets/sketch-v4.png"
              alt="Ink sketch portrait of Ellis"
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width: 768px) 210px, 290px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Sharpie on ledge — no blend modes; keep grey shadow from Figma export */}
      <div className="relative -mt-1 flex w-full max-w-[441px] flex-col items-center gap-0">
        <Image
          src="/assets/sharpie-v3.png"
          alt=""
          width={416}
          height={59}
          className="block h-auto w-full"
          sizes="(max-width: 640px) 90vw, 441px"
        />
        <div className="flex w-full flex-col items-start">
          <div
            className="h-10 w-full"
            style={{
              backgroundImage:
                "linear-gradient(154deg, rgb(253, 228, 172) 54%, rgb(181, 139, 80) 143%)",
            }}
          />
          <div className="relative h-[17.5px] w-full">
            <Image
              src="/assets/ledge.svg"
              alt=""
              fill
              className="object-fill"
              sizes="(max-width: 640px) 90vw, 441px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
