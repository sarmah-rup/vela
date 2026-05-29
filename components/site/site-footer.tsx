import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand, footerNav } from "@/lib/site";
import { Logo } from "./logo";
import { Container } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-32 border-t border-line bg-bg-soft/60">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {brand.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-faint">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-key" />
              All systems operational
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-faint">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted transition-colors hover:text-fg"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-faint">
            © {brand.name} Labs, Inc. Placeholder marketing site, imagery and
            metrics are illustrative.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted">
            <Link href="/about" className="hover:text-fg">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-fg">
              Terms
            </Link>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center gap-1 hover:text-fg"
            >
              {brand.email}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
