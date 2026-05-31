import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────────────
// Image slot. Renders a real (free-licensed) dummy photo from /public/img.
// Swap the pools below for your own assets, or pass an explicit `src`.
// Keep the wrapper sizing and everything else stays put.
// ───────────────────────────────────────────────────────────────────────

// On-model pools now use our own AI-generated shots (flat #f0f0f0 ground).
// Flat-lay product pools are left as-is — they stand in for the "before" input.
const pools: Record<string, string[]> = {
  model: [
    "/img/ip/shoot/image_01.png",
    "/img/ip/shoot/image_04.png",
    "/img/ip/shoot/image_11.png",
    "/img/ip/shoot/image_17.png",
    "/img/ip/shoot/image_16.png",
  ],
  garment: [
    "/img/ip/shoot/image_02.png",
    "/img/ip/shoot/image_08.png",
    "/img/ip/shoot/image_12.png",
    "/img/ip/shoot/image_19.png",
  ],
  warm: ["/img/ip/shoot/image_11.png", "/img/ip/shoot/image_21.png", "/img/ip/shoot/image_24.png"],
  cool: ["/img/ip/shoot/image_17.png", "/img/ip/shoot/image_03.png", "/img/ip/shoot/image_31.png"],
  product: [
    "/img/ip/flat-jacket.webp",
    "/img/ip/flat-dress.webp",
    "/img/ip/flat-shirt.avif",
    "/img/ip/product-bag.webp",
  ],
  studio: ["/img/ip/shoot/image_11.png", "/img/ip/shoot/image_16.png", "/img/ip/shoot/image_22.png"],
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
        "relative isolate overflow-hidden bg-[#f0f0f0]",
        rounded,
        className,
      )}
      style={{ aspectRatio: ratio }}
      data-placeholder
    >
      <Image
        src={chosen}
        alt={label ?? "ImagePipeline generated visual (placeholder)"}
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-cover object-top"
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
