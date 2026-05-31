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
// the viewport (behind the fixed menu) and fills ~65vw — the home-hero looks, cross-
// fading, each with a dev cue overlaid; on the right, the bare Clerk form.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-[100dvh] lg:grid-cols-[65vw_minmax(0,1fr)]">
      {/* Left: rotating home-hero imagery + dev cues, starting at the top of the screen */}
      <AuthHero />

      {/* Right: bare Clerk form, vertically centered, on the #f0f0f0 panel the
          image fades into on its right edge. */}
      <div className="flex items-center justify-center bg-[#f0f0f0] px-6 py-10 sm:px-10">{children}</div>
    </div>
  );
}
