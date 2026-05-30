import Link from "next/link";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * ImagePipeline mark — three cascading rounded frames (image layers flowing
 * through a pipeline) with an aperture dot. Paired with a two-tone wordmark so
 * it doesn't read as a generic system-font logotype.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${brand.name} home`}
    >
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <defs>
            <linearGradient id="ipMark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--color-key-soft)" />
              <stop offset="0.55" stopColor="var(--color-key)" />
              <stop offset="1" stopColor="var(--color-fill)" />
            </linearGradient>
          </defs>
          <rect x="11.5" y="3" width="17.5" height="17.5" rx="5" fill="url(#ipMark)" opacity="0.28" />
          <rect x="7.25" y="7.25" width="17.5" height="17.5" rx="5" fill="url(#ipMark)" opacity="0.55" />
          <rect x="3" y="11.5" width="17.5" height="17.5" rx="5" fill="url(#ipMark)" />
          <circle cx="11.75" cy="20.25" r="2.3" fill="var(--color-bg)" />
        </svg>
      </span>
      <span className="font-display text-[1.35rem] leading-none tracking-[-0.045em] text-fg">
        <span className="font-normal text-muted">Image</span>
        <span className="font-semibold">Pipeline</span>
      </span>
    </Link>
  );
}
