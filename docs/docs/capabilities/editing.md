---
id: editing
title: Editing
sidebar_label: Editing
---

# Editing

Instruction-based image editing via natural-language prompts. Change scenes, swap
objects, and adjust composition without masks.

`POST /edit/image/v1`, edit `input_image` according to `prompt`.

```bash
curl https://api.imagepipeline.io/edit/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_image": "https://.../photo.webp",
    "prompt": "change the jacket to navy blue and add soft rim lighting",
    "faster_inference": true
  }'
```

| Field | Default | Notes |
| --- | --- | --- |
| `prompt` |, | **Required.** The edit instruction. |
| `input_image` |, | Image to edit. |
| `mode` |, | Optional editing mode. |
| `refine_strength` |, | How aggressively to apply the edit. |
| `faster_inference` | `true` | Trade a little quality for speed. |
| `output_format` | `webp` | `webp`, `jpeg`, or `png`. |
| `seed` | `-1` | Set for reproducibility. |

Returns a `job_id`; poll `GET /edit/image/v1/status/{job_id}` or use a
[webhook](/concepts/jobs#webhooks).
