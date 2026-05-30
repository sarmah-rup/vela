import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Pin the workspace root so the multi-lockfile warning goes away.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Docs serving:
  //   • Dev  → proxy /docs/* to the Docusaurus dev server on :3001 (live reload).
  //   • Prod → the docs are built into public/docs at build time and served as
  //            static files, so no rewrite is needed (and localhost:3001 doesn't
  //            exist on Vercel). See "build:docs" in package.json.
  async rewrites() {
    if (!isDev) return [];
    return [
      { source: "/docs", destination: "http://localhost:3001/docs/" },
      { source: "/docs/:path*", destination: "http://localhost:3001/docs/:path*" },
    ];
  },
};

export default nextConfig;
