import Link from "next/link";
import { brand } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Vela mark, a stylised sail/aperture built from two light wedges. */
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
            <linearGradient id="velaMark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--color-key-soft)" />
              <stop offset="0.5" stopColor="var(--color-key)" />
              <stop offset="1" stopColor="var(--color-fill)" />
            </linearGradient>
          </defs>
          <path
            d="M16 2 L28 26 A14 14 0 0 1 4 26 Z"
            fill="none"
            stroke="url(#velaMark)"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <path d="M16 5 L25 24 L16 20 Z" fill="url(#velaMark)" />
        </svg>
      </span>
      <span className="font-display text-2xl leading-none tracking-tight text-fg">
        {brand.wordmark}
      </span>
    </Link>
  );
}
