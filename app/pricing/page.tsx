import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple plans that scale with you. Monthly or yearly billing, with a custom Enterprise tier.",
};

const faqs = [
  {
    q: "How does billing work?",
    a: "Pick Pro or Scale and pay per month, or switch to yearly billing to save about 17% (two months free) with all your credits available upfront. You can change or cancel any time from the dashboard.",
  },
  {
    q: "What is a credit?",
    a: "One credit covers one successful generation on most endpoints. Editing and background operations cost less; video and 3D cost more. Failed jobs are never charged.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "You can upgrade your plan or top up at any time. Requests that would exceed your balance return a clear INSUFFICIENT_CREDITS error rather than failing silently.",
  },
  {
    q: "Is the output licensed for commercial use?",
    a: "Yes. Every render ships with a commercial license and embedded C2PA provenance. Enterprise adds full IP indemnification so your legal team can sign off with confidence.",
  },
  {
    q: "What does Enterprise include?",
    a: "Volume credit pricing, dedicated GPUs with an SLA, SSO/SAML, white-glove onboarding, and a solutions engineer. Book a call and we'll tailor it to your catalogue.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Pricing renders its own eyebrow + heading + toggle (see components/sections/pricing.tsx). */}
      <div className="pt-28 sm:pt-36" />
      <Pricing />

      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="The details, up front." />
          </Reveal>
          <Faq items={faqs} />
        </Container>
      </section>

      <CtaSection
        title="Start building today."
        subtitle="Create an account, grab an API key, and run your first job in minutes."
      />
    </>
  );
}
