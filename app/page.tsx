import Link from "next/link";
import { ArrowRight, Upload, Wand2, Send } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ShowcaseStrip } from "@/components/sections/showcase-strip";
import { SolutionCards } from "@/components/sections/solution-cards";
import { BeforeAfter } from "@/components/sections/before-after";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaSection } from "@/components/sections/cta";
import { Placeholder } from "@/components/ui/placeholder";
import { useCases } from "@/lib/use-cases";
import { logoCloud } from "@/lib/site";

const steps = [
  {
    icon: Upload,
    title: "Send a product photo",
    body: "A flat-lay, ghost-mannequin or hanger shot, or a whole catalogue feed. Phone photos are fine.",
  },
  {
    icon: Wand2,
    title: "Pick a model and scene",
    body: "Choose skin tone, body type, pose and backdrop, or pin a recurring brand model.",
  },
  {
    icon: Send,
    title: "Publish on-model, at scale",
    body: "Get licensed, on-brand imagery back on a webhook and write it straight to your store.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero (editorial, image-led) ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 sm:pt-40">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            {/* Copy */}
            <div className="flex flex-col items-start gap-6 pb-10 lg:pb-16">
              <Reveal delay={0.04}>
                <h1 className="font-display text-4xl leading-[1.06] tracking-tight sm:text-5xl">
                  <span className="font-normal text-muted">On-model imagery</span>
                  <br />
                  <span className="font-bold">for the brands that</span>
                  <br />
                  <span className="font-bold">move fast.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="max-w-sm text-pretty leading-relaxed text-muted">
                  Vela helps fashion and ecommerce teams produce authentic,
                  on-brand imagery at scale, with full creative control. No
                  studio, no photoshoot.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button href="/demo" size="lg">
                    Get started
                  </Button>
                  <Button href="/contact" variant="soft" size="lg">
                    Book a demo
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Image */}
            <Reveal delay={0.1}>
              <div className="media relative h-[24rem] overflow-hidden rounded-2xl sm:h-[32rem] lg:h-[38rem]">
                <Placeholder
                  src="/img/ip/onmodel-jacket-1.png"
                  tone="model"
                  ratio="auto"
                  rounded="rounded-none"
                  className="h-full border-0"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </Container>

        {/* High-contrast logo band */}
        <div className="mt-14 bg-ink py-7">
          <Container>
            <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-white/45">
              Top fashion teams build with Vela
            </p>
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
              <div className="marquee flex w-max items-center gap-12">
                {[...logoCloud, ...logoCloud].map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    className="whitespace-nowrap font-serif text-xl tracking-tight text-white/55"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="py-20">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="From product photo to on-model, in three steps."
              description="No professional photography, no booking a studio. Upload what you have and publish what you need."
            />
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="media overflow-hidden">
                <Placeholder tone="model" ratio="4/3" label="on-model output" />
              </div>
            </Reveal>
            <RevealGroup className="flex flex-col gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <RevealItem key={s.title}>
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-key/10 text-key">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1 border-b border-line pb-4">
                        <span className="font-display text-xl font-bold tracking-tight">
                          {i + 1}. {s.title}
                        </span>
                        <span className="text-sm leading-relaxed text-muted">
                          {s.body}
                        </span>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* ── Editorial gallery ──────────────────────────────────────────── */}
      <section className="py-12">
        <Container className="mb-10 flex flex-col items-center gap-3 text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
              Generated, not shot
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="max-w-3xl text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl">
              Every face here is{" "}
              <span className="font-semibold italic">AI generated.</span>
            </h2>
          </Reveal>
        </Container>
        <Reveal delay={0.1}>
          <ShowcaseStrip />
        </Reveal>
      </section>

      {/* ── Solution cards (stat-led) ──────────────────────────────────── */}
      <section className="py-12">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="What you can build"
              title="Every product visual, one platform."
              description="Five composable endpoints for the whole catalogue. Outcomes shown are from the use cases, illustrative placeholders."
            />
          </Reveal>
          <SolutionCards />
        </Container>
      </section>

      {/* ── Before / after ─────────────────────────────────────────────── */}
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Studio-grade output"
              title="Drag to see the difference."
              description="Flat-lay in, campaign-ready out, in the lighting and styling you specify."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-3">
              <BeforeAfter
                beforeSrc="/img/ip/flat-jacket.webp"
                afterSrc="/img/ip/onmodel-jacket-1.png"
                beforeLabel="Flat-lay"
                afterLabel="On-model"
              />
              <BeforeAfter
                beforeSrc="/img/ip/flat-dress.webp"
                afterSrc="/img/ip/model-20.png"
                beforeLabel="Product front"
                afterLabel="On-model"
              />
              <BeforeAfter
                beforeSrc="/img/ip/flat-shirt.avif"
                afterSrc="/img/ip/model-12.png"
                beforeLabel="Flat-lay"
                afterLabel="On-model"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="py-12">
        <StatsBand />
      </section>

      {/* ── Use cases teaser ───────────────────────────────────────────── */}
      <section className="py-16">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Use cases"
                title="See it on a real catalogue."
              />
              <Button href="/use-cases" variant="outline">
                All use cases
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {useCases.map((u) => (
              <RevealItem key={u.slug}>
                <Link
                  href={`/use-cases/${u.slug}`}
                  className="card-soft lift group flex h-full flex-col overflow-hidden"
                >
                  <Placeholder tone={u.heroTone} ratio="16/10" rounded="rounded-none" />
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <span className="text-xs text-faint">{u.vertical}</span>
                    <span className="font-display text-xl font-bold tracking-tight">
                      {u.company}
                    </span>
                    <span className="text-sm text-muted">{u.oneLiner}</span>
                    <span className="mt-auto flex items-center gap-2 pt-3">
                      <span className="font-display text-2xl font-bold tracking-tight text-key">
                        {u.headlineMetric.value}
                      </span>
                      <span className="text-xs text-faint">
                        {u.headlineMetric.label}
                      </span>
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="pb-8">
        <CtaSection
          title="Replace the photoshoot with an API call."
          subtitle="Start free with 250 generations. Bring a flat-lay and see it come back on-model in minutes."
          primary={{ label: "Start free", href: "/demo" }}
          secondary={{ label: "Book a demo", href: "/contact" }}
        />
      </section>
    </>
  );
}
