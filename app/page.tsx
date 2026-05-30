import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CenterSlider } from "@/components/sections/center-slider";
import { BeforeAfter } from "@/components/sections/before-after";
import { HeroRotator } from "@/components/sections/hero-rotator";
import { Testimonials } from "@/components/sections/testimonials";
import { StatsShowcase } from "@/components/sections/stats-showcase";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaSection } from "@/components/sections/cta";
import { logoCloud } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ── Hero (editorial, image-led) ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F0F0F0] pt-16 sm:pt-20 lg:pt-0">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            {/* Copy */}
            <div className="flex flex-col items-start gap-6 pb-10 lg:mt-4 lg:pb-16">
              <Reveal delay={0.04}>
                <h1 className="font-display text-4xl leading-[1.06] tracking-tight sm:text-5xl">
                  <span className="font-normal text-muted">On-model imagery</span>
                  <br />
                  <span className="font-medium text-fill">for fast brands.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="max-w-sm text-pretty leading-relaxed text-muted">
                  Vela helps fashion and ecommerce teams produce authentic,
                  on-brand imagery at scale, with full creative control. No
                  studio, no photoshoot.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button href="/contact" size="lg" className="group">
                    Book a Call
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                  <Button href="/docs" variant="soft" size="lg">
                    Docs
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Image — rotating AI-generated looks */}
            <Reveal delay={0.1} className="w-full lg:-mt-16">
              <HeroRotator />
            </Reveal>
          </div>
        </Container>

        {/* High-contrast logo band */}
        <div className="bg-ink py-7">
          <Container>
            <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-white/45">
              Top fashion teams build with Vela
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
      </section>

      {/* ── Category showcase ──────────────────────────────────────────── */}
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
          <CenterSlider />
        </Reveal>
      </section>

      {/* ── Stats over imagery ─────────────────────────────────────────── */}
      <StatsShowcase />

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <Testimonials />

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

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="py-12">
        <StatsBand />
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="pb-8">
        <CtaSection
          title="Replace the photoshoot with an API call."
          subtitle="Start free with 250 generations. Bring a flat-lay and see it come back on-model in minutes."
          primary={{ label: "Talk to us", href: "/contact" }}
          secondary={null}
        />
      </section>
    </>
  );
}
