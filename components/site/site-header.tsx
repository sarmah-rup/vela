"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { mainNav, productNav } from "@/lib/site";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [productOpen, setProductOpen] = React.useState(false);
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

          <nav className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                className="inline-flex items-center gap-1 rounded-pill px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
                aria-expanded={productOpen}
              >
                Product
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    productOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {productOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 top-full w-[min(92vw,30rem)] -translate-x-1/2 pt-3"
                  >
                    <div className="card grid gap-1 p-2">
                      {productNav.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-soft"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-key/70 transition-transform group-hover/item:scale-150" />
                          <span>
                            <span className="block text-sm font-medium text-fg">
                              {item.label}
                            </span>
                            <span className="block text-xs leading-relaxed text-faint">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

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

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/sign-in"
              className="rounded-pill px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              Sign in
            </Link>
            <Button href="/sign-up" size="sm">
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
              <p className="px-2 pb-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-faint">
                Product
              </p>
              {productNav.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-2 py-2.5 text-sm text-fg hover:bg-bg-soft"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-line" />
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
                <Button href="/sign-up" onClick={() => setMenuOpen(false)}>
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
