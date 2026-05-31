import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/user";
import { getModel } from "@/lib/imagepipeline";

// GET /api/user/models/:modelId → full model detail (GET /v1/user/models/{model_id}).
export async function GET(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const user = await getAppUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { modelId } = await params;
  try {
    return NextResponse.json(await getModel(modelId));
  } catch (err) {
    const status = (err as { status?: number }).status ?? 502;
    return NextResponse.json({ error: "imagepipeline_error" }, { status });
  }
}
