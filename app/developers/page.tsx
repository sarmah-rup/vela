import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, BookOpen, Webhook, Activity, ArrowRight } from "lucide-react";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CodeWindow } from "@/components/sections/code-window";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";
import { heroTabs } from "@/lib/code-samples";

export const metadata: Metadata = {
  title: "Developers",
  description: "Quickstart, API reference and SDKs for the Vela visual API.",
};

const endpoints = [
  { method: "POST", path: "/creator/instamodel/image/v1", desc: "Generate on-model imagery" },
  { method: "POST", path: "/creator/tryon/image/v1", desc: "Virtual try-on, garment on body" },
  { method: "POST", path: "/background/change/image/v1", desc: "Replace and relight background" },
  { method: "POST", path: "/edit/image/v1", desc: "Instruction-based image edit" },
  { method: "POST", path: "/upscale/image/v1", desc: "Upscale and enhance detail" },
  { method: "GET", path: "/{endpoint}/status/{job_id}", desc: "Poll an async job" },
];

const resources = [
  { icon: BookOpen, title: "Guides", desc: "Catalogue ingest, batching, brand kits." },
  { icon: Webhook, title: "Webhooks", desc: "Async events for long-running jobs." },
  { icon: Terminal, title: "SDKs", desc: "TypeScript, Python, Go and Ruby." },
  { icon: Activity, title: "Status", desc: "Live uptime and incident history." },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title={
          <>
            Read one endpoint.
            <br />
            <span className="text-gradient italic">Ship all five.</span>
          </>
        }
        description="A single request shape, first-class SDKs and a response you can rely on. Here is everything you need to go from key to production."
      />

      {/* Quickstart */}
      <section className="pb-12">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <div className="flex flex-col gap-6">
                <Eyebrow>Quickstart</Eyebrow>
                <h2 className="font-display text-4xl tracking-tight">
                  From zero to first render in 3 minutes.
                </h2>
                <ol className="flex flex-col gap-4">
                  {[
                    "Grab an API key from the dashboard",
                    "Install the SDK or hit the REST endpoint",
                    "Send a task, get a licensed asset back",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-muted">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-key">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 text-sm text-key hover:text-key-soft"
                  >
                    Open the live demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <CodeWindow tabs={heroTabs} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Reference */}
      <section id="reference" className="scroll-mt-28 py-16">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="API reference"
              title="A small, stable surface."
            />
          </Reveal>
          <Reveal>
            <div className="card overflow-hidden">
              <div className="hidden grid-cols-[100px_1fr_2fr] gap-4 border-b border-line px-6 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint sm:grid">
                <span>Method</span>
                <span>Path</span>
                <span>Description</span>
              </div>
              {endpoints.map((e) => (
                <div
                  key={e.path}
                  className="grid grid-cols-1 gap-2 border-b border-line-soft px-6 py-4 last:border-0 sm:grid-cols-[100px_1fr_2fr] sm:items-center sm:gap-4"
                >
                  <span className="inline-flex w-fit rounded-md border border-key/30 bg-key/10 px-2 py-0.5 font-mono text-xs text-key">
                    {e.method}
                  </span>
                  <span className="font-mono text-sm text-fg">{e.path}</span>
                  <span className="text-sm text-muted">{e.desc}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Resources */}
      <section id="status" className="scroll-mt-28 py-12">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <SectionHeading align="left" eyebrow="Keep going" title="Everything else." />
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((r) => {
              const Icon = r.icon;
              return (
                <RevealItem key={r.title}>
                  <div className="card flex h-full flex-col gap-3 p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-soft text-fill">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl tracking-tight">
                      {r.title}
                    </h3>
                    <p className="text-sm text-muted">{r.desc}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection
        title="Get your API key."
        subtitle="Free to start, no card required. The docs are open, no login wall."
        primary={{ label: "Create a key", href: "/demo" }}
        secondary={{ label: "Browse guides", href: "/resources" }}
      />
    </>
  );
}
