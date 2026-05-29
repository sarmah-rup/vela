import type { CodeTab } from "@/components/sections/code-window";

// Real endpoints + request shapes from the ImagePipeline OpenAPI spec, framed
// for the visual-commerce niche. Auth is X-API-Key, bodies are flat JSON,
// compute endpoints are async (return a job_id, poll or use a webhook).

export const heroTabs: CodeTab[] = [
  {
    label: "cURL",
    language: "bash",
    filename: "tryon.sh",
    code: `# Virtual try-on: drop a garment onto a model
curl https://api.vela.dev/creator/tryon/image/v1 \\
  -H "X-API-Key: $VELA_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "person_image": "https://cdn.brand.com/models/ava.jpg",
    "clothing_image": "https://cdn.brand.com/sku/884.jpg",
    "gender": "female",
    "output_format": "webp",
    "callback_url": "https://hooks.brand.com/vela"
  }'`,
  },
  {
    label: "TypeScript",
    language: "ts",
    filename: "onmodel.ts",
    code: `import { Vela } from "@vela/sdk";

const vela = new Vela(process.env.VELA_KEY);

// On-model imagery for an entire catalogue, streamed back via webhook
const jobs = await Promise.all(
  catalogue.map((p) =>
    vela.creator.instamodel({
      prompt: "studio model, soft daylight, editorial",
      input_face: "models/ava.jpg",
      callback_url: "https://hooks.brand.com/vela",
    }),
  ),
);

return jobs.map((j) => j.job_id);`,
  },
  {
    label: "Python",
    language: "py",
    filename: "background.py",
    code: `from vela import Vela

vela = Vela(api_key=os.environ["VELA_KEY"])

# Clean and relight a raw product photo
job = vela.background.change(
    input_image="sku/884-raw.jpg",
    prompt="seamless studio backdrop, soft shadow",
    output_format="png",
)

print(job.job_id, job.status)  # rnd_3kQ9aZ queued`,
  },
];

export const responseTab: CodeTab[] = [
  {
    label: "202 queued",
    language: "json",
    filename: "queued.json",
    code: `{
  "job_id": "job_3kQ9aZ",
  "status": "queued",
  "endpoint": "/creator/tryon/image/v1",
  "estimated_time_seconds": 4,
  "queued_at": "2026-05-29T12:00:00Z"
}`,
  },
  {
    label: "webhook",
    language: "json",
    filename: "webhook.json",
    code: `{
  "job_id": "job_3kQ9aZ",
  "status": "completed",
  "result_url": "https://cdn.vela.dev/o/3kQ9aZ.webp",
  "result_mime_type": "image/webp",
  "inference_time_seconds": 3.4,
  "credits_charged": true
  // result_url expires in 24h, store it now
}`,
  },
];
