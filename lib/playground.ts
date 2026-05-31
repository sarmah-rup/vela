// ─────────────────────────────────────────────────────────────────────────────
// "Try now" feature catalog. A curated, plain-data list of the ImagePipeline
// feature endpoints with realistic example payloads, output kinds, and which
// fields take an image — used by the dashboard Try-now tool and by the BFF run/
// status routes as an allowlist (so only known endpoints can be proxied).
//
// All ImagePipeline image/video/etc. jobs are async: POST returns a job_id, then
// GET {path}/status/{job_id} resolves to a result_url. Snippets show the public
// integration shape (X-API-Key); the in-app runner uses the Clerk bearer.
// ─────────────────────────────────────────────────────────────────────────────

export const IP_PUBLIC_BASE = "https://api.imagepipeline.io";

// Obvious placeholder so users (and the "use generated image" action) can tell
// which fields expect an image/audio URL.
export const IMG_PLACEHOLDER = "https://your-image-url/input.png";
const AUDIO_PLACEHOLDER = "https://your-audio-url/voice.wav";

export type OutputKind = "image" | "video" | "audio" | "model3d" | "json";

export type Feature = {
  id: string;
  label: string;
  category: string;
  blurb: string;
  path: string;
  output: OutputKind;
  imageFields: string[]; // request fields that take an image URL
  example: Record<string, unknown>;
  runnable?: boolean; // false → docs/snippet only (e.g. multipart upload)
};

