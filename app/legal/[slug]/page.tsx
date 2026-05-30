import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { legalDocs, legalBySlug } from "@/lib/legal";

function getLegalHtml(slug: string): string | null {
  if (!legalBySlug[slug]) return null;
  try {
    return readFileSync(join(process.cwd(), "content", "legal", `${slug}.html`), "utf8");
  } catch {
    return null;
  }
}

// Only the known policy slugs render; anything else 404s (and avoids a runtime
// filesystem read for unknown paths).
export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalBySlug[slug];
  if (!doc) return {};
  return { title: doc.title };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalBySlug[slug];
  const html = getLegalHtml(slug);
  if (!doc || !html) notFound();

  return (
    <section className="relative pb-28 pt-36 sm:pt-44">
      <Container className="max-w-3xl">
        <article
          className={[
            "text-muted",
            "[&_h1]:mb-2 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-fg sm:[&_h1]:text-5xl",
            "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg",
            "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-fg",
            "[&_p]:mb-4 [&_p]:leading-relaxed",
            "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
            "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
            "[&_li]:leading-relaxed",
            "[&_a]:text-key [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-key-deep",
            "[&_strong]:font-semibold [&_strong]:text-fg",
            // first paragraph after the title is the "Last updated" line
            "[&_h1+p]:mb-10 [&_h1+p]:font-mono [&_h1+p]:text-xs [&_h1+p]:uppercase [&_h1+p]:tracking-wider [&_h1+p]:text-faint",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </section>
  );
}
