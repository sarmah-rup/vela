"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

// One main menu everywhere: the marketing SiteHeader renders on every Next route
// (home, /dashboard, auth). Marketing pages provide their own hero top-spacing.
// /dashboard self-pads for the fixed header inside its own layout so its app
// background runs flush under the header (no colored band). Auth + dashboard pages
// also sit flush against the footer — no top margin/gap.
const FLUSH_FOOTER_PREFIXES = ["/sign-in", "/sign-up", "/dashboard"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const flushFooter = FLUSH_FOOTER_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      <SiteHeader />
      <main className="relative z-[2]">{children}</main>
      <SiteFooter flush={flushFooter} />
    </>
  );
}
