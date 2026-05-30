import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Placeholder } from "@/components/ui/placeholder";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Customers",
  description: "How commerce teams build with ImagePipeline. Stories and outcomes.",
};

const stories = [
  {
    brand: "Northwind",
    tone: "model",
    metric: "4,000 SKUs",
    blurb: "Refreshed an entire outerwear catalogue on-model in one sprint.",
    quote:
      "ImagePipeline became a step in our build pipeline. Product data in, on-model imagery out, no studio.",
  },
  {
    brand: "Atelier 9",
    tone: "warm",
    metric: "5x output",
    blurb: "Generates a full ad set per launch across Meta and TikTok.",
    quote:
      "Our creative team went from one campaign a week to one a day, on brand every time.",
  },
  {
    brand: "Meridian",
    tone: "product",
    metric: "−90% cost",
    blurb: "Standardised mixed seller photos across a 60k-item marketplace.",
    quote:
      "Every listing looks like it came from the same studio now. Returns dropped with it.",
  },
];

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title={
          <>
            The catalogue,
            <br />
            <span className="text-gradient italic">on autopilot.</span>
          </>
        }
        description="From indie labels to global marketplaces, teams use ImagePipeline to make every product visual programmatic. Stories below are illustrative placeholders."
      />

      <section className="py-12">
        <Container>
          <RevealGroup className="grid gap-5 lg:grid-cols-3">
            {stories.map((s) => (
              <RevealItem key={s.brand}>
                <article className="card group flex h-full flex-col overflow-hidden">
                  <Placeholder
                    tone={s.tone}
                    label={s.brand}
                    ratio="4/3"
                    rounded="rounded-none"
                  />
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl tracking-tight">
                        {s.brand}
                      </span>
                      <span className="rounded-pill bg-key/15 px-2.5 py-1 text-xs font-medium text-key">
                        {s.metric}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{s.blurb}</p>
                    <blockquote className="mt-auto border-l-2 border-key/50 pl-4 text-sm italic leading-relaxed text-fg/90">
                      “{s.quote}”
                    </blockquote>
                    <span className="inline-flex items-center gap-1 text-sm text-key opacity-0 transition-opacity group-hover:opacity-100">
                      Read the story
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Reveal>
            <LogoCloud label="Generating across these catalogues" />
          </Reveal>
        </Container>
      </section>

      <section className="py-12">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading eyebrow="By the numbers" title="What changes when imagery is programmable." />
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "4.2B", l: "images generated" },
              { v: "62", l: "markets live" },
              { v: "<900ms", l: "median render" },
              { v: "99.98%", l: "uptime" },
            ].map((s) => (
              <RevealItem key={s.l}>
                <div className="card flex flex-col gap-1 p-7">
                  <span className="font-display text-4xl tracking-tight text-gradient">
                    {s.v}
                  </span>
                  <span className="text-sm text-muted">{s.l}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
