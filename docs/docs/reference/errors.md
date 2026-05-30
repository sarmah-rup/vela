---
id: errors
title: Errors
sidebar_label: Errors
---

# Errors

ImagePipeline uses conventional HTTP status codes and returns structured error
information. Validation problems are reported synchronously; runtime problems surface on
the [job](/concepts/jobs) as a terminal `failed` status.

## Validation errors

A malformed request returns `422 Unprocessable Entity` with an `HTTPValidationError`
body that pinpoints the offending field:

```json
{
  "detail": [
    {
      "loc": ["body", "prompt"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Job failures

When a job fails, the `JobStatusResponse` (and the `failed` [webhook](/concepts/jobs#webhooks))
carry a human-readable `error`, a machine-readable `failure_reason_code`, and a
`retryable` flag.

```json
{
  "job_id": "job_a1b2c3",
  "status": "failed",
  "error": "Prompt rejected by content policy.",
  "failure_reason_code": "INPUT_INVALID",
  "retryable": false
}
```

## Failure reason codes

| Code | Retryable | Meaning |
| --- | --- | --- |
| `RATE_LIMIT_EXCEEDED` | ✅ | Too many requests — back off and retry. |
| `CONCURRENT_JOBS_EXCEEDED` | ✅ | Too many in-flight jobs for your plan. |
| `INSUFFICIENT_CREDITS` | ❌ | Top up credits in the dashboard. |
| `CREDIT_CHARGE_FAILED` | ❌ | Billing could not be completed. |
| `INPUT_INVALID` | ❌ | Bad input or content-policy violation. |
| `MODEL_ERROR` | ✅ | The model failed on this input. |
| `MODEL_UNAVAILABLE` | ✅ | The model is temporarily unavailable. |
| `STORAGE_ERROR` | ✅ | Result could not be stored. |
| `TIMEOUT` | ✅ | The job exceeded its time budget. |
| `INTERNAL_ERROR` | ✅ | Something went wrong on our side. |
| `CANCELLED` | — | The job was cancelled. |

## Retry guidance

- **Retryable codes:** retry with exponential backoff and jitter.
- **`RATE_LIMIT_EXCEEDED` / `CONCURRENT_JOBS_EXCEEDED`:** slow down and reduce concurrency.
- **Non-retryable codes:** fix the input or your account state — retrying won't help.

```bash
# exponential backoff on a retryable failure
for attempt in 1 2 3 4 5; do
  resp=$(curl -s https://api.imagepipeline.io/generate/image/v1/status/$JOB_ID \
    -H "X-API-Key: $IMAGEPIPELINE_API_KEY")
  echo "$resp" | grep -q '"status": "completed"' && break
  echo "$resp" | grep -q '"retryable": false' && { echo "giving up"; break; }
  sleep $((2 ** attempt))
done
```
