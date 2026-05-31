"use client";

import * as React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  KeyRound,
  Images as ImagesIcon,
  Activity,
  CreditCard,
  Settings,
  Plus,
  Copy,
  Check,
  Eye,
  RotateCw,
  Sparkles,
  ArrowUpRight,
  TriangleAlert,
  WifiOff,
  Lock,
  Zap,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import { CAL_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { UserMe, UserSubscription, UserImage, DashboardData, Json } from "@/lib/imagepipeline";
import { TryNow } from "./try-now";

// ─────────────────────────────────────────────────────────────────────────────
// All account data (credits, plan, usage, rate limits, API key, images,
// subscriptions, enterprise) is fetched server-side from api.imagepipeline.io and
// passed in as `data` — see app/dashboard/page.tsx + lib/imagepipeline.ts. The
// ImagePipeline account is the source of truth for plan/credits; the plan tiers
// below are presentational (mirrors lib/plans.ts) for the upgrade grid.
// ─────────────────────────────────────────────────────────────────────────────

type PlanTier = {
  key: string;
  name: string;
  monthly?: number;
  yearly?: number;
  custom?: boolean;
  credits: string;
  features: string[];
  popular?: boolean;
};

const PLAN_TIERS: PlanTier[] = [
  {
    key: "pro",
    name: "Pro",
    monthly: 49,
    yearly: 41,
    credits: "20,000 credits / mo",
    features: ["10 API keys", "Webhooks & async jobs", "Email support"],
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    monthly: 199,
    yearly: 166,
    credits: "120,000 credits / mo",
    features: ["Unlimited API keys", "Priority GPUs", "Priority support"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    custom: true,
    credits: "Volume credit pricing",
    features: ["Dedicated GPUs & SLA", "SSO / SAML", "Solutions engineer"],
  },
];

type Tab = "overview" | "try" | "keys" | "images" | "usage" | "billing" | "settings";

const NAV: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "try", label: "Try now", icon: Wand2 },
  { key: "keys", label: "API key", icon: KeyRound },
  { key: "images", label: "Images", icon: ImagesIcon },
  { key: "usage", label: "Usage", icon: Activity },
  { key: "billing", label: "Plans & billing", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

const fmt = (n: number) => n.toLocaleString("en-US");

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DashboardClient({
  email,
  plan,
  active,
  data,
}: {
  email: string;
  plan: string;
  active: boolean;
  data: DashboardData;
}) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const { user } = useUser();

  const { account, reachable } = data;
  const name = user?.firstName || user?.fullName || email.split("@")[0];
  const creditsLeft = account?.tokens_remaining ?? 0;
  const planLabel = titleCase(plan);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6 lg:py-8">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="lg:w-60 lg:shrink-0">
        <div className="lg:sticky lg:top-28">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1.5 lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const Icon = item.icon;
              const on = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    on ? "bg-bg-soft text-fg" : "text-muted hover:bg-bg-soft hover:text-fg",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Account footer (desktop) */}
          <div className="mt-4 hidden items-center gap-3 rounded-2xl border border-line bg-surface p-3 lg:flex">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">{name}</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="min-w-0 flex-1">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
            {NAV.find((n) => n.key === tab)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg">
              <Sparkles className="h-3.5 w-3.5 text-key" />
              {account ? `${fmt(creditsLeft)} credits left` : "—"}
            </span>
            <span className="inline-flex max-w-[12rem] items-center truncate rounded-pill bg-key px-3 py-1.5 text-xs font-semibold text-white">
              {planLabel}
            </span>
          </div>
        </div>

        {!reachable && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-bg-soft p-4 text-sm">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
            <p className="text-muted">
              Couldn&apos;t reach the ImagePipeline API right now. Account details may be
              unavailable — try again shortly.
            </p>
          </div>
        )}

        {tab === "overview" && (
          <Overview
            name={name}
            planLabel={planLabel}
            active={active}
            data={data}
            onGoTo={setTab}
          />
        )}
        {tab === "try" && <TryNow />}
        {tab === "keys" && <ApiKeys masked={data.apiKeyMasked} hasKey={data.hasApiKey} />}
        {tab === "images" && <ImagesTab images={data.images} />}
        {tab === "usage" && <Usage data={data} />}
        {tab === "billing" && (
          <Billing
            plan={plan}
            planLabel={planLabel}
            active={active}
            subscriptions={data.subscriptions}
            subscriptionsError={data.subscriptionsError}
          />
        )}
        {tab === "settings" && (
          <SettingsTab name={name} email={email} avatar={user?.imageUrl} account={account} />
        )}
      </main>
    </div>
  );
}

