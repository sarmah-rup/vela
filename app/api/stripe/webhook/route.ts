import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { brand } from "@/lib/site";
import { planByPriceId } from "@/lib/plans";
import { setBillingMetadata, getUserEmailAndMetadata } from "@/lib/user";
import { resendConfigured, sendEmail } from "@/lib/email/resend";
import { buildPurchaseEmail } from "@/lib/email/transactional";

// Stripe needs the raw body to verify the signature, read it as text, don't parse.
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

  // Map a subscription back to its Clerk user. We stamp `userId` on both the
  // subscription metadata (at checkout) and the customer metadata (at creation),
  // so either is enough, no local lookup table needed.
  async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
    if (typeof sub.metadata?.userId === "string") return sub.metadata.userId;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && typeof customer.metadata?.userId === "string") {
      return customer.metadata.userId;
    }
    return null;
  }

  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = await resolveUserId(sub);
    if (!userId) return; // nothing we can attribute this to

    const priceId = sub.items.data[0]?.price?.id ?? null;
    const plan =
      sub.status === "active" || sub.status === "trialing" ? planByPriceId(priceId) : "free";
    // `current_period_end` lives on the subscription (older API) or its items (newer).
    const periodEnd =
      (sub as { current_period_end?: number }).current_period_end ??
      (sub.items.data[0] as { current_period_end?: number } | undefined)?.current_period_end ??
      null;

    // Writing the same plan twice is harmless, so re-delivered events need no dedupe log.
    await setBillingMetadata(userId, {
      plan,
      planStatus: sub.status,
      stripeSubscriptionId: sub.id,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await syncSubscription(sub);

        // "Thank you for your purchase" email. checkout.session.completed fires
        // once per purchase, so no extra dedupe is needed.
        if (resendConfigured) {
          const userId =
            (typeof session.metadata?.userId === "string" && session.metadata.userId) ||
            (typeof sub.metadata?.userId === "string" ? sub.metadata.userId : null);
          const plan = planByPriceId(sub.items.data[0]?.price?.id ?? null);
          const info = userId ? await getUserEmailAndMetadata(userId) : null;
          const email =
            info?.email || session.customer_details?.email || session.customer_email || "";
          if (email) {
            const firstName = email.split("@")[0];
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${brand.domain}`;
            const mail = buildPurchaseEmail({ firstName, plan, appUrl });
            try {
              await sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });
            } catch {
              /* email failure shouldn't fail the webhook */
            }
          }
        }
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
