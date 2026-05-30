import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  FileCode2,
  GraduationCap,
  ShieldCheck,
  Boxes,
  ArrowUpRight,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides, templates, security docs and learning material for ImagePipeline.",
};

const guides = [
  {
    icon: BookOpen,
    title: "Catalogue ingest guide",
    desc: "Map a product feed to render jobs and write assets back to your DAM.",
    tag: "Guide",
  },
  {
    icon: FileCode2,
    title: "Batch + webhooks recipe",
    desc: "Process 10k SKUs without blocking, with retries and idempotency.",
    tag: "Recipe",
  },
  {
    icon: GraduationCap,
    title: "Brand-locked models 101",
    desc: "Fine-tune a private model on your assets and gate access to it.",
    tag: "Tutorial",
  },
  {
    icon: ShieldCheck,
    title: "Security & compliance",
    desc: "SOC 2, data residency, retention and the indemnity model.",
    tag: "Trust",
  },
  {
    icon: Boxes,
    title: "UI kit for resellers",
    desc: "Drop-in, co-branded components to embed generation in your product.",
    tag: "Kit",
  },
  {
    icon: BookOpen,
    title: "Prompt & scene library",
    desc: "Reference scenes, poses and lighting presets that reliably perform.",
    tag: "Reference",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Everything to take you
            <br />
            <span className="text-gradient italic">from key to scale.</span>
          </>
        }
        description="Guides, recipes and reference material. All free, all without a login wall."
      />

      <section className="pb-12">
        <Container>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => {
              const Icon = g.icon;
              return (
                <RevealItem key={g.title}>
                  <Link
                    href="/developers"
                    className="card group flex h-full flex-col gap-4 p-6 transition-all hover:-translate-y-1 hover:border-key/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-soft text-key">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-pill border border-line px-2.5 py-0.5 text-[0.7rem] text-faint">
                        {g.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-xl leading-snug tracking-tight">
                      {g.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {g.desc}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-key opacity-0 transition-opacity group-hover:opacity-100">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <section className="py-12">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Learn the model"
              title="Short reads, big leverage."
            />
          </Reveal>
          <Reveal>
            <div className="card flex flex-col items-center gap-5 p-10 text-center sm:p-14">
              <p className="max-w-2xl font-display text-2xl leading-snug tracking-tight text-balance sm:text-3xl">
                New to generative imagery for commerce? Start with the ingest
                guide, then wire up batching. You will have a live pipeline
                before lunch.
              </p>
              <Link
                href="/developers"
                className="inline-flex items-center gap-2 text-sm text-key hover:text-key-soft"
              >
                Go to the docs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
