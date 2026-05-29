import type { ChainStep } from "@/components/sections/workflow-chain";

export type FeatureContent = {
  slug: string;
  nav: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeTone: string;
  afterTone: string;
  bullets: { title: string; body: string }[];
  spec: { label: string; value: string }[];
  endpoint: string;
  steps: ChainStep[];
  sample: string;
};

export const features: Record<string, FeatureContent> = {
  "on-model": {
    slug: "on-model",
    nav: "On-Model Imagery",
    eyebrow: "On-Model Imagery",
    title: "Turn a flat-lay into a",
    highlight: "campaign in seconds.",
    description:
      "Upload a flat-lay, ghost-mannequin or hanger shot and get a photoreal model wearing it, styled, lit and framed to your brand guidelines.",
    beforeLabel: "Flat-lay",
    afterLabel: "On-model",
    beforeTone: "product",
    afterTone: "model",
    bullets: [
      {
        title: "Diverse, consistent models",
        body: "Choose skin tone, body type, age and pose, or pin a recurring model as an identity profile across an entire collection.",
      },
      {
        title: "Brand-true lighting",
        body: "Match your studio key and fill, backdrop and grade so generated shots sit beside real ones without a seam.",
      },
      {
        title: "Catalogue-scale batches",
        body: "Push thousands of SKUs through async jobs and stream results back on a webhook as they finish.",
      },
    ],
    spec: [
      { label: "Endpoint", value: "/creator/instamodel" },
      { label: "Avg latency", value: "~4s async" },
      { label: "Inputs", value: "Flat-lay, ghost, hanger" },
      { label: "Output", value: "webp, jpeg, png" },
    ],
    endpoint: "/creator/instamodel/image/v1",
    steps: [
      { endpoint: "POST /identity/lock/image/v1", label: "Lock the model", detail: "Pin a reusable brand model." },
      { endpoint: "POST /creator/instamodel/image/v1", label: "Generate on-model", detail: "Place the garment, any tone." },
      { endpoint: "POST /background/change/image/v1", label: "Set the scene", detail: "Brand backdrop and light." },
      { endpoint: "POST /upscale/image/v1", label: "Finish", detail: "Sharpen for hero placements." },
    ],
    sample: `curl https://api.vela.dev/creator/instamodel/image/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -d '{
    "prompt": "studio model, soft daylight, editorial",
    "input_face": "models/ava.jpg",
    "profile_id": "prof_marisol_ava",
    "output_format": "webp",
    "callback_url": "https://hooks.brand.com/vela"
  }'`,
  },
  "try-on": {
    slug: "try-on",
    nav: "Virtual Try-On",
    eyebrow: "Virtual Try-On",
    title: "Any garment, any body,",
    highlight: "pixel-accurate.",
    description:
      "Render how a garment actually drapes, folds, texture, print alignment and fit, on a chosen model or a shopper's own photo.",
    beforeLabel: "Garment",
    afterLabel: "Worn",
    beforeTone: "garment",
    afterTone: "model",
    bullets: [
      {
        title: "Fabric-accurate drape",
        body: "Preserves seams, prints and the way each fabric falls on the body, from person and clothing image inputs.",
      },
      {
        title: "Sub-second renders",
        body: "Fast enough to power live, interactive try-on inside your storefront or app.",
      },
      {
        title: "Shopper or model",
        body: "Use a curated model roster, or let shoppers pass their own photo as the person_image.",
      },
    ],
    spec: [
      { label: "Endpoint", value: "/creator/tryon" },
      { label: "p50 latency", value: "<900ms" },
      { label: "Inputs", value: "person_image + clothing" },
      { label: "Modes", value: "On-model, on-shopper" },
    ],
    endpoint: "/creator/tryon/image/v1",
    steps: [
      { endpoint: "POST /creator/tryon/image/v1", label: "Try it on", detail: "Garment onto the body." },
      { endpoint: "POST /background/change/image/v1", label: "Set the scene", detail: "Optional backdrop swap." },
      { endpoint: "POST /upscale/image/v1", label: "Finish", detail: "Zoom-ready resolution." },
    ],
    sample: `curl https://api.vela.dev/creator/tryon/image/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -d '{
    "person_image": "models/ava.jpg",
    "clothing_image": "sku/884.jpg",
    "gender": "female",
    "output_format": "webp",
    "callback_url": "https://hooks.brand.com/vela"
  }'`,
  },
  editing: {
    slug: "editing",
    nav: "Editing & Background",
    eyebrow: "Editing & Background",
    title: "Cut, relight and upscale",
    highlight: "the whole catalogue.",
    description:
      "Instruction-based editing, background replacement and relighting, and upscaling, batched across every image you own.",
    beforeLabel: "Raw photo",
    afterLabel: "Cleaned",
    beforeTone: "product",
    afterTone: "cool",
    bullets: [
      {
        title: "Background and relight",
        body: "Replace or standardise backgrounds and relight mixed-source photos to one consistent catalogue look.",
      },
      {
        title: "Edit in plain language",
        body: "Recompose, swap objects or change scenes with a natural-language prompt, no image pipeline code.",
      },
      {
        title: "8K upscaling",
        body: "Recover detail and resolution for hero placements, zoom views and print without artefacts.",
      },
    ],
    spec: [
      { label: "Endpoints", value: "/edit, /background" },
      { label: "Cost", value: "from $0.02 / image" },
      { label: "Upscale", value: "to 8K" },
      { label: "Batch", value: "10k+ per job" },
    ],
    endpoint: "/edit/image/v1",
    steps: [
      { endpoint: "POST /background/change/image/v1", label: "Standardise", detail: "One clean backdrop." },
      { endpoint: "POST /edit/image/v1", label: "Recompose", detail: "Prompt-based edits." },
      { endpoint: "POST /upscale/image/v1", label: "Lift", detail: "Up to 8K detail." },
    ],
    sample: `curl https://api.vela.dev/background/change/image/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -d '{
    "input_image": "sku/884-raw.jpg",
    "prompt": "seamless studio backdrop, soft shadow",
    "output_format": "png",
    "callback_url": "https://hooks.brand.com/vela"
  }'`,
  },
  "ad-creative": {
    slug: "ad-creative",
    nav: "Ad Creative",
    eyebrow: "Ad Creative",
    title: "One product becomes",
    highlight: "a hundred ads.",
    description:
      "Generate sized, on-brand static and video creative from a single product, with logo, palette and template rules applied.",
    beforeLabel: "Product",
    afterLabel: "Ad set",
    beforeTone: "product",
    afterTone: "warm",
    bullets: [
      {
        title: "Branded templates",
        body: "Inject brand colours, logo and style rules into every asset with the branding endpoints.",
      },
      {
        title: "Static and video",
        body: "Produce motion ads from a single product image alongside the static set.",
      },
      {
        title: "Every placement, sized",
        body: "Export correctly-sized variants per network and format from one job.",
      },
    ],
    spec: [
      { label: "Endpoints", value: "/branding, /generate" },
      { label: "Formats", value: "Static, video" },
      { label: "Brand kit", value: "Logo + palette" },
      { label: "Sizes", value: "Per placement" },
    ],
    endpoint: "/branding/template/image/v1",
    steps: [
      { endpoint: "POST /generate/image/v1", label: "Generate", detail: "Hero product scene." },
      { endpoint: "POST /branding/template/image/v1", label: "Brand it", detail: "Palette, logo, template." },
      { endpoint: "POST /generate/video/v1", label: "Animate", detail: "Short motion ad." },
    ],
    sample: `curl https://api.vela.dev/branding/template/image/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -d '{
    "prompt": "summer launch, hero product",
    "logo_url": "https://cdn.brand.com/logo.png",
    "palette": ["#FF5733", "#1A1A1A"],
    "output_format": "png",
    "callback_url": "https://hooks.brand.com/vela"
  }'`,
  },
  "enterprise-api": {
    slug: "enterprise-api",
    nav: "Enterprise API",
    eyebrow: "Enterprise API",
    title: "Licensed generation,",
    highlight: "built for the catalogue.",
    description:
      "Reusable identity profiles, C2PA provenance on every output, async jobs with webhooks, and the governance enterprise teams require.",
    beforeLabel: "Risk",
    afterLabel: "Compliant",
    beforeTone: "cool",
    afterTone: "warm",
    bullets: [
      {
        title: "C2PA provenance built in",
        body: "Every output embeds provenance metadata satisfying EU AI Act Article 50 disclosure.",
      },
      {
        title: "Reusable identity profiles",
        body: "Create, version and govern brand models as profiles your team calls by id.",
      },
      {
        title: "Ephemeral and governed",
        body: "Inputs and outputs are processed ephemerally, with API key management, plans and credit balance.",
      },
    ],
    spec: [
      { label: "Endpoints", value: "/profiles, /identity" },
      { label: "Provenance", value: "C2PA, Art. 50" },
      { label: "Auth", value: "X-API-Key" },
      { label: "Data", value: "Ephemeral" },
    ],
    endpoint: "/profiles/v1",
    steps: [
      { endpoint: "POST /profiles/v1", label: "Create profile", detail: "Govern a brand identity." },
      { endpoint: "POST /identity/lock/image/v1", label: "Lock identity", detail: "Reusable, consistent model." },
      { endpoint: "GET /webhooks/event-schema", label: "Wire webhooks", detail: "Async delivery contract." },
    ],
    sample: `curl https://api.vela.dev/profiles/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -d '{
    "name": "Marisol / Ava",
    "reference_images": ["models/ava-1.jpg", "models/ava-2.jpg"]
  }'`,
  },
};

export const featureOrder = [
  "on-model",
  "try-on",
  "editing",
  "ad-creative",
  "enterprise-api",
];
