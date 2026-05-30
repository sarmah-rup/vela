---
id: generate
title: Generate
sidebar_label: Generate
---

# Generate

Text-to-image, image-to-video, text-to-speech, and image-to-3D generation. Use Generate
as the **starting point** for most [workflows](/concepts/workflows).

## Text → Image

`POST /generate/image/v1`, only `prompt` is required.

```bash
curl https://api.imagepipeline.io/generate/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a person in a red jacket on a rooftop at golden hour",
    "width": 1024,
    "height": 1024,
    "output_format": "webp"
  }'
```

![Example 1024×1024 result generated from a text prompt](/img/examples/model-1.avif)

| Field | Default | Notes |
| --- | --- | --- |
| `prompt` |, | **Required.** |
| `width` / `height` | `1024` | Output dimensions. |
| `num_inference_steps` | model | More steps = more detail, slower. |
| `guidance_scale` | model | How strictly to follow the prompt. |
| `seed` | `-1` | `-1` randomizes; set a value for reproducibility. |
| `output_format` | `webp` | `webp`, `jpeg`, or `png`. |
| `palette` |, | Constrain output to brand colors. |
| `profile_id` |, | Apply an [identity profile](/concepts/profiles). |
| `callback_url` |, | Receive a [webhook](/concepts/jobs#webhooks). |

## Image → Video

`POST /generate/video/v1`, animate a still image (`input_image` required).

```json
{
  "input_image": "https://.../still.webp",
  "prompt": "make this image come alive, cinematic motion",
  "duration_seconds": 2.0,
  "width": 896,
  "height": 512
}
```

## Text → Speech

`POST /generate/speech/v1`, synthesize speech from `text`.

```json
{ "text": "Welcome to ImagePipeline.", "language_id": "en", "exaggeration": 0.5 }
```

## Image → 3D

`POST /generate/3d/v1`, turn an image into a 3D mesh (`image_path` required).

```json
{ "image_path": "https://.../object.webp", "mode": "generate" }
```

Each endpoint has a matching `…/status/{job_id}` route, see [Jobs](/concepts/jobs)
and the full [API Reference](/api/).
