import type { CaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  studies?: CaseStudy[];
  className?: string;
}

// Secondary (outlined) button, same treatment as the header nav
const buttonClass = cn(
  "inline-flex items-center justify-center rounded-full border-2 border-text-secondary px-2.5 py-1 font-mono text-xs font-light text-text-secondary touch-manipulation sm:px-3 sm:text-sm md:px-5 md:text-xl",
  "transition-colors duration-150 hover:bg-text-secondary hover:text-bg-base",
);

export function SiteFooter({ className }: SiteFooterProps = {}) {
  return (
    <footer
      className={cn(
        "mt-16 flex w-full flex-col items-center gap-6 pb-8 sm:mt-24 sm:gap-8 md:mt-[158px] md:gap-[42px] md:pb-12",
        className,
      )}
    >
      <div className="h-0.5 w-full bg-text-secondary/30" role="presentation" />
      <div className="page-content flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-xs font-light text-text-secondary sm:text-sm md:text-xl">
          Built by Ellis Aguilar 2026
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-[26px]">
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            Resume
          </a>
          <a
            href="https://www.linkedin.com/in/maguilar1018"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/amaxine1018"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
