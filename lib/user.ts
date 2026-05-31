import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import type { PlanKey } from "@/lib/plans";

// Subscription state lives in the Clerk user's privateMetadata, there is no local
// database. Clerk is the user store (auth tokens for the backend); Stripe is billing.
// API keys are issued out-of-band (AWS), so this app never persists them.
export type BillingMetadata = {
  stripeCustomerId?: string | null;
  plan?: PlanKey;
  planStatus?: string;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: string | null; // ISO string
};

export type AppUser = {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  plan: PlanKey;
  planStatus: string;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
};

// Resolve the signed-in Clerk user and read billing state from privateMetadata.
// Returns null if there is no authenticated session.
export async function getAppUser(): Promise<AppUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    "";
  const md = (clerkUser.privateMetadata ?? {}) as BillingMetadata;

  return {
    id: userId,
    email,
    stripeCustomerId: md.stripeCustomerId ?? null,
    plan: md.plan ?? "free",
    planStatus: md.planStatus ?? "inactive",
    stripeSubscriptionId: md.stripeSubscriptionId ?? null,
    currentPeriodEnd: md.currentPeriodEnd ?? null,
  };
}

// Merge billing fields into a user's privateMetadata. Safe to call repeatedly with
// the same values (idempotent), which is why the Stripe webhook needs no dedupe log.
export async function setBillingMetadata(userId: string, data: BillingMetadata): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...(user.privateMetadata ?? {}), ...data },
  });
}

// Generic merge into privateMetadata (used by the email-drip enrollment state).
export async function mergePrivateMetadata(
  userId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...(user.privateMetadata ?? {}), ...data },
  });
}

// Read a user's email + privateMetadata (used by the unsubscribe route, which has
// no session). Returns null if the user no longer exists.
export async function getUserEmailAndMetadata(
  userId: string,
): Promise<{ email: string; metadata: Record<string, unknown> } | null> {
  const client = await clerkClient();
  try {
    const user = await client.users.getUser(userId);
    const email =
      user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "";
    return { email, metadata: (user.privateMetadata ?? {}) as Record<string, unknown> };
  } catch {
    return null;
  }
}
