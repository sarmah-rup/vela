import Link from "next/link";
import {
  Sparkles,
  Shirt,
  Wand2,
  Megaphone,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Placeholder } from "@/components/ui/placeholder";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const items = [
  {
    icon: Sparkles,
    title: "On-Model Imagery",
    href: "/features/on-model",
    body: "Send a flat-lay, ghost-mannequin or hanger shot. Get a photoreal model wearing it, lit to your brand. Pick skin tone, pose, age and scene.",
    tone: "model",
    span: "lg:col-span-2 lg:row-span-2",
    feature: true,
  },
  {
    icon: Shirt,
    title: "Virtual Try-On",
    href: "/features/try-on",
    body: "Drape any garment on any body with fabric-accurate folds and texture.",
    tone: "garment",
  },
  {
    icon: Wand2,
    title: "Editing & Background",
    href: "/features/editing",
    body: "Cutouts, relight, upscale to 8K and clean-ups, batched across the catalogue.",
    tone: "product",
  },
  {
    icon: Megaphone,
    title: "Ad Creative",
    href: "/features/ad-creative",
    body: "Turn one product into sized, on-brand ads and video for Meta, TikTok and Amazon.",
    tone: "warm",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise API",
    href: "/features/enterprise-api",
    body: "Fully licensed generation with IP indemnity, brand locks, SSO and audit logs.",
    tone: "cool",
  },
];

export function Capabilities() {
  return (
    <RevealGroup className="grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <RevealItem key={item.title} className={item.span ?? ""}>
            <Link
              href={item.href}
              className="card-soft lift group relative flex h-full flex-col gap-4 overflow-hidden p-6 hover:border-key/30"
            >
              {item.feature ? (
                <div className="relative mb-1 overflow-hidden rounded-2xl">
                  <Placeholder
                    tone={item.tone}
                    label="on_model output"
                    ratio="16/11"
                  />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-soft text-key transition-colors group-hover:border-key/30 group-hover:bg-key/8">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-key" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-2xl tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
