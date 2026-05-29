import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPost, posts } from "@/lib/blog";
import { Container } from "@/components/ui/primitives";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "@/components/ui/reveal";
import { CtaSection } from "@/components/sections/cta";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <article className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
        <div className="studio-glow opacity-60" />
        <Container className="relative max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" />
              All posts
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="flex items-center gap-3 text-xs text-faint">
              <span className="text-key">{post.category}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-pretty text-lg text-muted">{post.excerpt}</p>
          </Reveal>
        </Container>
      </article>

      <Container className="max-w-3xl">
        <Reveal>
          <Placeholder tone={post.tone} ratio="16/9" label={post.category} />
        </Reveal>
      </Container>

      <Container className="max-w-3xl py-12">
        <div className="flex flex-col gap-6 text-lg leading-relaxed text-muted">
          {post.body.map((para, i) => (
            <Reveal key={i} delay={Math.min(i * 0.04, 0.2)}>
              <p
                className={
                  i === 0
                    ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-key"
                    : ""
                }
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="max-w-3xl py-12">
        <div className="rule mb-10" />
        <h2 className="mb-6 font-display text-2xl tracking-tight">Keep reading</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {more.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card group flex flex-col gap-2 p-5 transition-colors hover:border-key/40"
            >
              <span className="text-xs text-key">{p.category}</span>
              <span className="font-display text-lg leading-snug tracking-tight">
                {p.title}
              </span>
              <span className="inline-flex items-center gap-1 pt-1 text-sm text-muted">
                Read
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>

      <CtaSection />
    </>
  );
}
