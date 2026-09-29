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
    <header className="relative z-20">
      {/* Purple top wave — Figma node Top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[168px] overflow-hidden md:h-[252px]">
        <svg
          className="block h-full w-full"
          viewBox="0 0 1512 252"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M207.5 231C80.5 303.5 0 166 0 166V0H1512V69H340C223 69 334.5 158.5 207.5 231Z"
            fill="var(--purple-50)"
          />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1512px] items-start justify-between px-6 pb-6 pt-8 md:px-[66px] md:pt-[53px]">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Ellis Aguilar home">
          <LogoMark className="size-[88px] md:size-[140px]" />
        </Link>

        <nav
          aria-label="Primary"
          className="relative z-10 mt-4 flex flex-wrap items-center justify-end gap-2 md:mt-[64px] md:gap-[26px]"
        >
          {NAV.map((item) => {
            const isActive = item.match === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-[var(--radius-nav)] border-2 border-text-secondary px-3 py-1 font-mono text-sm font-light text-text-secondary md:px-5 md:text-2xl",
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
