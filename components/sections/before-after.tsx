"use client";

import * as React from "react";
import { Placeholder } from "@/components/ui/placeholder";
import { DevTag } from "@/components/ui/dev-tag";
import { cn } from "@/lib/utils";

// Interactive before/after reveal slider. Drag the handle or use arrow keys.
export function BeforeAfter({
  className,
  beforeLabel = "Flat-lay input",
  afterLabel = "Vela output",
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
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

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
      style={{ aspectRatio: "4/5", touchAction: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
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
          aria-label="Drag to compare"
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/30 bg-ink/70 backdrop-blur transition-transform hover:scale-105 focus-visible:scale-105"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
          }}
        >
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

      <DevTag compact />
    </div>
  );
}
