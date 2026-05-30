import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { brand } from "@/lib/site";
import { PLANS } from "@/lib/plans";
import { SiteChrome } from "@/components/site/site-chrome";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL = `https://${brand.domain}`;

// Site-wide structured data: Organization + WebSite + the product (WebApplication).
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: brand.name,
      url: SITE_URL,
      description: brand.description,
      logo: `${SITE_URL}/icon.svg`,
      email: brand.email,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: brand.name,
      url: SITE_URL,
      description: brand.tagline,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: brand.name,
      url: SITE_URL,
      description: brand.description,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires an API key; callable from any language over HTTPS",
      featureList: [
        "On-model imagery",
        "Virtual try-on",
        "Background replace & relight",
        "Ad creative generation",
        "Identity faceswap, lock & replace",
        "Image upscaling",
      ],
      offers: PLANS.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.priceLabel.replace(/[^0-9]/g, "") || "0",
        priceCurrency: "USD",
        description: p.blurb,
      })),
    },
    {
      "@type": "WebAPI",
      name: `${brand.name} API`,
      description:
        "REST API for image generation, virtual try-on, identity, background & relight, and ad creative. Async jobs with polling or webhooks.",
      url: `${SITE_URL}/docs/api`,
      documentation: `${SITE_URL}/docs`,
      provider: { "@id": `${SITE_URL}/#organization` },
      termsOfService: `${SITE_URL}/legal/terms`,
    },
  ],
};

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
    siteName: brand.name,
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Drop your verification codes into env to verify ownership in Google Search
  // Console / Bing Webmaster (then submit the sitemaps there).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
};

// Only mount ClerkProvider once real keys exist, otherwise an invalid placeholder key
// would throw during render and break the marketing site. See SETUP.md.
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

const GTM_ID = "GTM-NM5F9Q6L";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tree = (
    <html
      lang="en"
      className={`${jakarta.variable} ${fraunces.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg text-fg">
        <JsonLd data={structuredData} />
        {/* Google Tag Manager, loaded after the page is interactive so it never
            blocks FCP (the injected gtm.js is itself async). */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ScrollProgress />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );

  return clerkConfigured ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
