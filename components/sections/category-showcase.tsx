"use client";

import * as React from "react";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { DevTag } from "@/components/ui/dev-tag";
import { cn } from "@/lib/utils";

// Category switcher: pick a use-case pill and the showcase image swaps, with a
// small "plain product" inset standing in for the before state.
// Each main image is one of our own AI-generated shots on a flat #f0f0f0 ground
// (object-contain, so square shots sit centered with no crop). Mix of women, men,
// and product stills to show the range.
const categories = [
  {
    id: "lifestyle",
    label: "Lifestyle",
    src: "/img/ip/shoot/image_21.png",
    inset: "/img/ip/flat-jacket.webp",
    prompt: "candid lifestyle, natural daylight, city street...",
  },
  {
    id: "editorial",
    label: "Editorial",
    src: "/img/ip/shoot/image_16.png",
    inset: "/img/ip/flat-dress.webp",
    prompt: "high-fashion editorial, dramatic rim light...",
  },
  {
    id: "on-model",
    label: "On-model",
    src: "/img/ip/shoot/image_38.png",
    inset: "/img/ip/flat-shirt.avif",
    prompt: "on-model menswear, neutral studio, full body...",
  },
  {
    id: "studio",
    label: "Studio",
    src: "/img/ip/shoot/image_39.png",
    inset: "/img/ip/product-bag.webp",
    prompt: "studio product, seamless backdrop, soft shadow...",
  },
  {
    id: "campaign",
    label: "Campaign",
    src: "/img/ip/shoot/image_36.png",
    inset: "/img/ip/flat-jacket.webp",
    prompt: "campaign hero, bold styling, wide crop...",
  },
];

export function CategoryShowcase() {
  const [active, setActive] = React.useState(0);

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
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
                  i === active
                    ? "bg-ink text-white"
                    : "bg-bg-soft text-muted hover:text-fg",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="w-full">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-line bg-[#f0f0f0]">
            {categories.map((c, i) => (
              <Image
                key={c.id}
                src={c.src}
                alt={c.label}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority={i === 0}
                className={cn(
                  "object-contain object-center transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}

            {/* "plain product" before inset, swaps with the active category */}
            <div className="absolute left-5 top-1/2 hidden h-44 w-36 -translate-y-1/2 overflow-hidden rounded-xl border-4 border-white bg-white shadow-2xl sm:block">
              {categories.map((c, i) => (
                <Image
                  key={c.id}
                  src={c.inset}
                  alt={`${c.label} input`}
                  fill
                  sizes="144px"
                  className={cn(
                    "object-cover transition-opacity duration-700 ease-out",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>

            {categories.map((c, i) => (
              <DevTag
                key={c.id}
                path="/generate/image/v1"
                prompt={c.prompt}
                className={cn(
                  "transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
