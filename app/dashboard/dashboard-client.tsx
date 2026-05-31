"use client";

import * as React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  KeyRound,
  Activity,
  CreditCard,
  Settings,
  Boxes,
  Images as ImagesIcon,
  Plus,
  Copy,
  Check,
  Eye,
  RotateCw,
  Sparkles,
  ArrowUpRight,
  TriangleAlert,
  WifiOff,
  Server,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { CAL_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import type {
  UserMe,
  UserSubscription,
  UserModelInfo,
  UserModel,
  UserImage,
  DashboardData,
  Json,
} from "@/lib/imagepipeline";

// ─────────────────────────────────────────────────────────────────────────────
// All account data (credits, plan, usage, limits, API key, models, images,
// subscriptions, enterprise) is fetched server-side from api.imagepipeline.io and
// passed in as `data` — see app/dashboard/page.tsx + lib/imagepipeline.ts. The plan
// tiers below are presentational (mirrors lib/plans.ts) for the upgrade grid; the
// live plan/status come from `account` + Clerk.
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

type Tab = "overview" | "keys" | "models" | "images" | "usage" | "billing" | "settings";

const NAV: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "keys", label: "API key", icon: KeyRound },
  { key: "models", label: "Models", icon: Boxes },
  { key: "images", label: "Images", icon: ImagesIcon },
  { key: "usage", label: "Usage", icon: Activity },
  { key: "billing", label: "Plans & billing", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

const fmt = (n: number) => n.toLocaleString("en-US");

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function maskKey(key: string): string {
  if (key.length <= 12) return `${key.slice(0, 4)}••••`;
  return `${key.slice(0, 12)}••••••••••${key.slice(-4)}`;
}

const humanize = (k: string) =>
  k.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function DashboardClient({
  email,
  plan,
  planStatus,
  data,
}: {
  email: string;
  plan: string;
  planStatus: string;
  data: DashboardData;
}) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const { user } = useUser();

  const { account, subscriptions, reachable } = data;
  const name = user?.firstName || user?.fullName || email.split("@")[0];
  const active = planStatus === "active" || planStatus === "trialing";
  const creditsLeft = account?.tokens_remaining ?? 0;
  const hasKey = !!account?.api_key;

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
            <span className="inline-flex items-center rounded-pill bg-key px-3 py-1.5 text-xs font-semibold capitalize text-white">
              {plan}
            </span>
          </div>
        </div>

        {!reachable && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-muted">
              Couldn&apos;t reach the ImagePipeline API right now. Account details may be
              unavailable — try again shortly.
            </p>
          </div>
        )}

        {tab === "overview" && (
          <Overview
            name={name}
            plan={plan}
            active={active}
            data={data}
            hasKey={hasKey}
            onGoTo={setTab}
          />
        )}
        {tab === "keys" && <ApiKeys account={account} />}
        {tab === "models" && <Models models={data.models} />}
        {tab === "images" && <ImagesTab images={data.images} />}
        {tab === "usage" && <Usage data={data} />}
        {tab === "billing" && (
          <Billing plan={plan} planStatus={planStatus} active={active} subscriptions={subscriptions} />
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

function CreditStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-medium tabular-nums text-fg">{fmt(value)}</span>
    </div>
  );
}

function renderVal(v: unknown): React.ReactNode {
  if (v == null) return "—";
  if (typeof v === "number") return fmt(v);
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return v;
  return <code className="font-mono text-xs text-muted">{JSON.stringify(v)}</code>;
}

