import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────────────
// Image slot. Renders a real (free-licensed) dummy photo from /public/img.
// Swap the pools below for your own assets, or pass an explicit `src`.
// Keep the wrapper sizing and everything else stays put.
// ───────────────────────────────────────────────────────────────────────

const pools: Record<string, string[]> = {
  model: [
    "/img/ip/onmodel-jacket-1.png",
    "/img/ip/model-20.png",
    "/img/ip/model-10.png",
    "/img/ip/model-1.png",
    "/img/ip/model-3.png",
  ],
  garment: [
    "/img/ip/onmodel-jacket-2.png",
    "/img/ip/model-5.png",
    "/img/ip/model-12.png",
    "/img/ip/model-2.png",
  ],
  warm: ["/img/ip/onmodel-jacket-1.png", "/img/ip/model-20.png", "/img/ip/model-7.png"],
  cool: ["/img/ip/model-10.png", "/img/ip/model-8.png", "/img/ip/model-15.png"],
  product: [
    "/img/ip/flat-jacket.webp",
    "/img/ip/flat-dress.webp",
    "/img/ip/flat-shirt.avif",
    "/img/ip/product-bag.webp",
  ],
  studio: ["/img/ip/model-10.png", "/img/ip/product-bag.webp", "/img/ip/model-25.png"],
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Placeholder({
  label,
  tone = "studio",
  src,
  className,
  ratio = "4/5",
  rounded = "rounded-2xl",
  priority,
  children,
}: {
  label?: string;
  tone?: keyof typeof pools | string;
  src?: string;
  className?: string;
  ratio?: string;
  rounded?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const pool = pools[tone] ?? pools.studio;
  const chosen = src ?? pool[hash(`${tone}${label ?? ""}${ratio}`) % pool.length];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-bg-soft",
        rounded,
        className,
      )}
      style={{ aspectRatio: ratio }}
      data-placeholder
    >
      <Image
        src={chosen}
        alt={label ?? "Vela generated visual (placeholder)"}
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-cover"
        priority={priority}
      />
      {label ? (
        <span className="absolute left-3 top-3 z-[1] rounded-pill bg-white/85 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
