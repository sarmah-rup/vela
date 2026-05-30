"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

// One main menu everywhere: the marketing SiteHeader renders on every Next route
// (home, /app, auth). Marketing pages provide their own hero top-spacing; app/auth
// pages get padding here since the header is fixed-position.
const PADDED_PREFIXES = ["/app", "/sign-in", "/sign-up"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const padded = PADDED_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      <SiteHeader />
      <main className={`relative z-[2] ${padded ? "pt-28" : ""}`}>{children}</main>
      <SiteFooter />
    </>
  );
}
