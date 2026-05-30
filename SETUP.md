# Auth + Billing setup (Clerk · Neon · Stripe)

The dashboard at **`/app`** lets a signed-in user create/revoke **API keys** and manage a
**subscription**. Auth is Clerk (Google + GitHub), data is Neon Postgres (Drizzle), billing
is Stripe subscriptions. Everything reads from `.env.local` — fill in the placeholders below.

```
localhost:3000        → marketing site (Vela)
localhost:3000/docs   → ImagePipeline docs
localhost:3000/app    → dashboard (protected — sign in required)
localhost:3000/sign-in, /sign-up → Clerk auth (Google + GitHub)
```

## 1. Clerk (auth)

1. Create an app at <https://dashboard.clerk.com>.
2. **User & Authentication → Social Connections** → enable **Google** and **GitHub**.
3. **API keys** → copy into `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

The sign-in/up routes and redirects are already configured via env. `proxy.ts` protects
`/app`, `/api/keys`, and `/api/billing`.

## 2. Neon Postgres (database)

1. Create a project at <https://console.neon.tech> and copy the connection string into
   `DATABASE_URL` in `.env.local`.
2. Create the tables:
   ```bash
   npx drizzle-kit push
   ```
   (Browse data any time with `npx drizzle-kit studio`.)

Schema lives in `lib/db/schema.ts`: `users`, `api_keys`, `processed_stripe_events`.

## 3. Stripe (billing)

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

## 4. Run

```bash
npm run dev          # http://localhost:3000
```

Sign up → land on `/app` → **Create key** (copy it once) and **Choose Pro/Scale** to run a
real Stripe Checkout. After payment, the webhook syncs `users.plan` and the dashboard shows
the active plan. **Manage billing** opens the Stripe Customer Portal.

## How API-key auth works

Keys are issued as `sk_live_<random>`. Only a **SHA-256 hash** is stored (`lib/api-keys.ts`);
the plaintext is shown exactly once. To authenticate an incoming API request on your
backend, hash the presented key and look it up in `api_keys` (ignoring `revoked_at` rows).

## Files

```
proxy.ts                         Clerk middleware (Next 16 convention)
app/layout.tsx                   ClerkProvider + SiteChrome
app/sign-in, app/sign-up         Clerk auth pages (Google + GitHub)
app/app/                         Dashboard (layout, page, dashboard-client)
app/api/keys/                    Create / list / revoke API keys
app/api/billing/checkout         Start a subscription Checkout
app/api/billing/portal           Open the Stripe Customer Portal
app/api/stripe/webhook           Sync subscription state (signature-verified)
lib/db/                          Drizzle schema + Neon client
lib/stripe.ts, lib/plans.ts      Stripe client + subscription tiers
lib/api-keys.ts, lib/user.ts     Key generation + user resolution
```
