"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const STROKE_TTL_MS = 10_000;
const LINE_WIDTH_CSS = 8;
/** Temporary cursor: tip at bottom-left of 63×72 PNG */
const CURSOR_HOTSPOT = "0 72";
const CURSOR_URL = `/assets/small-sharpie.png`;

type Point = { x: number; y: number };
type Stroke = { points: Point[]; bornAt: number };

/**
 * Hero sketch — Figma Sketch 96:38. The flat square post-it is the drawing surface.
 * Interactive: pick up sharpie → draw on sketch → strokes fade after 10s.
 */
export function HeroSketch() {
  const [isSharpieActive, setIsSharpieActive] = useState(false);

  const postItRef = useRef<HTMLDivElement>(null);
  const sharpieBtnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchBoxRef = useRef<HTMLDivElement>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef(1);

  const drawStrokes = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const cssW = canvas.width / dpr;
    const cssH = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const alive: Stroke[] = [];
    for (const stroke of strokesRef.current) {
      const age = now - stroke.bornAt;
      if (age >= STROKE_TTL_MS) continue;
      alive.push(stroke);

      const opacity = 1 - age / STROKE_TTL_MS;
      const pts = stroke.points;
      if (pts.length === 0) continue;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.lineWidth = LINE_WIDTH_CSS;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      if (pts.length === 1) {
        ctx.lineTo(pts[0].x + 0.01, pts[0].y);
      }
      ctx.stroke();
    }
    strokesRef.current = alive;
    ctx.restore();
  }, []);

  const startFadeLoop = useCallback(() => {
    if (rafRef.current != null) return;

    const tick = (now: number) => {
      drawStrokes(now);
      if (strokesRef.current.length > 0 || drawingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawStrokes]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const box = sketchBoxRef.current;
    if (!canvas || !box) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const { clientWidth: w, clientHeight: h } = box;
    if (w === 0 || h === 0) return;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Redraw after resize so strokes aren't lost visually
    drawStrokes(performance.now());
  }, [drawStrokes]);

  // Canvas resize
  useEffect(() => {
    resizeCanvas();
    const box = sketchBoxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(box);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  // Cancel rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // Body cursor while sharpie is active (restored on deactivate + unmount)
  useEffect(() => {
    if (!isSharpieActive) return;

    const prev = document.body.style.cursor;
    document.body.style.cursor = `url('${CURSOR_URL}') ${CURSOR_HOTSPOT}, auto`;

    return () => {
      document.body.style.cursor = prev;
    };
  }, [isSharpieActive]);

  // Outside click → put sharpie down
  useEffect(() => {
    if (!isSharpieActive) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (postItRef.current?.contains(target)) return;
      if (sharpieBtnRef.current?.contains(target)) return;
      setIsSharpieActive(false);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isSharpieActive]);

  const pointerToLocal = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const cssW = canvas.width / dprRef.current;
    const cssH = canvas.height / dprRef.current;
    return {
      x: rect.width === 0 ? 0 : ((e.clientX - rect.left) / rect.width) * cssW,
      y: rect.height === 0 ? 0 : ((e.clientY - rect.top) / rect.height) * cssH,
    };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isSharpieActive) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;

    const stroke: Stroke = {
      points: [pointerToLocal(e)],
      bornAt: performance.now(),
    };
    activeStrokeRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    startFadeLoop();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isSharpieActive || !drawingRef.current) return;
    const stroke = activeStrokeRef.current;
    if (!stroke) return;
    stroke.points.push(pointerToLocal(e));
  };

  const endStroke = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    activeStrokeRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const toggleSharpie = () => {
    setIsSharpieActive((v) => !v);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[455px] flex-col items-center gap-[31px]">
      {/* Sticky note — Figma 152:589, scaled down only when the column is narrower */}
      <div className="w-full max-w-[332.819px] [container-type:inline-size]">
        <div
          ref={postItRef}
          className="relative"
          style={{ height: "calc(324 / 332.819 * 100cqw)" }}
        >
          <div
            className="absolute top-0 left-0 h-[324px] w-[332.819px] origin-top-left"
            style={{ transform: "scale(calc(100cqw / 332.819px))" }}
          >
            <img
              src="/assets/sticky-shadow.svg"
              alt=""
              width={306}
              height={324}
              className="absolute top-0 left-0"
            />
            {/* Flat square post-it is the drawing surface */}
            <div className="absolute top-0 left-[13.86px] flex size-[318.962px] items-center justify-center">
              <div
                ref={sketchBoxRef}
                className="relative size-[315.9px] bg-yellow-50"
              >
                <img
                  src="/assets/sticky-marks.svg"
                  alt=""
                  width={291}
                  height={47}
                  className="pointer-events-none absolute top-[241px] left-[12px]"
                />
                <div className="pointer-events-none absolute top-[28.5px] left-[34.8px] h-[243px] w-[244px]">
                  <Image
                    src="/assets/headshot-sketch.png"
                    alt="Ink sketch portrait of Ellis"
                    fill
                    className="object-cover mix-blend-darken"
                    sizes="244px"
                    priority
                  />
                </div>
                <canvas
                  ref={canvasRef}
                  aria-hidden
                  className={`absolute inset-0 z-10 size-full ${
                    isSharpieActive
                      ? "pointer-events-auto touch-none"
                      : "pointer-events-none"
                  }`}
                  style={
                    isSharpieActive
                      ? {
                          cursor: `url('${CURSOR_URL}') ${CURSOR_HOTSPOT}, auto`,
                        }
                      : undefined
                  }
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endStroke}
                  onPointerCancel={endStroke}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sharpie on ledge — no blend modes; keep grey shadow from Figma export */}
      <div className="relative flex w-full max-w-[441px] flex-col items-center gap-0">
        <button
          ref={sharpieBtnRef}
          type="button"
          aria-pressed={isSharpieActive}
          aria-label={
            isSharpieActive ? "Put the sharpie down" : "Pick up the sharpie"
          }
          onClick={toggleSharpie}
          className="block w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <Image
            src="/assets/sharpie-v3.png"
            alt=""
            width={416}
            height={59}
            className={`block h-auto w-full transition-opacity duration-150 ${
              isSharpieActive ? "invisible opacity-0" : "visible opacity-100"
            }`}
            sizes="(max-width: 640px) 90vw, 441px"
          />
        </button>
        <div className="flex w-full flex-col items-start">
          <div
            className="h-10 w-full"
            style={{
              backgroundImage:
                "linear-gradient(154deg, rgb(253, 228, 172) 54%, rgb(181, 139, 80) 143%)",
            }}
          />
          <div className="relative h-[17.5px] w-full">
            <Image
              src="/assets/ledge.svg"
              alt=""
              fill
              className="object-fill"
              sizes="(max-width: 640px) 90vw, 441px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
