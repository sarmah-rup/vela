import { emailLayout, emailText } from "@/lib/email/layout";

// Transactional emails (not part of the marketing drip, so no unsubscribe).

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// Purchase confirmation, sent from the Stripe webhook on checkout.session.completed.
export function buildPurchaseEmail(ctx: {
  firstName: string;
  plan: string;
  appUrl: string;
}): { subject: string; html: string; text: string } {
  const planLabel = titleCase(ctx.plan);
  const ctaUrl = `${ctx.appUrl}/dashboard`;
  return {
    subject: `Thank you for your purchase, ${planLabel} is active`,
    html: emailLayout({
      preheader: `Your ${planLabel} plan is active.`,
      heading: "Thank you for your purchase",
      paragraphs: [
        `Hi ${ctx.firstName}, thanks for upgrading. Your ${planLabel} plan is now active and your new credits and rate limits are live.`,
        "You can review usage, manage billing, and grab your API key from the dashboard at any time.",
      ],
      ctaText: "Open your dashboard",
      ctaUrl,
    }),
    text: emailText({
      lines: [
        `Hi ${ctx.firstName}, thanks for upgrading. Your ${planLabel} plan is now active, with new credits and rate limits live.`,
        "Review usage, manage billing, and grab your API key from the dashboard.",
      ],
      ctaText: "Open your dashboard",
      ctaUrl,
    }),
  };
}
