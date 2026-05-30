import type { MetadataRoute } from "next";
import { brand } from "@/lib/site";
import { legalDocs } from "@/lib/legal";

const SITE_URL = `https://${brand.domain}`;

// Only the pages that are actually part of the live site (linked in the nav/footer)
// are listed — we don't want crawlers indexing orphaned or placeholder routes.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/pricing",
    "/faq",
    "/docs",
    "/sign-in",
    "/sign-up",
    ...legalDocs.map((d) => `/legal/${d.slug}`),
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
