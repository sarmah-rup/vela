"use client";

import * as React from "react";
import {
  Lock,
  ImageOff,
  ShieldCheck,
  Sparkles,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { stats } from "@/lib/site";
import { cn } from "@/lib/utils";

// Combined "Built for developers" + trust + stats — bento grid. A 4×3 matrix:
// a large developer tile (2×2) with drifting hairlines, four stats, and four
// trust cards. Every card gets a smooth gradient sweep on hover.

const trustPoints = [
  { icon: Lock, title: "100% privacy", desc: "Yours, end to end." },
  { icon: ImageOff, title: "We don't store your images", desc: "Never retained." },
  { icon: ShieldCheck, title: "SOC 2 compliant", desc: "Audited controls." },
  { icon: Sparkles, title: "Responsible AI", desc: "Provenance built in." },
];

const HEADING = {
  eyebrow: "Developer-first · Enterprise-ready",
  title: "Built to ship, built to trust.",
  description:
    "One API for on-model imagery — with the SDKs, webhooks, and controls teams need to run it in production.",
};

const cardBase =
  "group relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-key/30 hover:shadow-[0_28px_60px_-30px_rgba(13,15,20,0.3)]";

// Card shell that tracks the cursor (writes --mx/--my) and layers a hidden grid
// (revealed in a circle around the cursor) plus a soft gradient sweep, behind
// the content.
function SpotlightCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} className={cn(cardBase, className)}>
      <span
        aria-hidden
        className="spotlight-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-key-soft via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <SpotlightCard className="card flex flex-col justify-center gap-1 bg-bg-soft p-7 text-center">
      <div className="relative">
        <CountUp value={value} className="font-display text-4xl font-medium tracking-tight text-fill" />
        <span className="mt-1 block text-sm text-muted">{label}</span>
      </div>
    </SpotlightCard>
  );
}

function TrustCard({
  icon: Icon,
  title,
  desc,
}: (typeof trustPoints)[number]) {
  return (
    <SpotlightCard className="card-soft flex flex-col gap-2 p-6">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-key-soft text-key transition-colors duration-500 group-hover:bg-key group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="relative text-[0.95rem] font-semibold text-fg">{title}</h3>
      <p className="relative text-sm leading-relaxed text-muted">{desc}</p>
    </SpotlightCard>
  );
}

export function DTBento() {
  return (
    <Container className="flex flex-col gap-10">
      <SectionHeading {...HEADING} />
      <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Large developer tile — spans 2×2 */}
        <SpotlightCard className="card-soft col-span-2 flex flex-col justify-between gap-6 p-7 lg:row-span-2">
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-key-soft text-key transition-colors duration-500 group-hover:bg-key group-hover:text-white">
            <Package className="h-6 w-6" />
          </span>
          <div className="relative">
            <h3 className="font-display text-2xl font-medium tracking-tight text-fill">Python &amp; JS SDKs</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Drop-in typed clients, webhooks on output, and poll-or-no-poll status — ship in an afternoon.
            </p>
          </div>
        </SpotlightCard>

        {/* Row 1 right: two stats */}
        <StatCard value={stats[0].value} label={stats[0].label} />
        <StatCard value={stats[1].value} label={stats[1].label} />

        {/* Row 2 right: two trust cards */}
        <TrustCard {...trustPoints[0]} />
        <TrustCard {...trustPoints[1]} />

        {/* Row 3: two trust cards + two more stats (bottom-right) */}
        <TrustCard {...trustPoints[2]} />
        <TrustCard {...trustPoints[3]} />
        <StatCard value={stats[2].value} label={stats[2].label} />
        <StatCard value={stats[3].value} label={stats[3].label} />
      </div>
      <div className="flex justify-center">
        <Button href="/docs" variant="ghost">
          Learn more
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </Container>
  );
}
