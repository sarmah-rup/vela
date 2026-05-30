// Generate public/llms-full.txt: every docs page concatenated as one markdown
// file, so AI agents (Cursor, Claude Code, Copilot, etc.) can ingest the whole
// API surface in a single fetch. Run: node scripts/build-llms-full.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DOCS = join(ROOT, "docs", "docs");

// Sidebar order (see docs/sidebars.ts) so the output reads top-to-bottom.
const ORDER = [
  "intro.md",
  "quickstart.md",
  "authentication.md",
  "concepts/jobs.md",
  "concepts/profiles.md",
  "concepts/workflows.md",
  "capabilities/generate.md",
  "capabilities/identity.md",
  "capabilities/editing.md",
  "capabilities/background.md",
  "capabilities/branding.md",
  "capabilities/upscale.md",
  "reference/errors.md",
  "reference/compliance.md",
];

const stripFrontmatter = (s) => s.replace(/^---\n[\s\S]*?\n---\n/, "").trim();

let out =
  "# ImagePipeline — Full Documentation\n\n" +
  "> ImagePipeline is the image AI API for ecommerce and fashion teams: on-model imagery, virtual try-on, background & relight, and ad creative. This file concatenates the full documentation for LLMs and agents.\n\n" +
  "Canonical site: https://imagepipeline.io · OpenAPI: https://imagepipeline.io/docs/openapi.json\n";

for (const file of ORDER) {
  try {
    const md = stripFrontmatter(readFileSync(join(DOCS, file), "utf8"));
    out += `\n\n---\n\n<!-- source: docs/${file} -->\n\n${md}\n`;
  } catch {
    // skip missing files
  }
}

writeFileSync(join(ROOT, "public", "llms-full.txt"), out + "\n", "utf8");
console.log(`llms-full.txt written (${out.length} chars)`);
