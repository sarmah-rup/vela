import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next.js 16 renamed `middleware.ts` → `proxy.ts`. Clerk runs here.
// Stays a no-op passthrough until real Clerk keys are set, so the marketing site and
// the /docs proxy keep working before auth is configured (see SETUP.md).
const clerkConfigured =
  !!process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes("REPLACE_ME");

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/api/billing(.*)",
  "/api/user(.*)",
  "/api/playground(.*)",
]);

const proxy = clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) await auth.protect();
    })
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
