"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed Boost intro loop — Figma frames 180:252 → 181:530 (1746×932).
 *
 * F1–F2: orange circle nested under the blue pill top with equal padding.
 * F3+: nest released; circle holds center while blue extends / widens.
 */

const ASSETS = "/assets/thumbs/boost";

const FW = 1746;
const FH = 932;
const CIRCLE = 244;
const BLUE_NARROW = 302;
const PAD = (BLUE_NARROW - CIRCLE) / 2; // 29

const ORANGE = "var(--orange-200)";
const SHADOW = "#a24212";
const BLUE = "var(--blue-50)";

/** Smooth ease-in-out — softer than the previous stepped curve */
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DURATION = 6.4;

/**
 * Timeline (shared clock):
 * 0.00 F1 start
 * 0.18 F2 center — shadow matches blue height, then fades
 * 0.30 F3 blue full height, nest released
 * 0.38 widen start — circle begins fading, mark begins scaling
 * 0.48 nearly full blue + mark growing
 * 0.58 full blue, mark large
 * 0.68 mark peak
 * 0.76 mark faded
 * 0.86 orange restored
 * 0.92 shadow re-enters
 * 0.96 blue+circle at F1
 * 1.00 loop
 */
const TIMES = [0, 0.18, 0.3, 0.38, 0.48, 0.58, 0.68, 0.76, 0.86, 0.92, 0.96, 1];

const BLUE_TOP_F1 = 373 + 184; // 557
const BLUE_TOP_F2 = 313;
const BLUE_TOP_F3 = -415;
const BLUE_H_F1 = 616;
const BLUE_H_F2 = 1089;
const BLUE_H_F3 = 1762;
const SHADOW_TOP_F1 = 373;
const SHADOW_H_F1 = 631;

type Size = { w: number; h: number };

function useStageSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

const mx = (px: number, w: number) => (px / FW) * w;
const my = (px: number, h: number) => (px / FH) * h;

