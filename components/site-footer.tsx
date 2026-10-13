import type { CaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  studies?: CaseStudy[];
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps = {}) {
  return (
    <footer
      className={cn(
        "mt-16 flex w-full flex-col items-center gap-6 pb-8 sm:mt-24 sm:gap-8 md:mt-[158px] md:gap-[42px] md:pb-12",
        className,
      )}
    >
      <div className="h-px w-full bg-text-secondary/30" role="presentation" />
      <div className="page-content flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-sm font-light text-text-secondary sm:text-base md:text-2xl">
          Built by Ellis Aguilar 2026
        </p>
        <div className="flex flex-wrap items-center gap-3 font-mono text-sm font-light text-text-secondary sm:gap-4 sm:text-base md:text-2xl">
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-highlight"
          >
            Resume
          </a>
          <span className="size-1.5 rounded-full bg-text-secondary sm:size-2" aria-hidden />
          <a
            href="https://www.linkedin.com/in/maguilar1018"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-highlight"
          >
            LinkedIn
          </a>
          <span className="size-1.5 rounded-full bg-text-secondary sm:size-2" aria-hidden />
          <a
            href="https://github.com/amaxine1018"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-highlight"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
