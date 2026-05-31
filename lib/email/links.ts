import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// Signed, tamper-proof one-click unsubscribe links. The token is an HMAC of the
// Clerk user id, so the link works without a session and can't be forged.
const SECRET = process.env.EMAIL_LINK_SECRET ?? "";

export function signUser(userId: string): string {
  return createHmac("sha256", SECRET).update(userId).digest("hex").slice(0, 32);
}

export function verifyUser(userId: string, token: string): boolean {
  const expected = signUser(userId);
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function unsubscribeUrl(appUrl: string, userId: string): string {
  return `${appUrl}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${signUser(userId)}`;
}
