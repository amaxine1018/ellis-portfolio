"use client";

import {
  easeInOut,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PhoneVideo } from "@/components/case-study/phone-video";
import type { CaseStudyMediaBlock } from "@/lib/case-studies/types";

/** Scroll distance (in viewport heights) spent resting on a panel / sliding to the next. */
const HOLD_VH = 40;
const MOVE_VH = 45;
/** Phone height ÷ width: 844/390 screen plus the bezel. */
const PHONE_RATIO = 2.085;

/**
 * Wide screens with room for a pinned panel and no reduced-motion preference.
 * Everyone else (and the server render) gets the plain vertical `fallback`.
 */
function usePinned(): boolean {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return pinned;
}

/**
 * Pins the screens in place while the page scrolls, sliding them left one
 * video/text pair at a time. Only the current pair is visible: the others fade
 * out before they slide away and fade in as they arrive. When scrolling stops
 * between two pairs the page glides to the nearest one in the direction you
 * were going. After the last pair the pin releases and the page carries on
 * scrolling down.
 */
export function HorizontalShowcase({
  blocks,
  fallback,
}: {
  blocks: CaseStudyMediaBlock[];
  fallback: ReactNode;
}) {
  const pinned = usePinned();
  if (!pinned) return <>{fallback}</>;
  return <Pinned blocks={blocks} />;
}

function Pinned({ blocks }: { blocks: CaseStudyMediaBlock[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = blocks.length;
  const step = HOLD_VH + MOVE_VH;
  const total = n * HOLD_VH + (n - 1) * MOVE_VH;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const inputs: number[] = [];
  const outputs: string[] = [];
  for (let i = 0; i < n; i++) {
    const start = i * step;
    inputs.push(start / total, (start + HOLD_VH) / total);
    outputs.push(`${-i * 100}%`, `${-i * 100}%`);
  }
  const x = useTransform(scrollYProgress, inputs, outputs, { ease: easeInOut });

  // Snap: when scrolling stops between two panels, glide to the next one
  // (or back to the previous one) so a panel always ends up centered.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let snapping = false;
    let lastY = window.scrollY;
    let dir = 1;

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const stop = () => {
      cancelAnimationFrame(raf);
      snapping = false;
      lastY = window.scrollY;
    };

    // Our own tween instead of behavior:"smooth": the browser's glide has a
    // variable, slow duration and gets cancelled by trackpad inertia, which
    // read as a stutter. This one is short and always the same.
    const glideTo = (to: number) => {
      const from = window.scrollY;
      const dist = to - from;
      const duration = Math.min(650, Math.max(380, Math.abs(dist) * 0.45));
      const t0 = performance.now();
      snapping = true;
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, from + dist * ease(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else stop();
      };
      raf = requestAnimationFrame(tick);
    };

    const settle = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const progress = (window.scrollY - top) / range;
      if (progress <= 0 || progress >= 1) return;
      const pos = progress * total;
      const i = Math.floor(pos / step);
      // resting on a panel: nothing to do
      if (pos - i * step <= HOLD_VH || i >= n - 1) return;
      const target = dir > 0 ? i + 1 : i;
      const targetPos = target * step + HOLD_VH / 2;
      glideTo(top + (targetPos / total) * range);
    };

    const onScroll = () => {
      if (snapping) return;
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 70);
    };
    // Swallow wheel input while gliding (trackpad inertia would otherwise
    // fight the tween); touch and keys hand control straight back.
    const onWheel = (e: WheelEvent) => {
      if (snapping) e.preventDefault();
    };
    const onTakeOver = () => stop();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTakeOver, { passive: true });
    window.addEventListener("keydown", onTakeOver);
    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTakeOver);
      window.removeEventListener("keydown", onTakeOver);
    };
  }, [n, step, total]);

  return (
    <div
      ref={ref}
      className="relative mt-8 sm:mt-12"
      style={{ height: `calc(100svh + ${total}vh)` }}
      role="group"
      aria-label="Prototype screens"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div className="flex w-full" style={{ x }}>
          {blocks.map((block, i) => (
            <Panel
              key={block.caption}
              block={block}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Panel({
  block,
  index,
  total,
  progress,
}: {
  block: CaseStudyMediaBlock;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const width = block.width ?? 260;
  // width ÷ height of the media: a phone recording, or the block's own crop
  const [aw, ah] = (block.aspect ?? "").split("/").map((v) => parseFloat(v));
  const ratio = aw && ah ? aw / ah : 1 / PHONE_RATIO;
  const start = index * (HOLD_VH + MOVE_VH);
  const end = start + HOLD_VH;
  const half = MOVE_VH / 2;
  // fully visible while resting; gone by the middle of the slide away,
  // and only starts appearing once the slide toward it is half done
  // Keyframes must stay within 0–1 (scroll-linked animations reject offsets
  // outside that range), so the first panel has no fade-in and the last no fade-out.
  const keys: [number, number][] = (
    [
      [start - half, 0],
      [start, 1],
      [end, 1],
      [end + half, 0],
    ] as [number, number][]
  ).filter(([v]) => v >= 0 && v <= total);
  const opacity = useTransform(
    progress,
    keys.map(([v]) => v / total),
    keys.map(([, o]) => o),
  );

  return (
    <motion.div
      className="flex w-full shrink-0 items-center justify-center gap-12"
      style={{ opacity }}
    >
      <div
        className="shrink-0"
        // never taller than the viewport minus some breathing room
        style={{
          width: `min(${width}px, calc((100svh - 10rem) * ${ratio}))`,
        }}
      >
        {block.video ? (
          <PhoneVideo video={block.video} label={block.caption} />
        ) : block.image ? (
          <div
            className="relative w-full"
            style={{ aspectRatio: block.aspect ?? "1 / 1" }}
          >
            <Image
              src={block.image}
              alt={block.caption}
              fill
              className="object-contain"
              sizes={`${width}px`}
            />
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 max-w-[26rem] flex-1 flex-col gap-4">
        <p className="font-display text-[clamp(1.5rem,2vw+0.5rem,2.25rem)] font-bold leading-normal text-text-primary">
          {block.caption}
        </p>
        {block.body ? (
          <p className="font-body text-xl font-normal leading-[30px] text-text-primary">
            {block.body}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
