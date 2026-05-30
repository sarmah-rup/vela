"use client";

import * as React from "react";

type PlanRow = {
  key: string;
  name: string;
  priceLabel: string;
  blurb: string;
  features: string[];
  popular: boolean;
  purchasable: boolean;
};

export function DashboardClient({
  email,
  plan,
  planStatus,
  plans,
}: {
  email: string;
  plan: string;
  planStatus: string;
  plans: PlanRow[];
}) {
  const [busyPlan, setBusyPlan] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function startCheckout(planKey: string) {
    setBusyPlan(planKey);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout");
      window.location.assign(data.url);
    } catch (e) {
      setError((e as Error).message);
      setBusyPlan(null);
    }
  }

  async function manageBilling() {
    setBusyPlan("portal");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) window.location.assign(data.url);
    else {
      setError(data.error ?? "Could not open billing portal");
      setBusyPlan(null);
    }
  }

  const active = planStatus === "active" || planStatus === "trialing";

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">{email}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Plan ─────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-fg">Plan</h2>
            <p className="text-sm text-muted">
              Current:{" "}
              <span className="font-medium capitalize text-fg">{plan}</span>{" "}
              <span className="text-faint">({active ? planStatus : "no active subscription"})</span>
            </p>
          </div>
          {active && (
            <button
              onClick={manageBilling}
              disabled={busyPlan === "portal"}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-key/50 disabled:opacity-50"
            >
              {busyPlan === "portal" ? "Opening…" : "Manage billing"}
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((p) => {
            const current = p.key === plan && active;
            return (
              <div
                key={p.key}
                className={`relative rounded-2xl border bg-surface p-6 ${
                  p.popular ? "border-key/50 shadow-[0_18px_40px_-28px_rgba(13,15,20,0.4)]" : "border-line"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2 right-4 rounded-full bg-key px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-fg">{p.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-fg">{p.priceLabel}</p>
                <p className="mt-1 text-sm text-muted">{p.blurb}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-key">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {current ? (
                    <span className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-bg-soft px-4 py-2 text-sm font-medium text-muted">
                      Current plan
                    </span>
                  ) : p.purchasable ? (
                    <button
                      onClick={() => startCheckout(p.key)}
                      disabled={busyPlan === p.key}
                      className="w-full rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep disabled:opacity-50"
                    >
                      {busyPlan === p.key ? "Redirecting…" : `Choose ${p.name}`}
                    </button>
                  ) : (
                    <span className="inline-flex w-full items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted">
                      Default
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
