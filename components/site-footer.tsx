import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";

interface SiteFooterProps {
  studies?: CaseStudy[];
}

export function SiteFooter(_props: SiteFooterProps = {}) {
  return (
    <footer className="mt-24 flex w-full flex-col items-center gap-8 pb-12 md:mt-[158px] md:gap-[42px]">
      <div className="h-px w-full bg-text-secondary/30" role="presentation" />
      <div className="flex w-full max-w-[var(--page-max)] flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center md:px-0">
        <p className="font-mono text-base font-light text-text-secondary md:text-2xl">
          Built by Ellis Aguilar 2026
        </p>
        <div className="flex flex-wrap items-center gap-4 font-mono text-base font-light text-text-secondary md:gap-4 md:text-2xl">
          <Link href="#" className="hover:text-text-accent">
            Resume
          </Link>
          <span className="size-2 rounded-full bg-text-secondary" aria-hidden />
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-accent"
          >
            LinkedIn
          </a>
          <span className="size-2 rounded-full bg-text-secondary" aria-hidden />
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-accent"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
