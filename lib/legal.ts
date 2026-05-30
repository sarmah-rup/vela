// Legal/policy page metadata. Body HTML is extracted from the source exports into
// content/legal/<slug>.html (see scripts/extract-legal.mjs) and read at build time
// by the server component in app/legal/[slug]/page.tsx.
//
// Keep this module free of node-only imports (fs/path): it is also imported by the
// footer, which is part of a client component graph.
export type LegalDoc = { slug: string; label: string; title: string };

export const legalDocs: LegalDoc[] = [
  { slug: "privacy", label: "Privacy", title: "Privacy Policy" },
  { slug: "terms", label: "Terms", title: "Terms of Service" },
  { slug: "acceptable-use", label: "Acceptable Use", title: "Acceptable Use Policy" },
  { slug: "copyright-dmca", label: "Copyright & DMCA", title: "Copyright & DMCA Policy" },
  { slug: "security", label: "Security", title: "Security" },
  { slug: "responsible-ai", label: "Responsible AI", title: "Responsible AI" },
];

export const legalBySlug: Record<string, LegalDoc> = Object.fromEntries(
  legalDocs.map((d) => [d.slug, d]),
);
