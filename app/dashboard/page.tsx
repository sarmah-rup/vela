import { getAppUser } from "@/lib/user";
import { getDashboardData } from "@/lib/imagepipeline";
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

  // Real account state (credits, plan, usage, limits, API key, models, images,
  // subscriptions, enterprise) comes from api.imagepipeline.io, fetched server-side
  // with the user's bearer token. If the backend is unreachable the client renders a
  // graceful "couldn't load" state instead of fabricated numbers. Identity falls
  // back to Clerk.
  const data = await getDashboardData();

  return (
    <DashboardClient
      email={data.account?.email || user.email}
      plan={data.account?.plan || user.plan}
      planStatus={user.planStatus}
      data={data}
    />
  );
}
