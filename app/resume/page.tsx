import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Resume",
  description: "Design resume for Ellis Aguilar.",
};

/**
 * HTML wrapper so the resume tab uses the site favicon (app/icon.svg).
 * Opening the raw PDF directly cannot set a custom favicon.
 */
export default function ResumePage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-bg-base">
      <iframe
        title="Ellis Aguilar Design Resume"
        src="/Ellis-Aguilar-Design-Resume.pdf"
        className="min-h-0 w-full flex-1 border-0"
      />
      <div className="page-shell">
        <SiteFooter className="mt-6 sm:mt-8 md:mt-10" />
      </div>
    </main>
  );
}
