import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// One row per Clerk user. Mirrors a few fields locally so we can attach an API-key
// list and a Stripe subscription without round-tripping to Clerk on every request.
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id (user_xxx)
  email: text("email").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  // Subscription state, kept in sync by the Stripe webhook.
  plan: text("plan").notNull().default("free"), // free | pro | scale
  planStatus: text("plan_status").notNull().default("inactive"), // active | trialing | past_due | canceled | inactive
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// API keys. We store ONLY a SHA-256 hash of the secret; the full key is shown once
// at creation. `keyPrefix` + `last4` let us display a recognizable, non-secret label.
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull().default("Default key"),
    keyHash: text("key_hash").notNull().unique(),
    keyPrefix: text("key_prefix").notNull(), // e.g. "sk_live"
    last4: text("last4").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [index("api_keys_user_idx").on(t.userId)],
);

// Idempotency log so a re-delivered Stripe webhook is processed at most once.
export const processedStripeEvents = pgTable("processed_stripe_events", {
  id: text("id").primaryKey(), // Stripe event id (evt_xxx)
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
