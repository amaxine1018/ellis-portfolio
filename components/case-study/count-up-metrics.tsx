"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type {
  BenchmarkLegendItem,
  CaseStudyMetric,
} from "@/lib/case-studies/types";

const DOT_CLASS = {
  v1: "bg-boost-alert",
  v2: "bg-boost-positive",
} as const;

const DURATION = 1;
const HOLD_MS = 3000;

interface CountUpMetricsProps {
  legend: BenchmarkLegendItem[];
  metrics: CaseStudyMetric[];
}

export function CountUpMetrics({ legend, metrics }: CountUpMetricsProps) {
  return (
    <div className="mt-8 flex flex-col items-center gap-12 sm:mt-12 sm:gap-[79px]">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-x-[111px]">
        {metrics.map((metric) => (
          <CountUpMetric key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-[46px] gap-y-3">
        {legend.map((item) => (
          <div key={item.series} className="flex items-center gap-[22px]">
            <span
              aria-hidden
              className={`size-[26px] rounded-full border-[3px] border-text-primary ${DOT_CLASS[item.series]}`}
            />
            <span className="font-mono text-lg text-text-primary sm:text-2xl">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function format(value: number, decimals: number, suffix: string) {
  return `${value.toFixed(decimals)}${suffix}`;
}

/**
 * Shows the baseline value in orange, then counts to the validated value while
 * in view. The number is grey while counting and turns green on arrival. It holds each end for 3s, then counts back
 * and repeats. Reduced motion shows the green result without animating.
 */
function CountUpMetric({ metric }: { metric: CaseStudyMetric }) {
  const { label, from, to, decimals = 0, suffix = "" } = metric;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(from);
  // which end the number is resting on; null while it is counting
  const [rest, setRest] = useState<"from" | "to" | null>("from");
  const valueRef = useRef(from);
  const headingRef = useRef(to);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      setRest("to");
      return;
    }
    if (!inView) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controls: ReturnType<typeof animate> | undefined;

    // Count to one end, hold it for a few seconds, count back, repeat.
    // Colour follows the end it is resting on: orange at the baseline,
    // green at the validated value. Leaving the viewport pauses the loop.
    const run = async () => {
      while (!cancelled) {
        const target = headingRef.current;
        setRest(null);
        controls = animate(valueRef.current, target, {
          duration: DURATION,
          ease: "linear",
          onUpdate: (v) => {
            valueRef.current = v;
            setValue(v);
          },
        });
        await controls;
        if (cancelled) return;
        valueRef.current = target;
        setValue(target);
        setRest(target === to ? "to" : "from");
        await new Promise<void>((resolve) => {
          timer = setTimeout(resolve, HOLD_MS);
        });
        if (cancelled) return;
        headingRef.current = target === to ? from : to;
      }
    };
    void run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controls?.stop();
    };
  }, [inView, reduced, from, to]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      {/* invisible copies of both end values hold the width so nothing shifts while counting */}
      <p
        className={`inline-grid font-display text-[88px] leading-[1.1] font-bold tabular-nums transition-colors duration-150 sm:text-[104px] lg:text-[128px] ${
          rest === "to"
            ? "text-boost-positive"
            : rest === "from"
              ? "text-boost-alert"
              : "text-grey-50"
        }`}
      >
        <span aria-hidden className="invisible col-start-1 row-start-1">
          {format(Math.max(from, to), decimals, suffix)}
        </span>
        <span className="col-start-1 row-start-1 text-center" aria-hidden>
          {format(value, decimals, suffix)}
        </span>
        <span className="sr-only">
          {label}: {format(from, decimals, suffix)} before, {format(to, decimals, suffix)} after
        </span>
      </p>
      <p className="font-display text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
        {label}
      </p>
    </div>
  );
}
