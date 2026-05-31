import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import { requestEnterprisePod } from "@/lib/imagepipeline";

// POST /api/user/enterprise/pod → request a dedicated enterprise pod
// (POST /v1/user/enterprise/pod/request).
export async function POST() {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await requestEnterprisePod());
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    return NextResponse.json({ error: "imagepipeline_error" }, { status });
  }
}
