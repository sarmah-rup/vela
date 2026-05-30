import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, processedStripeEvents } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { planByPriceId } from "@/lib/plans";

// Stripe needs the raw body to verify the signature — read it as text, don't parse.
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `invalid_signature: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  // Idempotency — ignore an event we've already handled.
  const seen = await db
    .insert(processedStripeEvents)
    .values({ id: event.id })
    .onConflictDoNothing()
    .returning();
  if (seen.length === 0) return NextResponse.json({ received: true, duplicate: true });

  async function syncSubscription(sub: Stripe.Subscription) {
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const priceId = sub.items.data[0]?.price?.id ?? null;
    const plan = sub.status === "active" || sub.status === "trialing" ? planByPriceId(priceId) : "free";
    // `current_period_end` lives on the subscription (older API) or its items (newer).
    const periodEnd =
      (sub as { current_period_end?: number }).current_period_end ??
      (sub.items.data[0] as { current_period_end?: number } | undefined)?.current_period_end ??
      null;

    await db
      .update(users)
      .set({
        plan,
        planStatus: sub.status,
        stripeSubscriptionId: sub.id,
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        updatedAt: new Date(),
      })
      .where(eq(users.stripeCustomerId, customerId));
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await syncSubscription(sub);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
