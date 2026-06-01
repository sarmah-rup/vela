"use client";

import * as React from "react";
import {
  Play,
  Loader2,
  Copy,
  Check,
  ImagePlus,
  Download,
  CornerDownLeft,
  RefreshCw,
  TriangleAlert,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FEATURES,
  SNIPPET_LANGS,
  snippet,
  imageInputFeatures,
  type Feature,
  type SnippetLang,
} from "@/lib/playground";
import { PricingTiers } from "@/components/sections/pricing";

// Category order follows first appearance in FEATURES.
const CATEGORIES = FEATURES.reduce<string[]>(
  (acc, f) => (acc.includes(f.category) ? acc : [...acc, f.category]),
  [],
);

const OUTPUT_LABEL: Record<Feature["output"], string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  model3d: "3D model",
  json: "JSON",
};

type RunState = {
  phase: "idle" | "running" | "done" | "error";
  status?: string;
  progress?: number | null;
  resultUrl?: string | null;
  mime?: string | null;
  raw?: Record<string, unknown> | null;
  error?: string;
};

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-key/50"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-key" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function TryNow() {
  const [activeId, setActiveId] = React.useState(FEATURES[0].id);
  const feature = FEATURES.find((f) => f.id === activeId)!;
  const [json, setJson] = React.useState(() => JSON.stringify(FEATURES[0].example, null, 2));
  const [view, setView] = React.useState<"request" | "code">("request");
  const [lang, setLang] = React.useState<SnippetLang>("curl");
  const [run, setRun] = React.useState<RunState>({ phase: "idle" });
  const [generated, setGenerated] = React.useState<string | null>(null);
  const [lightbox, setLightbox] = React.useState<string | null>(null);
  const [upsell, setUpsell] = React.useState(false);
  const pollRef = React.useRef<number | null>(null);

  React.useEffect(() => () => void (pollRef.current && clearTimeout(pollRef.current)), []);

  const payload = React.useMemo<Record<string, unknown> | null>(() => {
    try {
      const p = JSON.parse(json);
      return p && typeof p === "object" ? p : null;
    } catch {
      return null;
    }
  }, [json]);
  const jsonValid = payload !== null;

  function select(id: string) {
    if (pollRef.current) clearTimeout(pollRef.current);
    const f = FEATURES.find((x) => x.id === id)!;
    setActiveId(id);
    setJson(JSON.stringify(f.example, null, 2));
    setRun({ phase: "idle" });
    setView("request");
  }

  function injectImage(fields: string[], url: string) {
    const base = jsonValid ? { ...(payload as object) } : { ...feature.example };
    for (const field of fields) (base as Record<string, unknown>)[field] = url;
    setJson(JSON.stringify(base, null, 2));
  }

  function poll(jobId: string) {
    let tries = 0;
    const tick = async () => {
      tries += 1;
      try {
        const res = await fetch(
          `/api/playground/status?path=${encodeURIComponent(feature.path)}&jobId=${encodeURIComponent(jobId)}`,
        );
        const s = await res.json();
        const status: string = s.status ?? "processing";
        if (status === "completed") {
          setRun({ phase: "done", status, resultUrl: s.result_url, mime: s.result_mime_type, raw: s });
          if (feature.output === "image" && s.result_url) setGenerated(s.result_url);
          return;
        }
        if (status === "failed" || status === "cancelled") {
          setRun({ phase: "error", status, error: s.detail || `Job ${status}.` });
          return;
        }
        setRun({ phase: "running", status, progress: s.progress });
      } catch {
        /* transient — keep polling */
      }
      if (tries < 80) pollRef.current = window.setTimeout(tick, 2500);
      else setRun({ phase: "error", error: "Timed out waiting for the result." });
    };
    tick();
  }

  async function doRun() {
    if (!jsonValid || feature.runnable === false) return;
    setRun({ phase: "running", status: "submitting" });
    try {
      const res = await fetch("/api/playground/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: feature.path, payload }),
      });
      const data = await res.json();
      // 403 → feature not on the user's plan: show the upgrade/pricing popup.
      if (res.status === 403 || data.error === "plan_upgrade_required") {
        setRun({ phase: "idle" });
        setUpsell(true);
        return;
      }
      if (!res.ok || !data.job_id) {
        setRun({ phase: "error", error: data.detail || "The request was rejected." });
        return;
      }
      setRun({ phase: "running", status: data.status ?? "queued" });
      poll(data.job_id);
    } catch {
      setRun({ phase: "error", error: "Couldn't reach the API." });
    }
  }

  const snippetText = snippet(lang, feature, jsonValid ? payload : feature.example);
  const imgFeatures = imageInputFeatures();

  return (
    <div className="space-y-5">
      {/* Generated-image reuse banner */}
      {generated && (
        <div className="flex flex-col gap-3 rounded-2xl border border-key/30 bg-key-soft p-4 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generated}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg">Generated image ready</p>
            <p className="text-xs text-muted">Use it as input for an image endpoint:</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {imgFeatures.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  select(f.id);
                  setTimeout(() => injectImage([f.imageFields[0]], generated), 0);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-key/50"
              >
                {f.label}
                <ChevronRight className="h-3.5 w-3.5 text-faint" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* ── Feature list ─────────────────────────────────── */}
        <aside className="lg:w-60 lg:shrink-0">
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-3">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  {cat}
                </p>
                <div className="space-y-0.5">
                  {FEATURES.filter((f) => f.category === cat).map((f) => {
                    const on = f.id === activeId;
                    return (
                      <button
                        key={f.id}
                        onClick={() => select(f.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                          on ? "bg-bg-soft font-medium text-fg" : "text-muted hover:bg-bg-soft hover:text-fg",
                        )}
                      >
                        <span className="truncate">{f.label}</span>
                        {f.imageFields.length > 0 && (
                          <span title="Takes an image input">
                            <ImagePlus className="h-3.5 w-3.5 shrink-0 text-faint" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 px-2 text-xs text-faint">
            <ImagePlus className="h-3.5 w-3.5" /> takes an image in the payload
          </p>
        </aside>

        {/* ── Detail ───────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-fg">{feature.label}</h2>
                  <span className="rounded-full bg-bg-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {OUTPUT_LABEL[feature.output]}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{feature.blurb}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-line bg-bg-soft px-3 py-2 font-mono text-xs text-fg">
                <span className="font-semibold text-key">POST</span> {feature.path}
              </code>
              <CopyButton text={feature.path} label="Path" />
            </div>
          </div>

          {/* Request / Code toggle — mirrors the home pricing toggle */}
          <div className="inline-flex items-center rounded-pill border border-line bg-surface p-0.5 text-sm">
            {(["request", "code"] as const).map((v) => {
              const on = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="relative rounded-pill px-4 py-1.5 font-medium"
                >
                  {on && (
                    <motion.span
                      layoutId="try-view-toggle"
                      className="absolute inset-0 rounded-pill bg-key"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={cn("relative z-10", on ? "text-white" : "text-muted")}>
                    {v === "request" ? "Request" : "Code"}
                  </span>
                </button>
              );
            })}
          </div>

          {view === "request" ? (
            <div className="space-y-4">
              {/* Image-field helper */}
              {feature.imageFields.length > 0 && (
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-fg">
                    <ImagePlus className="h-4 w-4 text-key" /> Image inputs
                  </p>
                  <div className="space-y-1.5">
                    {feature.imageFields.map((field) => (
                      <div key={field} className="flex items-center justify-between gap-3 text-sm">
                        <code className="font-mono text-xs text-muted">{field}</code>
                        {generated ? (
                          <button
                            onClick={() => injectImage([field], generated)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-key hover:underline"
                          >
                            <CornerDownLeft className="h-3.5 w-3.5" /> use generated image
                          </button>
                        ) : (
                          <span className="text-xs text-faint">paste an image URL</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JSON editor */}
              <div className="rounded-2xl border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                  <span className="text-xs font-medium text-muted">Request body (JSON)</span>
                  <div className="flex items-center gap-2">
                    {!jsonValid && (
                      <span className="flex items-center gap-1 text-xs text-red-500">
                        <TriangleAlert className="h-3.5 w-3.5" /> invalid JSON
                      </span>
                    )}
                    <CopyButton text={json} />
                  </div>
                </div>
                <textarea
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  spellCheck={false}
                  rows={Math.min(18, json.split("\n").length + 1)}
                  className="block w-full resize-y rounded-b-2xl bg-transparent p-4 font-mono text-xs text-fg outline-none"
                />
              </div>

              {/* Run */}
              {feature.runnable === false ? (
                <p className="text-sm text-muted">
                  This is a multipart upload — run it from your server using the code on the right.
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={doRun}
                    disabled={!jsonValid || run.phase === "running"}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-key px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-key-deep disabled:opacity-50"
                  >
                    {run.phase === "running" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {run.phase === "running" ? "Running…" : "Run"}
                  </button>
                  {run.phase === "running" && (
                    <span className="text-xs text-muted">
                      {run.status}
                      {typeof run.progress === "number" ? ` · ${run.progress}%` : ""} — async job,
                      polling…
                    </span>
                  )}
                  {run.phase === "done" && (
                    <button
                      onClick={doRun}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-key hover:underline"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> run again
                    </button>
                  )}
                </div>
              )}

              {/* Output */}
              {run.phase === "error" && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
                  <TriangleAlert className="h-4 w-4" /> {run.error}
                </div>
              )}
              {run.phase === "done" && (
                <Output
                  url={run.resultUrl}
                  mime={run.mime}
                  kind={feature.output}
                  raw={run.raw}
                  onEnlarge={setLightbox}
                />
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <div className="flex items-center gap-1">
                  {SNIPPET_LANGS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLang(l.id)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                        lang === l.id ? "bg-bg-soft text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <CopyButton text={snippetText} />
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-fg">
                {snippetText}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-fg transition-colors hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Plan upgrade popup (shown on a 403 from the API) */}
      {upsell && <PlanUpsellModal feature={feature.label} onClose={() => setUpsell(false)} />}
    </div>
  );
}

// Shown when the API returns 403 — the selected feature isn't on the user's
// plan. Reuses the same pricing tiers as the marketing site.
function PlanUpsellModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="relative my-6 w-full max-w-5xl rounded-card border border-line bg-bg p-6 shadow-2xl sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft text-fg transition-colors hover:bg-line"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-key-soft px-3 py-1 text-xs font-semibold text-key">
            <TriangleAlert className="h-3.5 w-3.5" /> Not available on your plan
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-fg">
            Upgrade to unlock {feature}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {feature} isn&rsquo;t included in your current plan. Choose a plan below to start using
            it right away.
          </p>
        </div>

        <PricingTiers />
      </div>
    </div>
  );
}

function Output({
  url,
  mime,
  kind,
  raw,
  onEnlarge,
}: {
  url?: string | null;
  mime?: string | null;
  kind: Feature["output"];
  raw?: Record<string, unknown> | null;
  onEnlarge: (url: string) => void;
}) {
  const isImage = kind === "image" || mime?.startsWith("image/");
  const isVideo = kind === "video" || mime?.startsWith("video/");
  const isAudio = kind === "audio" || mime?.startsWith("audio/");

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-fg">Output</p>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-key/50"
          >
            <Download className="h-3.5 w-3.5" /> Open / download
          </a>
        )}
      </div>
      {url && isImage && (
        <div className="group relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            onClick={() => onEnlarge(url)}
            className="max-h-[28rem] cursor-zoom-in rounded-xl border border-line object-contain"
          />
          <button
            onClick={() => onEnlarge(url)}
            aria-label="Enlarge image"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/90 text-fg opacity-0 shadow-sm transition-opacity hover:bg-surface group-hover:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      )}
      {url && isVideo && (
        <video src={url} controls className="max-h-[28rem] rounded-xl border border-line" />
      )}
      {url && isAudio && <audio src={url} controls className="w-full" />}
      {url && !isImage && !isVideo && !isAudio && (
        <p className="text-sm text-muted">
          Result ready — <span className="font-mono text-xs">{mime || "file"}</span>. Use the
          download link above.
        </p>
      )}
      {!url && raw && (
        <pre className="overflow-x-auto rounded-lg bg-bg-soft p-3 font-mono text-xs text-fg">
          {JSON.stringify(raw, null, 2)}
        </pre>
      )}
      <p className="mt-3 text-xs text-faint">
        Result URLs are temporary (expire within 24h) — download and store outputs in your own
        storage.
      </p>
    </div>
  );
}
