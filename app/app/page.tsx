import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { maskedLabel } from "@/lib/api-keys";
import { PLANS } from "@/lib/plans";
import { DashboardClient } from "./dashboard-client";

const clerkConfigured =
  !!process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes("REPLACE_ME");

// Dashboard is protected by proxy.ts; this guard is belt-and-suspenders.
export default async function DashboardPage() {
  if (!clerkConfigured) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-fg">Finish setup</h1>
        <p className="mt-2 max-w-prose text-sm text-muted">
          Auth and billing aren&apos;t configured yet. Add your Clerk, Neon, and Stripe keys to
          <code className="mx-1">.env.local</code> (see <code>SETUP.md</code>), then restart the
          dev server to enable the dashboard.
        </p>
      </div>
    );
  }

  const user = await getOrCreateUser();
  if (!user) {
    return <p className="text-muted">Please sign in.</p>;
  }

  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, user.id), isNull(apiKeys.revokedAt)))
    .orderBy(desc(apiKeys.createdAt));

  const keys = rows.map((k) => ({
    id: k.id,
    name: k.name,
    label: maskedLabel(k.keyPrefix, k.last4),
    createdAt: k.createdAt.toISOString(),
  }));

  const plans = PLANS.map((p) => ({
    key: p.key,
    name: p.name,
    priceLabel: p.priceLabel,
    blurb: p.blurb,
    features: p.features,
    popular: !!p.popular,
    purchasable: !!p.priceId,
  }));

  return (
    <DashboardClient
      email={user.email}
      plan={user.plan}
      planStatus={user.planStatus}
      keys={keys}
      plans={plans}
    />
  );
}
