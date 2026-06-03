"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/primitives";

// Testimonials: the un-zoomed "before" portrait embedded full-bleed on #f0f0f0
// (hero layout), an auto-rotating quote (no controls), and a wide detail bar
// below it. The bar is a light, empty placeholder — it shows nothing until you
// actually hover the photo, then the enhanced "after" of that spot fades in
// (a thin reticle marks the region). Demo copy.
const IMG_BEFORE = "/img/ip/before-f0.webp";
const IMG_AFTER = "/img/ip/after-f0.webp";
const BG = "#f0f0f0";
const ZOOM = 2.4;
const POS_X = 0.8;
const POS_Y = 1;

const quotes = [
  { quote: "ImagePipeline keeps every detail crisp — skin, eyes, fabric — across thousands of catalogue shots.", brand: "Printify", role: "Operations" },
  { quote: "We replaced our entire studio workflow. On-model shots our team can ship the same day, straight from the API.", brand: "Rappi", role: "Ops Manager" },
  { quote: "Image quality stopped being a bottleneck. The API just handles it across everything we publish.", brand: "Mixtiles", role: "Engineering Lead" },
];

function geom(scene: HTMLElement, clientX: number, clientY: number) {
  const r = scene.getBoundingClientRect();
  const side = Math.min(r.width, r.height);
  const offX = (r.width - side) * POS_X;
  const offY = (r.height - side) * POS_Y;
  const ix = clientX - r.left - offX;
  const iy = clientY - r.top - offY;
  const inside = ix >= 0 && ix <= side && iy >= 0 && iy <= side;
  return { side, ix, iy, inside, lx: clientX - r.left, ly: clientY - r.top };
}

export function TestimonialSlider() {
  const [i, setI] = React.useState(0);
  const reduce = useReducedMotion();
  const scene = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const ret = React.useRef<HTMLDivElement>(null);
  const cap = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((p) => (p + 1) % quotes.length), 4500);
    return () => clearInterval(id);
  }, [reduce]);

  const hide = React.useCallback(() => {
    if (ret.current) ret.current.style.opacity = "0";
    if (panel.current) panel.current.style.opacity = "0";
    if (cap.current) cap.current.style.opacity = "0";
  }, []);

  const onMove = React.useCallback((e: React.MouseEvent) => {
    const sc = scene.current, p = panel.current, rt = ret.current;
    if (!sc || !p || !rt) return;
    const g = geom(sc, e.clientX, e.clientY);
    if (!g.inside) { rt.style.opacity = "0"; p.style.opacity = "0"; if (cap.current) cap.current.style.opacity = "0"; return; }
    rt.style.opacity = "1";
    p.style.opacity = "1";
    if (cap.current) cap.current.style.opacity = "1";
    const pr = p.getBoundingClientRect();
    p.style.backgroundSize = `${g.side * ZOOM}px ${g.side * ZOOM}px`;
    p.style.backgroundPosition = `${pr.width / 2 - g.ix * ZOOM}px ${pr.height / 2 - g.iy * ZOOM}px`;
    rt.style.width = `${pr.width / ZOOM}px`;
    rt.style.height = `${pr.height / ZOOM}px`;
    rt.style.left = `${g.lx}px`;
    rt.style.top = `${g.ly}px`;
  }, []);

  const s = quotes[i];

  return (
    <section ref={scene} onMouseMove={onMove} onMouseLeave={hide} className="relative flex items-center overflow-hidden py-20 lg:min-h-[46rem] lg:py-0" style={{ background: BG }}>
      <Image src={IMG_BEFORE} alt="On-model portrait" fill sizes="100vw" className="object-contain object-bottom lg:object-[80%_bottom]" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: `linear-gradient(90deg, ${BG} 0%, ${BG} 30%, transparent 58%)` }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-white" />

      {/* Thin reticle marking the hovered spot */}
      <div ref={ret} aria-hidden className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-md opacity-0 ring-1 ring-black/55 shadow-[0_0_0_1px_rgba(255,255,255,0.45)] transition-opacity duration-150" />

      <Container className="relative z-10">
        <div className="flex max-w-xl flex-col gap-8 lg:-translate-y-2">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-5">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-fill/55">What teams say</span>
              <p className="font-display text-2xl font-medium leading-snug tracking-tight text-fill sm:text-[2rem] sm:leading-[1.2]">{s.quote}</p>
              <footer className="flex items-baseline gap-2">
                <span className="font-display text-base font-semibold tracking-tight text-fg">{s.brand}</span>
                <span className="text-sm text-fill/60">· {s.role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Wide detail viewer — very subtle placeholder until hover */}
          <div className="relative h-64 w-full max-w-lg overflow-hidden rounded-[24px] bg-white/35 ring-1 ring-black/[0.05]">
            <div
              ref={panel}
              aria-hidden
              style={{ backgroundImage: `url(${IMG_AFTER})`, backgroundRepeat: "no-repeat" }}
              className="absolute inset-0 opacity-0 transition-opacity duration-200"
            />
            <span
              ref={cap}
              className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white opacity-0 backdrop-blur transition-opacity duration-300"
            >
              Realistic &amp; Consistent
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
