---
id: jobs
title: Jobs & Webhooks
sidebar_label: Jobs & Webhooks
---

# Jobs & Webhooks

All compute endpoints in ImagePipeline are **asynchronous**. A request returns
immediately with a `job_id` and `status: queued`; you retrieve the result by polling or
via a webhook.

## The job lifecycle

![The ImagePipeline job lifecycle: queued, pending, processing, then completed or failed/cancelled](/img/diagrams/job-lifecycle.svg)

`status` is one of: `queued`, `pending`, `processing`, `completed`, `failed`, `cancelled`.

## The queued response

Every compute `POST` returns a `JobQueuedResponse`:

```json
{
  "job_id": "job_a1b2c3",
  "status": "queued",
  "endpoint": "/generate/image/v1",
  "estimated_time_seconds": 8,
  "queued_at": "2026-05-30T12:00:00Z"
}
```

## Option A, Poll

Each compute endpoint has a matching status endpoint:
`GET /{endpoint}/status/{job_id}`. Poll it until `status` is terminal.

```bash
curl https://api.imagepipeline.io/generate/image/v1/status/job_a1b2c3 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY"
```

The `JobStatusResponse` carries progress, timing, credits, and, on success, the
result:

```json
{
  "job_id": "job_a1b2c3",
  "status": "completed",
  "progress": 100,
  "result_url": "https://cdn.imagepipeline.io/...signed...",
  "result_mime_type": "image/webp",
  "queue_wait_seconds": 1.1,
  "inference_time_seconds": 6.2,
  "total_elapsed_seconds": 7.3,
  "credits_charged": true,
  "credits_amount": 1
}
```

On failure you get an `error`, a machine-readable `failure_reason_code`, and a
`retryable` flag, see [Errors](/reference/errors).

:::tip
Use polling for development. Poll at a sensible interval (e.g. every 1–2s) rather than
in a tight loop.
:::

## Option B, Webhooks {#webhooks}

Pass a `callback_url` in any compute request body and ImagePipeline `POST`s a
`WebhookEvent` to it when the job reaches a terminal state. **Recommended for production.**

```json
{
  "job_id": "job_a1b2c3",
  "user_id": "usr_123",
  "status": "completed",
  "result_url": "https://cdn.imagepipeline.io/...signed...",
  "result_mime_type": "image/webp",
  "result_size_bytes": 184320,
  "timestamp": 1769774400
}
```

`status` in a webhook is always `completed` or `failed`. Retrieve the canonical schema
any time:

```bash
curl https://api.imagepipeline.io/webhooks/event-schema \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY"
```

## Result URL lifecycle

:::warning Result URLs expire within 24 hours
`result_url` is a **temporary pre-signed download link**. Download and store the file in
your own storage immediately after the job completes, do not persist the URL itself, it
will stop working.
:::

Some webhook payloads can also include `result_base64` for small assets, avoiding a
second download round-trip.
