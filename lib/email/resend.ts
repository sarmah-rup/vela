import "server-only";
import { Resend } from "resend";
import { brand } from "@/lib/site";

// ─────────────────────────────────────────────────────────────────────────────
// Resend client + thin helpers (server only). Sending stays inert until a real
// RESEND_API_KEY is set, so the webhook is a safe no-op before configuration.
// ─────────────────────────────────────────────────────────────────────────────

export const resendConfigured =
  !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("REPLACE_ME");

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_inert");
const FROM = process.env.RESEND_FROM ?? `${brand.name} <noreply@${brand.domain}>`;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  scheduledAt?: string; // ISO 8601; omit to send immediately
  headers?: Record<string, string>;
};

// Send (or schedule) one email. Returns the Resend message id so a scheduled
// send can be cancelled later. Throws on API error.
export async function sendEmail(args: SendArgs): Promise<string | null> {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    scheduledAt: args.scheduledAt,
    headers: args.headers,
  });
  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

// Cancel a scheduled email (best-effort — already-sent ids just error out).
export async function cancelEmail(id: string): Promise<void> {
  try {
    await resend.emails.cancel(id);
  } catch {
    /* already sent / unknown id — ignore */
  }
}

// Add (or refresh) the contact in the marketing audience. Best-effort.
export async function upsertContact(email: string, firstName?: string): Promise<void> {
  if (!AUDIENCE_ID) return;
  try {
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email,
      firstName,
      unsubscribed: false,
    });
  } catch {
    /* likely already exists — fine */
  }
}

// Mark the contact unsubscribed in the audience. Best-effort.
export async function unsubscribeContact(email: string): Promise<void> {
  if (!AUDIENCE_ID) return;
  try {
    await resend.contacts.update({ audienceId: AUDIENCE_ID, email, unsubscribed: true });
  } catch {
    /* ignore */
  }
}
