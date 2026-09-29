import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader active="work" />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Case study not found
        </h1>
        <p className="font-mono text-base text-text-muted">
          That slug doesn&apos;t match anything in{" "}
          <code className="text-text-primary">content/case-studies/</code>.
        </p>
        <Link
          href="/"
          className="font-mono text-sm text-text-secondary underline underline-offset-4"
        >
          Back home
        </Link>
      </main>
    </>
  );
}
