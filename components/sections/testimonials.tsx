"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const peek = {
  left: "/img/ip/shoot/image_22.png",
  right: "/img/ip/shoot/image_12.png",
};

// Quotes are kept to a similar length so the card height stays stable as it cycles.
const testimonials = [
  {
    brand: "Printify",
    quote:
      "ImagePipeline cut our image editing time by 42% and made managing thousands of sellers far simpler across all of our stores.",
    name: "Operations",
    role: "Printify",
  },
  {
    brand: "Rappi",
    quote:
      "ImagePipeline has been a great partner for Rappi, helping us increase the number of on-model shots on our platform by 33%.",
    name: "Alain Abud",
    role: "Ops Manager, Rappi",
  },
  {
    brand: "Mixtiles",
    quote:
      "With the ImagePipeline API we no longer worry about image quality, and we solved the problems we had with user-generated content.",
    name: "Ido Grosberg",
    role: "Engineering Lead, Mixtiles",
  },
];

export function Testimonials() {
  const [i, setI] = React.useState(0);
  const n = testimonials.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);
  const t = testimonials[i];

  return (
    <section className="bg-ink py-24 text-white">
      <Container className="flex flex-col items-center gap-8">
        <Reveal className="relative mx-auto flex w-full max-w-5xl items-center justify-center">
          {/* Decorative peeking previews */}
          <div className="absolute left-0 top-1/2 hidden h-56 w-72 -translate-y-1/2 -rotate-[5deg] overflow-hidden rounded-2xl shadow-2xl lg:block">
            <Image src={peek.left} alt="" fill sizes="288px" className="object-cover object-top" />
          </div>
          <div className="absolute right-0 top-1/2 hidden h-56 w-72 -translate-y-1/2 rotate-[5deg] overflow-hidden rounded-2xl shadow-2xl lg:block">
            <Image src={peek.right} alt="" fill sizes="288px" className="object-cover object-top" />
          </div>

          {/* Static card; only the text inside cross-fades between slides. */}
          <div className="relative z-10 flex min-h-[19rem] w-full max-w-xl flex-col rounded-[28px] bg-[#e9e7ff] p-9 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:min-h-[18rem] sm:p-11">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
              >
                <span className="font-display text-lg font-bold tracking-tight">
                  {t.brand}
                </span>
                <p className="mt-6 font-display text-2xl font-semibold leading-snug sm:text-3xl">
                  “{t.quote}”
                </p>
                <div className="mt-6 flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-ink/50">{t.role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Subtle slider controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((item, d) => (
              <button
                key={item.brand}
                onClick={() => setI(d)}
                aria-label={`Show ${item.brand}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  d === i ? "w-6 bg-white" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
