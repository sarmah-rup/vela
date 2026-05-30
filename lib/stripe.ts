import Stripe from "stripe";

// Server-side Stripe client. Never import this into a client component.
// apiVersion is omitted so it tracks the version pinned by the installed SDK.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  appInfo: { name: "ImagePipeline", url: "https://imagepipeline.io" },
});
