import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/site/scroll-progress";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${fraunces.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg text-fg">
        <ScrollProgress />
        <SiteHeader />
        <main className="relative z-[2]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
