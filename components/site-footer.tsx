import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";

interface SiteFooterProps {
  studies?: CaseStudy[];
}

export function SiteFooter(_props: SiteFooterProps = {}) {
  return (
    <footer className="mt-16 flex w-full flex-col items-center gap-6 pb-8 sm:mt-24 sm:gap-8 md:mt-[158px] md:gap-[42px] md:pb-12">
      <div className="h-px w-full bg-text-secondary/30" role="presentation" />
      <div className="page-content flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-sm font-light text-text-secondary sm:text-base md:text-2xl">
          Built by Ellis Aguilar 2026
        </p>
        <div className="flex flex-wrap items-center gap-3 font-mono text-sm font-light text-text-secondary sm:gap-4 sm:text-base md:text-2xl">
          <Link href="#" className="hover:text-text-accent">
            Resume
          </Link>
          <span className="size-1.5 rounded-full bg-text-secondary sm:size-2" aria-hidden />
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-accent"
          >
            LinkedIn
          </a>
          <span className="size-1.5 rounded-full bg-text-secondary sm:size-2" aria-hidden />
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
