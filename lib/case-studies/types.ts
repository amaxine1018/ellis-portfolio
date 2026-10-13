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
  | "blue-50"
  | "blue-25";

export interface CaseStudyMediaBlock {
  caption: string;
  /** Supporting line under the caption */
  body?: string;
  /** Optional image under /public; grey placeholder if omitted */
  image?: string;
  /** Rendered frame width in px. Defaults to the portrait phone width. */
  width?: number;
  /** CSS aspect-ratio when the source image needs a crop, e.g. "318 / 633" */
  aspect?: string;
}

export interface CaseStudyImageAsset {
  src: string;
  width: number;
  height: number;
  alt?: string;
  /** CSS aspect-ratio for a cropped frame, e.g. "457 / 465" */
  frame?: string;
  /** Overflow crop matching a Figma image frame */
  crop?: { height: string; top: string };
  /** object-position inside the crop window */
  position?: string;
}

/** Path string, or an asset with intrinsic size so mixed aspects stay undistorted */
export type CaseStudyImage = string | CaseStudyImageAsset;

/** Metric module tones from the Boost testing cards */
export type CaseStudyStatTone = "alert" | "caution" | "positive";

export interface CaseStudyStat {
  title: string;
  value: string;
  detail: string;
  tone: CaseStudyStatTone;
}

export type BenchmarkSeries = "v1" | "v2";

export interface BenchmarkPoint {
  series: BenchmarkSeries;
  label: string;
  /** Percent from the top of the plot */
  top: number;
  /** Percent from the left of the plot, at the dot's left edge */
  left: number;
}

export interface BenchmarkCategory {
  label: string;
  /** Percent from the left of the plot, at the label center */
  left: number;
}

export interface BenchmarkChart {
  title: string;
  wash: "top" | "bottom";
  points: BenchmarkPoint[];
  categories: BenchmarkCategory[];
}

export interface BenchmarkLegendItem {
  series: BenchmarkSeries;
  label: string;
}

export interface CaseStudySection {
  id: string;
  /** Uppercase label shown above the section title */
  label: string;
  title: string;
  /** Second line of the title, rendered as a link. `phrase` links that word inside the title to `href`. */
  titleLink?: { href: string; label: string; phrase?: string };
  body?: string;
  /** Accent quote with orange bar (Figma callout) */
  quote?: string;
  /** Second headline, same style as title */
  extraTitle?: string;
  /** Body after quote when both exist */
  bodyAfter?: string;
  /** Disc list rendered with the body copy */
  bullets?: string[];
  mediaBlocks?: CaseStudyMediaBlock[];
  /** Side-by-side phone rows vs stacked full-width images */
  mediaLayout?: "landscape" | "portrait" | "stack" | "row" | "split";
  /** Full-width media under process-style sections */
  media?: string;
  /** Additional images, in order */
  images?: CaseStudyImage[];
  /** Gap between copy and stacked images. compact = 24px, medium = 48px, default = 64px */
  mediaSpacing?: "compact" | "medium";
  /** Round stacked image corners to the media radius */
  roundedImages?: boolean;
  /** Testing metric cards, one inner array per row */
  statRows?: CaseStudyStat[][];
  /** Benchmark dot charts (Boost testing) */
  legend?: BenchmarkLegendItem[];
  charts?: BenchmarkChart[];
  /** Sidebar label when it differs from the section label, e.g. "Ideate" */
  navLabel?: string;
  /** Body copy weight. Defaults to light. */
  bodyWeight?: "light" | "regular";
  /** Include in sticky sidebar (default true) */
  nav?: boolean;
}

export interface CaseStudyMeta {
  tools: string;
  team: string;
  duration: string;
  /** Overrides the default TEAM label, e.g. "MY ROLE" */
  teamLabel?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** Case study headline when it differs from the landing-card title */
  headline?: string;
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
  /**
   * Landing-card image treatment.
   * logo: centered mark crop. device: phone crop. coming-soon: placeholder, no image.
   */
  thumbnailLayout?: "logo" | "device" | "coming-soon";
  /** Optional second/third hero phone images */
  heroImages?: string[];
  /** phones: colored band with device shots. frame: single cropped image. mark: centered logo crop. boost-intro: looping Boost animation. */
  heroLayout?: "phones" | "frame" | "boost-intro" | "mark";
  /** Meta row color. Defaults to accent (navy). */
  metaTone?: "accent" | "primary";
  /** Desktop space between the meta row and the first section. */
  introGap?: "56" | "88";
  pills: CaseStudyPill[];
  meta: CaseStudyMeta;
  sections: CaseStudySection[];
  /** Landing grid column preference: left stack vs right stack height variant */
  cardHeight?: "short" | "tall";
  featuredOrder: number;
}
