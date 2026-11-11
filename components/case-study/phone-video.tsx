"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseStudyVideo } from "@/lib/case-studies/types";

/**
 * Looping prototype recording inside a CSS phone bezel on a transparent
 * background (the page color shows through).
 *
 * Everything is sized in container-query units (1cqw = 1% of the phone's
 * width), so the bezel, corner radii and buttons scale with the phone.
 * The screen is 390:844, matching the recordings.
 *
 * Plays only while on screen. With reduced motion it stays on the poster.
 */
export function PhoneVideo({
  video,
  label,
}: {
  video: CaseStudyVideo;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="@container relative w-full">
      {/* side buttons sit behind the bezel and peek out of its edge */}
      <span
        aria-hidden
        className="absolute -left-[0.9cqw] top-[20cqw] h-[7cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-text-primary"
      />
      <span
        aria-hidden
        className="absolute -left-[0.9cqw] top-[31cqw] h-[12cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-text-primary"
      />
      <span
        aria-hidden
        className="absolute -left-[0.9cqw] top-[46cqw] h-[12cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-text-primary"
      />
      <span
        aria-hidden
        className="absolute -right-[0.9cqw] top-[36cqw] h-[18cqw] w-[1.2cqw] rounded-r-[0.6cqw] bg-text-primary"
      />

      <div
        className="relative rounded-[14.6cqw] bg-text-primary p-[3.4cqw] ring-1 ring-inset ring-text-inverse/15"
        style={{ boxShadow: "var(--shadow-stat)" }}
      >
        <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[11.2cqw] bg-text-primary">
          <video
            ref={ref}
            className="absolute inset-0 size-full object-cover"
            poster={video.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
          >
            <source src={video.mp4} type="video/mp4" />
            {video.webm ? <source src={video.webm} type="video/webm" /> : null}
          </video>
        </div>
      </div>
    </div>
  );
}
