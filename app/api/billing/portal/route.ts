import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import { stripe } from "@/lib/stripe";

// POST /api/billing/portal, open the Stripe Customer Portal to manage/cancel a plan.
export async function POST() {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "no_subscription" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
