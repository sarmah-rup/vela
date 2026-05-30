import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { getUseCase, useCases } from "@/lib/use-cases";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/structured-data";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { BeforeAfter } from "@/components/sections/before-after";
import { WorkflowChain } from "@/components/sections/workflow-chain";
import { CtaSection } from "@/components/sections/cta";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return {};
  return {
    title: `${u.company} case study`,
    description: u.oneLiner,
    alternates: { canonical: `/use-cases/${slug}` },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) notFound();

  const others = useCases.filter((x) => x.slug !== slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Use cases", path: "/use-cases" },
          { name: u.company, path: `/use-cases/${slug}` },
        ])}
      />
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
        <div className="studio-glow opacity-60" />
        <Container className="relative">
          <Reveal>
            <Link
              href="/use-cases"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              All use cases
            </Link>
          </Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-6">
              <Reveal delay={0.05}>
                <span className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-pill bg-bg-soft px-2.5 py-1 font-medium text-muted">
                    {u.vertical}
                  </span>
                  <span className="text-faint">{u.sector}</span>
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-balance font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                  {u.company}
                </h1>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                  {u.oneLiner}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-sm text-faint">{u.size}</p>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="mx-auto w-full max-w-sm">
                <BeforeAfter
                  beforeLabel={u.beforeLabel}
                  afterLabel={u.afterLabel}
                  beforeTone={u.beforeTone}
                  afterTone={u.afterTone}
                  className="media"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Metrics band */}
      <Container>
        <Reveal>
          <div className="card-soft grid grid-cols-2 divide-x divide-y divide-line overflow-hidden sm:grid-cols-4 sm:divide-y-0">
            {u.metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1 p-6 sm:p-7">
                <CountUp
                  value={m.value}
                  className="font-display text-3xl font-bold tracking-tight text-key sm:text-4xl"
                />
                <span className="text-sm text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Challenge + Approach */}
      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="flex flex-col gap-5">
                <Eyebrow>The challenge</Eyebrow>
                {u.challenge.map((p, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-5">
                <Eyebrow>The approach</Eyebrow>
                {u.approach.map((p, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <section className="pb-16">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="The workflow"
              title="The exact endpoint chain."
              description="Composable primitives, run in order on a webhook. No glue code beyond the calls themselves."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <WorkflowChain steps={u.workflow} />
          </Reveal>
        </Container>
      </section>

      {/* Outcome + quote */}
      <section className="pb-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="flex flex-col gap-5">
                <Eyebrow>The outcome</Eyebrow>
                {u.outcome.map((p, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
                <div className="mt-2 flex flex-wrap gap-2">
                  {u.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-pill border border-line bg-bg-soft px-3 py-1 font-mono text-xs text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="card-soft flex h-full flex-col justify-between gap-6 p-8">
                <Quote className="h-8 w-8 text-key" />
                <blockquote className="text-pretty font-display text-xl leading-snug tracking-tight">
                  {u.quote.text}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-gradient-to-br from-key/40 to-fill/30 ring-1 ring-line" />
                  <span className="text-sm">
                    <span className="block font-medium text-fg">
                      {u.quote.name}
                    </span>
                    <span className="block text-faint">{u.quote.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="py-16">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight">
              More use cases
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {others.map((o) => (
              <RevealItem key={o.slug}>
                <Link
                  href={`/use-cases/${o.slug}`}
                  className="card-soft lift group flex items-center justify-between gap-4 p-6"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-faint">{o.vertical}</span>
                    <span className="font-display text-xl tracking-tight">
                      {o.company}
                    </span>
                    <span className="text-sm text-muted">
                      {o.headlineMetric.value} {o.headlineMetric.label}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-key transition-transform group-hover:translate-x-0.5" />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection
        title="Your catalogue, your numbers."
        subtitle="Start free with 250 generations and benchmark it against your last shoot."
      />
    </>
  );
}
