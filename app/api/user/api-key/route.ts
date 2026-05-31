import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import {
  createApiKey,
  resetApiKey,
  getCurrentApiKey,
  getMe,
  extractApiKey,
} from "@/lib/imagepipeline";

// GET /api/user/api-key  → reveal the current full API key (GET /v1/user/api-key).
export async function GET() {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const apiKey = extractApiKey(await getCurrentApiKey());
    return NextResponse.json({ apiKey });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    return NextResponse.json({ error: "imagepipeline_error" }, { status });
  }
}

// POST /api/user/api-key { action: "create" | "reset" }
// Issues (create-if-none) or rotates (reset) the user's single ImagePipeline API
// key. The full key is returned exactly once for the client to copy. Protected by
// Clerk via proxy.ts; the bearer token is attached server-side in lib/imagepipeline.
export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  if (action !== "create" && action !== "reset") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  try {
    // The key mutations key off the ImagePipeline user_id, which /me provides.
    const me = await getMe();
    const data =
      action === "create" ? await createApiKey(me.user_id) : await resetApiKey(me.user_id);
    const apiKey = extractApiKey(data) ?? me.api_key;
    return NextResponse.json({ apiKey });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    return NextResponse.json({ error: "imagepipeline_error" }, { status });
  }
}
