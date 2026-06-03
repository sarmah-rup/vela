"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// "Turn plain product photos…" — image (pills + square image + centered thumbs)
// on the left; the real ImagePipeline request + response on the right. Each tab
// maps to its actual API endpoint and request schema; the response is a real
// JobStatusResponse whose inference_time changes per image.
type Look = { src: string; ms: number };
type Cat = {
  id: string;
  label: string;
  endpoint: string;
  prompt: string;
  req: Record<string, unknown>;
  looks: Look[];
};

const CATS: Cat[] = [
  {
    id: "male",
    label: "Male models",
    endpoint: "/identity/replace/image/v1",
    prompt: "swap the model, keep the outfit, seated, soft studio light",
    req: { input_image: "https://files.imagepipeline.io/u/src.png", height: 1024, width: 1024, output_format: "webp", seed: -1 },
    looks: [{ src: "male-1-orig", ms: 1840 }, { src: "male-2-orig", ms: 2120 }, { src: "male-3-orig", ms: 1660 }],
  },
  {
    id: "female",
    label: "Female models",
    endpoint: "/identity/replace/image/v1",
    prompt: "swap the model, keep the outfit, soft studio light",
    req: { input_image: "https://files.imagepipeline.io/u/src.png", height: 1024, width: 1024, output_format: "webp", seed: -1 },
    looks: [{ src: "female-1", ms: 1730 }, { src: "female-2", ms: 1980 }, { src: "female-3", ms: 1540 }],
  },
  {
    id: "tryon",
    label: "Try-on",
    endpoint: "/creator/tryon/image/v1",
    prompt: "try on the accessory, keep face and pose",
    req: { person_image: "https://files.imagepipeline.io/u/model.png", clothing_image: "https://files.imagepipeline.io/u/accessory.png", gender: "woman", height: 1248, width: 832, output_format: "webp", seed: -1 },
    looks: [{ src: "tryon-1", ms: 2240 }, { src: "tryon-2", ms: 2010 }, { src: "tryon-3", ms: 1890 }],
  },
  {
    id: "holding",
    label: "Holding product",
    endpoint: "/edit/image/v1",
    prompt: "model holding the product, natural grip, studio light",
    req: { input_image: "https://files.imagepipeline.io/u/product.png", output_format: "webp", seed: -1 },
    looks: [{ src: "hold-man-orig", ms: 1620 }, { src: "hold-woman-orig", ms: 1770 }],
  },
];

const img = (src: string) => `/img/ip/showcase/${src}.webp`;
const clean = (src: string) => src.replace("-orig", "");
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

function reqText(cat: Cat) {
  // prompt first (it's the required field), then the rest of the body
  return JSON.stringify({ prompt: cat.prompt, ...cat.req }, null, 2);
}
function resText(cat: Cat, look: Look) {
  return JSON.stringify(
    {
      job_id: `job_${clean(look.src).replace(/-/g, "")}`,
      status: "completed",
      result_url: `https://files.imagepipeline.io/o/${clean(look.src)}.webp`,
      inference_time_seconds: look.ms / 1000,
      credits_amount: 1,
    },
    null,
    2,
  );
}

export function CategoryShowcase() {
  const [a, setA] = React.useState(0);
  const [v, setV] = React.useState(0);
  const reduce = useReducedMotion();
  const cat = CATS[a];
  const look = cat.looks[v];

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setV((x) => (x + 1) % cat.looks.length), 4500);
    return () => clearInterval(id);
  }, [a, v, reduce, cat.looks.length]);

  const pick = (i: number) => { setA(i); setV(0); };

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            title="Turn plain product photos into beautiful visual assets with AI."
            description="Improve your visual content with ImagePipeline, tuned for enhancing faces, text, and ecommerce imagery."
          />
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.82fr]">
          {/* LEFT: pills + image + centered thumbnails */}
          <div className="flex flex-col items-start gap-5">
            <div className="inline-flex flex-wrap items-center gap-1 rounded-pill border border-line bg-surface p-1">
              {CATS.map((c, i) => (
                <button key={c.id} onClick={() => pick(i)} className={cn("rounded-pill px-4 py-2 text-sm font-medium transition-colors", i === a ? "bg-ink text-white" : "text-muted hover:text-fg")}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#f0f0f0]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div key={look.src} className="absolute inset-0" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                  <Image src={img(look.src)} alt={cat.label} fill sizes="(max-width:1024px) 100vw, 620px" className="object-contain" priority={a === 0 && v === 0} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex w-full justify-center gap-3">
              {cat.looks.map((lk, i) => (
                <button key={lk.src} onClick={() => setV(i)} aria-label={`Look ${i + 1}`} className={cn("relative h-16 w-16 overflow-hidden rounded-xl bg-[#f0f0f0] transition-all sm:h-[4.5rem] sm:w-[4.5rem]", i === v ? "ring-2 ring-ink ring-offset-2 ring-offset-white" : "opacity-70 hover:opacity-100")}>
                  <Image src={img(lk.src)} alt="" fill sizes="72px" className="object-cover object-top" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: request + response + stats — top-aligned with the image */}
          <div className="flex flex-col gap-3 lg:mt-16">
            <div className="rounded-2xl bg-[#0b0c0e] p-5 font-mono text-[12px] leading-relaxed shadow-[0_30px_70px_-32px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2">
                <span className="text-white/30">$</span>
                <span className="font-semibold text-emerald-400/90">POST</span>
                <span className="text-white/55">{cat.endpoint}</span>
              </div>
              <pre className="mt-3 whitespace-pre-wrap break-words text-white/70">{reqText(cat)}</pre>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 font-mono text-[12px] leading-relaxed">
              <div className="flex items-center gap-2 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-fg">200 OK</span>
                <span>· GET {cat.endpoint}/status/{`{job_id}`}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre key={look.src} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 whitespace-pre-wrap break-words text-fill/75">
                  {resText(cat, look)}
                </motion.pre>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="font-display text-2xl font-medium tracking-tight text-fill">{secs(look.ms)}</div>
                <div className="text-xs text-muted">inference time</div>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="font-display text-2xl font-medium tracking-tight text-fill">1024²</div>
                <div className="text-xs text-muted">output · webp</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