// ───────────────────────────────────────── Shared bits
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-surface p-5", className)}>{children}</div>;
}

const isPlainObject = (v: unknown): v is Json =>
  !!v && typeof v === "object" && !Array.isArray(v);

const isEmptyVal = (v: unknown) =>
  v == null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (isPlainObject(v) && Object.keys(v).length === 0);

function renderVal(v: unknown): React.ReactNode {
  if (v == null) return "—";
  if (typeof v === "number") return fmt(v);
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.every((x) => typeof x !== "object")) return v.join(", ");
  return <code className="font-mono text-xs text-muted">{JSON.stringify(v)}</code>;
}

// Recursive renderer for the spec's untyped responses (plan, usage, rate-limits).
// Empty objects/arrays are skipped so the UI never shows raw `{}` / `[]`.
function DataRows({ data, depth = 0 }: { data: Json | null; depth?: number }) {
  const entries = data ? Object.entries(data).filter(([, v]) => !isEmptyVal(v)) : [];
  if (entries.length === 0) {
    return <p className="py-3 text-sm text-muted">No data available.</p>;
  }
  return (
    <dl className={cn("text-sm", depth === 0 && "divide-y divide-line")}>
      {entries.map(([k, v]) =>
        isPlainObject(v) ? (
          <div key={k} className="py-2.5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-faint">{titleCase(k.replace(/[_-]/g, " "))}</p>
            <div className="rounded-lg bg-bg-soft/60 px-3 py-1">
              <DataRows data={v} depth={depth + 1} />
            </div>
          </div>
        ) : (
          <div
            key={k}
            className={cn("flex items-start justify-between gap-4", depth === 0 ? "py-2.5" : "py-1.5")}
          >
            <dt className="text-muted">{titleCase(k.replace(/[_-]/g, " "))}</dt>
            <dd className="max-w-[60%] break-words text-right font-medium text-fg">{renderVal(v)}</dd>
          </div>
        ),
      )}
    </dl>
  );
}

// ───────────────────────────────────────── Enterprise upsell (banner + locked card)
function EnterpriseBanner() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-key/30 bg-gradient-to-r from-key-soft to-surface p-5 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-key-soft">
          <Zap className="h-4 w-4 text-key" />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-fg">Go faster with Enterprise</p>
          <p className="mt-0.5 max-w-prose text-sm text-muted">
            Dedicated GPUs, priority queues, and video models for high-speed generation at scale.
            Need a product video shoot? Talk to us.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep"
        >
          Book a demo
        </a>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 hover:text-key"
        >
          Talk to us
        </a>
      </div>
    </div>
  );
}

