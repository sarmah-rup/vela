import { brand } from "@/lib/site";

export const SITE_URL = `https://${brand.domain}`;

// schema.org BreadcrumbList — helps AI/search reconstruct site hierarchy and cite
// the right page. Pass crumbs in order, paths relative to the site root.
export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}
