"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { mainNav } from "@/lib/site";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Clerk only mounts a provider once real keys are set (see layout.tsx). Without it,
// <SignedIn>/<SignedOut> have no context, so fall back to the signed-out actions.
const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("REPLACE_ME");

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Nav + auth actions reveal together as one, but only once auth state is resolved,
  // with a single subtle fade-up — never piecemeal. (The logo / hamburger render
  // immediately, outside this; see below.)
  const navCluster = (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="hidden items-center gap-2 lg:flex"
    >
      <nav className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-pill px-3.5 py-2 text-sm transition-colors",
                active ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
              {active ? (
                <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-key" />
              ) : null}
            </Link>
          );
        })}
      </nav>
      {clerkConfigured ? (
        <>
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-pill px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              Sign in
            </Link>
            <Button href="/sign-up" size="sm">
              Try Now
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </SignedOut>
          <SignedIn>
            <Button href="/dashboard" size="sm" variant="outline">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </>
      ) : (
        <>
          <Link
            href="/sign-in"
            className="rounded-pill px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
          >
            Sign in
          </Link>
          <Button href="/sign-up" size="sm">
            Try Now
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </motion.div>
  );

  // `transition-[...]` (not transition-all) on the pill so the scrolled glass
  // animates without fighting any transforms.
  const bar = (
    <div
      className={cn(
        "flex items-center justify-between rounded-pill px-4 py-2 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "glass shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
          : "border border-transparent",
      )}
    >
      {/* Logo renders immediately — never gated on auth. */}
      <Logo />

      {/* Configured: hold the nav cluster until Clerk resolves, then reveal it whole.
          Not configured: nothing to wait on. */}
      {clerkConfigured ? <ClerkLoaded>{navCluster}</ClerkLoaded> : navCluster}

      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg lg:hidden"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">{bar}</div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 w-full max-w-6xl px-6 lg:hidden"
          >
            <div className="card max-h-[75vh] overflow-y-auto p-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-2 py-2.5 text-sm text-fg hover:bg-bg-soft"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid gap-2">
                {clerkConfigured ? (
                  <>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-2 py-2.5 text-sm text-fg hover:bg-bg-soft"
                      >
                        Sign in
                      </Link>
                      <Button href="/sign-up" onClick={() => setMenuOpen(false)}>
                        Try Now
                      </Button>
                    </SignedOut>
                    <SignedIn>
                      <Button
                        href="/dashboard"
                        variant="outline"
                        onClick={() => setMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                      <div className="flex items-center gap-2 px-2 py-1">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-muted">Account</span>
                      </div>
                    </SignedIn>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-2 py-2.5 text-sm text-fg hover:bg-bg-soft"
                    >
                      Sign in
                    </Link>
                    <Button href="/sign-up" onClick={() => setMenuOpen(false)}>
                      Try Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
