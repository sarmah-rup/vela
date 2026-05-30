"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DevTag } from "@/components/ui/dev-tag";
import { cn } from "@/lib/utils";

// Center-focused, infinitely looping carousel. The middle slide is zoomed in,
// neighbours zoom out. Slides are repeated across several copies and the track
// silently snaps back a copy once it drifts past the edges, so clicking left or
// right (or autoplay) keeps producing images endlessly.
const slides = [
  { src: "/img/ip2/694d1aba2b34deb3ac23e9bf_Botika_Homepage_Client_Tobi.avif", brand: "Marisol" },
  { src: "/img/ip2/694d1aba2b34deb3ac23e9c3_Botika_Homepage_Client_Edikted.avif", brand: "Northwind" },
  { src: "/img/ip2/694d1aba6f75e6997aa01475_Botika_Homepage_Client_Forever21.avif", brand: "Cadence" },
  { src: "/img/ip2/694d1aba357b875e39fac185_Botika_Homepage_Client_NilandMon.avif", brand: "Tindra" },
  { src: "/img/ip2/694d1aba91a13a0bfec750c4_Botika_Homepage_Client_Jordache.avif", brand: "Atelier 9" },
  { src: "/img/ip2/694d1abaab7d5eb267387995_Botika_Homepage_Client_PerryEllis.avif", brand: "Saola" },
  { src: "/img/ip2/69843784a0cc58c8ebf8d877_Heliot_AImodel_Example.avif", brand: "Kestrel" },
];

const W = 340; // slide width (px)
const G = 22; // gap (px)
const STEP = W + G;
const REPS = 5; // copies of the slide set rendered into the track

export function CenterSlider() {
  const n = slides.length;
  const BASE = Math.floor(REPS / 2) * n;
  const [pos, setPos] = React.useState(BASE);
  const [paused, setPaused] = React.useState(false);
  const [noAnim, setNoAnim] = React.useState(false);
  const active = ((pos % n) + n) % n;

  const move = React.useCallback((dir: number) => {
    setNoAnim(false);
    setPos((p) => p + dir);
  }, []);

  // Jump to a brand via the dots, taking the shortest path.
  const goTo = React.useCallback(
    (d: number) => {
      setNoAnim(false);
      setPos((p) => {
        const cur = ((p % n) + n) % n;
        let delta = (d - cur) % n;
        if (delta > n / 2) delta -= n;
        if (delta < -n / 2) delta += n;
        return p + delta;
      });
    },
    [n],
  );

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setNoAnim(false);
      setPos((p) => p + 1);
    }, 3600);
    return () => clearInterval(id);
  }, [paused]);

  const rendered = React.useMemo(
    () => Array.from({ length: REPS }).flatMap(() => slides),
    [],
  );

  // After a move settles, if we've drifted near either edge, snap back a whole
  // copy with no animation — content is identical so the jump is invisible.
  const handleRest = () => {
    if (pos < n || pos >= (REPS - 1) * n) {
      setNoAnim(true);
      setPos(BASE + active);
    }
  };
  React.useEffect(() => {
    if (!noAnim) return;
    const id = requestAnimationFrame(() => setNoAnim(false));
    return () => cancelAnimationFrame(id);
  }, [noAnim]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto h-[24rem] overflow-hidden sm:h-[32rem] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
        <motion.div
          className="absolute inset-y-0 left-1/2 flex items-center"
          style={{ gap: G }}
          animate={{ x: -(pos * STEP + W / 2) }}
          transition={
            noAnim
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 24, mass: 0.5 }
          }
          onAnimationComplete={handleRest}
        >
          {rendered.map((s, gi) => {
            const isActive = gi === pos;
            return (
              <motion.button
                key={gi}
                onClick={() => {
                  setNoAnim(false);
                  setPos(gi);
                }}
                aria-label={`Show ${s.brand}`}
                className="relative shrink-0"
                style={{ width: W, height: "100%" }}
                animate={{
                  scale: isActive ? 1 : 0.72,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 130, damping: 22 }}
              >
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-[18px] transition-all duration-300",
                    isActive
                      ? "bg-white p-1 shadow-[0_50px_90px_-35px_rgba(13,15,20,0.5)]"
                      : "",
                  )}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={s.src}
                      alt={`${s.brand} on-model shot`}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                    <motion.span
                      animate={{ opacity: isActive ? 1 : 0 }}
                      className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-pill bg-black/55 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white backdrop-blur"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {s.brand}
                    </motion.span>
                    {isActive ? <DevTag path="/generate/image/v1" /> : null}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => move(-1)}
          aria-label="Previous"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-key hover:text-key"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.brand}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-fg" : "w-1.5 bg-line hover:bg-faint",
              )}
            />
          ))}
        </div>
        <button
          onClick={() => move(1)}
          aria-label="Next"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-key hover:text-key"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
