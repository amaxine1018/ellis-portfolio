/**
 * Content-driven case study shape.
 * Layout reads this; copy/media live under content/case-studies/.
 * Section ids power sticky nav + scroll-spy.
 */

export type PillTone =
  | "orange"
  | "pink"
  | "green"
  | "blue"
  | "mint"
  | "gold"
  | "purple"
  | "navy";

export interface CaseStudyPill {
  label: string;
  tone: PillTone;
}

/** CSS variable name for card/hero background, e.g. "purple-50" → var(--purple-50) */
export type TokenColor =
  | "purple-50"
  | "mint-50"
  | "orange-50"
  | "gold-200"
  | "grey-50"
  | "pink-50"
  | "orange-100"
  | "green-200"
  | "blue-100"
  | "blue-50";

export interface CaseStudyMediaBlock {
  caption: string;
  /** Optional image under /public; grey placeholder if omitted */
  image?: string;
}

/** Metric module tones from the Boost testing cards */
export type CaseStudyStatTone = "alert" | "caution" | "positive";

export interface CaseStudyStat {
  title: string;
  value: string;
  detail: string;
  tone: CaseStudyStatTone;
}

export interface CaseStudySection {
  id: string;
  /** Uppercase label shown above the section title */
  label: string;
  title: string;
  body?: string;
  /** Accent quote with orange bar (Figma callout) */
  quote?: string;
  /** Second headline, same style as title */
  extraTitle?: string;
  /** Body after quote when both exist */
  bodyAfter?: string;
  mediaBlocks?: CaseStudyMediaBlock[];
  /** Side-by-side phone rows vs stacked full-width images */
  mediaLayout?: "landscape" | "portrait" | "stack";
  /** Full-width media under process-style sections */
  media?: string;
  /** Additional full-width images, in order */
  images?: string[];
  /** Testing metric cards, one inner array per row */
  statRows?: CaseStudyStat[][];
  /** Include in sticky sidebar (default true) */
  nav?: boolean;
}

export interface CaseStudyMeta {
  tools: string;
  team: string;
  duration: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  year: string;
  client: string;
  status: "Concept" | "Shipped" | string;
  /** Landing card background token */
  thumbnailTone: TokenColor;
  /** Case study hero band token (falls back to thumbnailTone) */
  heroTone?: TokenColor;
  thumbnailImage: string;
  /** Animated thumbnail that replaces thumbnailImage on the landing card */
  thumbnailMotion?: "boost-intro";
  /** Optional second/third hero phone images */
  heroImages?: string[];
  /** phones: colored band with device shots. frame: single cropped image. boost-intro: looping Boost animation. */
  heroLayout?: "phones" | "frame" | "boost-intro";
  pills: CaseStudyPill[];
  meta: CaseStudyMeta;
  sections: CaseStudySection[];
  /** Landing grid column preference: left stack vs right stack height variant */
  cardHeight?: "short" | "tall";
  featuredOrder: number;
}
