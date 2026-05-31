"use client";

import * as React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  KeyRound,
  Activity,
  CreditCard,
  Settings,
  Plus,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ArrowUpRight,
  TriangleAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { CAL_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Dummy data — replaced by real backend calls later.
// ─────────────────────────────────────────────────────────────────────────────
const CREDITS = { used: 6750, total: 20000 };

type ApiKey = {
  id: string;
  name: string;
  masked: string;
  created: string;
  lastUsed: string;
};

const INITIAL_KEYS: ApiKey[] = [
  { id: "k_1", name: "Production", masked: "ip_live_8f3a••••••••••d92c", created: "Apr 12, 2026", lastUsed: "2 hours ago" },
  { id: "k_2", name: "Staging", masked: "ip_test_2b7c••••••••••a14f", created: "Mar 28, 2026", lastUsed: "5 days ago" },
];

const USAGE = [
  { label: "Generate", calls: 4120 },
  { label: "Identity", calls: 1880 },
  { label: "Editing", calls: 540 },
  { label: "Background", calls: 210 },
];

const INVOICES = [
  { id: "in_1042", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "in_1031", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "in_1019", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
];

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

type Tab = "overview" | "keys" | "usage" | "billing" | "settings";

const NAV: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "keys", label: "API keys", icon: KeyRound },
  { key: "usage", label: "Usage", icon: Activity },
  { key: "billing", label: "Plans & billing", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export function DashboardClient({
  email,
  plan,
  planStatus,
}: {
  email: string;
  plan: string;
  planStatus: string;
}) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const { user } = useUser();
  const creditsLeft = CREDITS.total - CREDITS.used;

  const name = user?.firstName || user?.fullName || email.split("@")[0];
  const active = planStatus === "active" || planStatus === "trialing";

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
              {fmt(creditsLeft)} credits left
            </span>
            <span className="inline-flex items-center rounded-pill bg-key px-3 py-1.5 text-xs font-semibold capitalize text-white">
              {plan}
            </span>
          </div>
        </div>

        {tab === "overview" && (
          <Overview name={name} plan={plan} active={active} creditsLeft={creditsLeft} onGoTo={setTab} />
        )}
        {tab === "keys" && <ApiKeys />}
        {tab === "usage" && <Usage />}
        {tab === "billing" && <Billing plan={plan} planStatus={planStatus} active={active} />}
        {tab === "settings" && <SettingsTab name={name} email={email} avatar={user?.imageUrl} />}
      </main>
    </div>
  );
}

// ───────────────────────────────────────── Shared bits
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-surface p-5", className)}>{children}</div>;
}

