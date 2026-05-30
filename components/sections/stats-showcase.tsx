import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { DevTag } from "@/components/ui/dev-tag";

const stats = ["100M+ images edited"];

export function StatsShowcase() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Image
        src="/img/stats-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
      <Container className="relative flex min-h-[92vh] flex-col justify-start gap-7 pb-28 pt-16 text-white sm:pt-20">
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-key" />
            Building generative AI since 2020
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="font-display text-3xl font-light leading-[1.14] tracking-tight sm:text-5xl">
            {stats.map((s) => (
              <div key={s}>{s}</div>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Developer payload cue, larger than the imagery chips. */}
      <DevTag
        corner="br"
        className="hidden sm:flex sm:right-10 sm:bottom-14"
        path="/generate/image/v1"
        body={`{
  "product_url": "https://cdn.brand.com/product-image.jpg",
  "prompt": "on-model, soft daylight...",
  "num_images": 1
}`}
      />
    </section>
  );
}
