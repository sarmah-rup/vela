---
id: upscale
title: Upscale
sidebar_label: Upscale
---

# Upscale

Resolution upscaling and detail enhancement. Use it as the **final step** in almost any
[workflow](/concepts/workflows).

`POST /upscale/image/v1`, upscale `input_image` to the target `width` × `height`.

```bash
curl https://api.imagepipeline.io/upscale/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_image": "https://.../staged.webp",
    "width": 2048,
    "height": 2048,
    "output_format": "png"
  }'
```

| Field | Default | Notes |
| --- | --- | --- |
| `input_image` |, | Image to upscale. |
| `width` / `height` | `1024` | Target dimensions. |
| `output_format` | `webp` | `webp`, `jpeg`, or `png`. |
| `seed` | `-1` | Set for reproducibility. |
| `profile_id` |, | Apply an [identity profile](/concepts/profiles). |

Returns a `job_id`; poll `GET /upscale/image/v1/status/{job_id}` or use a
[webhook](/concepts/jobs#webhooks).