function CreditsBar({ leftLabel = true }: { leftLabel?: boolean }) {
  const pct = Math.round((CREDITS.used / CREDITS.total) * 100);
  return (
    <div>
      {leftLabel && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-muted">Credits used</span>
          <span className="text-sm font-medium text-fg">
            {fmt(CREDITS.used)} <span className="text-faint">/ {fmt(CREDITS.total)}</span>
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-bg-soft">
        <div className="h-full rounded-full bg-key" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-faint">Resets on Jun 1, 2026 · {pct}% used</p>
    </div>
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
          const current = active && plan === tier.key;
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
  plan,
  active,
  creditsLeft,
  onGoTo,
}: {
  name: string;
  plan: string;
  active: boolean;
  creditsLeft: number;
  onGoTo: (t: Tab) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-fg">Welcome back, {name}</h2>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Credits left</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">{fmt(creditsLeft)}</p>
          <div className="mt-4">
            <CreditsBar leftLabel={false} />
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted">Current plan</p>
          <p className="mt-1 font-display text-3xl font-semibold capitalize tracking-tight text-fg">{plan}</p>
          <p className="mt-1 text-xs text-faint">{active ? "Active subscription" : "No active subscription"}</p>
          <button
            onClick={() => onGoTo("billing")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            Upgrade plan <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>

        <Card>
          <p className="text-sm text-muted">API keys</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">{INITIAL_KEYS.length}</p>
          <p className="mt-1 text-xs text-faint">Active keys</p>
          <button
            onClick={() => onGoTo("keys")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            Manage keys <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>
      </div>

      {/* Plans shown right on landing */}
      <Card>
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-key" />
          <h3 className="text-sm font-semibold text-fg">Upgrade for more credits</h3>
        </div>
        <PlanGrid plan={plan} active={active} />
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── API keys
function ApiKeys() {
  const [keys, setKeys] = React.useState<ApiKey[]>(INITIAL_KEYS);
  const [newKey, setNewKey] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  function createKey() {
    // Dummy generated key — backend will issue the real one later.
    const rand = Array.from({ length: 24 }, (_, i) => "abcdef0123456789"[(i * 7 + 3) % 16]).join("");
    const full = `ip_live_${rand}`;
    setNewKey(full);
    setCopied(false);
    setKeys((k) => [
      {
        id: `k_${k.length + 1}`,
        name: "New key",
        masked: `${full.slice(0, 12)}••••••••••${full.slice(-4)}`,
        created: "Just now",
        lastUsed: "Never",
      },
      ...k,
    ]);
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="max-w-md text-sm text-muted">
          Use API keys to authenticate requests. Keep them secret — treat a key like a password.
        </p>
        <button
          onClick={createKey}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep"
        >
          <Plus className="h-4 w-4" />
          Create key
        </button>
      </div>

      {newKey && (
        <div className="rounded-2xl border border-key/40 bg-key-soft p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <TriangleAlert className="h-4 w-4 text-key" />
            Copy your new key now — you won&apos;t see it again.
          </div>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm text-fg">
              {newKey}
            </code>
            <button
              onClick={() => copy(newKey)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-fg hover:border-key/50"
            >
              {copied ? <Check className="h-4 w-4 text-key" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <Card className="p-0">
        <div className="divide-y divide-line">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{k.name}</p>
                <p className="truncate font-mono text-xs text-muted">{k.masked}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted">Created {k.created}</p>
                <p className="text-xs text-faint">Last used {k.lastUsed}</p>
              </div>
              <button
                onClick={() => setKeys((list) => list.filter((x) => x.id !== k.id))}
                className="rounded-lg p-2 text-faint transition-colors hover:bg-bg-soft hover:text-red-500"
                aria-label={`Revoke ${k.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {keys.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">No API keys yet. Create one to get started.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── Usage
function Usage() {
  const max = Math.max(...USAGE.map((u) => u.calls));
  const total = USAGE.reduce((s, u) => s + u.calls, 0);
  return (
    <div className="space-y-5">
      <Card>
        <CreditsBar />
      </Card>

      <Card>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-fg">Calls by capability</h3>
          <span className="text-xs text-faint">Last 30 days · {fmt(total)} calls</span>
        </div>
        <div className="space-y-3">
          {USAGE.map((u) => (
            <div key={u.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-fg">{u.label}</span>
                <span className="text-muted">{fmt(u.calls)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-soft">
                <div className="h-full rounded-full bg-key" style={{ width: `${(u.calls / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── Billing
function Billing({ plan, planStatus, active }: { plan: string; planStatus: string; active: boolean }) {
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
        <div>
          <p className="text-sm text-muted">Current plan</p>
          <p className="font-display text-2xl font-semibold capitalize text-fg">
            {plan} <span className="text-sm font-normal text-faint">({active ? planStatus : "inactive"})</span>
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
          <h3 className="text-sm font-semibold text-fg">Invoices</h3>
        </div>
        <div className="divide-y divide-line">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
              <span className="text-fg">{inv.date}</span>
              <span className="text-muted">{inv.amount}</span>
              <span className="rounded-full bg-bg-soft px-2 py-0.5 text-xs font-medium text-muted">{inv.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────── Settings
function SettingsTab({ name, email, avatar }: { name: string; email: string; avatar?: string }) {
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
            ["Account ID", "usr_••••••••"],
            ["Member since", "Mar 2026"],
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
