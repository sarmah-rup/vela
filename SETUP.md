# Auth + Billing setup (Clerk · Stripe)

The dashboard at **`/app`** lets a signed-in user view and manage their **subscription**.
Auth is Clerk (Google + GitHub), billing is Stripe subscriptions. **There is no database** —
subscription state is stored in the Clerk user's `privateMetadata`, kept in sync by the Stripe
webhook. API keys are issued out-of-band (AWS); this app does not store them. Everything reads
from `.env.local` — fill in the placeholders below.

```
localhost:3000        → marketing site (Vela)
localhost:3000/docs   → ImagePipeline docs
localhost:3000/app    → dashboard (protected — sign in required)
localhost:3000/sign-in, /sign-up → Clerk auth (Google + GitHub)
```

The frontend authenticates to your backend with the **Clerk session token (bearer)**; API
calls from outside the browser use an **API key issued by AWS** — neither is managed here.

The dashboard's live data (image credits, plan, the user's API key, and subscriptions) is
read from the ImagePipeline backend at **`api.imagepipeline.io`**, fetched **server-side** so
the base URL and token never reach the browser (see `lib/imagepipeline.ts`). Override the host
with `IMAGEPIPELINE_API_URL` in `.env.local` (defaults to production). If the backend is
unreachable the dashboard degrades gracefully instead of showing fake numbers.

## 1. Clerk (auth)

1. Create an app at <https://dashboard.clerk.com>.
2. **User & Authentication → Social Connections** → enable **Google** and **GitHub**.
3. **API keys** → copy into `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

The sign-in/up routes and redirects are already configured via env. `proxy.ts` protects
`/app` and `/api/billing`. Subscription state is written to the user's `privateMetadata`
(`plan`, `planStatus`, `stripeCustomerId`, `stripeSubscriptionId`, `currentPeriodEnd`).

## 2. Stripe (billing)

1. In the Stripe dashboard, create **two recurring Products/Prices** (Pro, Scale) and copy
   their price IDs into `NEXT_PUBLIC_STRIPE_PRICE_PRO` / `NEXT_PUBLIC_STRIPE_PRICE_SCALE`.
2. **Developers → API keys** → set `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. **Webhook** — forward events to the local route:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
   Events handled: `checkout.session.completed`,
   `customer.subscription.created|updated|deleted`.

The webhook maps a Stripe subscription back to its Clerk user via the `userId` we stamp on
both the subscription and customer metadata, then writes the plan into Clerk. Re-delivered
events are safe to reprocess (writing the same plan twice is a no-op), so no idempotency log
is needed.

## 3. Resend (email)

Onboarding drip + a purchase confirmation, sent from **`noreply@imagepipeline.io`**.

1. Create a Resend account, **verify the `imagepipeline.io` domain**, and create an
   **Audience**. Copy into `.env.local`: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`,
   `RESEND_FROM` (defaults to `ImagePipeline <noreply@imagepipeline.io>`), and a
   random `EMAIL_LINK_SECRET` (signs one-click unsubscribe links).
2. **Clerk webhook** — Clerk dashboard → **Webhooks** → add an endpoint at
   `{APP_URL}/api/webhooks/clerk`, subscribe to **`user.created`**, and copy the
   signing secret into `CLERK_WEBHOOK_SECRET`. On sign-up the user is added to the
   Audience and the welcome + 7-email drip is scheduled (all within Resend's 30-day
   window). Unsubscribing cancels the remaining sends.

The Stripe webhook also sends a "thank you for your purchase" email on
`checkout.session.completed`. All copy lives in `email.md` / `lib/email/`. Sending
stays inert until `RESEND_API_KEY` is set, so it's a safe no-op before configuration.

## 4. Run

```bash
npm run dev          # http://localhost:3000
```

Sign up → land on `/app` → **Choose Pro/Scale** to run a real Stripe Checkout. After payment,
the webhook syncs the plan into Clerk metadata and the dashboard shows the active plan.
**Manage billing** opens the Stripe Customer Portal.

## Files

```
proxy.ts                         Clerk middleware (Next 16 convention)
app/layout.tsx                   ClerkProvider + SiteChrome
app/sign-in, app/sign-up         Clerk auth pages (Google + GitHub)
app/app/                         Dashboard (layout, page, dashboard-client)
app/api/billing/checkout         Start a subscription Checkout
app/api/billing/portal           Open the Stripe Customer Portal
app/api/stripe/webhook           Sync subscription state into Clerk (+ purchase email)
app/api/webhooks/clerk           On user.created: add to audience + schedule the drip
app/api/email/unsubscribe        One-click unsubscribe (cancels remaining sends)
app/api/user/api-key             Create / rotate the user's ImagePipeline API key
lib/imagepipeline.ts             Server-only client for api.imagepipeline.io (bearer auth)
lib/email/                       Resend client, layout, drip sequence, transactional
email.md                         All email copy (review / edit here)
lib/user.ts                      Read/write billing state on Clerk privateMetadata
lib/stripe.ts, lib/plans.ts      Stripe client + subscription tiers
```
