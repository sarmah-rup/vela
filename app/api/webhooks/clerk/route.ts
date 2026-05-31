import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { brand } from "@/lib/site";
import { mergePrivateMetadata } from "@/lib/user";
import { resendConfigured, sendEmail, upsertContact } from "@/lib/email/resend";
import { SEQUENCE } from "@/lib/email/sequence";
import { unsubscribeUrl } from "@/lib/email/links";

// Clerk → Resend onboarding hook. On `user.created` we add the user to the
// marketing audience and schedule the welcome + 7-email drip in one shot (all
// within Resend's 30-day window). Enrollment is recorded in privateMetadata so
// Clerk retries don't double-enroll. Verified with svix (CLERK_WEBHOOK_SECRET).
//
// This route is intentionally public (Clerk's servers call it, no session) — the
// svix signature is the auth.

type ClerkEvent = {
  type: string;
  data: {
    id: string;
    first_name?: string | null;
    email_addresses?: { id: string; email_address: string }[];
    primary_email_address_id?: string | null;
    private_metadata?: Record<string, unknown>;
  };
};

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? `https://${brand.domain}`;

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret || secret.includes("REPLACE_ME")) {
    // Not configured yet — acknowledge so Clerk doesn't retry-storm.
    return NextResponse.json({ ok: true, skipped: "not_configured" });
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let evt: ClerkEvent;
  try {
    evt = new Webhook(secret).verify(payload, headers) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (evt.type !== "user.created") {
    return NextResponse.json({ ok: true, ignored: evt.type });
  }

  const user = evt.data;
  // Idempotency: skip if already enrolled (Clerk may redeliver).
  if (user.private_metadata?.dripEnrolledAt) {
    return NextResponse.json({ ok: true, skipped: "already_enrolled" });
  }

  const email =
    user.email_addresses?.find((e) => e.id === user.primary_email_address_id)?.email_address ??
    user.email_addresses?.[0]?.email_address;
  if (!email) return NextResponse.json({ ok: true, skipped: "no_email" });

  if (!resendConfigured) {
    return NextResponse.json({ ok: true, skipped: "resend_not_configured" });
  }

  const firstName = user.first_name || email.split("@")[0];
  const base = appUrl();
  const ctx = { firstName, appUrl: base, unsubscribeUrl: unsubscribeUrl(base, user.id) };
  const headersOut = {
    "List-Unsubscribe": `<${ctx.unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };

  // Resend's API is rate limited (2 req/sec on the free tier). The audience
  // upsert plus the 8 scheduling calls would blow past that and silently drop
  // the later steps, so we space the calls out.
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const RATE_GAP_MS = 700;

  await upsertContact(email, firstName);
  await sleep(RATE_GAP_MS);

  // Schedule the whole sequence. day 0 sends now; the rest are scheduled by offset.
  const now = Date.now();
  const scheduledIds: string[] = [];
  for (const step of SEQUENCE) {
    try {
      const { html, text } = step.build(ctx);
      const scheduledAt =
        step.dayOffset > 0
          ? new Date(now + step.dayOffset * 86_400_000).toISOString()
          : undefined;
      const id = await sendEmail({
        to: email,
        subject: step.subject,
        html,
        text,
        scheduledAt,
        headers: headersOut,
      });
      if (id && scheduledAt) scheduledIds.push(id); // only future sends are cancellable
    } catch {
      /* one failed step shouldn't abort the rest */
    }
    await sleep(RATE_GAP_MS);
  }

  await mergePrivateMetadata(user.id, {
    dripEnrolledAt: new Date(now).toISOString(),
    dripScheduledIds: scheduledIds,
    dripUnsubscribed: false,
  });

  return NextResponse.json({ ok: true, scheduled: scheduledIds.length });
}