export function BoostThumb() {
  const reduce = useReducedMotion();
  const { ref, size } = useStageSize();
  const ready = size.w > 0 && size.h > 0;

  const x = (px: number) => mx(px, size.w);
  const y = (px: number) => my(px, size.h);
  const pad = x(PAD);
  const circleSize = x(CIRCLE);
  const blueW1 = x(BLUE_NARROW);

  // Overshoot width so rounded ends never leave orange gutters
  const blueFull = size.w * 1.2;

  const circleTopF1 = y(BLUE_TOP_F1) + pad;
  const circleTopF2 = y(BLUE_TOP_F2) + pad;
  const circleTopHold = y(344);

  // At F2, shadow matches blue exactly (same top + height)
  const blueTopF2 = y(BLUE_TOP_F2);
  const blueH_F2 = y(BLUE_H_F2);

  const transition = {
    duration: DURATION,
    ease: EASE,
    times: TIMES,
    repeat: Infinity,
    repeatType: "loop" as const,
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ background: ORANGE }}
      aria-hidden
    >
      {!ready ? null : reduce ? (
        <StaticPose
          blueTop={blueTopF2}
          blueW={blueW1}
          blueH={blueH_F2}
          circleTop={circleTopF2}
          circleSize={circleSize}
        />
      ) : (
        <>
          {/* Line shadow — matches blue height at center, then fades */}
          <motion.div
            className="absolute left-1/2 z-0 -translate-x-1/2 will-change-transform"
            style={{ background: SHADOW }}
            initial={false}
            animate={{
              top: [
                y(SHADOW_TOP_F1),
                blueTopF2,
                blueTopF2,
                blueTopF2,
                blueTopF2,
                blueTopF2,
                blueTopF2,
                blueTopF2,
                size.h + 40,
                y(SHADOW_TOP_F1),
                y(SHADOW_TOP_F1),
                y(SHADOW_TOP_F1),
              ],
              width: [
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
              ],
              height: [
                y(SHADOW_H_F1),
                blueH_F2, // same height as blue at center
                blueH_F2,
                blueH_F2,
                blueH_F2,
                blueH_F2,
                blueH_F2,
                blueH_F2,
                y(SHADOW_H_F1),
                y(SHADOW_H_F1),
                y(SHADOW_H_F1),
                y(SHADOW_H_F1),
              ],
              borderRadius: [
                9999, 9999, 9999, 9999, 9999, 9999, 9999, 9999, 9999, 9999,
                9999, 9999,
              ],
              opacity: [1, 0.35, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            }}
            transition={transition}
          />

          {/* Blue line — overshoots card width + radius → 0 so no orange sides */}
          <motion.div
            className="absolute left-1/2 z-[1] -translate-x-1/2 will-change-transform"
            style={{ background: BLUE }}
            initial={false}
            animate={{
              top: [
                y(BLUE_TOP_F1),
                blueTopF2,
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F3),
                y(BLUE_TOP_F1),
                size.h * 0.88,
                y(BLUE_TOP_F1),
                y(BLUE_TOP_F1),
              ],
              width: [
                blueW1,
                blueW1,
                blueW1,
                x(602),
                blueFull,
                blueFull,
                blueFull,
                blueFull,
                blueW1,
                blueW1,
                blueW1,
                blueW1,
              ],
              height: [
                y(BLUE_H_F1),
                blueH_F2,
                y(BLUE_H_F3),
                y(BLUE_H_F3),
                y(BLUE_H_F3),
                y(BLUE_H_F3),
                y(BLUE_H_F3),
                y(BLUE_H_F3),
                y(BLUE_H_F1),
                y(BLUE_H_F1),
                y(BLUE_H_F1),
                y(BLUE_H_F1),
              ],
              borderRadius: [
                9999,
                9999,
                9999,
                x(165),
                0,
                0,
                0,
                0,
                9999,
                9999,
                9999,
                9999,
              ],
            }}
            transition={transition}
          />

          {/* Orange circle — fades as soon as widen begins */}
          <motion.div
            className="absolute left-1/2 z-[2] -translate-x-1/2 will-change-transform"
            style={{ width: circleSize, height: circleSize }}
            initial={false}
            animate={{
              top: [
                circleTopF1,
                circleTopF2,
                circleTopHold,
                circleTopHold,
                circleTopHold,
                circleTopHold,
                circleTopHold,
                circleTopHold,
                circleTopF1,
                size.h * 0.9,
                circleTopF1,
                circleTopF1,
              ],
              opacity: [1, 1, 1, 0.4, 0, 0, 0, 0, 0, 0, 1, 1],
            }}
            transition={transition}
          >
            <img
              src={`${ASSETS}/logo-circle.svg`}
              alt=""
              className="absolute inset-0 size-full"
              width={244}
              height={244}
            />
            <motion.img
              src={`${ASSETS}/boost-mark.svg`}
              alt=""
              className="absolute left-1/2 top-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2"
              width={208}
              height={98}
              initial={false}
              animate={{ opacity: [1, 1, 1, 0.2, 0, 0, 0, 0, 0, 0, 1, 1] }}
              transition={transition}
            />
          </motion.div>

          {/* Flyer mark — scales up as blue widens (starts at widen, not after) */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[3] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center will-change-transform"
            style={{ width: circleSize, height: circleSize }}
            initial={false}
            animate={{
              scale: [1, 1, 1, 1.35, 2.4, 5.5, 9.5, 9.5, 1, 1, 1, 1],
              opacity: [0, 0, 0, 0.85, 1, 1, 1, 0, 0, 0, 0, 0],
            }}
            transition={transition}
          >
            <img
              src={`${ASSETS}/boost-mark.svg`}
              alt=""
              className="w-[85%]"
              width={208}
              height={98}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}

function StaticPose({
  blueTop,
  blueW,
  blueH,
  circleTop,
  circleSize,
}: {
  blueTop: number;
  blueW: number;
  blueH: number;
  circleTop: number;
  circleSize: number;
}) {
  return (
    <>
      <div
        className="absolute left-1/2 z-[1] -translate-x-1/2"
        style={{
          top: blueTop,
          width: blueW,
          height: blueH,
          borderRadius: 9999,
          background: BLUE,
        }}
      />
      <div
        className="absolute left-1/2 z-[2] -translate-x-1/2"
        style={{ top: circleTop, width: circleSize, height: circleSize }}
      >
        <img
          src={`${ASSETS}/logo-circle.svg`}
          alt=""
          className="absolute inset-0 size-full"
          width={244}
          height={244}
        />
        <img
          src={`${ASSETS}/boost-mark.svg`}
          alt=""
          className="absolute left-1/2 top-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2"
          width={208}
          height={98}
        />
      </div>
    </>
  );
}
