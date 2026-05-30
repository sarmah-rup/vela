"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { mainNav, CAL_URL } from "@/lib/site";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between rounded-pill px-4 py-2 transition-all duration-300",
            scrolled
              ? "glass shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
              : "border border-transparent",
          )}
        >
          <Logo />

          <div className="hidden items-center gap-2 lg:flex">
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
            <Link
              href="/sign-in"
              className="rounded-pill px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              Sign in
            </Link>
            <Button href={CAL_URL} size="sm">
              Try the API
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

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
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-2 py-2.5 text-sm text-fg hover:bg-bg-soft"
                >
                  Sign in
                </Link>
                <Button href={CAL_URL} onClick={() => setMenuOpen(false)}>
                  Try the API
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
