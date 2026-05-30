import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog & Changelog",
  description: "Product updates, engineering notes and field guides from ImagePipeline.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <>
      <PageHero
        eyebrow="Blog & changelog"
        title={
          <>
            Notes from the
            <br />
            <span className="text-gradient italic">render pipeline.</span>
          </>
        }
        description="Product launches, engineering deep-dives and the occasional opinion about pixels."
      />

      <section className="pb-12">
        <Container className="flex flex-col gap-10">
          {/* Featured */}
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="card group grid gap-0 overflow-hidden lg:grid-cols-2"
            >
              <Placeholder
                tone={featured.tone}
                label={featured.category}
                ratio="16/10"
                rounded="rounded-none"
              />
              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <span className="flex items-center gap-3 text-xs text-faint">
                  <span className="text-key">{featured.category}</span>
                  <span>·</span>
                  <span>{formatDate(featured.date)}</span>
                  <span>·</span>
                  <span>{featured.readingTime}</span>
                </span>
                <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="text-muted">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-key">
                  Read post
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {rest.map((p) => (
              <RevealItem key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="card group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-key/40"
                >
                  <Placeholder
                    tone={p.tone}
                    ratio="16/10"
                    rounded="rounded-none"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="flex items-center gap-2 text-xs text-faint">
                      <span className="text-key">{p.category}</span>
                      <span>·</span>
                      <span>{p.readingTime}</span>
                    </span>
                    <h3 className="font-display text-xl leading-snug tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted">{p.excerpt}</p>
                    <span className="mt-auto pt-2 text-xs text-faint">
                      {formatDate(p.date)}
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
