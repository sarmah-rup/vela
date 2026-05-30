import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { brand } from "@/lib/site";
import { SiteChrome } from "@/components/site/site-chrome";
import { ScrollProgress } from "@/components/site/scroll-progress";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// High-contrast editorial serif, used only on display headlines + big stats.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name}, ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  metadataBase: new URL(`https://${brand.domain}`),
  openGraph: {
    title: `${brand.name}, ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
};

// Only mount ClerkProvider once real keys exist — otherwise an invalid placeholder key
// would throw during render and break the marketing site. See SETUP.md.
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tree = (
    <html
      lang="en"
      className={`${jakarta.variable} ${fraunces.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg text-fg">
        <ScrollProgress />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );

  return clerkConfigured ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
