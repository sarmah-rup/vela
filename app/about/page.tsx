import type { Metadata } from "next";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Why we are building the visual layer for commerce.",
};

const values = [
  {
    title: "Licensed by default",
    body: "Generation should never put a brand at legal risk. Every output ships clean and indemnified.",
  },
  {
    title: "Fast enough to be invisible",
    body: "If it is not sub-second, it is not infrastructure. We obsess over the p50.",
  },
  {
    title: "Boring where it counts",
    body: "Predictable contracts, honest pricing, uneventful uptime. Save the magic for the pixels.",
  },
];

const team = [
  { name: "A. Rivera", role: "Co-founder, CEO" },
  { name: "J. Okafor", role: "Co-founder, CTO" },
  { name: "M. Lindqvist", role: "Head of Research" },
  { name: "S. Banerjee", role: "Head of Product" },
];

const roles = [
  { title: "Senior ML Engineer, Generation", team: "Research", place: "Remote" },
  { title: "Developer Experience Lead", team: "Product", place: "London / Remote" },
  { title: "Solutions Engineer", team: "GTM", place: "New York" },
  { title: "Brand Designer", team: "Marketing", place: "Remote" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Photography should be
            <br />
            <span className="text-gradient italic">a function call.</span>
          </>
        }
        description="We started ImagePipeline because the gap between a product existing and a product being shown is still measured in weeks and studios. It should be measured in milliseconds."
      />

      {/* Mission */}
      <section className="py-12">
        <Container>
          <Reveal>
            <div className="card relative overflow-hidden p-8 sm:p-14">
              <div className="studio-glow opacity-40" />
              <p className="relative max-w-3xl font-display text-2xl leading-snug tracking-tight text-balance sm:text-3xl">
                Every brand now competes on visual volume, more SKUs, more
                channels, more variants, faster. The old model of shoots,
                retouchers and creative queues cannot keep up. ImagePipeline turns that
                whole pipeline into one licensed API so any team can produce
                studio-grade imagery at the speed of their catalogue.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="Principles" title="What we optimise for." />
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <RevealItem key={v.title}>
                <div className="card flex h-full flex-col gap-3 p-7">
                  <h3 className="font-display text-2xl tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Team */}
      <section className="py-12">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="Team" title="A small team with a long view." />
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {team.map((m) => (
              <RevealItem key={m.name}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="h-24 w-24 rounded-full bg-gradient-to-br from-key/40 via-surface-2 to-fill/30 ring-1 ring-line" />
                  <span>
                    <span className="block font-medium text-fg">{m.name}</span>
                    <span className="block text-xs text-faint">{m.role}</span>
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Careers */}
      <section id="careers" className="py-16 scroll-mt-28">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-3">
                <Eyebrow>Careers</Eyebrow>
                <h2 className="font-display text-4xl tracking-tight">
                  Come build the visual layer.
                </h2>
              </div>
              <Button href="/contact" variant="outline">
                See all openings
              </Button>
            </div>
          </Reveal>
          <RevealGroup className="flex flex-col gap-3">
            {roles.map((r) => (
              <RevealItem key={r.title}>
                <a
                  href="/contact"
                  className="card group flex items-center justify-between gap-4 p-5 transition-colors hover:border-key/40"
                >
                  <span className="font-display text-xl tracking-tight">
                    {r.title}
                  </span>
                  <span className="flex items-center gap-4 text-sm text-faint">
                    <span className="hidden sm:inline">{r.team}</span>
                    <span>{r.place}</span>
                    <span className="text-key transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection
        title="Want to see it run?"
        subtitle="Spin up an API key and render your first on-model shot in minutes."
      />
    </>
  );
}
