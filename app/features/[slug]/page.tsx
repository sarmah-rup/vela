import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { features, featureOrder } from "@/lib/features";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { BeforeAfter } from "@/components/sections/before-after";
import { CodeWindow } from "@/components/sections/code-window";
import { WorkflowChain } from "@/components/sections/workflow-chain";
import { CtaSection } from "@/components/sections/cta";

export function generateStaticParams() {
  return featureOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = features[slug];
  if (!f) return {};
  return { title: f.nav, description: f.description };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = features[slug];
  if (!f) notFound();

  const others = featureOrder.filter((s) => s !== slug);

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
        <div className="studio-glow opacity-70" />
        <div className="absolute inset-0 -z-[1] grid-lines opacity-40" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <Reveal>
                <Eyebrow>{f.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="text-balance font-display text-5xl leading-[1] tracking-tight sm:text-6xl">
                  {f.title}{" "}
                  <span className="text-gradient italic">{f.highlight}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted">
                  {f.description}
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="flex flex-wrap gap-3">
                  <Button href="/demo" size="lg">
                    Try it live
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href="/developers" variant="outline" size="lg">
                    API reference
                  </Button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="mx-auto w-full max-w-sm">
                <BeforeAfter
                  beforeLabel={f.beforeLabel}
                  afterLabel={f.afterLabel}
                  beforeTone={f.beforeTone}
                  afterTone={f.afterTone}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Spec strip */}
      <Container>
        <Reveal>
          <div className="card grid grid-cols-2 divide-x divide-y divide-line overflow-hidden sm:grid-cols-4 sm:divide-y-0">
            {f.spec.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 p-6">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint">
                  {s.label}
                </span>
                <span className="font-display text-2xl tracking-tight text-fg">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Bullets */}
      <section className="py-24">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="What you get"
              title="Designed to drop into production."
            />
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {f.bullets.map((b) => (
              <RevealItem key={b.title}>
                <div className="card flex h-full flex-col gap-3 p-7">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-bg-soft text-key">
                    <Check className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-2xl tracking-tight">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{b.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Workflow */}
      <section className="py-12">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Composable"
              title="Chain it into a full pipeline."
              description="Every endpoint is an independent primitive. This is a typical chain for this capability, run async on a webhook."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <WorkflowChain steps={f.steps} />
          </Reveal>
        </Container>
      </section>

      {/* Code */}
      <section className="py-12">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="flex flex-col gap-5">
                <Eyebrow>One call</Eyebrow>
                <h2 className="font-display text-4xl tracking-tight">
                  <span className="font-mono text-key">{f.endpoint}</span>
                </h2>
                <p className="max-w-md text-muted">
                  Flat JSON, X-API-Key auth, async by default. You get a job_id
                  back and the finished asset on your webhook.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <CodeWindow
                title={`POST ${f.endpoint}`}
                tabs={[
                  {
                    label: "cURL",
                    language: "bash",
                    filename: "req.sh",
                    code: f.sample,
                  },
                ]}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="py-20">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight">
              Pairs well with
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => {
              const o = features[s];
              return (
                <RevealItem key={s}>
                  <Link
                    href={`/features/${s}`}
                    className="card group flex h-full flex-col gap-2 p-5 transition-all hover:-translate-y-1 hover:border-key/40"
                  >
                    <span className="font-display text-xl tracking-tight">
                      {o.nav}
                    </span>
                    <span className="text-sm text-muted">{o.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-key">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