// Generic renderer for the spec's untyped responses (plan, usage, rate-limits, …).
function KeyValues({ data }: { data: Json | null }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="py-4 text-sm text-muted">No data available.</p>;
  }
  return (
    <dl className="divide-y divide-line text-sm">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-4 py-2.5">
          <dt className="text-muted">{humanize(k)}</dt>
          <dd className="max-w-[60%] break-words text-right font-medium text-fg">{renderVal(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionCard({ title, data }: { title: string; data: Json | null }) {
  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold text-fg">{title}</h3>
      <KeyValues data={data} />
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
  data,
  hasKey,
  onGoTo,
}: {
  name: string;
  plan: string;
  active: boolean;
  data: DashboardData;
  hasKey: boolean;
  onGoTo: (t: Tab) => void;
}) {
  const { account, models, images } = data;
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
          <p className="text-sm text-muted">Models</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">{models.length}</p>
          <p className="mt-1 text-xs text-faint">Trained models</p>
          <button
            onClick={() => onGoTo("models")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            View models <ArrowUpRight className="h-4 w-4" />
          </button>
        </Card>

        <Card>
          <p className="text-sm text-muted">API key</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-fg">
            {hasKey ? "Active" : "None"}
          </p>
          <p className="mt-1 text-xs text-faint">{images.length} images generated</p>
          <button
            onClick={() => onGoTo("keys")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
          >
            Manage key <ArrowUpRight className="h-4 w-4" />
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

// ───────────────────────────────────────── API key (single key per user)
function ApiKeys({ account }: { account: UserMe | null }) {
  const [key, setKey] = React.useState<string | null>(account?.api_key ?? null);
  const [fullKey, setFullKey] = React.useState<string | null>(null); // shown after create/reset/reveal
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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
        setKey(data.apiKey);
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
        setKey(data.apiKey);
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
          {key && (
            <button
              onClick={reveal}
              disabled={!!busy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              {busy === "reveal" ? "Revealing…" : "Reveal"}
            </button>
          )}
          {key ? (
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
        {key ? (
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">Default key</p>
              <p className="truncate font-mono text-xs text-muted">{maskKey(key)}</p>
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

// ───────────────────────────────────────── Models (list + on-demand detail)
function Models({ models }: { models: UserModelInfo[] }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<UserModel | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setDetail(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/user/models/${encodeURIComponent(id)}`);
      const d = await res.json();
      if (res.ok) setDetail(d);
    } catch {
      /* leave detail null; row still shows summary */
    } finally {
      setLoading(false);
    }
  }

  if (models.length === 0) {
    return (
      <Card>
        <p className="py-6 text-center text-sm text-muted">
          No trained models yet. Train one via the API to see it here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div className="divide-y divide-line">
        {models.map((m) => {
          const open = openId === m.model_id;
          return (
            <div key={m.model_id}>
              <button
                onClick={() => toggle(m.model_id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-soft"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">
                    {m.model_name || m.model_id}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {m.trigger_word ? `Trigger: ${m.trigger_word} · ` : ""}
                    {fmtDate(m.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-bg-soft px-2 py-0.5 text-xs font-medium capitalize text-muted">
                    {m.status}
                  </span>
                  <ChevronDown
                    className={cn("h-4 w-4 text-faint transition-transform", open && "rotate-180")}
                  />
                </div>
              </button>
              {open && (
                <div className="border-t border-line bg-bg-soft/40 px-5 py-4">
                  {loading && <p className="text-sm text-muted">Loading…</p>}
                  {!loading && detail && (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {detail.thumbnail_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={detail.thumbnail_url}
                          alt=""
                          className="h-24 w-24 shrink-0 rounded-xl border border-line object-cover"
                        />
                      )}
                      <dl className="flex-1 divide-y divide-line text-sm">
                        {[
                          ["Model ID", detail.model_id],
                          ["Status", detail.status],
                          ["Trigger word", detail.trigger_word ?? "—"],
                          ["Training steps", detail.training_steps != null ? fmt(detail.training_steps) : "—"],
                          ["Created", fmtDate(detail.created_at)],
                          ["Updated", fmtDate(detail.updated_at)],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between py-2">
                            <dt className="text-muted">{k}</dt>
                            <dd className="font-medium text-fg">{v}</dd>
                          </div>
                        ))}
                        {detail.model_url && (
                          <div className="pt-2">
                            <a
                              href={detail.model_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-key hover:underline"
                            >
                              Open model <ArrowUpRight className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                  {!loading && !detail && (
                    <p className="text-sm text-muted">Couldn&apos;t load model details.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ───────────────────────────────────────── Images (gallery)
function ImagesTab({ images }: { images: UserImage[] }) {
  if (images.length === 0) {
    return (
      <Card>
        <p className="py-6 text-center text-sm text-muted">
          No generated images yet. Images you create via the API will appear here.
        </p>
      </Card>
    );
  }
  return (
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
  );
}

// ───────────────────────────────────────── Usage (credits + plan + limits + enterprise)
function Usage({ data }: { data: DashboardData }) {
  const { account, subscriptions, plan, usage, rateLimits, rateLimitStats, enterprise } = data;
  const sub = subscriptions[0];
  const [reqBusy, setReqBusy] = React.useState(false);
  const [reqMsg, setReqMsg] = React.useState<string | null>(null);

  async function requestPod() {
    setReqBusy(true);
    setReqMsg(null);
    try {
      const res = await fetch("/api/user/enterprise/pod", { method: "POST" });
      setReqMsg(res.ok ? "Pod requested — we'll provision it shortly." : "Couldn't request a pod.");
    } catch {
      setReqMsg("Couldn't request a pod.");
    } finally {
      setReqBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-fg">Credit balances</h3>
          {account?.plan_expiry_date && (
            <span className="text-xs text-faint">Renews {fmtDate(account.plan_expiry_date)}</span>
          )}
        </div>
        {account ? (
          <div className="mt-1">
            <CreditStat label="Image credits" value={account.tokens_remaining} />
            <CreditStat label="Model trainings" value={account.model_trainings_remaining} />
            <CreditStat label="Private model loads" value={account.private_model_loads_remaining} />
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted">Usage data is unavailable right now.</p>
        )}
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Plan limits" data={plan} />
        <SectionCard title="Usage (last 30 days)" data={usage} />
        <SectionCard title="Rate limits" data={rateLimits} />
        <SectionCard title="Rate limit stats" data={rateLimitStats} />
      </div>

      {sub && (
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-fg">Current billing period</h3>
          <dl className="divide-y divide-line text-sm">
            {[
              ["Plan", sub.plan],
              ["Status", sub.subscription_status],
              ["Period start", fmtDate(sub.period_start)],
              ["Period end", fmtDate(sub.period_end)],
              ...(sub.pod_id ? ([["Pod", `${sub.pod_id} (${sub.pod_status})`]] as [string, string][]) : []),
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium capitalize text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Enterprise — only when the account actually has enterprise data */}
      {enterprise.hasData && (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-key" />
              <h3 className="text-sm font-semibold text-fg">Enterprise</h3>
            </div>
            <button
              onClick={requestPod}
              disabled={reqBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
            >
              {reqBusy ? "Requesting…" : "Request pod"}
            </button>
          </div>
          {reqMsg && <p className="mb-3 text-xs text-muted">{reqMsg}</p>}
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard title="Pods" data={enterprise.pods} />
            <SectionCard title="Pod status" data={enterprise.podStatus} />
            <SectionCard title="Queue metrics" data={enterprise.queueMetrics} />
            <SectionCard title="SQS metrics" data={enterprise.sqsMetrics} />
          </div>
        </Card>
      )}
    </div>
  );
}

// ───────────────────────────────────────── Billing
function Billing({
  plan,
  planStatus,
  active,
  subscriptions,
}: {
  plan: string;
  planStatus: string;
  active: boolean;
  subscriptions: UserSubscription[];
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
          <h3 className="text-sm font-semibold text-fg">Subscriptions</h3>
        </div>
        <div className="divide-y divide-line">
          {subscriptions.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">No subscriptions yet.</p>
          )}
          {subscriptions.map((sub) => (
            <div key={sub.subscription_id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
              <span className="capitalize text-fg">{sub.plan}</span>
              <span className="text-muted">
                {fmtDate(sub.period_start)} – {fmtDate(sub.period_end)}
              </span>
              <span className="rounded-full bg-bg-soft px-2 py-0.5 text-xs font-medium capitalize text-muted">
                {sub.subscription_status}
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
            ["Plan", account?.plan ?? "—"],
            ["Plan renews", fmtDate(account?.plan_expiry_date)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium capitalize text-fg">{v}</dd>
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
