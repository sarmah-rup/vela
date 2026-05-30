---
id: background
title: Background
sidebar_label: Background
---

# Background

Background replacement and relighting. Works on any image — generated or uploaded.

`POST /background/change/image/v1` — replace the background of `input_image`, described
by `prompt`.

```bash
curl https://api.imagepipeline.io/background/change/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_image": "https://.../product.webp",
    "prompt": "on a sunlit marble kitchen counter",
    "output_format": "webp"
  }'
```

Commonly used mid-[workflow](/concepts/workflows) — for example
**Generate → Background → Upscale** to stage a product shot, then sharpen it.

Returns a `job_id`; poll `GET /background/change/image/v1/status/{job_id}` or use a
[webhook](/concepts/jobs#webhooks).
