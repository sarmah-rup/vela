import type { Metadata } from "next";
import { Upload, Cpu, PackageCheck, Layers, Globe, Lock } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Capabilities } from "@/components/sections/capabilities";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaSection } from "@/components/sections/cta";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "One visual commerce platform: ingest, generate and ship product imagery through a single licensed API.",
};

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Send an input",
    body: "A flat-lay, a garment, a raw photo or a whole catalogue feed. REST, SDK or a signed URL.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Pick a task",
    body: "on_model, try_on, edit, ad_creative or a custom brand model. Set scene, model and output.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Ship the asset",
    body: "Get a hosted, commercially-licensed image or video back, synchronously or via webhook.",
  },
];

const pillars = [
  {
    icon: Layers,
    title: "Composable primitives",
    body: "Mix endpoints in one pipeline, cut out, then place on a model, then size for every ad network.",
  },
  {
    icon: Globe,
    title: "Edge generation",
    body: "Renders run close to your users across 62 markets, keeping interactive try-on under a second.",
  },
  {
    icon: Lock,
    title: "Licensed and governed",
    body: "Licensed training data, IP indemnity, SSO, audit logs and data residency baked in.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="The platform"
        title={
          <>
            The visual layer for
            <br />
            <span className="text-gradient italic">modern commerce.</span>
          </>
        }
        description="ImagePipeline sits between your product data and every surface that needs an image, replacing studios, retouchers and creative queues with one programmable API."
      />

      {/* How it works */}
      <section className="py-16">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Three steps, one key." />
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <RevealItem key={s.step}>
                  <div className="card relative flex h-full flex-col gap-4 p-7">
                    <span className="absolute right-6 top-6 font-display text-5xl text-line">
                      {s.step}
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg-soft text-key">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="py-16">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Endpoints"
              title="Everything the catalogue needs."
            />
          </Reveal>
          <Capabilities />
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="Why it holds up" title="Built like infrastructure." />
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <RevealItem key={p.title}>
                  <div className="card flex h-full flex-col gap-3 p-7">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg-soft text-fill">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {p.body}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <section className="py-16">
        <StatsBand />
      </section>

      <CtaSection />
    </>
  );
}
