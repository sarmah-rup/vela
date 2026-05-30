// Subscription tiers. Price IDs come from env (create recurring prices in Stripe).
// `key` is what we store on users.plan; `priceId` maps a checkout to a tier.

export type PlanKey = "free" | "pro" | "scale";

export type Plan = {
  key: PlanKey;
  name: string;
  priceLabel: string;
  blurb: string;
  features: string[];
  priceId?: string; // undefined for the free tier
  popular?: boolean;
};

// There is no free tier; "free" remains only as the internal default state for a
// user with no active subscription (set by the Stripe webhook).
export const PLANS: Plan[] = [
  {
    key: "pro",
    name: "Pro",
    priceLabel: "$49/mo",
    blurb: "For production apps.",
    features: ["20,000 credits / mo", "10 API keys", "Webhooks", "Email support"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    priceLabel: "$199/mo",
    blurb: "High-volume pipelines.",
    features: ["120,000 credits / mo", "Unlimited keys", "Priority GPUs", "Priority support"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE,
  },
];

export const planByPriceId = (priceId: string | null | undefined): PlanKey => {
  if (!priceId) return "free";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE) return "scale";
  return "free";
};

export const getPlan = (key: PlanKey): Plan =>
  PLANS.find((p) => p.key === key) ?? PLANS[0];
