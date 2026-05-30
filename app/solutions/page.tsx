import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "How fashion brands, marketplaces, agencies and platforms use ImagePipeline to generate product visuals at scale.",
};

const audiences = [
  {
    tag: "Fashion & apparel",
    title: "Refresh the look book without a studio",
    body: "Generate on-model imagery and try-on for every drop, in every size and skin tone, the day product data lands.",
    tone: "model",
    points: ["On-model per SKU", "Seasonal restyles", "Size-inclusive sets"],
  },
  {
    tag: "Marketplaces",
    title: "One consistent look across every seller",
    body: "Normalise mixed-quality seller photos into a single clean, relit, on-brand catalogue standard.",
    tone: "product",
    points: ["Bulk normalisation", "Background standards", "Seller self-serve API"],
  },
  {
    tag: "Agencies",
    title: "Ship client creative 5x faster",
    body: "Turn a product feed into campaign-ready static and video for every channel, white-labelled to each client.",
    tone: "warm",
    points: ["Per-client brand kits", "Ad-set generation", "White-label API"],
  },
  {
    tag: "Platforms & PIM",
    title: "Embed generation into your product",
    body: "Offer image generation natively inside your commerce, PIM or DAM product with a single integration.",
    tone: "cool",
    points: ["Usage-based reselling", "Webhooks + batch", "Co-branded UI kit"],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={
          <>
            Built for everyone who
            <br />
            <span className="text-gradient italic">ships a catalogue.</span>
          </>
        }
        description="The same five endpoints power very different workflows. Here is how teams put ImagePipeline to work."
      />

      <section className="py-12">
        <Container>
          <RevealGroup className="grid gap-5 lg:grid-cols-2">
            {audiences.map((a) => (
              <RevealItem key={a.tag}>
                <div className="card group flex h-full flex-col gap-6 overflow-hidden p-7">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-key">
                        {a.tag}
                      </span>
                      <h3 className="font-display text-3xl leading-tight tracking-tight">
                        {a.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {a.body}
                      </p>
                    </div>
                    <Placeholder
                      tone={a.tone}
                      ratio="3/4"
                      className="hidden w-28 shrink-0 sm:block"
                    />
                  </div>
                  <ul className="mt-auto flex flex-wrap gap-2">
                    {a.points.map((p) => (
                      <li
                        key={p}
                        className="rounded-pill border border-line bg-bg-soft px-3 py-1 text-xs text-muted"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Proof"
              title="Teams ship more, for less."
              description="Representative outcomes reported by early customers. Figures are illustrative placeholders."
            />
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-3">
            {[
              { v: "90%", l: "lower imagery cost" },
              { v: "5x", l: "faster time to market" },
              { v: "+28%", l: "PDP conversion lift" },
            ].map((s) => (
              <RevealItem key={s.l}>
                <div className="card flex flex-col items-center gap-2 p-8 text-center">
                  <span className="font-display text-5xl tracking-tight text-gradient">
                    {s.v}
                  </span>
                  <span className="text-sm text-muted">{s.l}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <div className="flex justify-center">
              <Link
                href="/customers"
                className="inline-flex items-center gap-2 text-sm text-key hover:text-key-soft"
              >
                Read customer stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
