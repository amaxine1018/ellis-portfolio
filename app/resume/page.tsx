import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Design resume for Ellis Aguilar.",
};

/**
 * HTML wrapper so the resume tab uses the site favicon (app/icon.svg).
 * Opening the raw PDF directly cannot set a custom favicon.
 *
 * Exception to the site footer: this page does not render SiteFooter.
 * The PDF fills the viewport instead.
 */
export default function ResumePage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-bg-base">
      <iframe
        title="Ellis Aguilar Design Resume"
        src="/Ellis-Aguilar-Design-Resume.pdf"
        className="min-h-0 w-full flex-1 border-0"
      />
    </main>
  );
}
