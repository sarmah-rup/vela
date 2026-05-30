# Pending items

Deferred work, with a rough priority (x/10 — higher = more impactful/urgent).
Tackle top-down.

## Performance
- **8/10 — Don't gate above-the-fold content on JS.** The hero/sections use
  `Reveal` (`opacity:0` until motion runs client-side). It's in the SSR HTML
  (fine for crawlers) but delays FCP/LCP and can blank the page on a hydration
  hiccup. Render hero copy + image at full opacity; animate transform only.
- **7/10 — Image optimization pass.** Add `blurDataURL` placeholders + `priority`
  + `fetchPriority="high"` to the hero/LCP image; set `quality` (~55–65 AVIF) on
  the large images. Confirm only the hero is eager; everything else lazy.

## AI SEO / crawlability
- **7/10 — Verify the edge doesn't block AI crawlers.** On Vercel, make sure the
  Firewall/WAF + bot management don't challenge GPTBot / ClaudeBot / PerplexityBot
  / OAI-SearchBot (robots already allows them, but edge rules can still block).
- **6/10 — Per-page canonical + metadata audit.** Add `alternates.canonical` and
  unique title/description/OG to every route (some pages still inherit defaults).
- **5/10 — Docs sitemap + submission.** Add the Docusaurus sitemap plugin and
  reference it; submit sitemaps to Google Search Console, Bing, and IndexNow.
- **5/10 — More structured data.** `TechArticle` + `BreadcrumbList` on docs pages;
  `Article` on blog posts (see below).

## Content / brand
- **4/10 — Blog is placeholder.** No real posts yet. When real: write posts and
  add `Article`/`TechArticle` JSON-LD (author, datePublished, publisher) on
  `app/blog/[slug]`. (Deferred per request — blogs don't exist yet.)
- **4/10 — Logo wordmark width on small mobile.** "ImagePipeline" is long next to
  the burger; check it doesn't crowd at ~320px (tighten size/tracking if needed).
- **3/10 — Replace placeholder marketing copy** with real product copy.
- **3/10 — Docs brand cleanup.** A few "Vela" references remain in docs comments
  (`docs/src/css/custom.css` header, etc.) — cosmetic, not user-facing.

## Done (for reference)
- robots.txt (AI crawlers allowed) · llms.txt + llms-full.txt · sitemap.xml
- JSON-LD: Organization + WebSite + WebApplication (site-wide), FAQPage (pricing + /faq)
- Dedicated /faq page · public OpenAPI at /docs/openapi.json
- GTM via next/script afterInteractive (non-render-blocking)
- Rebrand Vela → ImagePipeline (imagepipeline.io) + new logo
