// ─────────────────────────────────────────────────────────────────────────
// Central brand + content config. Rename the product in ONE place here.
// All copy lives in this file so it is trivial to swap for real content later.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "ImagePipeline",
  wordmark: "ImagePipeline",
  tagline: "The image AI API for product and fashion commerce.",
  description:
    "ImagePipeline is the image AI API for ecommerce and fashion teams. On-model imagery, virtual try-on, background and relight, and ad creative. One key, async jobs, licensed output.",
  domain: "imagepipeline.io",
  email: "hello@imagepipeline.io",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const productNav: NavGroup = {
  label: "Product",
  items: [
    {
      label: "On-Model Imagery",
      href: "/features/on-model",
      description: "Flat-lay to a styled shot on a photoreal AI model.",
    },
    {
      label: "Virtual Try-On",
      href: "/features/try-on",
      description: "Drop any garment onto any body, pixel-accurate.",
    },
    {
      label: "Editing & Background",
      href: "/features/editing",
      description: "Cutouts, relight, upscale and clean-ups at scale.",
    },
    {
      label: "Ad Creative",
      href: "/features/ad-creative",
      description: "Turn a catalogue into platform-ready ads and video.",
    },
    {
      label: "Enterprise API",
      href: "/features/enterprise-api",
      description: "Licensed generation, brand controls, indemnified.",
    },
  ],
};

export const mainNav: NavItem[] = [
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export const footerNav: NavGroup[] = [
  {
    label: "Links",
    items: [
      { label: "Docs", href: "/docs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
      { label: "FAQ", href: "/faq" },
      { label: "Help", href: "#" },
    ],
  },
];

// Logos for the "trusted by" cloud, placeholder brand names, swap for real SVGs.
export const logoCloud = [
  "Lumen & Co",
  "Northwind",
  "Atelier 9",
  "MERIDIAN",
  "Saola",
  "Florarama",
  "OUTBOUND",
  "Kestrel",
];

export const stats = [
  { value: "4.2B", label: "Images generated", sub: "across the network in 2025" },
  { value: "<900ms", label: "p50 latency", sub: "for a try-on render" },
  { value: "99.98%", label: "Uptime", sub: "trailing twelve months" },
  { value: "62", label: "Markets", sub: "with edge generation" },
];
