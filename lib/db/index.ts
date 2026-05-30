import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon serverless driver — works in Node and Edge runtimes on Vercel.
// DATABASE_URL is required at runtime (see .env.local / SETUP.md).
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
export { schema };
