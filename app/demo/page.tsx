import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Playground } from "./playground";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Live Demo",
  description: "Try the Vela API in your browser. Pick a task and render.",
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Live demo"
        title={
          <>
            Run a render
            <br />
            <span className="text-gradient italic">right here.</span>
          </>
        }
        description="Choose a task, tweak the parameters and watch the request and output update. No key required, this sandbox is simulated."
      />

      <section className="pb-8">
        <Container>
          <Playground />
        </Container>
      </section>

      <CtaSection
        title="Like what you see? Make it real."
        subtitle="Grab a key and point this exact request at the live API."
        primary={{ label: "Get an API key", href: "/contact" }}
        secondary={{ label: "Read the docs", href: "/developers" }}
      />
    </>
  );
}
