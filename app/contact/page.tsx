import type { Metadata } from "next";
import { Mail, MessageSquare, Building2 } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { brand } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the ImagePipeline team about your catalogue.",
};

const channels = [
  {
    icon: Mail,
    title: "Email us",
    body: brand.email,
    href: `mailto:${brand.email}`,
  },
  {
    icon: MessageSquare,
    title: "Developer Slack",
    body: "Join 3,000+ builders",
    href: "/developers",
  },
  {
    icon: Building2,
    title: "Enterprise",
    body: "Book an architecture review",
    href: "/contact",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let’s make your catalogue
            <br />
            <span className="text-gradient italic">programmable.</span>
          </>
        }
        description="Tell us what you are building. We usually reply within a business day."
      />

      <section className="pb-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="flex flex-col gap-4">
                {channels.map((c) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.title}
                      href={c.href}
                      className="card group flex items-center gap-4 p-5 transition-colors hover:border-key/40"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg-soft text-key">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="font-medium text-fg">{c.title}</span>
                        <span className="text-sm text-muted">{c.body}</span>
                      </span>
                    </a>
                  );
                })}
                <div className="card flex flex-col gap-2 p-5">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
                    Studios
                  </span>
                  <p className="text-sm text-muted">
                    London · New York · Bengaluru
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
