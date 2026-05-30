import { SignUp } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/site/auth-shell";

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function SignUpPage() {
  if (!clerkConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="max-w-sm text-sm text-muted">
          Auth isn&apos;t configured yet. Add your Clerk keys to <code>.env.local</code> (see{" "}
          <code>SETUP.md</code>) and restart.
        </p>
      </div>
    );
  }
  return (
    <AuthShell>
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  );
}
