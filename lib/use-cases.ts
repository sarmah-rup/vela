// Detailed case studies. Companies and figures are fictional but realistic,
// shown as illustrative placeholders. Workflows reference real Vela endpoints.

export type Metric = { value: string; label: string };
export type WorkflowStep = { endpoint: string; label: string; detail: string };

export type UseCase = {
  slug: string;
  company: string;
  sector: string;
  vertical: "DTC fashion" | "Footwear & accessories" | "Marketplace & ecom";
  logoTone: string;
  heroTone: string;
  size: string;
  oneLiner: string;
  headlineMetric: Metric;
  metrics: Metric[];
  challenge: string[];
  approach: string[];
  workflow: WorkflowStep[];
  outcome: string[];
  quote: { text: string; name: string; role: string };
  stack: string[];
  beforeLabel: string;
  afterLabel: string;
  beforeTone: string;
  afterTone: string;
};

export const useCases: UseCase[] = [
  {
    slug: "marisol",
    company: "Marisol",
    sector: "DTC womenswear",
    vertical: "DTC fashion",
    logoTone: "warm",
    heroTone: "model",
    size: "Direct-to-consumer label, ~120 SKUs per drop, 14 drops a year",
    oneLiner:
      "A fast-moving womenswear label replaced its on-model photoshoots with the Vela API and shipped every drop a week earlier.",
    headlineMetric: { value: "−88%", label: "cost per on-model image" },
    metrics: [
      { value: "−88%", label: "cost per on-model image" },
      { value: "7 days", label: "shaved off each drop" },
      { value: "+24%", label: "PDP add-to-cart" },
      { value: "6", label: "skin tones per SKU, standard" },
    ],
    challenge: [
      "Marisol shot every drop in a rented studio with a booked model and a retoucher. A 120-SKU drop took nine days and a five-figure invoice before a single product went live.",
      "Size-inclusive and skin-tone-diverse imagery was aspirational, never budgeted. Each extra variant meant another shoot day nobody could afford.",
      "Restocks and colourways had no imagery at all, so high-margin SKUs sat with placeholder photos for weeks.",
    ],
    approach: [
      "Marisol pinned a small roster of brand models as identity profiles, then generated on-model imagery straight from flat-lays the moment product data landed.",
      "Each SKU renders in six skin tones by default, with brand lighting and backdrop locked so the output sits beside legacy studio shots seamlessly.",
      "The whole job runs from their PIM on a webhook, writing finished assets back to the DAM keyed by SKU.",
    ],
    workflow: [
      {
        endpoint: "POST /identity/lock/image/v1",
        label: "Lock the model",
        detail: "Pin a recurring brand model as a reusable identity profile.",
      },
      {
        endpoint: "POST /creator/instamodel/image/v1",
        label: "Generate on-model",
        detail: "Place the flat-lay garment on the locked model, six skin tones.",
      },
      {
        endpoint: "POST /background/change/image/v1",
        label: "Set the scene",
        detail: "Drop in brand backdrop and soft studio lighting.",
      },
      {
        endpoint: "POST /upscale/image/v1",
        label: "Finish for hero",
        detail: "Upscale and sharpen for zoom and hero placements.",
      },
    ],
    outcome: [
      "A 120-SKU drop now goes from product data to live PDP imagery in under a day, fully on-brand and size-inclusive.",
      "Cost per on-model image fell by 88%, and the freed budget went into more frequent drops rather than more shoot days.",
      "Diverse imagery lifted add-to-cart on product pages by 24% in an A/B test against the old single-model shots.",
    ],
    quote: {
      text: "We used to plan launches around studio availability. Now imagery is a build step. Marisol ships when the product is ready, not when the studio is free.",
      name: "Priya Nair",
      role: "Head of Ecommerce, Marisol",
    },
    stack: ["Identity Lock", "InstaModel", "Background", "Upscale", "Webhooks"],
    beforeLabel: "Flat-lay",
    afterLabel: "On-model, 6 tones",
    beforeTone: "product",
    afterTone: "model",
  },
  {
    slug: "cadence",
    company: "Cadence Athletic",
    sector: "Performance footwear",
    vertical: "Footwear & accessories",
    logoTone: "cool",
    heroTone: "warm",
    size: "Performance footwear brand, 40 hero SKUs, global wholesale + DTC",
    oneLiner:
      "A footwear brand generated on-foot lifestyle imagery and short product video for every colourway without re-shooting.",
    headlineMetric: { value: "9x", label: "more creative per SKU" },
    metrics: [
      { value: "9x", label: "creative variants per SKU" },
      { value: "−74%", label: "cost per colourway asset" },
      { value: "2 hrs", label: "from sample to ad-ready set" },
      { value: "+19%", label: "paid social CTR" },
    ],
    challenge: [
      "Cadence launches each silhouette in eight to twelve colourways. Shooting every colourway on-foot, in multiple scenes, for paid social was never viable.",
      "Wholesale partners wanted localised lifestyle imagery; the brand could only supply flat studio packs.",
      "Video ads were outsourced per campaign, slow and expensive, so most colourways never got motion creative at all.",
    ],
    approach: [
      "Cadence shoots one physical sample per silhouette, then generates every colourway and scene from it with consistent lighting and grade.",
      "Lifestyle scenes and on-foot crops are produced per market, then turned into short product video for paid social.",
      "Branded ad templates apply colour, logo and format rules so each network gets correctly-sized creative in one pass.",
    ],
    workflow: [
      {
        endpoint: "POST /edit/image/v1",
        label: "Recolour the colourway",
        detail: "Generate every colourway from a single sample shot.",
      },
      {
        endpoint: "POST /background/change/image/v1",
        label: "Place in scene",
        detail: "On-foot lifestyle scenes per target market.",
      },
      {
        endpoint: "POST /generate/video/v1",
        label: "Make it move",
        detail: "Short product video from the finished still.",
      },
      {
        endpoint: "POST /branding/template/image/v1",
        label: "Size for every network",
        detail: "Apply brand template and export per placement.",
      },
    ],
    outcome: [
      "Every colourway now ships with nine creative variants across stills and video, up from a single studio pack.",
      "Cost per colourway asset dropped 74%, and a sample becomes an ad-ready set in about two hours.",
      "Paid social click-through rose 19% once each colourway had scene-matched motion creative.",
    ],
    quote: {
      text: "One sample in, a full campaign out. We finally give every colourway the creative it deserves instead of betting on one hero pair.",
      name: "Marcus Lindqvist",
      role: "Brand Director, Cadence Athletic",
    },
    stack: ["Edit", "Background", "Generate Video", "Branding", "Upscale"],
    beforeLabel: "Sample shot",
    afterLabel: "Colourway + scene",
    beforeTone: "product",
    afterTone: "warm",
  },
  {
    slug: "tindra",
    company: "Tindra Market",
    sector: "Multi-seller marketplace",
    vertical: "Marketplace & ecom",
    logoTone: "product",
    heroTone: "cool",
    size: "Fashion + home marketplace, 60,000+ listings, thousands of sellers",
    oneLiner:
      "A marketplace standardised inconsistent seller photography into one clean catalogue look through the API.",
    headlineMetric: { value: "60k+", label: "listings normalised" },
    metrics: [
      { value: "60k+", label: "listings normalised" },
      { value: "−31%", label: "returns from listing mismatch" },
      { value: "<900ms", label: "median per image" },
      { value: "1", label: "consistent catalogue standard" },
    ],
    challenge: [
      "Tindra's sellers uploaded photos in every imaginable lighting, crop and background. The catalogue looked like thousands of different shops, because it was.",
      "Inconsistent imagery drove returns: buyers received items that looked nothing like the washed-out or over-edited listing photo.",
      "Manual moderation of image quality did not scale past a few thousand listings.",
    ],
    approach: [
      "Every seller upload passes through a Vela normalisation step before it goes live: background standardised, lighting relit, resolution lifted.",
      "Sellers get the same clean output through a self-serve API, so the standard is enforced at ingest rather than policed after the fact.",
      "Outputs carry C2PA provenance metadata, so the marketplace can prove how each listing image was processed.",
    ],
    workflow: [
      {
        endpoint: "POST /background/change/image/v1",
        label: "Standardise background",
        detail: "One clean catalogue backdrop across every seller.",
      },
      {
        endpoint: "POST /edit/image/v1",
        label: "Normalise lighting",
        detail: "Relight mixed-source photos to a single look.",
      },
      {
        endpoint: "POST /upscale/image/v1",
        label: "Lift resolution",
        detail: "Bring low-res seller uploads up to catalogue spec.",
      },
    ],
    outcome: [
      "Over 60,000 live listings were normalised to one catalogue standard, with new uploads conformed automatically at ingest.",
      "Returns attributed to listing mismatch fell 31% as photos finally matched what shipped.",
      "Median processing landed under 900ms per image, fast enough to run inline on upload.",
    ],
    quote: {
      text: "We turned thousands of different shops into one catalogue without telling a single seller to re-shoot. It just happens at upload.",
      name: "Sofia Banerjee",
      role: "VP Product, Tindra Market",
    },
    stack: ["Background", "Edit", "Upscale", "C2PA provenance", "Webhooks"],
    beforeLabel: "Seller upload",
    afterLabel: "Catalogue standard",
    beforeTone: "product",
    afterTone: "cool",
  },
];

export function getUseCase(slug: string) {
  return useCases.find((u) => u.slug === slug);
}
