import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import { ipGet } from "@/lib/imagepipeline";
import { isAllowedPath, statusPath } from "@/lib/playground";

// GET /api/playground/status?path=<feature path>&jobId=<id>
// Polls a Try-now job's status. `path` is validated against the allowlist; the
// client polls this until status is completed/failed/cancelled.
export async function GET(req: Request) {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") ?? "";
  const jobId = searchParams.get("jobId") ?? "";
  if (!isAllowedPath(path) || !jobId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const data = await ipGet(statusPath(path, jobId));
    return NextResponse.json(data);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    return NextResponse.json(
      { error: "imagepipeline_error", detail: (err as Error).message },
      { status },
    );
  }
}
