import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/case-study-layout";
import { SiteHeader } from "@/components/site-header";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Case study" };
  return {
    title: study.title,
    description: study.summary,
  };
}

/**
 * Reusable case study route — Figma frame 59:87
 * Content from content/case-studies/[slug].json
 */
export default async function WorkCaseStudyPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <SiteHeader active="work" />
      <main className="flex flex-1 flex-col">
        <CaseStudyLayout study={study} />
      </main>
    </>
  );
}
