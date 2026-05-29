export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  tone: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "try-on-v2",
    title: "Try-On v2: sub-second, fabric-accurate renders",
    excerpt:
      "Our new try-on model drops median latency below 900ms while improving how prints and seams hold on the body.",
    category: "Product",
    date: "2026-05-20",
    readingTime: "4 min",
    tone: "model",
    body: [
      "Virtual try-on only earns a place in the storefront if it is fast enough to feel instant and accurate enough to trust. With Try-On v2 we set out to win on both at once.",
      "The new model renders at a median of 880ms while preserving print alignment, seam geometry and the way each fabric falls on a given body. That means you can power live, interactive try-on without a spinner and without misleading the shopper.",
      "Under the hood we moved generation to the edge across 62 markets and added deterministic seeds, so a given garment-and-model pair returns a stable result you can cache and reuse across a catalogue.",
      "Try-On v2 is available today on every plan at the same per-render price. Point your existing try_on calls at the v2 model flag to opt in.",
    ],
  },
  {
    slug: "licensing-and-indemnity",
    title: "Why licensed output is non-negotiable for commerce",
    excerpt:
      "Generated imagery is only useful if your legal team can sign off. Here is how we make every render commercially safe.",
    category: "Trust",
    date: "2026-05-06",
    readingTime: "6 min",
    tone: "cool",
    body: [
      "The fastest way to stall an AI imagery rollout is an unanswered question from legal. If the provenance of the training data is unclear, the risk lands on the brand using the output.",
      "Vela trains on licensed data and ships every render with a commercial license. Enterprise plans add full IP indemnification, so the obligation sits with us, not with you.",
      "We also expose a per-render indemnified flag on every response, so you can prove provenance downstream and keep an auditable trail for compliance.",
      "Safety is not a feature you add later. It is the contract that makes generated imagery usable at all.",
    ],
  },
  {
    slug: "catalogue-in-a-weekend",
    title: "Shipping a 4,000-SKU refresh in a single sprint",
    excerpt:
      "A field guide to batching on-model generation across a large catalogue without melting your pipeline.",
    category: "Engineering",
    date: "2026-04-18",
    readingTime: "5 min",
    tone: "warm",
    body: [
      "Large catalogues fail slowly. A thousand SKUs is a script; forty thousand is a system. Here is the pattern teams use to keep batch generation predictable.",
      "Start with the batch endpoint and a webhook. Stream results as they finish rather than blocking on the slowest render, and write each asset back to your DAM keyed by SKU.",
      "Pin a deterministic seed per product so re-runs are idempotent, and tag every job so you can reconcile against your product feed.",
      "With that scaffolding in place, a full seasonal refresh becomes a single job you kick off on Friday and review on Monday.",
    ],
  },
  {
    slug: "designing-the-render-contract",
    title: "Designing a response you never have to debug",
    excerpt:
      "Latency, dimensions, licensing and usage on every render. The thinking behind our JSON contract.",
    category: "Engineering",
    date: "2026-03-29",
    readingTime: "4 min",
    tone: "product",
    body: [
      "A good API response answers the next three questions before you ask them. For a render, those are: did it work, what did I get, and what did it cost.",
      "Every Vela response includes status, latency, output dimensions, license state and credit usage. No second call to reconcile, no guessing.",
      "We treat the contract as frozen. New capabilities arrive as new fields, never as breaking changes to the ones you already depend on.",
      "Boring, stable responses are what let you build on top without fear. That is the whole point.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
