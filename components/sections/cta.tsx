import { ArrowRight } from "lucide-react";
import { Container, Frame } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaSection({
  title = "Ship your catalogue in a weekend, not a quarter.",
  subtitle = "Start free with 250 generations. No card, no sales call, just an API key and the docs.",
  primary = { label: "Get an API key", href: "/demo" },
  secondary = { label: "Talk to us", href: "/contact" },
}: {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Container>
      <Reveal>
        <Frame className="card relative overflow-hidden px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="studio-glow opacity-80" />
          <div className="relative z-[1] mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-balance font-serif text-4xl font-light leading-[1.04] tracking-tight sm:text-5xl">
              {title}
            </h2>
            <p className="text-pretty text-lg text-muted">{subtitle}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href={primary.href} size="lg">
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={secondary.href} variant="outline" size="lg">
                {secondary.label}
              </Button>
            </div>
          </div>
        </Frame>
      </Reveal>
    </Container>
  );
}
