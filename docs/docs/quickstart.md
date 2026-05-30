---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
---

# Quickstart

Generate your first image in a few minutes. You'll need an API key from the
[dashboard](https://imagepipeline.io/dashboard), see [Authentication](/authentication).

```bash
export IMAGEPIPELINE_API_KEY="<your_api_key>"
```

## 1. Submit a generation job

Compute endpoints are **asynchronous**. They accept flat JSON and return immediately
with a `job_id`.

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

```json
{
  "job_id": "job_a1b2c3",
  "status": "queued",
  "endpoint": "/generate/image/v1",
  "estimated_time_seconds": 8,
  "queued_at": "2026-05-30T12:00:00Z"
}
```

## 2. Poll for the result

Call the matching status endpoint until `status` is `completed` or `failed`.

```bash
curl https://api.imagepipeline.io/generate/image/v1/status/job_a1b2c3 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY"
```

```json
{
  "job_id": "job_a1b2c3",
  "status": "completed",
  "progress": 100,
  "result_url": "https://cdn.imagepipeline.io/...signed...",
  "result_mime_type": "image/webp",
  "inference_time_seconds": 6.2,
  "credits_charged": true
}
```

## 3. Download immediately

```bash
curl -o output.webp "<result_url>"
```

:::warning Result URLs expire
`result_url` is a temporary pre-signed link that **expires within 24 hours**. Download
and store the file in your own storage right away, don't persist the URL.
:::

## Prefer webhooks in production

Instead of polling, pass a `callback_url` and ImagePipeline will `POST` a
[`WebhookEvent`](/concepts/jobs#webhooks) when the job finishes:

```bash
curl https://api.imagepipeline.io/generate/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "prompt": "a serene mountain lake", "callback_url": "https://yourserver.com/webhook" }'
```

## Next steps

- Explore every [capability](/capabilities/generate).
- Learn the [job lifecycle](/concepts/jobs).
- Lock a face into a reusable [identity profile](/concepts/profiles).
