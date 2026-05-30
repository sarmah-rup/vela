import { cn } from "@/lib/utils";

// A subtle "dev-first" cue overlaid on imagery, styled like a tiny terminal:
// a `$` prompt, a monospace request line (method + real API endpoint), and an
// optional prompt that maps to the image. pointer-events-none so it never blocks
// drag/click on the underlying image.
const corners = {
  tr: "right-3 top-3",
  br: "right-3 bottom-3",
} as const;

export function DevTag({
  path,
  prompt,
  body,
  corner = "br",
  compact = false,
  className,
}: {
  path?: string;
  prompt?: string;
  /** Multi-line JSON request body for the larger "developer" block. */
  body?: string;
  corner?: keyof typeof corners;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 flex flex-col gap-0.5 rounded-lg border border-white/10 bg-[#0b0c0e]/85 px-2.5 py-1.5 font-mono text-[10px] leading-tight shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md",
        corners[corner],
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="text-white/30">$</span>
        <span className="font-semibold text-emerald-400/90">POST</span>
        {!compact && path ? <span className="text-white/60">{path}</span> : null}
      </span>
      {!compact && body ? (
        <pre className="mt-1 whitespace-pre text-white/45">{body}</pre>
      ) : null}
      {!compact && !body && prompt ? (
        <span className="text-white/40">
          prompt: &quot;{prompt}&quot;
          <span className="ml-px inline-block animate-pulse text-emerald-400/80">▋</span>
        </span>
      ) : null}
    </div>
  );
}
