import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// `npx drizzle-kit push`  — create/sync tables on your Neon database.
// `npx drizzle-kit studio` — browse the data.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
