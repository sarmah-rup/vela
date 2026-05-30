import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCases } from "@/lib/use-cases";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "How DTC brands, footwear labels and marketplaces use ImagePipeline to cut imagery cost and ship catalogues faster.",
};

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Use cases"
        title={
          <>
            Real catalogues,{" "}
            <span className="text-gradient">real numbers.</span>
          </>
        }
        description="Three teams, three very different problems, one API. Companies and figures are illustrative placeholders, the workflows are exactly how it is built."
      />

      <section className="pb-8">
        <Container className="flex flex-col gap-6">
          {useCases.map((u, i) => (
            <Reveal key={u.slug} delay={i * 0.05}>
              <Link
                href={`/use-cases/${u.slug}`}
                className="card-soft lift group grid gap-0 overflow-hidden md:grid-cols-[1.1fr_1fr]"
              >
                <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
                  <div className="flex flex-col gap-4">
                    <span className="flex items-center gap-3 text-xs">
                      <span className="rounded-pill bg-bg-soft px-2.5 py-1 font-medium text-muted">
                        {u.vertical}
                      </span>
                      <span className="text-faint">{u.sector}</span>
                    </span>
                    <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                      {u.company}
                    </h2>
                    <p className="max-w-md text-pretty text-muted">
                      {u.oneLiner}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-display text-4xl tracking-tight text-gradient">
                        {u.headlineMetric.value}
                      </span>
                      <span className="text-sm text-faint">
                        {u.headlineMetric.label}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-key">
                      Read the story
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
                <div className="relative min-h-56">
                  <Placeholder
                    tone={u.heroTone}
                    src={undefined}
                    ratio="1/1"
                    rounded="rounded-none"
                    className="h-full"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="The pattern"
              title="Different teams, the same leverage."
              description="Whatever the catalogue, the win is the same shape: less spend per asset, far less time, more variety than a studio could ever produce."
            />
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-3">
            {[
              { v: "−74 to −88%", l: "cost per finished image" },
              { v: "days to hours", l: "time from product to live" },
              { v: "6 to 9x", l: "more creative per SKU" },
            ].map((s) => (
              <RevealItem key={s.l}>
                <div className="card flex flex-col gap-1 p-7">
                  <span className="font-display text-3xl tracking-tight text-gradient">
                    {s.v}
                  </span>
                  <span className="text-sm text-muted">{s.l}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection
        title="Put your catalogue on the same path."
        subtitle="Bring a flat-lay and an API key. See your own before-and-after in minutes."
      />
    </>
  );
}
