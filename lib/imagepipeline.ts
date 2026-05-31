import "server-only";
import { auth } from "@clerk/nextjs/server";

// ─────────────────────────────────────────────────────────────────────────────
// ImagePipeline user/dashboard API client. SERVER ONLY — the base URL and the
// caller's bearer token never reach the browser. The dashboard talks to our own
// route handlers / server components, which call this on the user's behalf.
//
// Auth bridge: we forward the signed-in user's Clerk session token as
// `Authorization: Bearer …` (per SETUP.md). The backend resolves the user from
// that token, so the "current user" endpoints (/v1/user/me, …) need no user_id.
//
// The `{user_id}` / `/v1/user/{user_id}/…` path variants are admin lookups that
// return the SAME data as the current-user endpoints, so we don't re-expose them;
// where an endpoint needs a user_id (images / metrics) we resolve it from /me.
//
// NOTE: the /v1/user/models endpoints are deprecated and intentionally not used.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = (process.env.IMAGEPIPELINE_API_URL ?? "https://api.imagepipeline.io").replace(
  /\/$/,
  "",
);

// ── Typed shapes (from components.schemas) ───────────────────────────────────

// GET /v1/user/me (UserDetails). `api_key` is redacted before reaching the client.
export type UserMe = {
  user_id: string;
  email: string | null;
  plan: string;
  tokens_remaining: number; // image credits remaining
  model_trainings_remaining: number;
  private_model_loads_remaining: number;
  plan_expiry_date: string | null; // ISO date-time
  api_key: string | null;
};

// GET /v1/user/subscriptions (UserSubscription)
export type UserSubscription = {
  user_id: string;
  subscription_id: string;
  plan: string;
  pod_id: string;
  pod_status: string;
  period_start: string;
  period_end: string;
  subscription_status: string;
  sqs: string | null;
};

// GET /v1/user/images (UserImage)
export type UserImage = {
  download_url: string;
  creation_timestamp: string;
  model_id: string;
  image_id: string;
};

// Several endpoints (plan, usage, rate-limits, metrics, enterprise) are documented
// but have no response schema — keep them loose.
export type Json = Record<string, unknown>;

class ImagePipelineError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ImagePipelineError";
  }
}

