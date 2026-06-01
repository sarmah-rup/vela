"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { DevTag } from "@/components/ui/dev-tag";
import { cn } from "@/lib/utils";

// Category switcher: pick a use-case pill, then pick one of three variant
// thumbnails at the bottom — the large showcase image swaps to match.
// 5 pills x 3 variants = 15 images (dummy assets from "ip asset 2" for now).
const categories = [
  {
    id: "lifestyle",
    label: "Lifestyle",
    prompt: "candid lifestyle, natural daylight, city street...",
    images: [
      "/img/ip/cat/cat-01.avif",
      "/img/ip/cat/cat-02.avif",
      "/img/ip/cat/cat-03.avif",
    ],
  },
  {
    id: "editorial",
    label: "Editorial",
    prompt: "high-fashion editorial, dramatic rim light...",
    images: [
      "/img/ip/cat/cat-04.avif",
      "/img/ip/cat/cat-05.avif",
      "/img/ip/cat/cat-06.avif",
    ],
  },
  {
    id: "on-model",
    label: "On-model",
    prompt: "on-model menswear, neutral studio, full body...",
    images: [
      "/img/ip/cat/cat-07.avif",
      "/img/ip/cat/cat-08.avif",
      "/img/ip/cat/cat-09.avif",
    ],
  },
  {
    id: "studio",
    label: "Studio",
    prompt: "studio product, seamless backdrop, soft shadow...",
    images: [
      "/img/ip/cat/cat-10.avif",
      "/img/ip/cat/cat-11.avif",
      "/img/ip/cat/cat-12.avif",
    ],
  },
  {
    id: "campaign",
    label: "Campaign",
    prompt: "campaign hero, bold styling, wide crop...",
    images: [
      "/img/ip/cat/cat-13.avif",
      "/img/ip/cat/cat-14.avif",
      "/img/ip/cat/cat-15.avif",
    ],
  },
];

export function CategoryShowcase() {
  const [active, setActive] = React.useState(0);
  const [variant, setVariant] = React.useState(0);
  const reduce = useReducedMotion();

  const current = categories[active];
  const src = current.images[variant];

  // Auto-cycle through the active category's variants (like the hero rotator).
  // Re-runs on any change to active/variant, so a manual pick restarts the timer.
  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setVariant((v) => (v + 1) % current.images.length),
      4500,
    );
    return () => clearInterval(id);
  }, [active, variant, reduce, current.images.length]);

  function pickCategory(i: number) {
    setActive(i);
    setVariant(0);
  }

  return (
    <section className="py-24">
      <Container className="flex flex-col items-center gap-8">
        <Reveal>
          <SectionHeading
            title="Turn plain product photos into beautiful visual assets with AI."
            description="Improve your visual content with ImagePipeline, tuned for enhancing faces, text, and ecommerce imagery."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-pill border border-line bg-surface p-1">
            {categories.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  onClick={() => pickCategory(i)}
                  className="relative rounded-pill px-4 py-2 text-sm font-medium"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-pill bg-ink"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 transition-colors",
                      isActive ? "text-white" : "text-muted hover:text-fg",
                    )}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="w-full">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-line bg-[#f0f0f0]">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Image
                  src={src}
                  alt={current.label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  priority={active === 0 && variant === 0}
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Three variant thumbnails, center-bottom; click to swap the large image. */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
              {current.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setVariant(i)}
                  aria-label={`${current.label} variant ${i + 1}`}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-xl border-4 bg-white shadow-2xl transition-all sm:h-20 sm:w-20",
                    i === variant
                      ? "border-white ring-2 ring-ink"
                      : "border-white opacity-80 hover:opacity-100",
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <DevTag path="/generate/image/v1" prompt={current.prompt} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
