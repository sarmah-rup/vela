// One-off: extract the <main> content from the ss/*.html policy exports, strip the
// source site's classes/scripts/svgs, and write clean HTML to content/legal/<slug>.html.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "ss");
const OUT = join(ROOT, "content", "legal");
mkdirSync(OUT, { recursive: true });

const FILES = [
  { file: "Privacy Policy — ImagePipeline.html", slug: "privacy" },
  { file: "Terms of Service — ImagePipeline.html", slug: "terms" },
  { file: "Acceptable Use Policy — ImagePipeline.html", slug: "acceptable-use" },
  { file: "Copyright & DMCA Policy — ImagePipeline.html", slug: "copyright-dmca" },
  { file: "Security — ImagePipeline.html", slug: "security" },
  { file: "Responsible AI — ImagePipeline.html", slug: "responsible-ai" },
];

function extractMain(html) {
  const start = html.indexOf("<main");
  if (start === -1) throw new Error("no <main>");
  const open = html.indexOf(">", start) + 1;
  const end = html.indexOf("</main>", open);
  return html.slice(open, end);
}

function clean(inner) {
  return inner
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sdata-[a-z-]+="[^"]*"/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(div|span)\b[^>]*>/gi, "") // unwrap layout-only wrappers
    .replace(/^[\s\S]*?(?=<h1)/i, "") // drop the leading "Legal" eyebrow before the title
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

for (const { file, slug } of FILES) {
  const html = readFileSync(join(SRC, file), "utf8");
  const cleaned = clean(extractMain(html));
  writeFileSync(join(OUT, `${slug}.html`), cleaned + "\n", "utf8");
  console.log(`${slug}.html  (${cleaned.length} chars)`);
}
