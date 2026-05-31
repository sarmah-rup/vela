import { AuthHero } from "@/components/site/auth-hero";

// Clerk appearance tuned to the ImagePipeline design system (near-black key, no
// blue, transparent card so it sits inside our panel). The "Secured by Clerk"
// branding is hidden via CSS in globals.css.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#111317",
    colorText: "#0e0f12",
    colorTextSecondary: "#5f626b",
    colorBackground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full border-0 shadow-none",
    card: "border-0 bg-transparent p-0 shadow-none",
    headerTitle: "font-display tracking-tight",
    footer: "bg-transparent",
  },
};

// Full-bleed auth screen: on the left a fixed-height image that runs from the top of
// the viewport (behind the fixed menu) and fills ~65vw — one AI-generated on-model
// look with a dev cue overlaid; on the right, the bare Clerk form. Pages can pass a
// distinct image so sign-in and sign-up don't show the same model.
export function AuthShell({
  children,
  heroSrc,
  heroPrompt,
}: {
  children: React.ReactNode;
  heroSrc?: string;
  heroPrompt?: string;
}) {
  return (
    <div className="grid h-[100dvh] lg:grid-cols-[65vw_minmax(0,1fr)]">
      {/* Left: AI-generated on-model imagery + dev cue, starting at the top of the screen */}
      <AuthHero src={heroSrc} prompt={heroPrompt} />

      {/* Right: bare Clerk form, vertically centered, on the #f0f0f0 panel the
          image sits on. */}
      <div className="flex items-center justify-center bg-[#f0f0f0] px-6 py-10 sm:px-10">{children}</div>
    </div>
  );
}
