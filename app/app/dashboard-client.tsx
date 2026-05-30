"use client";

import * as React from "react";

type KeyRow = { id: string; name: string; label: string; createdAt: string };
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
  keys: initialKeys,
  plans,
}: {
  email: string;
  plan: string;
  planStatus: string;
  keys: KeyRow[];
  plans: PlanRow[];
}) {
  const [keys, setKeys] = React.useState<KeyRow[]>(initialKeys);
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [freshKey, setFreshKey] = React.useState<string | null>(null);
  const [busyPlan, setBusyPlan] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function createKey() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName || "Default key" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create key");
      setFreshKey(data.key);
      setKeys((k) => [
        { id: data.id, name: data.name, label: data.label, createdAt: data.createdAt },
        ...k,
      ]);
      setNewName("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this key? Requests using it will stop working immediately.")) return;
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (res.ok) setKeys((k) => k.filter((x) => x.id !== id));
  }

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
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setBusyPlan(null);
    }
  }

  async function manageBilling() {
    setBusyPlan("portal");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) window.location.href = data.url;
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

      {/* ── API keys ─────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-fg">API keys</h2>

        {freshKey && (
          <div className="rounded-xl border border-key/40 bg-key-soft px-4 py-3">
            <p className="text-sm font-medium text-fg">Copy your new key now — it won&apos;t be shown again.</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm text-fg">
                {freshKey}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(freshKey)}
                className="rounded-lg bg-key px-3 py-2 text-sm font-medium text-white hover:bg-key-deep"
              >
                Copy
              </button>
              <button
                onClick={() => setFreshKey(null)}
                className="rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-fg"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Key name (e.g. production)"
            className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-key/50"
          />
          <button
            onClick={createKey}
            disabled={creating}
            className="rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create key"}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {keys.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No API keys yet. Create one to start calling the API.</p>
          ) : (
            <ul className="divide-y divide-line">
              {keys.map((k) => (
                <li key={k.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-fg">{k.name}</p>
                    <p className="font-mono text-xs text-muted">{k.label}</p>
                  </div>
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-300 hover:text-red-600"
                  >
                    Revoke
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
