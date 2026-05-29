import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Alternating image + copy blocks, each anchored by a bold outcome stat.
const solutions = [
  {
    href: "/features/on-model",
    label: "On-model imagery",
    title: "Flat-lays become on-model photos",
    body: "Upload a flat-lay, ghost-mannequin or hanger shot and get a photoreal model wearing it, in any skin tone, lit to your brand.",
    tags: ["6 skin tones / SKU", "Brand lighting", "Batch from PIM"],
    stat: { value: "−88%", note: "cost per on-model image" },
    proof: "Marisol",
    tone: "model",
  },
  {
    href: "/features/try-on",
    label: "Virtual try-on",
    title: "Drape any garment on any body",
    body: "Fabric-accurate try-on from a person and clothing image, fast enough to run live inside your storefront.",
    tags: ["Sub-second", "On-shopper or model", "Print-accurate"],
    stat: { value: "+24%", note: "product-page add-to-cart" },
    proof: "Marisol",
    tone: "garment",
  },
  {
    href: "/features/editing",
    label: "Background & editing",
    title: "One clean look across the catalogue",
    body: "Standardise backgrounds, relight mixed-source photos and upscale to print quality, batched across every SKU.",
    tags: ["Auto background", "Relight", "8K upscale"],
    stat: { value: "60k+", note: "listings normalised" },
    proof: "Tindra Market",
    tone: "cool",
  },
  {
    href: "/features/ad-creative",
    label: "Ad creative",
    title: "One product, a hundred ads",
    body: "Generate sized, on-brand static and video creative for every network from a single product image.",
    tags: ["Static + video", "Brand kit locked", "Sized per network"],
    stat: { value: "9x", note: "more creative per SKU" },
    proof: "Cadence Athletic",
    tone: "warm",
  },
];

export function SolutionCards() {
  return (
    <RevealGroup className="flex flex-col gap-6">
      {solutions.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <RevealItem key={s.href}>
            <div className="card-soft group grid items-stretch gap-0 overflow-hidden md:grid-cols-2">
              {/* Image side */}
              <div
                className={cn(
                  "relative min-h-72 overflow-hidden",
                  flip ? "md:order-2" : "md:order-1",
                )}
              >
                <Placeholder
                  tone={s.tone}
                  ratio="1/1"
                  rounded="rounded-none"
                  className="h-full border-0 transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Copy side */}
              <div
                className={cn(
                  "flex flex-col justify-center gap-6 p-8 sm:p-12",
                  flip ? "md:order-1" : "md:order-2",
                )}
              >
                <div className="flex flex-col gap-4">
                  <span className="inline-flex w-fit items-center gap-2 rounded-pill bg-key/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-key">
                    {s.label}
                  </span>
                  <h3 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-[2.1rem]">
                    {s.title}
                  </h3>
                  <p className="max-w-md text-pretty leading-relaxed text-muted">
                    {s.body}
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-pill border border-line bg-bg-soft px-3 py-1 text-xs text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
                  <div className="flex items-end gap-3">
                    <span className="font-serif text-6xl font-semibold leading-[0.85] tracking-tight text-fg">
                      {s.stat.value}
                    </span>
                    <span className="flex flex-col pb-1 text-sm text-muted">
                      <span>{s.stat.note}</span>
                      <span className="text-xs text-faint">
                        measured at {s.proof}
                      </span>
                    </span>
                  </div>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-colors hover:text-key"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