// Authenticated server-side fetch against api.imagepipeline.io. Attaches the
// Clerk bearer token and never caches (per-user, dynamic). Throws on non-2xx.
async function ipFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) throw new ImagePipelineError(401, "no_session_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new ImagePipelineError(res.status, detail.slice(0, 300) || res.statusText);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

const q = (userId: string) => `?user_id=${encodeURIComponent(userId)}`;

// Generic helpers for the Try-now runner (path is allowlisted by the caller).
export const ipGet = (path: string) => ipFetch<Json>(path);
export const ipPost = (path: string, body: unknown) =>
  ipFetch<Json>(path, { method: "POST", body: JSON.stringify(body ?? {}) });

// ── Account / identity ───────────────────────────────────────────────────────
export const getMe = () => ipFetch<UserMe>("/v1/user/me");

// ── Plan / usage / limits ─────────────────────────────────────────────────────
export const getPlanInfo = () => ipFetch<Json>("/v1/user/plan");
export const getUsage = (days?: number) =>
  ipFetch<Json>(`/v1/user/usage${days ? `?days=${days}` : ""}`);
export const getRateLimits = () => ipFetch<Json>("/v1/user/rate-limits");
export const getRateLimitStats = () => ipFetch<Json>("/v1/user/rate-limits/stats");

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const getSubscriptions = () => ipFetch<UserSubscription[]>("/v1/user/subscriptions");

// ── Images (needs the resolved ImagePipeline user_id) ─────────────────────────
export const getImages = (userId: string) => ipFetch<UserImage[]>(`/v1/user/images${q(userId)}`);

// ── API key (single key: get / create-if-none / rotate) ───────────────────────
export const getCurrentApiKey = () => ipFetch<Json>("/v1/user/api-key");
export const createApiKey = (userId: string) =>
  ipFetch<Json>(`/v1/user/api_key/new${q(userId)}`, { method: "POST" });
export const resetApiKey = (userId: string) =>
  ipFetch<Json>(`/v1/user/api_key/reset${q(userId)}`, { method: "POST" });

// ── Enterprise (SQS metrics, pods, queue) ─────────────────────────────────────
export const getSqsMetrics = (userId: string) => ipFetch<Json>(`/v1/user/metrics${q(userId)}`);
export const listEnterprisePods = () => ipFetch<Json>("/v1/user/enterprise/pods");
export const getEnterprisePodStatus = () => ipFetch<Json>("/v1/user/enterprise/pods/status");
export const getEnterpriseQueueMetrics = () =>
  ipFetch<Json>("/v1/user/enterprise/queue/metrics");
export const requestEnterprisePod = () =>
  ipFetch<Json>("/v1/user/enterprise/pod/request", { method: "POST" });

// Pull the API key string out of a loosely-typed key response.
export function extractApiKey(data: Json | null): string | null {
  if (!data) return null;
  const v = data.api_key ?? data.apiKey ?? data.key;
  return typeof v === "string" ? v : null;
}

// Mask a secret for display so the full value never has to leave the server.
function mask(key: string | null | undefined): string | null {
  if (!key) return null;
  return key.length <= 12
    ? `${key.slice(0, 4)}••••`
    : `${key.slice(0, 12)}••••••••••${key.slice(-4)}`;
}

// ── Aggregate everything the dashboard needs in one server-side pass ──────────
// Each piece degrades independently so a single failing endpoint doesn't blank
// the dashboard. `reachable` reflects whether the core /me call succeeded.
export type DashboardData = {
  account: UserMe | null; // api_key is redacted to null here (see apiKeyMasked)
  reachable: boolean;
  apiKeyMasked: string | null; // safe-to-render masked form
  hasApiKey: boolean;
  subscriptions: UserSubscription[];
  subscriptionsError: boolean; // distinguish backend failure from genuinely none
  plan: Json | null;
  usage: Json | null;
  rateLimits: Json | null;
  images: UserImage[];
  enterprise: {
    // Whether this account actually has enterprise access (the pod/queue endpoints
    // 403 with "Enterprise plan required" otherwise). Drives the locked teaser.
    hasAccess: boolean;
    sqsMetrics: Json | null;
    pods: Json | null;
    podStatus: Json | null;
    queueMetrics: Json | null;
  };
};

export async function getDashboardData(): Promise<DashboardData> {
  const [meSettled] = await Promise.allSettled([getMe()]);
  const fullAccount = meSettled.status === "fulfilled" ? meSettled.value : null;
  const reachable = meSettled.status === "fulfilled";
  const uid = fullAccount?.user_id;

  const settled = await Promise.allSettled([
    getSubscriptions(), // 0
    getPlanInfo(), // 1
    getUsage(30), // 2
    getRateLimits(), // 3
    uid ? getImages(uid) : Promise.resolve([]), // 4
    uid ? getSqsMetrics(uid) : Promise.resolve(null), // 5
    listEnterprisePods(), // 6
    getEnterprisePodStatus(), // 7
    getEnterpriseQueueMetrics(), // 8
  ]);

  const ok = (i: number) => settled[i].status === "fulfilled";
  const val = <T,>(i: number, fb: T): T =>
    ok(i) ? ((settled[i] as PromiseFulfilledResult<T>).value ?? fb) : fb;

  const pods = val<Json | null>(6, null);
  const podStatus = val<Json | null>(7, null);
  const queueMetrics = val<Json | null>(8, null);

  // Redact the API key — never ship the full secret in the page payload.
  const account: UserMe | null = fullAccount ? { ...fullAccount, api_key: null } : null;

  return {
    account,
    reachable,
    apiKeyMasked: mask(fullAccount?.api_key),
    hasApiKey: !!fullAccount?.api_key,
    subscriptions: val<UserSubscription[]>(0, []),
    subscriptionsError: !ok(0),
    plan: val<Json | null>(1, null),
    usage: val<Json | null>(2, null),
    rateLimits: val<Json | null>(3, null),
    images: val<UserImage[]>(4, []),
    enterprise: {
      // A successful (non-403) response from any pod/queue endpoint means access.
      hasAccess: ok(6) || ok(7) || ok(8),
      sqsMetrics: val<Json | null>(5, null),
      pods,
      podStatus,
      queueMetrics,
    },
  };
}
