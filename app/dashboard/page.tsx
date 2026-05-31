import { getAppUser } from "@/lib/user";
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
          Auth and billing aren&apos;t configured yet. Add your Clerk and Stripe keys to
          <code className="mx-1">.env.local</code> (see <code>SETUP.md</code>), then restart the
          dev server to enable the dashboard.
        </p>
      </div>
    );
  }

  const user = await getAppUser();
  if (!user) {
    return <p className="text-muted">Please sign in.</p>;
  }

  // Real identity + plan come from Clerk; credits / API keys / usage are dummy in
  // the client for now (backend wired up later).
  return (
    <DashboardClient email={user.email} plan={user.plan} planStatus={user.planStatus} />
  );
}
