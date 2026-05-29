"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tasks = [
  { id: "on_model", label: "On-Model", before: "product", after: "model" },
  { id: "try_on", label: "Try-On", before: "garment", after: "model" },
  { id: "edit", label: "Edit", before: "product", after: "cool" },
  { id: "ad_creative", label: "Ad Creative", before: "product", after: "warm" },
];

const scenes = ["soft-studio", "daylight", "editorial", "gradient"];
const poses = ["three-quarter", "front", "walking", "seated"];

export function Playground() {
  const [task, setTask] = React.useState(tasks[0]);
  const [scene, setScene] = React.useState(scenes[0]);
  const [pose, setPose] = React.useState(poses[0]);
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");

  const run = () => {
    setState("running");
    setTimeout(() => setState("done"), 1400);
  };

  const reset = () => setState("idle");

  const request = `{
  "task": "${task.id}",
  "input": "sku/884.jpg",
  "scene": "${scene}",
  "model": { "pose": "${pose}" }
}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* Controls + request */}
      <div className="card flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Task
          </span>
          <div className="flex flex-wrap gap-2">
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTask(t);
                  reset();
                }}
                className={cn(
                  "rounded-pill border px-3.5 py-1.5 text-sm transition-colors",
                  task.id === t.id
                    ? "border-key/60 bg-key/15 text-key"
                    : "border-line text-muted hover:text-fg",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Control label="Scene" value={scene} setValue={setScene} options={scenes} />
          <Control label="Pose" value={pose} setValue={setPose} options={poses} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Request body
          </span>
          <pre className="overflow-auto rounded-xl border border-line bg-ink/60 p-4 font-mono text-xs leading-relaxed text-muted">
            {request}
          </pre>
        </div>

        <div className="flex gap-3">
          <Button onClick={run} disabled={state === "running"} className="flex-1">
            {state === "running" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rendering…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run render
              </>
            )}
          </Button>
          {state === "done" ? (
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      {/* Output */}
      <div className="card relative flex flex-col gap-4 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Output
          </span>
          <AnimatePresence>
            {state === "done" ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 rounded-pill bg-key/15 px-2.5 py-1 font-mono text-[0.7rem] text-key"
              >
                <Sparkles className="h-3 w-3" /> 200 · 842ms
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Placeholder
            tone={state === "done" ? task.after : "product"}
            label={state === "done" ? `${task.label} output` : "input · sku/884.jpg"}
            ratio="4/5"
          />
          <AnimatePresence>
            {state === "running" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/60 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="relative inline-flex h-12 w-12">
                    <span className="ring-spin absolute inset-0 rounded-full border-2 border-key/30 border-t-key" />
                  </span>
                  <span className="font-mono text-xs text-muted">
                    diffusing pixels…
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <p className="text-xs text-faint">
          Demo renders are simulated with placeholder visuals. Wire to{" "}
          <span className="font-mono text-muted">POST /v1/render</span> to make
          it live.
        </p>
      </div>
    </div>
  );
}

function Control({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-line bg-bg-soft px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-key/60"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
