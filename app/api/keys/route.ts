import { NextResponse } from "next/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/user";
import { generateApiKey, maskedLabel } from "@/lib/api-keys";

// GET /api/keys — list the caller's (non-revoked) keys, masked.
export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, user.id), isNull(apiKeys.revokedAt)))
    .orderBy(desc(apiKeys.createdAt));

  return NextResponse.json({
    data: rows.map((k) => ({
      id: k.id,
      name: k.name,
      label: maskedLabel(k.keyPrefix, k.last4),
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
    })),
  });
}

// POST /api/keys — create a key. The plaintext is returned ONCE.
export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let name = "Default key";
  try {
    const body = await req.json();
    if (typeof body?.name === "string" && body.name.trim()) name = body.name.trim().slice(0, 60);
  } catch {
    /* empty body is fine */
  }

  const { key, keyHash, keyPrefix, last4 } = generateApiKey();
  const [created] = await db
    .insert(apiKeys)
    .values({ userId: user.id, name, keyHash, keyPrefix, last4 })
    .returning();

  return NextResponse.json({
    id: created.id,
    name: created.name,
    key, // shown once — the client must copy it now
    label: maskedLabel(keyPrefix, last4),
    createdAt: created.createdAt,
  });
}
