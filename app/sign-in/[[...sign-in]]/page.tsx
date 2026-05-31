import { SignIn } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/site/auth-shell";

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

// Clerk renders Google + GitHub automatically once they're enabled as Social
// Connections in the Clerk dashboard.
export default function SignInPage() {
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
    <AuthShell
      heroSrc="/img/ip/shoot/image_11.png"
      heroPrompt="full-body on-model, tailored suit, soft studio light..."
    >
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  );
}
