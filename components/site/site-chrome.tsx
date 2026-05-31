"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

// One main menu everywhere: the marketing SiteHeader renders on every Next route
// (home, /dashboard, auth). Marketing pages provide their own hero top-spacing;
// /dashboard gets padding here since the header is fixed-position. Auth pages are
// full-bleed: imagery runs to the top of the screen, behind the menu, so unpadded.
const PADDED_PREFIXES = ["/dashboard"];

// Auth pages are full-bleed and exactly one viewport tall, so the footer sits flush
// against them — no top margin.
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const padded = PADDED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      <SiteHeader />
      <main className={`relative z-[2] ${padded ? "pt-28" : ""}`}>{children}</main>
      <SiteFooter flush={isAuth} />
    </>
  );
}
