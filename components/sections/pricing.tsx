"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { CAL_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  blurb: string;
  // Priced tiers carry monthly + yearly (per-month, billed annually) numbers.
  monthly?: number;
  yearly?: number;
  credits?: string;
  custom?: boolean; // Enterprise
  cta: string;
  href: string;
  highlight?: boolean;
  featuresLead?: string;
  features: string[];
};

// Two priced tiers + one custom (Enterprise). Yearly ≈ 17% off (2 months free).
const tiers: Tier[] = [
  {
    name: "Pro",
    blurb: "For production apps.",
    monthly: 49,
    yearly: 41,
    credits: "20,000 credits / mo",
    cta: "Get started",
    href: "/sign-up?plan=pro",
    features: [
      "20,000 credits / month",
      "10 API keys",
      "Webhooks & async jobs",
      "All capabilities & models",
      "Email support",
    ],
  },
  {
    name: "Scale",
    blurb: "For high-volume pipelines and teams.",
    monthly: 199,
    yearly: 166,
    credits: "120,000 credits / mo",
    cta: "Get started",
    href: "/sign-up?plan=scale",
    highlight: true,
    featuresLead: "Everything in Pro, plus",
    features: [
      "120,000 credits / month",
      "Unlimited API keys",
      "Priority GPUs",
      "Team collaboration",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    blurb: "For high-volume teams with strict brand requirements.",
    custom: true,
    cta: "Book a call",
    href: CAL_URL,
    featuresLead: "Everything in Scale, plus",
    features: [
      "Volume credit pricing",
      "Dedicated GPUs & SLA",
      "SSO / SAML",
      "White-glove onboarding",
      "Solutions engineer",
    ],
  },
];

// Smoothly tweens the displayed price from its previous value to the new one when
// the billing period toggles — a quick count that settles on the final number.
function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = React.useState(target);
  const fromRef = React.useRef(target);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = reduce ? 1 : Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

function Price({ tier, yearly }: { tier: Tier; yearly: boolean }) {
  const perMonth = useAnimatedNumber(tier.custom ? 0 : yearly ? tier.yearly! : tier.monthly!);
  if (tier.custom) {
    return (
      <div className="mt-6">
        <span className="font-display text-5xl font-semibold tracking-tight text-fg">
          Custom
        </span>
      </div>
    );
  }
  return (
    <div className="mt-6">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-semibold tracking-tight text-fg tabular-nums">
          ${perMonth}
        </span>
        <span className="text-sm text-muted">
          USD&nbsp;/&nbsp;month
        </span>
      </div>
      <p className="mt-2 text-xs text-faint">
        {yearly ? "Billed annually · all credits upfront" : "Billed monthly"}
      </p>
    </div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = React.useState(true);

  return (
    <section className="relative pb-20 pt-36 sm:pb-28 sm:pt-44">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Reveal>
            <SectionHeading
              align="center"
              title="Simple pricing that scales with you"
              description="Two plans with clear monthly or yearly pricing, plus a custom Enterprise tier. No seats, no minimums, no surprise invoices."
            />
          </Reveal>
        </div>

        {/* Monthly / Yearly toggle */}
        <Reveal delay={0.1}>
          <div className="mb-12 flex items-center justify-end gap-3">
            <div className="inline-flex items-center rounded-pill border border-line bg-surface p-1">
              {[
                { label: "Monthly", value: false },
                { label: "Yearly", value: true },
              ].map((opt) => {
                const active = yearly === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setYearly(opt.value)}
                    className="relative rounded-pill px-4 py-1.5 text-sm font-medium"
                  >
                    {active ? (
                      <motion.span
                        layoutId="pricing-toggle-pill"
                        className="absolute inset-0 rounded-pill bg-key"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 transition-colors",
                        active ? "text-white" : "text-muted hover:text-fg",
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="hidden text-sm text-muted sm:inline">
              Save ~17% with yearly plans
            </span>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const dark = tier.highlight;
            return (
              <Reveal key={tier.name}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-card border p-8",
                    dark
                      ? "border-key bg-key text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
                      : "card-soft",
                  )}
                >
                  {dark ? (
                    <span className="absolute right-6 top-6 rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  ) : null}

                  <h3
                    className={cn(
                      "font-display text-xl font-semibold",
                      dark ? "text-white" : "text-fg",
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 max-w-[24ch] text-sm",
                      dark ? "text-white/70" : "text-muted",
                    )}
                  >
                    {tier.blurb}
                  </p>

                  {dark ? <PriceDark tier={tier} yearly={yearly} /> : <Price tier={tier} yearly={yearly} />}

                  {tier.credits ? (
                    <div
                      className={cn(
                        "mt-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm",
                        dark ? "border-white/20 text-white/90" : "border-line text-fg",
                      )}
                    >
                      <span>{tier.credits}</span>
                    </div>
                  ) : (
                    <div className="mt-6 h-[1px]" />
                  )}

                  <div className="mt-6">
                    <Link
                      href={tier.href}
                      className={cn(
                        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all",
                        dark
                          ? "bg-white text-key hover:bg-white/90"
                          : tier.custom
                            ? "border border-line bg-surface text-fg hover:border-key/50 hover:text-key"
                            : "bg-key text-white hover:bg-key-deep",
                      )}
                    >
                      {tier.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {tier.featuresLead ? (
                    <p
                      className={cn(
                        "mt-7 text-sm",
                        dark ? "text-white/80" : "text-muted",
                      )}
                    >
                      {tier.featuresLead}
                    </p>
                  ) : null}

                  <ul className={cn("mt-4 space-y-3", !tier.featuresLead && "mt-7")}>
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className={cn(
                          "flex items-start gap-2.5 text-sm",
                          dark ? "text-white/90" : "text-fg",
                        )}
                      >
                        <Check
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            dark ? "text-white" : "text-key",
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          All plans include async jobs, webhooks, and C2PA-licensed output.{" "}
          <Link href="/docs/intro" className="font-medium text-fg underline-offset-2 hover:underline">
            Read the docs
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

// Price block on the dark (popular) card, same layout, light-on-dark colors.
function PriceDark({ tier, yearly }: { tier: Tier; yearly: boolean }) {
  const perMonth = useAnimatedNumber(yearly ? tier.yearly! : tier.monthly!);
  return (
    <div className="mt-6">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-semibold tracking-tight text-white tabular-nums">
          ${perMonth}
        </span>
        <span className="text-sm text-white/70">
          USD&nbsp;/&nbsp;month
        </span>
      </div>
      <p className="mt-2 text-xs text-white/60">
        {yearly ? "Billed annually · all credits upfront" : "Billed monthly"}
      </p>
    </div>
  );
}
