import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import { ipPost } from "@/lib/imagepipeline";
import { isAllowedPath } from "@/lib/playground";

// POST /api/playground/run { path, payload }
// Submits a Try-now job to api.imagepipeline.io with the user's Clerk bearer token.
// `path` is validated against the feature catalog allowlist (no arbitrary proxying).
// Returns the queued job ({ job_id, status, … }).
export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { path, payload } = (await req.json().catch(() => ({}))) as {
    path?: string;
    payload?: unknown;
  };
  if (!path || !isAllowedPath(path)) {
    return NextResponse.json({ error: "unknown_endpoint" }, { status: 400 });
  }

  try {
    const data = await ipPost(path, payload ?? {});
    return NextResponse.json(data);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    // 403 with a valid session = the feature isn't on the user's plan. Signal
    // the client to show the upgrade/pricing popup.
    if (status === 403) {
      return NextResponse.json(
        { error: "plan_upgrade_required", detail: (err as Error).message },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "imagepipeline_error", detail: (err as Error).message },
      { status },
    );
  }
}
