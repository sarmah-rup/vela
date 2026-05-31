import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/email/links";
import { getUserEmailAndMetadata, mergePrivateMetadata } from "@/lib/user";
import { cancelEmail, unsubscribeContact } from "@/lib/email/resend";

// One-click unsubscribe (public, HMAC-token authed). Cancels the user's remaining
// scheduled drip emails and marks the contact unsubscribed in the audience.
// Handles GET (link click) and POST (RFC 8058 List-Unsubscribe-Post one-click).
async function handle(userId: string, token: string): Promise<boolean> {
  if (!userId || !verifyUser(userId, token)) return false;

  const info = await getUserEmailAndMetadata(userId);
  // Cancel any still-scheduled emails (best-effort).
  const ids = (info?.metadata.dripScheduledIds as string[] | undefined) ?? [];
  await Promise.allSettled(ids.map((id) => cancelEmail(id)));
  if (info?.email) await unsubscribeContact(info.email);
  try {
    await mergePrivateMetadata(userId, { dripUnsubscribed: true, dripScheduledIds: [] });
  } catch {
    /* user may be gone — ignore */
  }
  return true;
}

const page = (msg: string) =>
  new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
     <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:420px;margin:18vh auto;padding:0 24px;text-align:center;color:#0e0f12;">
       <div style="font-size:17px;font-weight:700;letter-spacing:-.02em;">Image<span style="color:#5f626b;">Pipeline</span></div>
       <p style="margin-top:16px;font-size:15px;color:#5f626b;line-height:1.6;">${msg}</p>
     </div>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ok = await handle(searchParams.get("u") ?? "", searchParams.get("t") ?? "");
  return ok
    ? page("You’ve been unsubscribed. You won’t receive further onboarding emails.")
    : page("This unsubscribe link is invalid or has expired.");
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const ok = await handle(searchParams.get("u") ?? "", searchParams.get("t") ?? "");
  return NextResponse.json({ ok });
}
