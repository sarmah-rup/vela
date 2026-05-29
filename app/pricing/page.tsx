import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Usage-based pricing that scales down with volume. Start free.",
};

const faqs = [
  {
    q: "How does usage-based pricing work?",
    a: "You pay per successful generation. The per-image rate falls automatically as your monthly volume grows, from $0.04 down to $0.018 on the Scale plan. Failed renders are never billed.",
  },
  {
    q: "What counts as one generation?",
    a: "One output asset from one endpoint. A batch of 500 on-model images counts as 500 generations. Editing operations are billed at a lower per-image rate.",
  },
  {
    q: "Is the output licensed for commercial use?",
    a: "Yes. Every render ships with a commercial license, and Enterprise adds full IP indemnification so your legal team can sign off with confidence.",
  },
  {
    q: "Do unused free generations roll over?",
    a: "The 250 monthly free generations reset each month and do not roll over. They are meant for prototyping, not production volume.",
  },
  {
    q: "Can I self-host or deploy privately?",
    a: "Enterprise customers can run Vela in a private VPC or on-prem with brand-locked models. Talk to sales for an architecture review.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pay for pixels,
            <br />
            <span className="text-gradient italic">not photoshoots.</span>
          </>
        }
        description="Start free, then pay per generation with rates that drop as you scale. No seats, no minimums, no surprise invoices."
      />

      <Container className="pb-8">
        <Pricing />
      </Container>

      <Container className="py-12">
        <Reveal>
          <p className="text-center text-sm text-faint">
            All plans include every endpoint, REST + SDKs, and a 99.9% uptime
            target. Prices shown are illustrative placeholders.
          </p>
        </Reveal>
      </Container>

      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Questions"
              title="The details, up front."
            />
          </Reveal>
          <Faq items={faqs} />
        </Container>
      </section>

      <CtaSection
        title="Try it before you commit."
        subtitle="250 generations on the house. Bring a flat-lay and watch it come back on-model."
      />
    </>
  );
}
