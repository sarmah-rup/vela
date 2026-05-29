// ─────────────────────────────────────────────────────────────────────────
// Central brand + content config. Rename the product in ONE place here.
// All copy lives in this file so it is trivial to swap for real content later.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "Vela",
  wordmark: "Vela",
  tagline: "The image AI API for product and fashion commerce.",
  description:
    "Vela is the image AI API for ecommerce and fashion teams. On-model imagery, virtual try-on, background and relight, and ad creative. One key, async jobs, licensed output.",
  domain: "vela.dev",
  email: "hello@vela.dev",
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
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
];

export const footerNav: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Platform", href: "/platform" },
      { label: "On-Model Imagery", href: "/features/on-model" },
      { label: "Virtual Try-On", href: "/features/try-on" },
      { label: "Editing & Background", href: "/features/editing" },
      { label: "Ad Creative", href: "/features/ad-creative" },
      { label: "Enterprise API", href: "/features/enterprise-api" },
    ],
  },
  {
    label: "Developers",
    items: [
      { label: "Documentation", href: "/developers" },
      { label: "API Reference", href: "/developers#reference" },
      { label: "Live Demo", href: "/demo" },
      { label: "Status", href: "/developers#status" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Customers", href: "/customers" },
      { label: "Blog", href: "/blog" },
      { label: "Resources", href: "/resources" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Pricing", href: "/pricing" },
      { label: "Solutions", href: "/solutions" },
      { label: "Guides", href: "/resources" },
      { label: "Security", href: "/enterprise-api" },
      { label: "Careers", href: "/about#careers" },
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
