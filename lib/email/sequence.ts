import { emailLayout, emailText } from "@/lib/email/layout";
import { CAL_URL } from "@/lib/site";

const BOOK_A_DEMO = { text: "Book a demo", url: CAL_URL };

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding drip: a welcome email (day 0) + 7 follow-ups, all within Resend's
// 30-day window so the whole sequence is scheduled at sign-up. Each email
// showcases one concrete use case and shows exactly how to call it. Edit the
// cadence (dayOffset) and copy here. House style: no em dashes.
// ─────────────────────────────────────────────────────────────────────────────

export type EmailCtx = {
  firstName: string;
  appUrl: string; // base URL for links (prod URL in production)
  unsubscribeUrl: string;
};

export type DripStep = {
  id: string;
  dayOffset: number; // 0 = send immediately at sign-up
  subject: string;
  build: (c: EmailCtx) => { html: string; text: string };
};

// Helper to assemble a step from copy + an optional code example.
function step(args: {
  id: string;
  dayOffset: number;
  subject: string;
  preheader: string;
  heading: (c: EmailCtx) => string;
  paragraphs: (c: EmailCtx) => string[];
  textLines: (c: EmailCtx) => string[];
  code?: string;
  ctaText: string;
  ctaPath: string;
}): DripStep {
  return {
    id: args.id,
    dayOffset: args.dayOffset,
    subject: args.subject,
    build: (c) => {
      const ctaUrl = `${c.appUrl}${args.ctaPath}`;
      return {
        html: emailLayout({
          preheader: args.preheader,
          heading: args.heading(c),
          paragraphs: args.paragraphs(c),
          code: args.code,
          ctaText: args.ctaText,
          ctaUrl,
          secondary: BOOK_A_DEMO,
          unsubscribeUrl: c.unsubscribeUrl,
        }),
        text: emailText({
          lines: args.textLines(c),
          code: args.code,
          ctaText: args.ctaText,
          ctaUrl,
          secondary: BOOK_A_DEMO,
          unsubscribeUrl: c.unsubscribeUrl,
        }),
      };
    },
  };
}

