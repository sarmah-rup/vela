import * as React from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      <div className="studio-glow opacity-70" />
      <div className="absolute inset-0 -z-[1] grid-lines opacity-40" />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="max-w-4xl text-balance font-serif text-5xl font-light leading-[1] tracking-tight sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.12}>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {description}
            </p>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={0.18} className="w-full">
            {children}
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
