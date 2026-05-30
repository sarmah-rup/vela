import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/seo/json-ld";
import { CAL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about ImagePipeline, the image AI API for product and fashion commerce: authentication, async jobs, pricing, data handling, and licensing.",
  alternates: { canonical: "/faq" },
};

// Answer-shaped, question-led copy, strong for both human readers and AI search
// (this page also emits FAQPage structured data below).
const faqs = [
  {
    q: "What is ImagePipeline?",
    a: "ImagePipeline is an image AI API for ecommerce and fashion teams. It turns flat-lay product shots into on-model imagery, runs virtual try-on, replaces and relights backgrounds, and generates ad creative, all through one REST API.",
  },
  {
    q: "How do I authenticate?",
    a: "From the browser, use a Clerk-issued bearer token. Server-to-server, send an API key in the X-API-Key header. Full details are in the authentication docs.",
  },
  {
    q: "Is generation synchronous or asynchronous?",
    a: "Asynchronous. You send a POST to start a job, then either poll its status endpoint or receive a webhook when the render completes.",
  },
  {
    q: "Do you store my images?",
    a: "No. Inputs and outputs are processed in-memory and are not retained after a job completes, and we do not train AI models on your content.",
  },
  {
    q: "Is the output licensed for commercial use?",
    a: "Yes. Every render ships with a commercial license and embedded C2PA provenance. Enterprise adds full IP indemnification.",
  },
  {
    q: "Which languages and SDKs are supported?",
    a: "The API is callable from any language over HTTPS, with typed Python and JavaScript/TypeScript SDKs for a drop-in integration.",
  },
  {
    q: "How does pricing work?",
    a: "Pro is $49/month and Scale is $199/month, with a custom Enterprise tier. One credit is roughly one successful generation. Editing and background operations cost less, video and 3D cost more, and failed jobs are never charged.",
  },
  {
    q: "How do I get started?",
    a: "Create an account, grab an API key, and run your first generation in minutes by following the Quickstart.",
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <section className="relative pb-20 pt-36 sm:pt-44">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know about the API, pricing, and how we handle your data."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Faq items={faqs} />
          </Reveal>
        </Container>
      </section>

      <CtaSection
        title="Still have questions?"
        subtitle="Read the docs or talk to us, we'll help you ship."
        primary={{ label: "Read the docs", href: "/docs" }}
        secondary={{ label: "Talk to us", href: CAL_URL }}
      />
    </>
  );
}
