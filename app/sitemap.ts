import type { MetadataRoute } from "next";
import { brand } from "@/lib/site";
import { legalDocs } from "@/lib/legal";
import { featureOrder } from "@/lib/features";
import { useCases } from "@/lib/use-cases";
import { posts } from "@/lib/blog";

const SITE_URL = `https://${brand.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/pricing",
    "/solutions",
    "/use-cases",
    "/developers",
    "/platform",
    "/about",
    "/customers",
    "/contact",
    "/demo",
    "/resources",
    "/blog",
    "/docs",
    ...legalDocs.map((d) => `/legal/${d.slug}`),
    ...featureOrder.map((s) => `/features/${s}`),
    ...useCases.map((u) => `/use-cases/${u.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
