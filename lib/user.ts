import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

// Resolve the signed-in Clerk user to our local `users` row, creating it on first
// visit. Returns null if there is no authenticated session.
export async function getOrCreateUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";

  const [created] = await db
    .insert(users)
    .values({ id: userId, email })
    .onConflictDoNothing()
    .returning();

  return created ?? (await db.query.users.findFirst({ where: eq(users.id, userId) })) ?? null;
}