export const SEQUENCE: DripStep[] = [
  step({
    id: "welcome",
    dayOffset: 0,
    subject: "Welcome to ImagePipeline",
    preheader: "Grab your API key and make your first call.",
    heading: (c) => `Welcome, ${c.firstName}`,
    paragraphs: () => [
      "ImagePipeline is the image AI API for product and fashion commerce. On-model imagery, virtual try-on, background and relight, generation, and more, all from one key.",
      "Your dashboard is ready. Grab your API key, then run any endpoint right in the browser with Try now. Over the next few weeks we will show you one practical use case at a time.",
    ],
    textLines: (c) => [
      `Welcome, ${c.firstName}.`,
      "ImagePipeline is the image AI API for commerce: on-model imagery, virtual try-on, background and relight, and generation, all from one key.",
      "Grab your API key in the dashboard and try any endpoint in the browser with Try now.",
    ],
    ctaText: "Open your dashboard",
    ctaPath: "/dashboard",
  }),
  step({
    id: "generate",
    dayOffset: 1,
    subject: "Use case: generate a product shot",
    preheader: "One POST, then poll for the result URL.",
    heading: () => "Generate a product shot",
    paragraphs: () => [
      "Say you need a clean studio shot of a product. Send one POST with a prompt and dimensions. You get back a job id.",
      "Poll the status endpoint until it returns a result_url. Every job on ImagePipeline works this same async way.",
    ],
    textLines: () => [
      "Generate a clean product shot with one POST, then poll the status endpoint for the result_url.",
    ],
    code: `curl -X POST https://api.imagepipeline.io/generate/image/v1 \\
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"studio photo of a perfume bottle on marble, soft daylight","width":1024,"height":1024}'

# then GET /generate/image/v1/status/{job_id} until result_url is set`,
    ctaText: "Try it in the dashboard",
    ctaPath: "/dashboard",
  }),
  step({
    id: "on-model",
    dayOffset: 3,
    subject: "Use case: flat-lay to on-model",
    preheader: "Turn a flat-lay into a styled on-model photo.",
    heading: () => "Flat-lay to on-model, without a photoshoot",
    paragraphs: () => [
      "Have a garment but no model shoot? Pass a face and a prompt to the instamodel endpoint and get a styled on-model image back.",
      "This is how catalogs go from sample to storefront in minutes instead of weeks.",
    ],
    textLines: () => [
      "Pass a face and a prompt to the instamodel endpoint to get a styled on-model image. Catalogs go from sample to storefront in minutes.",
    ],
    code: `POST /creator/instamodel/image/v1
{
  "prompt": "on-model editorial fashion photo, studio lighting",
  "input_face": "https://your-image-url/face.png",
  "height": 1024,
  "width": 768
}`,
    ctaText: "See on-model use cases",
    ctaPath: "/use-cases",
  }),
  step({
    id: "tryon",
    dayOffset: 5,
    subject: "Use case: virtual try-on",
    preheader: "Put any garment on any person, pixel accurate.",
    heading: () => "Drop a garment onto a model",
    paragraphs: () => [
      "Virtual try-on takes a person image and a clothing image and renders the garment onto the person. Useful for PDP variants, size and color combinations, and ad creative.",
      "Two image inputs, one call.",
    ],
    textLines: () => [
      "Virtual try-on takes a person image and a clothing image and renders the garment onto the person. Great for PDP variants and ad creative.",
    ],
    code: `POST /creator/tryon/image/v1
{
  "person_image": "https://your-image-url/person.png",
  "clothing_image": "https://your-image-url/garment.png",
  "gender": "woman"
}`,
    ctaText: "Try virtual try-on",
    ctaPath: "/dashboard",
  }),
  step({
    id: "background",
    dayOffset: 8,
    subject: "Use case: swap and relight backgrounds",
    preheader: "One product photo, many on-brand scenes.",
    heading: () => "Swap and relight the background",
    paragraphs: () => [
      "Shoot a product once, then place it in any scene. Send the image and describe the background you want.",
      "Pair it with upscale to ship crisp, high-resolution variants for every channel.",
    ],
    textLines: () => [
      "Send a product image and describe a new background to place it in any scene. Pair with upscale for high-resolution variants.",
    ],
    code: `POST /background/change/image/v1
{
  "input_image": "https://your-image-url/product.png",
  "prompt": "clean seamless white studio background"
}`,
    ctaText: "Try the editing endpoints",
    ctaPath: "/dashboard",
  }),
  step({
    id: "video",
    dayOffset: 12,
    subject: "Use case: animate a hero image into video",
    preheader: "Turn a still into short, on-brand motion.",
    heading: () => "Animate a still into video",
    paragraphs: () => [
      "Give a still image and a motion prompt to get a short video back. Good for hero sections, social, and paid placements.",
      "Same async pattern: submit, then poll for the result_url.",
    ],
    textLines: () => [
      "Give a still image and a motion prompt to get a short video. Same submit-then-poll pattern.",
    ],
    code: `POST /generate/video/v1
{
  "input_image": "https://your-image-url/hero.png",
  "prompt": "cinematic motion, smooth animation",
  "duration_seconds": 2
}`,
    ctaText: "Explore the platform",
    ctaPath: "/platform",
  }),
  step({
    id: "identity",
    dayOffset: 18,
    subject: "Use case: one identity across a campaign",
    preheader: "Keep the same face consistent everywhere.",
    heading: () => "Keep one identity across a campaign",
    paragraphs: () => [
      "Create an identity profile once, then reference it across generations so the same model stays consistent through a whole campaign.",
      "Lock identity, faceswap, and replace are built on the same idea, with licensed output.",
    ],
    textLines: () => [
      "Create an identity profile once and reference it across generations to keep the same model consistent through a campaign.",
    ],
    code: `POST /profiles/v1
{
  "name": "Spring campaign model",
  "description": "editorial on-model look"
}`,
    ctaText: "Read the developer guides",
    ctaPath: "/developers",
  }),
  step({
    id: "upgrade",
    dayOffset: 25,
    subject: "Ready to scale?",
    preheader: "More credits, higher limits, priority GPUs.",
    heading: () => "Ready to scale?",
    paragraphs: () => [
      "If ImagePipeline is earning its place in your stack, scaling up gets you more credits, higher rate limits, and priority GPUs.",
      "Take a look at the plans and pick the one that fits your volume.",
    ],
    textLines: () => [
      "Scaling up gets you more credits, higher rate limits, and priority GPUs. Take a look at the plans.",
    ],
    ctaText: "See plans",
    ctaPath: "/pricing",
  }),
];
