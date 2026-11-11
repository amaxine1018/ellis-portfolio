import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { CaseStudy } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type {
  CaseStudy,
  CaseStudyMeta,
  CaseStudyImage,
  CaseStudyImageAsset,
  CaseStudyMediaBlock,
  CaseStudyPill,
  CaseStudySection,
  CaseStudyStat,
  CaseStudyStatTone,
  PillTone,
  TokenColor,
} from "./types";

/** "coming-soon" entries are landing-page placeholders: a card, but no case study page. */
function hasPage(study: CaseStudy): boolean {
  return study.thumbnailLayout !== "coming-soon";
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const files = await readdir(CONTENT_DIR);
  const studies = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
        return JSON.parse(raw) as CaseStudy;
      }),
  );
  return studies.sort((a, b) => a.featuredOrder - b.featuredOrder);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const raw = await readFile(path.join(CONTENT_DIR, `${slug}.json`), "utf8");
    const study = JSON.parse(raw) as CaseStudy;
    return hasPage(study) ? study : null;
  } catch {
    return null;
  }
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const studies = await getAllCaseStudies();
  return studies.filter(hasPage).map((study) => study.slug);
}

export function tokenBg(token: string): string {
  return `var(--${token})`;
}
