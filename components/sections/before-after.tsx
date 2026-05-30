"use client";

import * as React from "react";
import { Placeholder } from "@/components/ui/placeholder";
import { DevTag } from "@/components/ui/dev-tag";
import { cn } from "@/lib/utils";

// Interactive before/after reveal slider. A mouse drags immediately. On touch the
// slider stays inert (touch-action: pan-y, so the page scrolls past it) until you
// tap to activate, then dragging compares. The tap cue is shown only on coarse
// pointers via CSS, so no JS touch-detection / hydration juggling is needed.
export function BeforeAfter({
  className,
  beforeLabel = "Flat-lay input",
  afterLabel = "ImagePipeline output",
  beforeTone = "product",
  afterTone = "model",
  beforeSrc,
  afterSrc,
}: {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeTone?: string;
  afterTone?: string;
  beforeSrc?: string;
  afterSrc?: string;
}) {
  const [pos, setPos] = React.useState(52);
  const [active, setActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const tapStart = React.useRef<{ x: number; y: number } | null>(null);

  const setFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, next)));
  }, []);

  React.useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate select-none overflow-hidden rounded-2xl border border-line",
        className,
      )}
      // Inert (pan-y) lets touch scroll past; once active we capture the drag.
      // touch-action only affects touch, a mouse drags regardless.
      style={{ aspectRatio: "4/5", touchAction: active ? "none" : "pan-y" }}
      onPointerDown={(e) => {
        if (active || e.pointerType === "mouse") {
          dragging.current = true;
          setFromClientX(e.clientX);
        } else {
          tapStart.current = { x: e.clientX, y: e.clientY };
        }
      }}
      onPointerUp={(e) => {
        // A tap (negligible movement) on touch activates the comparison.
        if (!active && tapStart.current) {
          const dx = Math.abs(e.clientX - tapStart.current.x);
          const dy = Math.abs(e.clientY - tapStart.current.y);
          if (dx < 8 && dy < 8) setActive(true);
          tapStart.current = null;
        }
      }}
    >
      {/* After (full) */}
      <Placeholder
        tone={afterTone}
        src={afterSrc}
        label={afterLabel}
        ratio="4/5"
        rounded="rounded-none"
        className="absolute inset-0 border-0"
      />
      {/* Before (clipped to the left of the handle) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Placeholder
          tone={beforeTone}
          src={beforeSrc}
          label={beforeLabel}
          ratio="4/5"
          rounded="rounded-none"
          className="absolute inset-0 border-0"
        />
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        style={{ left: `${pos}%` }}
      >
        <button
          aria-label="Compare before and after"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/30 bg-ink/70 backdrop-blur transition-transform hover:scale-105 focus-visible:scale-105"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
          }}
        >
          {/* Pulsing ring, coarse pointers only, until activated */}
          {!active ? (
            <span className="absolute inset-0 hidden animate-ping rounded-full border border-white/50 [@media(pointer:coarse)]:block" />
          ) : null}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* "Tap to compare" hint, coarse pointers only, until activated */}
      {!active ? (
        <span className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-pill bg-ink/70 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white backdrop-blur [@media(pointer:coarse)]:inline-flex">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
          Tap to compare
        </span>
      ) : null}

      <DevTag compact />
    </div>
  );
}
