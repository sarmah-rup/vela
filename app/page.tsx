import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { GalleryAngled } from "@/components/sections/gallery-variants";
import { DTBento } from "@/components/sections/dev-trust-variants";
import { BeforeAfter } from "@/components/sections/before-after";
import { HeroRotator } from "@/components/sections/hero-rotator";
import { TestimonialSlider } from "@/components/sections/testimonial-variants";
import { StatsShowcase } from "@/components/sections/stats-showcase";
import { CategoryShowcase } from "@/components/sections/category-variants";
import { CtaSection } from "@/components/sections/cta";
import { logoCloud, CAL_URL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      {/* ── Hero (full-bleed magazine cover) ────────────────────────────── */}
      <section className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden bg-[#F0F0F0] lg:min-h-[calc(100vh-4rem)]">
        {/* Rotating look fills the frame */}
        <HeroRotator fullBleed />

        {/* Short bottom fade so the figure stays fully visible while the
            section still bleeds into the white of the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

        {/* Copy, overlaid bottom-left */}
        <Container className="relative z-10">
          <div className="relative mr-auto max-w-3xl">
            <div className="relative z-10 flex flex-col items-start gap-5 py-9 pl-4 text-left sm:py-10">
            <Reveal immediate delay={0.04}>
              <h1 className="font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="font-normal text-muted">On-model imagery</span>
                <br />
                <span className="font-medium text-fill">for fast brands.</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.12}>
              <p className="max-w-md text-pretty leading-relaxed text-muted">
                The image AI API for fashion commerce. Flat-lays to on-model
                shots, virtual try-on, and relit scenes.
              </p>
            </Reveal>
            <Reveal immediate delay={0.18}>
              <div className="flex flex-wrap items-center justify-start gap-3">
                <Button href={CAL_URL} size="lg" className="group">
                  Book a Demo
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
                <Button href="/docs" variant="soft" size="lg">
                  Docs
                </Button>
              </div>
            </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Logo band (directly after the hero) ────────────────────────── */}
      <div className="bg-ink py-7">
        <Container>
          <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-white/45">
            Top fashion teams build with ImagePipeline
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee flex w-max items-center gap-12">
              {[...logoCloud, ...logoCloud].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-white/55"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ── Built for developers + trust + stats (bento) ───────────────── */}
      <section className="py-16">
        <Reveal>
          <DTBento />
        </Reveal>
      </section>

      {/* ── Category showcase (image + request/response cue cards) ─────── */}
      <CategoryShowcase />

      {/* ── Editorial gallery ──────────────────────────────────────────── */}
      <section className="py-12">
        <Container className="mb-10 flex flex-col items-center gap-3 text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
              Generated, not shot
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="max-w-3xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight text-fill sm:text-5xl">
              Every face here is{" "}
              <span className="font-semibold">AI generated.</span>
            </h2>
          </Reveal>
        </Container>
        <Reveal delay={0.1}>
          <GalleryAngled />
        </Reveal>
      </section>

      {/* ── Stats over imagery ─────────────────────────────────────────── */}
      <StatsShowcase />

      {/* ── Testimonials — quote slider + wide before/after zoom reveal ── */}
      <TestimonialSlider />

      {/* ── Before / after ─────────────────────────────────────────────── */}
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Studio-grade output"
              title="Drag to see the difference."
              description="Flat-lay in, campaign-ready out, in the lighting and styling you specify."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-3">
              <BeforeAfter
                beforeSrc="/img/ip/flat-jacket.webp"
                afterSrc="/img/ip/onmodel-jacket-1.png"
                beforeLabel="Flat-lay"
                afterLabel="On-model"
              />
              <BeforeAfter
                beforeSrc="/img/ip/flat-dress.webp"
                afterSrc="/img/ip/model-20.png"
                beforeLabel="Product front"
                afterLabel="On-model"
              />
              <BeforeAfter
                beforeSrc="/img/ip/flat-shirt.avif"
                afterSrc="/img/ip/model-12.png"
                beforeLabel="Flat-lay"
                afterLabel="On-model"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="pb-8">
        <CtaSection
          title="Fashion and ecommerce product imagery, at scale."
          subtitle="Thousands of brands use ImagePipeline to turn flat-lays into on-model shots, run virtual try-on, and ship campaign-ready imagery from one API."
          primary={{ label: "Talk to us", href: CAL_URL }}
          secondary={null}
        />
      </section>
    </>
  );
}