export const FEATURES: Feature[] = [
  // ── Generate ────────────────────────────────────────────────────────────
  {
    id: "generate-image",
    label: "Generate image",
    category: "Generate",
    blurb: "Text-to-image generation.",
    path: "/generate/image/v1",
    output: "image",
    imageFields: [],
    example: {
      prompt: "A studio product photo of a glass perfume bottle on marble, soft daylight",
      height: 1024,
      width: 1024,
      num_inference_steps: 30,
      guidance_scale: 7.5,
      output_format: "webp",
    },
  },
  {
    id: "generate-video",
    label: "Generate video",
    category: "Generate",
    blurb: "Animate a still image into video.",
    path: "/generate/video/v1",
    output: "video",
    imageFields: ["input_image"],
    example: {
      input_image: IMG_PLACEHOLDER,
      prompt: "make this image come alive, cinematic motion, smooth animation",
      height: 512,
      width: 896,
      duration_seconds: 2,
    },
  },
  {
    id: "generate-speech",
    label: "Generate speech",
    category: "Generate",
    blurb: "Text-to-speech audio.",
    path: "/generate/speech/v1",
    output: "audio",
    imageFields: [],
    example: { text: "Hello from ImagePipeline.", language_id: "en" },
  },
  {
    id: "generate-3d",
    label: "Generate 3D",
    category: "Generate",
    blurb: "Turn an image into a 3D mesh.",
    path: "/generate/3d/v1",
    output: "model3d",
    imageFields: ["image_path"],
    example: { image_path: IMG_PLACEHOLDER, mode: "generate" },
  },

  // ── On-model & try-on ─────────────────────────────────────────────────────
  {
    id: "instamodel",
    label: "Instamodel",
    category: "On-model & try-on",
    blurb: "Put a face on a generated on-model shot.",
    path: "/creator/instamodel/image/v1",
    output: "image",
    imageFields: ["input_face"],
    example: {
      prompt: "On-model fashion photo, editorial studio lighting",
      input_face: IMG_PLACEHOLDER,
      height: 1024,
      width: 768,
      output_format: "webp",
    },
  },
  {
    id: "tryon",
    label: "Virtual try-on",
    category: "On-model & try-on",
    blurb: "Dress a person image in a garment.",
    path: "/creator/tryon/image/v1",
    output: "image",
    imageFields: ["person_image", "clothing_image"],
    example: {
      person_image: IMG_PLACEHOLDER,
      clothing_image: IMG_PLACEHOLDER,
      gender: "woman",
      height: 1248,
      width: 832,
      output_format: "webp",
    },
  },

  // ── Identity ──────────────────────────────────────────────────────────────
  {
    id: "faceswap",
    label: "Faceswap",
    category: "Identity",
    blurb: "Swap the face from a source into a target.",
    path: "/identity/faceswap/image/v1",
    output: "image",
    imageFields: ["target", "source"],
    example: { target: IMG_PLACEHOLDER, source: IMG_PLACEHOLDER, output_format: "webp" },
  },
  {
    id: "identity-lock",
    label: "Lock identity",
    category: "Identity",
    blurb: "Re-render keeping the same identity.",
    path: "/identity/lock/image/v1",
    output: "image",
    imageFields: ["input_image"],
    example: {
      input_image: IMG_PLACEHOLDER,
      prompt: "Same person, professional headshot, neutral background",
      output_format: "webp",
    },
  },
  {
    id: "identity-replace",
    label: "Replace identity",
    category: "Identity",
    blurb: "Replace the identity in an image.",
    path: "/identity/replace/image/v1",
    output: "image",
    imageFields: ["input_image"],
    example: {
      input_image: IMG_PLACEHOLDER,
      prompt: "Replace with a smiling professional in studio lighting",
      output_format: "webp",
    },
  },
  {
    id: "voice-clone",
    label: "Clone voice",
    category: "Identity",
    blurb: "Speak text in a cloned reference voice.",
    path: "/identity/voice/clone/v1",
    output: "audio",
    imageFields: [],
    example: {
      text: "This is my cloned voice.",
      reference_voice_url: AUDIO_PLACEHOLDER,
      language_id: "en",
    },
  },
  {
    id: "identity-profile",
    label: "Identity profile",
    category: "Identity",
    blurb: "Create a reusable identity profile.",
    path: "/profiles/v1",
    output: "json",
    imageFields: [],
    example: {
      name: "My brand model",
      description: "Editorial on-model look",
      prompt_template: "a photo of {subject}, studio lighting",
    },
  },

  // ── Edit & enhance ──────────────────────────────────────────────────────
  {
    id: "edit-image",
    label: "Edit image",
    category: "Edit & enhance",
    blurb: "Instruction-based image editing.",
    path: "/edit/image/v1",
    output: "image",
    imageFields: ["input_image"],
    example: {
      input_image: IMG_PLACEHOLDER,
      prompt: "Place the product on a sunlit kitchen counter",
      output_format: "webp",
    },
  },
  {
    id: "background-change",
    label: "Change background",
    category: "Edit & enhance",
    blurb: "Swap or relight the background.",
    path: "/background/change/image/v1",
    output: "image",
    imageFields: ["input_image"],
    example: {
      input_image: IMG_PLACEHOLDER,
      prompt: "Clean seamless white studio background",
      output_format: "webp",
    },
  },
  {
    id: "upscale",
    label: "Upscale image",
    category: "Edit & enhance",
    blurb: "Increase resolution and detail.",
    path: "/upscale/image/v1",
    output: "image",
    imageFields: ["input_image"],
    example: { input_image: IMG_PLACEHOLDER, output_format: "webp" },
  },

  // ── Branding ──────────────────────────────────────────────────────────────
  {
    id: "logo",
    label: "Generate logo",
    category: "Branding",
    blurb: "Generate a brand logo.",
    path: "/branding/logo/image/v1",
    output: "image",
    imageFields: [],
    example: {
      prompt: "A minimalist logo for a specialty coffee brand, monoline",
      output_format: "webp",
    },
  },
  {
    id: "branding-template",
    label: "Branding template",
    category: "Branding",
    blurb: "Generate a branded creative template.",
    path: "/branding/template/image/v1",
    output: "image",
    imageFields: [],
    example: {
      prompt: "Instagram post template for a summer sale, bold typography",
      output_format: "webp",
    },
  },

  // ── Upload (multipart — docs only) ─────────────────────────────────────────
  {
    id: "upload",
    label: "Upload image",
    category: "Upload",
    blurb: "Host a local file → get a URL to use as input.",
    path: "/upload/image/v1",
    output: "json",
    imageFields: [],
    runnable: false,
    example: { file: "@/path/to/image.png" },
  },
];

