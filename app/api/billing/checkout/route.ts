import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { stripe } from "@/lib/stripe";
import { PLANS, type PlanKey } from "@/lib/plans";

// POST /api/billing/checkout { plan: "pro" | "scale" }
// Creates (or reuses) a Stripe customer and returns a subscription Checkout URL.
export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { plan } = (await req.json().catch(() => ({}))) as { plan?: PlanKey };
  const selected = PLANS.find((p) => p.key === plan);
  if (!selected?.priceId) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  // Ensure a Stripe customer exists for this user.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: selected.priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/app?checkout=success`,
    cancel_url: `${appUrl}/app?checkout=cancelled`,
    metadata: { userId: user.id, plan: selected.key },
    subscription_data: { metadata: { userId: user.id, plan: selected.key } },
  });

  return NextResponse.json({ url: session.url });
}
