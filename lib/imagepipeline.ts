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
// (The spec also documents an X-API-Key scheme for raw API consumers; the app
// doesn't use it.)
//
// We cover every distinct user capability in the spec. The `{user_id}` /
// `/v1/user/{user_id}/…` path variants are admin lookups that return the SAME
// data as the current-user endpoints, so we intentionally don't re-expose them —
// where an endpoint needs a user_id (models / images / metrics) we resolve it
// from /me and call the canonical route.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = (process.env.IMAGEPIPELINE_API_URL ?? "https://api.imagepipeline.io").replace(
  /\/$/,
  "",
);

// ── Typed shapes (from components.schemas) ───────────────────────────────────

// GET /v1/user/me · /v1/user/details · /v1/user/{user_id} (UserDetails)
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

// GET /v1/user/models (UserModelInfo) — list rows
export type UserModelInfo = {
  model_id: string;
  user_id: string;
  model_name: string | null;
  status: string;
  trigger_word: string | null;
  created_at: string | null;
};

// GET /v1/user/models/{model_id} (UserModel) — detail
export type UserModel = UserModelInfo & {
  updated_at: string | null;
  training_steps: number | null;
  model_url: string | null;
  thumbnail_url: string | null;
  training_config: Record<string, unknown> | null;
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

// ── Models & images (need the resolved ImagePipeline user_id) ─────────────────
export const getModels = (userId: string) =>
  ipFetch<UserModelInfo[]>(`/v1/user/models${q(userId)}`);
export const getModel = (modelId: string) =>
  ipFetch<UserModel>(`/v1/user/models/${encodeURIComponent(modelId)}`);
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

// Is any of the loose payloads non-empty? (drives conditional enterprise UI)
const nonEmpty = (v: unknown) =>
  v != null && (Array.isArray(v) ? v.length > 0 : typeof v !== "object" || Object.keys(v).length > 0);

// ── Aggregate everything the dashboard needs in one server-side pass ──────────
// Each piece degrades independently so a single failing endpoint doesn't blank
// the dashboard. `reachable` reflects whether the core /me call succeeded.
export type DashboardData = {
  account: UserMe | null;
  reachable: boolean;
  subscriptions: UserSubscription[];
  plan: Json | null;
  usage: Json | null;
  rateLimits: Json | null;
  rateLimitStats: Json | null;
  models: UserModelInfo[];
  images: UserImage[];
  enterprise: {
    sqsMetrics: Json | null;
    pods: Json | null;
    podStatus: Json | null;
    queueMetrics: Json | null;
    hasData: boolean;
  };
};

export async function getDashboardData(): Promise<DashboardData> {
  const [meSettled] = await Promise.allSettled([getMe()]);
  const account = meSettled.status === "fulfilled" ? meSettled.value : null;
  const reachable = meSettled.status === "fulfilled";
  const uid = account?.user_id;

  const settled = await Promise.allSettled([
    getSubscriptions(), // 0
    getPlanInfo(), // 1
    getUsage(30), // 2
    getRateLimits(), // 3
    getRateLimitStats(), // 4
    uid ? getModels(uid) : Promise.resolve([]), // 5
    uid ? getImages(uid) : Promise.resolve([]), // 6
    uid ? getSqsMetrics(uid) : Promise.resolve(null), // 7
    listEnterprisePods(), // 8
    getEnterprisePodStatus(), // 9
    getEnterpriseQueueMetrics(), // 10
  ]);

  const val = <T,>(i: number, fb: T): T =>
    settled[i].status === "fulfilled" ? ((settled[i] as PromiseFulfilledResult<T>).value ?? fb) : fb;

  const sqsMetrics = val<Json | null>(7, null);
  const pods = val<Json | null>(8, null);
  const podStatus = val<Json | null>(9, null);
  const queueMetrics = val<Json | null>(10, null);

  return {
    account,
    reachable,
    subscriptions: val<UserSubscription[]>(0, []),
    plan: val<Json | null>(1, null),
    usage: val<Json | null>(2, null),
    rateLimits: val<Json | null>(3, null),
    rateLimitStats: val<Json | null>(4, null),
    models: val<UserModelInfo[]>(5, []),
    images: val<UserImage[]>(6, []),
    enterprise: {
      sqsMetrics,
      pods,
      podStatus,
      queueMetrics,
      hasData: [sqsMetrics, pods, podStatus, queueMetrics].some(nonEmpty),
    },
  };
}
