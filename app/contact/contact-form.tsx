"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm text-fg placeholder:text-faint outline-none transition-colors focus:border-key/60";

const interests = ["Try the API", "Enterprise", "Partnerships", "Support"];

export function ContactForm() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [interest, setInterest] = React.useState(interests[0]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end only for now, wire to a real endpoint later.
    setState("sending");
    setTimeout(() => setState("sent"), 900);
  };

  if (state === "sent") {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-key/15 text-key">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="font-display text-3xl tracking-tight">Message sent</h3>
        <p className="max-w-sm text-sm text-muted">
          Thanks for reaching out. This is a demo form, so nothing was actually
          submitted, wire it to your CRM or an email endpoint when you are
          ready.
        </p>
        <Button variant="outline" onClick={() => setState("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5 p-7 sm:p-9">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          What can we help with?
        </label>
        <div className="flex flex-wrap gap-2">
          {interests.map((it) => (
            <button
              key={it}
              type="button"
              onClick={() => setInterest(it)}
              className={cn(
                "rounded-pill border px-3.5 py-1.5 text-sm transition-colors",
                interest === it
                  ? "border-key/60 bg-key/15 text-key"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              {it}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-muted">
            Name
          </label>
          <input id="name" required className={fieldClass} placeholder="Ada Lovelace" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-muted">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            className={fieldClass}
            placeholder="ada@brand.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm text-muted">
          Company
        </label>
        <input id="company" className={fieldClass} placeholder="Northwind" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-muted">
          Tell us about your catalogue
        </label>
        <textarea
          id="message"
          rows={4}
          className={cn(fieldClass, "resize-none")}
          placeholder="We have ~8,000 SKUs and want on-model imagery for every drop…"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
      <p className="text-center text-xs text-faint">
        By submitting you agree to our placeholder terms. No data leaves your
        browser in this demo.
      </p>
    </form>
  );
}
