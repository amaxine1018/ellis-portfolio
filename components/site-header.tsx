import Link from "next/link";
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

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="relative z-20 w-full [container-type:inline-size]">
      {/* Curved lobe keeps its aspect ratio; the flat right band stretches to the viewport. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: "min(181.831px, calc(100cqw * 181.831 / 1512))" }}
      >
        <svg
          className="absolute top-0 left-0 h-full"
          style={{ width: "min(276px, calc(100cqw * 276 / 1512))" }}
          viewBox="0 0 276 181.831"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMin meet"
          aria-hidden
        >
          <path
            d="M154.5 171.5C80.5 203.163 0 159 0 80.5V0H276V47.5C185.5 47.5 228.5 139.837 154.5 171.5Z"
            fill="var(--purple-50)"
          />
        </svg>
        <svg
          className="absolute top-0"
          style={{
            left: "min(275px, calc(100cqw * 275 / 1512))",
            width: "calc(100% - min(275px, calc(100cqw * 275 / 1512)))",
            height: "min(47.5px, calc(100cqw * 47.5 / 1512))",
          }}
          viewBox="0 0 100 47.5"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect width="100" height="47.5" fill="var(--purple-50)" />
        </svg>
      </div>

      <Link
        href="/"
        className="absolute z-10 block"
        style={{
          top: "min(37px, calc(100cqw * 37 / 1512))",
          left: "min(55px, calc(100cqw * 55 / 1512))",
          width: "min(102px, calc(100cqw * 102 / 1512))",
          height: "min(102px, calc(100cqw * 102 / 1512))",
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
                  "inline-flex items-center justify-center rounded-[var(--radius-nav)] border-2 border-text-secondary px-2.5 py-1 font-mono text-xs font-light text-text-secondary sm:px-3 sm:text-sm md:px-5 md:text-2xl",
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

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M70 0C108.66 0 140 31.3401 140 70C140 108.66 108.66 140 70 140C31.3401 140 0 108.66 0 70C0 31.3401 31.3401 0 70 0ZM70 17C40.7289 17 17 40.7289 17 70C17 99.2711 40.7289 123 70 123C99.2711 123 123 99.2711 123 70C123 54.9869 116.757 41.4324 106.727 31.7891C109.994 51.3861 114.525 86.4745 106.804 94.8965C95.939 106.746 83.7113 112.577 72.165 113.299C60.6186 114.02 48.7109 108.968 39.6904 101.752C30.6703 94.5356 28.4774 87.8191 28.8662 71.4434C29.2552 55.0672 42.2168 38.2471 62.4229 38.2471C77.6881 38.2474 85.334 53.8997 88.1602 61.5537C88.9685 63.7437 87.5136 65.9977 85.2109 66.3818L43.0449 73.4102C41.0208 73.7476 39.4066 75.2956 39.417 77.3477C39.4422 82.2379 41.1383 91.2575 52.3193 96.3398C68.1956 103.556 84.6135 103.556 95.9795 88.4014C104.921 76.4781 97.5592 38.4278 94.0127 22.7393C86.8039 19.0693 78.6436 17 70 17ZM71.0039 56.2793C69.835 53.7208 66.1942 47.7071 58.4531 49.7939C51.3751 51.7023 46.7727 56.9327 44.7852 59.6504C44.2951 60.3206 44.8519 61.1691 45.6738 61.0518L70.2734 57.5381C70.8854 57.4505 71.2608 56.8417 71.0039 56.2793Z"
        fill="var(--navy-800)"
      />
    </svg>
  );
}
