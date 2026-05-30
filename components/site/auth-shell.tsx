import Image from "next/image";
import Link from "next/link";

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

// Left/right auth screen: brand imagery + value prop on the left, the Clerk form
// on the right.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-7rem)] items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_50px_120px_-60px_rgba(13,15,20,0.6)] lg:grid-cols-2">
        {/* Left: imagery + about */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white lg:flex">
          <Image
            src="/img/ip2/69773c05e94e992c715a0315_Botika_Homepage_BruneteAIModel.avif"
            alt=""
            fill
            sizes="520px"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />

          <Link href="/" className="relative inline-flex items-center gap-2.5" aria-label="ImagePipeline home">
            <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
              <rect x="11.5" y="3" width="17.5" height="17.5" rx="5" fill="#ffffff" opacity="0.3" />
              <rect x="7.25" y="7.25" width="17.5" height="17.5" rx="5" fill="#ffffff" opacity="0.6" />
              <rect x="3" y="11.5" width="17.5" height="17.5" rx="5" fill="#ffffff" />
              <circle cx="11.75" cy="20.25" r="2.3" fill="#0b0c0e" />
            </svg>
            <span className="font-display text-lg font-semibold tracking-tight">
              <span className="text-white/60">Image</span>Pipeline
            </span>
          </Link>

          <div className="relative">
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight">
              The image AI API for fashion and ecommerce.
            </h2>
            <p className="mt-3 max-w-sm text-pretty leading-relaxed text-white/65">
              Turn flat-lays into on-model shots, run virtual try-on, and ship
              campaign-ready imagery from one API.
            </p>
          </div>
        </div>

        {/* Right: Clerk form */}
        <div className="flex items-center justify-center p-6 sm:p-10">{children}</div>
      </div>
    </div>
  );
}
