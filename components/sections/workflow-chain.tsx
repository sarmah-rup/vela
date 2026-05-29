import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChainStep = { endpoint: string; label: string; detail?: string };

// Visualises a composable endpoint chain, e.g. Lock -> InstaModel -> Background -> Upscale.
export function WorkflowChain({
  steps,
  className,
}: {
  steps: ChainStep[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "grid gap-3 sm:grid-flow-col sm:auto-cols-fr sm:items-stretch",
        className,
      )}
    >
      {steps.map((s, i) => (
        <li key={s.endpoint + i} className="relative flex sm:block">
          <div className="card-soft flex h-full flex-col gap-2 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-key/12 font-mono text-[0.7rem] font-semibold text-key">
                {i + 1}
              </span>
              <span className="font-medium text-fg">{s.label}</span>
            </div>
            <code className="block truncate font-mono text-[0.7rem] text-faint">
              {s.endpoint}
            </code>
            {s.detail ? (
              <p className="text-sm leading-relaxed text-muted">{s.detail}</p>
            ) : null}
          </div>
          {i < steps.length - 1 ? (
            <span className="hidden items-center justify-center sm:absolute sm:-right-[11px] sm:top-1/2 sm:z-10 sm:flex sm:-translate-y-1/2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-bg text-key">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
