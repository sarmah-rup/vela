import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Hobby",
    price: "$0",
    cadence: "to start",
    blurb: "Build a proof of concept on the house.",
    cta: { label: "Start free", href: "/demo" },
    features: [
      "250 generations / month",
      "All five endpoints",
      "Community Slack",
      "Standard models",
    ],
    featured: false,
  },
  {
    name: "Scale",
    price: "$0.04",
    cadence: "per generation",
    blurb: "Usage-based pricing that drops with volume.",
    cta: { label: "Get an API key", href: "/demo" },
    features: [
      "Volume tiers to $0.018",
      "Batch + webhooks",
      "Deterministic seeds",
      "Custom model library",
      "99.9% uptime SLA",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    blurb: "Licensing, controls and support for the catalogue.",
    cta: { label: "Talk to sales", href: "/contact" },
    features: [
      "IP indemnification",
      "SSO, SCIM, audit logs",
      "Private deployment",
      "Brand-locked models",
      "Solutions engineer",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <RevealGroup className="grid items-stretch gap-5 lg:grid-cols-3">
      {tiers.map((tier) => (
        <RevealItem key={tier.name} className="h-full">
          <div
            className={cn(
              "card relative flex h-full flex-col gap-6 p-7",
              tier.featured && "border-key/50",
            )}
          >
            {tier.featured ? (
              <>
                <div className="studio-glow opacity-40" />
                <span className="absolute right-6 top-6 rounded-pill bg-key px-2.5 py-1 text-xs font-semibold text-ink">
                  Most popular
                </span>
              </>
            ) : null}
            <div className="relative flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                {tier.name}
              </span>
              <div className="flex items-end gap-2">
                <span className="font-display text-5xl tracking-tight">
                  {tier.price}
                </span>
                <span className="pb-2 text-sm text-faint">{tier.cadence}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{tier.blurb}</p>
            </div>
            <div className="rule" />
            <ul className="relative flex flex-1 flex-col gap-3 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-muted">
                  <Check className="h-4 w-4 shrink-0 text-key" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              href={tier.cta.href}
              variant={tier.featured ? "primary" : "outline"}
              className="relative w-full"
            >
              {tier.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