// Locked, translucent teaser shown on the Usage tab for non-enterprise accounts
// (the pod/queue endpoints 403 with "Enterprise plan required").
function EnterpriseLocked() {
  return (
    <Card className="relative overflow-hidden p-0">
      {/* Blurred faux metrics behind the lock */}
      <div aria-hidden className="pointer-events-none select-none p-5 opacity-50 blur-[3px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {["Pods", "Queue depth", "Throughput", "GPU hours"].map((label) => (
            <div key={label} className="rounded-xl border border-line p-4">
              <div className="mb-3 h-3 w-24 rounded bg-bg-soft" />
              <div className="mb-2 h-6 w-16 rounded bg-bg-soft" />
              <div className="h-2 w-full rounded bg-bg-soft" />
            </div>
          ))}
        </div>
      </div>
      {/* Overlay CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-surface/70 to-surface/90 p-6 text-center backdrop-blur-[2px]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-key-soft">
          <Lock className="h-5 w-5 text-key" />
        </span>
        <h3 className="font-display text-lg font-semibold text-fg">Need high speed?</h3>
        <p className="max-w-md text-sm text-muted">
          Enterprise unlocks dedicated GPUs, priority queues, and video models — the fastest loads
          at scale, with live pod &amp; queue metrics here. Need a product video shoot? Talk to us.
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep"
          >
            Book a demo
          </a>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 hover:text-key"
          >
            Talk to us
          </a>
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────────────────── Plan grid (compact, dashboard-native)
function PlanGrid({ plan, active }: { plan: string; active: boolean }) {
  const [yearly, setYearly] = React.useState(true);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function upgrade(key: string) {
    setBusy(key);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: key }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.assign(data.url);
      else setBusy(null);
    } catch {
      setBusy(null);
    }
  }

  return (
    <div>
      {/* Monthly / Yearly toggle, right-aligned */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <span className="hidden text-xs text-muted sm:inline">Save ~17% yearly</span>
        <div className="inline-flex items-center rounded-pill border border-line bg-surface p-0.5">
          {[
            { label: "Monthly", value: false },
            { label: "Yearly", value: true },
          ].map((opt) => {
            const on = yearly === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => setYearly(opt.value)}
                className="relative rounded-pill px-3 py-1 text-xs font-medium"
              >
                {on && (
                  <motion.span
                    layoutId="dash-plan-toggle"
                    className="absolute inset-0 rounded-pill bg-key"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn("relative z-10", on ? "text-white" : "text-muted")}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLAN_TIERS.map((tier) => {
          const current = active && plan.toLowerCase() === tier.key;
          return (
            <div
              key={tier.key}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5",
                tier.popular ? "border-key/40" : "border-line",
                current && "ring-1 ring-key",
              )}
            >
              {tier.popular && !current && (
                <span className="absolute right-4 top-4 rounded-full bg-key-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-key">
                  Popular
                </span>
              )}
              {current && (
                <span className="absolute right-4 top-4 rounded-full bg-key px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Current
                </span>
              )}

              <h4 className="font-display text-base font-semibold text-fg">{tier.name}</h4>

              <div className="mt-2 flex items-baseline gap-1">
                {tier.custom ? (
                  <span className="font-display text-2xl font-semibold tracking-tight text-fg">Custom</span>
                ) : (
                  <>
                    <span className="font-display text-2xl font-semibold tracking-tight text-fg tabular-nums">
                      ${yearly ? tier.yearly : tier.monthly}
                    </span>
                    <span className="text-xs text-muted">/mo</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-faint">{tier.credits}</p>

              <ul className="mt-4 flex-1 space-y-2 text-xs text-muted">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <Check className="mt-px h-3.5 w-3.5 shrink-0 text-key" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {current ? (
                  <span className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-bg-soft px-4 py-2 text-sm font-medium text-muted">
                    Current plan
                  </span>
                ) : tier.custom ? (
                  <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 hover:text-key"
                  >
                    Book a call
                  </a>
                ) : (
                  <button
                    onClick={() => upgrade(tier.key)}
                    disabled={busy === tier.key}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep disabled:opacity-50"
                  >
                    {busy === tier.key ? "Redirecting…" : "Upgrade"}
                    {busy !== tier.key && <ArrowUpRight className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────── Overview
function Overview({
  name,
  planLabel,
  active,
  data,
  onGoTo,
}: {
  name: string;
  planLabel: string;
  active: boolean;
  data: DashboardData;
  onGoTo: (t: Tab) => void;
}) {
  const { account, images, hasApiKey, enterprise } = data;
  const creditsLeft = account?.tokens_remaining ?? 0;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-fg">Welcome back, {name}</h2>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Image credits</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">
            {account ? fmt(creditsLeft) : "—"}
          </p>
          <p className="mt-1 text-xs text-faint">
            {account?.plan_expiry_date ? `Renews ${fmtDate(account.plan_expiry_date)}` : "Remaining"}
          </p>
          <button
            onClick={() => onGoTo("usage")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            View usage <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>

        <Card>
          <p className="text-sm text-muted">Current plan</p>
          <p
            className="mt-1 truncate font-display text-3xl font-semibold tracking-tight text-fg"
            title={planLabel}
          >
            {planLabel}
          </p>
          <p className="mt-1 text-xs text-faint">{active ? "Active" : "No active plan"}</p>
          <button
            onClick={() => onGoTo("billing")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            Upgrade plan <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>

        <Card>
          <p className="text-sm text-muted">Images</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">{images.length}</p>
          <p className="mt-1 text-xs text-faint">Generated</p>
          <button
            onClick={() => onGoTo("images")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            View images <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>

        <Card>
          <p className="text-sm text-muted">API key</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">
            {hasApiKey ? "Active" : "None"}
          </p>
          <p className="mt-1 text-xs text-faint">{hasApiKey ? "1 key issued" : "Create one to start"}</p>
          <button
            onClick={() => onGoTo("keys")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            Manage key <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>
      </div>

      {/* Enterprise upsell — only for accounts without enterprise access */}
      {!enterprise.hasAccess && <EnterpriseBanner />}

      {/* Plans shown right on landing */}
      <Card>
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-key" />
          <h3 className="text-sm font-semibold text-fg">Upgrade for more credits</h3>
        </div>
        <PlanGrid plan={planLabel.toLowerCase()} active={active} />
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── API key (single key per user)
function ApiKeys({ masked, hasKey: initialHasKey }: { masked: string | null; hasKey: boolean }) {
  const [maskedKey, setMaskedKey] = React.useState<string | null>(masked);
  const [hasKey, setHasKey] = React.useState(initialHasKey);
  const [fullKey, setFullKey] = React.useState<string | null>(null); // shown after create/reset/reveal
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const maskOf = (key: string) =>
    key.length <= 12 ? `${key.slice(0, 4)}••••` : `${key.slice(0, 12)}••••••••••${key.slice(-4)}`;

  async function mutate(action: "create" | "reset") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/user/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setFullKey(data.apiKey);
        setMaskedKey(maskOf(data.apiKey));
        setHasKey(true);
        setCopied(false);
      } else setError("Couldn't update your API key. Please try again.");
    } catch {
      setError("Couldn't update your API key. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function reveal() {
    setBusy("reveal");
    setError(null);
    try {
      const res = await fetch("/api/user/api-key");
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setFullKey(data.apiKey);
        setCopied(false);
      } else setError("Couldn't fetch your API key.");
    } catch {
      setError("Couldn't fetch your API key.");
    } finally {
      setBusy(null);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-sm text-muted">
          Authenticate requests with your API key. You have one key — keep it secret, and rotate it
          if it&apos;s ever exposed.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {hasKey && (
            <button
              onClick={reveal}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              {busy === "reveal" ? "Revealing…" : "Reveal"}
            </button>
          )}
          {hasKey ? (
            <button
              onClick={() => mutate("reset")}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
            >
              <RotateCw className="h-4 w-4" />
              {busy === "reset" ? "Rotating…" : "Rotate"}
            </button>
          ) : (
            <button
              onClick={() => mutate("create")}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {busy === "create" ? "Creating…" : "Create key"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
          <TriangleAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      {fullKey && (
        <div className="rounded-2xl border border-key/40 bg-key-soft p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <TriangleAlert className="h-4 w-4 text-key" />
            Copy your key now — store it somewhere safe.
          </div>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm text-fg">
              {fullKey}
            </code>
            <button
              onClick={() => copy(fullKey)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-fg hover:border-key/50"
            >
              {copied ? <Check className="h-4 w-4 text-key" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <Card className="p-0">
        {hasKey && maskedKey ? (
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">Default key</p>
              <p className="truncate font-mono text-xs text-muted">{maskedKey}</p>
            </div>
            <span className="rounded-full bg-bg-soft px-2 py-0.5 text-xs font-medium text-muted">Active</span>
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted">
            No API key yet. Create one to start making requests.
          </p>
        )}
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── Images (gallery)
function ImagesTab({ images }: { images: UserImage[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg-soft p-4 text-sm">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-fg" />
        <p className="text-muted">
          Images are stored for only <span className="font-medium text-fg">24 hours</span> for
          privacy. Please download and keep them somewhere safe.
        </p>
      </div>

      {images.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-sm text-muted">
            No generated images yet. Images you create via the API will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <a
              key={img.image_id}
              href={img.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-line bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.download_url}
                alt=""
                className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
              />
              <p className="truncate px-3 py-2 text-xs text-muted">{fmtDate(img.creation_timestamp)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────── Usage (credits + activity + rate limits)
function Usage({ data }: { data: DashboardData }) {
  const { account, subscriptions, usage, rateLimits, enterprise } = data;
  const sub = subscriptions[0];
  const jobStats = isPlainObject(usage?.job_statistics) ? (usage!.job_statistics as Json) : null;
  const periodDays = typeof usage?.usage_period_days === "number" ? usage!.usage_period_days : null;
  // Just the structured limits/usage/remaining block (drop the redundant `plan` key).
  const limitsBlock: Json | null = rateLimits
    ? Object.fromEntries(Object.entries(rateLimits).filter(([k]) => k !== "plan"))
    : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-muted">Image credits remaining</p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-fg">
            {account ? fmt(account.tokens_remaining) : "—"}
          </p>
          <p className="mt-1 text-xs text-faint">
            {account?.plan_expiry_date ? `Renews ${fmtDate(account.plan_expiry_date)}` : "Credits remaining"}
          </p>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-semibold text-fg">
            Activity{periodDays ? ` (last ${periodDays} days)` : ""}
          </h3>
          {jobStats ? (
            <DataRows data={jobStats} />
          ) : (
            <p className="py-3 text-sm text-muted">No activity yet.</p>
          )}
        </Card>
      </div>

      {limitsBlock && Object.keys(limitsBlock).length > 0 && (
        <Card>
          <h3 className="mb-1 text-sm font-semibold text-fg">Rate limits</h3>
          <DataRows data={limitsBlock} />
        </Card>
      )}

      {sub && (
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-fg">Current billing period</h3>
          <dl className="divide-y divide-line text-sm">
            {[
              ["Plan", titleCase(sub.plan)],
              ["Status", titleCase(sub.subscription_status)],
              ["Period start", fmtDate(sub.period_start)],
              ["Period end", fmtDate(sub.period_end)],
              ...(sub.pod_id ? ([["Pod", `${sub.pod_id} (${sub.pod_status})`]] as [string, string][]) : []),
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Enterprise — live metrics if the account has access, otherwise a locked upsell */}
      {enterprise.hasAccess ? (
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-key" />
            <h3 className="text-sm font-semibold text-fg">Enterprise</h3>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              ["Pods", enterprise.pods],
              ["Pod status", enterprise.podStatus],
              ["Queue metrics", enterprise.queueMetrics],
              ["SQS metrics", enterprise.sqsMetrics],
            ].map(([title, d]) => (
              <div key={title as string}>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-faint">{title as string}</p>
                <DataRows data={d as Json | null} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EnterpriseLocked />
      )}
    </div>
  );
}

// ───────────────────────────────────────── Billing
function Billing({
  plan,
  planLabel,
  active,
  subscriptions,
  subscriptionsError,
}: {
  plan: string;
  planLabel: string;
  active: boolean;
  subscriptions: UserSubscription[];
  subscriptionsError: boolean;
}) {
  const [busy, setBusy] = React.useState(false);

  async function manageBilling() {
    setBusy(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) window.location.assign(data.url);
      else setBusy(false);
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted">Current plan</p>
          <p className="truncate font-display text-2xl font-semibold text-fg" title={planLabel}>
            {planLabel} <span className="text-sm font-normal text-faint">({active ? "active" : "inactive"})</span>
          </p>
        </div>
        <button
          onClick={manageBilling}
          disabled={busy}
          className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
        >
          {busy ? "Opening…" : "Manage billing"}
        </button>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-semibold text-fg">Plans</h3>
        <PlanGrid plan={plan} active={active} />
      </Card>

      <Card className="p-0">
        <div className="border-b border-line px-5 py-4">
          <h3 className="text-sm font-semibold text-fg">Subscriptions</h3>
        </div>
        <div className="divide-y divide-line">
          {subscriptions.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              {subscriptionsError ? "Couldn't load subscriptions right now." : "No subscriptions yet."}
            </p>
          )}
          {subscriptions.map((sub) => (
            <div key={sub.subscription_id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
              <span className="text-fg">{titleCase(sub.plan)}</span>
              <span className="text-muted">
                {fmtDate(sub.period_start)} – {fmtDate(sub.period_end)}
              </span>
              <span className="rounded-full bg-bg-soft px-2 py-0.5 text-xs font-medium text-muted">
                {titleCase(sub.subscription_status)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── Settings
function SettingsTab({
  name,
  email,
  avatar,
  account,
}: {
  name: string;
  email: string;
  avatar?: string;
  account: UserMe | null;
}) {
  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-key text-xl font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-fg">{name}</p>
          <p className="truncate text-sm text-muted">{email}</p>
        </div>
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-fg">Account details</h3>
        <dl className="mt-4 divide-y divide-line text-sm">
          {[
            ["Name", name],
            ["Email", email],
            ["Account ID", account?.user_id ?? "—"],
            ["Plan", account ? titleCase(account.plan) : "—"],
            ["Plan renews", fmtDate(account?.plan_expiry_date)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-faint">
          Use the account menu above to update your name, email, or password.
        </p>
      </Card>
    </div>
  );
}
