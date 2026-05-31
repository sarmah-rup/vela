import { brand } from "@/lib/site";

// ─────────────────────────────────────────────────────────────────────────────
// Shared, brand-consistent email shell (monochrome, matches the site palette).
// Inline styles only (email-safe). Used by the onboarding drip + transactional
// emails. House style: no em dashes anywhere in copy.
// ─────────────────────────────────────────────────────────────────────────────

export type LayoutOpts = {
  preheader: string;
  heading: string;
  paragraphs: string[];
  code?: string; // optional monospace example block (showcases a use case)
  ctaText: string;
  ctaUrl: string;
  secondary?: { text: string; url: string }; // e.g. Book a demo
  unsubscribeUrl?: string; // omit for transactional emails
};

export function emailLayout(o: LayoutOpts): string {
  const body = o.paragraphs
    .map((p) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5f626b;">${p}</p>`)
    .join("");

  const codeBlock = o.code
    ? `<pre style="margin:0 0 18px;padding:14px;background:#f4f4f2;border:1px solid #e6e5e1;border-radius:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.55;color:#0e0f12;white-space:pre-wrap;word-break:break-word;overflow-x:auto;">${escapeHtml(
        o.code,
      )}</pre>`
    : "";

  const footer = o.unsubscribeUrl
    ? `${brand.name}, the image AI API for commerce<br/>
       <a href="${o.unsubscribeUrl}" style="color:#9a9da6;text-decoration:underline;">Unsubscribe</a>`
    : `${brand.name}, the image AI API for commerce`;

  return `<!doctype html><html><body style="margin:0;background:#f4f4f2;padding:0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${o.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e6e5e1;border-radius:18px;overflow:hidden;">
        <tr><td style="padding:24px 28px 0;">
          <span style="font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#0e0f12;">Image<span style="color:#5f626b;">Pipeline</span></span>
        </td></tr>
        <tr><td style="padding:18px 28px 28px;">
          <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;letter-spacing:-0.02em;color:#0e0f12;">${o.heading}</h1>
          ${body}
          ${codeBlock}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0;"><tr><td style="border-radius:12px;background:#111317;">
            <a href="${o.ctaUrl}" style="display:inline-block;padding:11px 20px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${o.ctaText}</a>
          </td></tr></table>
          ${
            o.secondary
              ? `<p style="margin:14px 0 0;font-size:13px;color:#9a9da6;">Prefer a guided tour? <a href="${o.secondary.url}" style="color:#0e0f12;font-weight:600;text-decoration:underline;">${o.secondary.text}</a></p>`
              : ""
          }
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding:18px 28px;text-align:center;font-size:12px;line-height:1.6;color:#9a9da6;">
          ${footer}
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

// Plain-text counterpart (no em dashes; simple separators).
export function emailText(opts: {
  lines: string[];
  code?: string;
  ctaText: string;
  ctaUrl: string;
  secondary?: { text: string; url: string };
  unsubscribeUrl?: string;
}): string {
  const parts = [...opts.lines];
  if (opts.code) parts.push(opts.code);
  parts.push(`${opts.ctaText}: ${opts.ctaUrl}`);
  if (opts.secondary) parts.push(`${opts.secondary.text}: ${opts.secondary.url}`);
  parts.push(opts.unsubscribeUrl ? `${brand.name}\nUnsubscribe: ${opts.unsubscribeUrl}` : brand.name);
  return parts.join("\n\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
