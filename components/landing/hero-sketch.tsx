import Image from "next/image";

export function HeroSketch() {
  return (
    <div className="relative mx-auto flex w-full max-w-[455px] flex-col items-center gap-2">
      {/* Sticky note / portrait */}
      <div className="relative flex h-[320px] w-full items-start justify-center px-8 pt-10 md:h-[450px] md:px-[98px] md:pt-[82px]">
        <Image
          src="/assets/portrait.png"
          alt=""
          fill
          className="object-cover"
          sizes="455px"
          priority
        />
        <div className="relative z-10 flex h-[240px] w-[170px] items-center justify-center mix-blend-darken md:h-[327px] md:w-[230px]">
          <div className="-rotate-[3.46deg]">
            <div className="relative h-[230px] w-[155px] overflow-hidden md:h-[315px] md:w-[211px]">
              <Image
                src="/assets/sketch.png"
                alt="Ink sketch portrait of Ellis"
                fill
                className="object-cover"
                sizes="211px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sharpie on ledge */}
      <div className="relative flex w-full max-w-[441px] flex-col items-center">
        <div className="relative h-10 w-[90%] max-w-[409px] shadow-[0px_7px_3.1px_0px_rgba(0,0,0,0.25)] md:h-12">
          <Image
            src="/assets/sharpie.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="409px"
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <div
            className="h-8 w-full md:h-10"
            style={{
              backgroundImage:
                "linear-gradient(154deg, rgb(253, 228, 172) 54%, rgb(181, 139, 80) 143%)",
            }}
          />
          <div className="relative h-[14px] w-full md:h-[17.5px]">
            <Image
              src="/assets/ledge.svg"
              alt=""
              fill
              className="object-fill"
              sizes="441px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