export const findFeature = (path: string) => FEATURES.find((f) => f.path === path);
export const isAllowedPath = (path: string) => FEATURES.some((f) => f.path === path);

// Endpoints that take an image as part of the payload (for the "send an image"
// helper + badges).
export const imageInputFeatures = () => FEATURES.filter((f) => f.imageFields.length > 0);

export const statusPath = (path: string, jobId: string) =>
  `${path}/status/${encodeURIComponent(jobId)}`;

// ── Code snippets ─────────────────────────────────────────────────────────
export type SnippetLang = "curl" | "javascript" | "python" | "java";
export const SNIPPET_LANGS: { id: SnippetLang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
];

export function snippet(lang: SnippetLang, feature: Feature, payload: unknown): string {
  const url = `${IP_PUBLIC_BASE}${feature.path}`;
  const json = JSON.stringify(payload, null, 2);

  // Multipart upload is shaped differently from the JSON endpoints.
  if (feature.id === "upload") {
    switch (lang) {
      case "curl":
        return `curl -X POST ${url} \\\n  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \\\n  -F "file=@/path/to/image.png"`;
      case "javascript":
        return `const form = new FormData();\nform.append("file", fileInput.files[0]);\n\nconst res = await fetch("${url}", {\n  method: "POST",\n  headers: { "X-API-Key": process.env.IMAGEPIPELINE_API_KEY },\n  body: form,\n});\nconst data = await res.json();`;
      case "python":
        return `import requests\n\nres = requests.post(\n    "${url}",\n    headers={"X-API-Key": API_KEY},\n    files={"file": open("image.png", "rb")},\n)\nprint(res.json())`;
      case "java":
        return `// Use a multipart request body (e.g. OkHttp MultipartBody) with field "file".`;
    }
  }

  switch (lang) {
    case "curl":
      return `curl -X POST ${url} \\\n  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload)}'`;
    case "javascript":
      return `const res = await fetch("${url}", {\n  method: "POST",\n  headers: {\n    "X-API-Key": process.env.IMAGEPIPELINE_API_KEY,\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify(${json}),\n});\nconst { job_id } = await res.json();\n\n// Poll until the job completes:\nconst status = await fetch(\n  \`${IP_PUBLIC_BASE}${feature.path}/status/\${job_id}\`,\n  { headers: { "X-API-Key": process.env.IMAGEPIPELINE_API_KEY } },\n).then((r) => r.json());\nconsole.log(status.result_url);`;
    case "python":
      return `import requests, time\n\nres = requests.post(\n    "${url}",\n    headers={"X-API-Key": API_KEY},\n    json=${pyDict(payload)},\n)\njob_id = res.json()["job_id"]\n\n# Poll until the job completes:\nwhile True:\n    status = requests.get(\n        f"${IP_PUBLIC_BASE}${feature.path}/status/{job_id}",\n        headers={"X-API-Key": API_KEY},\n    ).json()\n    if status["status"] in ("completed", "failed"):\n        break\n    time.sleep(2)\nprint(status["result_url"])`;
    case "java":
      return `HttpClient client = HttpClient.newHttpClient();\nHttpRequest req = HttpRequest.newBuilder()\n    .uri(URI.create("${url}"))\n    .header("X-API-Key", System.getenv("IMAGEPIPELINE_API_KEY"))\n    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString(\n        ${javaString(JSON.stringify(payload))}))\n    .build();\nHttpResponse<String> res = client.send(req, BodyHandlers.ofString());\n// res.body() contains { "job_id": ... } — then GET ${feature.path}/status/{job_id}`;
  }
}

// Render a JS/JSON value as a Python literal (true/false/null → True/False/None).
function pyDict(v: unknown): string {
  const json = JSON.stringify(v, null, 4);
  return json
    .replace(/: true\b/g, ": True")
    .replace(/: false\b/g, ": False")
    .replace(/: null\b/g, ": None");
}

function javaString(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
