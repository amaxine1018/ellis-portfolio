import Link from "next/link";
import { HEADER_SHAPE, HeaderShape } from "@/components/brand/header-shape";
import { LOGO_SLOT, LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", match: "home" },
  { href: "/#work", label: "Work", match: "work" },
  { href: "/#studio", label: "Studio", match: "studio" },
  { href: "/#about", label: "About", match: "about" },
] as const;

export type SiteNavActive = "home" | "work" | "studio" | "about";

interface SiteHeaderProps {
  active?: SiteNavActive;
}

const fluid = (px: number) =>
  `min(${px}px, calc(100cqw * ${px} / ${HEADER_SHAPE.frameWidth}))`;

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header
      data-site-header
      className="relative z-20 w-full [container-type:inline-size]"
    >
      <HeaderShape />

      <Link
        href="/"
        data-site-logo
        className="absolute z-10 block"
        style={{
          top: fluid(LOGO_SLOT.top),
          left: fluid(LOGO_SLOT.left),
          width: fluid(LOGO_SLOT.size),
          height: fluid(LOGO_SLOT.size),
        }}
        aria-label="Ellis Aguilar home"
      >
        <LogoMark className="size-full" />
      </Link>

      <div className="relative mx-auto flex h-[112px] w-full max-w-[1512px] items-start justify-end px-6 sm:h-[140px] sm:px-10 md:h-[164px] lg:h-[188px] lg:px-0">
        <nav
          aria-label="Primary"
          className="relative z-10 mt-12 flex flex-wrap items-center justify-end gap-1.5 sm:mt-14 sm:gap-2 md:mt-[72px] lg:mr-[50px] lg:mt-[83px] lg:gap-[26px]"
        >
          {NAV.map((item) => {
            const isActive = item.match === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-[var(--radius-nav)] border-2 border-text-secondary px-2.5 py-1 font-mono text-xs font-light text-text-secondary sm:px-3 sm:text-sm md:px-5 md:text-xl",
                  isActive && "bg-text-secondary text-bg-base",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
