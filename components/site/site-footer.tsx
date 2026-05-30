import Link from "next/link";
import { footerNav } from "@/lib/site";
import { legalDocs } from "@/lib/legal";
import { Logo } from "./logo";
import { Container } from "@/components/ui/primitives";

export function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-32 border-t border-line bg-bg-soft/60">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <div className="flex items-center gap-2 text-sm text-faint">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-key" />
              All systems operational
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            {footerNav.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
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
          <p className="text-xs text-faint">© 2026 Model Pipeline AI Inc.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            {legalDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="hover:text-fg"
              >
                {doc.label}
              </Link>
            ))}
            <a href="/robots.txt" className="hover:text-fg">
              robots.txt
            </a>
            <a href="/llms.txt" className="hover:text-fg">
              llms.txt
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
