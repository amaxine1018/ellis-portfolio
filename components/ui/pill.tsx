import { cn } from "@/lib/utils";

export type PillTone =
  | "orange"
  | "pink"
  | "green"
  | "blue"
  | "mint"
  | "gold"
  | "purple";

const TONE_CLASS: Record<PillTone, string> = {
  orange: "bg-orange-100",
  pink: "bg-pink-50",
  green: "bg-green-200",
  blue: "bg-blue-100",
  mint: "bg-mint-50",
  gold: "bg-gold-200",
  purple: "bg-purple-50",
};

interface PillProps {
  label: string;
  tone: PillTone;
  className?: string;
}

export function Pill({ label, tone, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-pill)] px-4 py-1 font-mono text-sm font-bold text-text-inverse md:text-2xl",
        TONE_CLASS[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
