---
id: workflows
title: Composable Workflows
sidebar_label: Composable Workflows
---

# Composable Workflows

Every ImagePipeline endpoint is an **independent primitive**. They share the same
async [job model](/concepts/jobs) and accept each other's `result_url` as input, so
you can chain them in any order.

![A composable workflow: Generate, then Background, then Upscale, each passing its result_url to the next](/img/diagrams/workflow-chain.svg)

## Common pipelines

| Workflow | Steps |
| --- | --- |
| **Identity** | Generate → Lock → Try-on → Animate |
| **Content** | Generate → Faceswap → Background → Upscale |
| **Brand** | Generate → Background → Branding → Upscale |

## Chaining pattern

Each step waits for the previous job to complete, then feeds its `result_url` into the
next request.

```python
import os, time, requests

API = "https://api.imagepipeline.io"
H = {"X-API-Key": os.environ["IMAGEPIPELINE_API_KEY"]}

def run(endpoint, body):
    job = requests.post(f"{API}/{endpoint}", json=body, headers=H).json()
    jid = job["job_id"]
    while True:
        s = requests.get(f"{API}/{endpoint}/status/{jid}", headers=H).json()
        if s["status"] in ("completed", "failed", "cancelled"):
            if s["status"] != "completed":
                raise RuntimeError(s.get("error", s["status"]))
            return s["result_url"]
        time.sleep(1.5)

# Generate → Background → Upscale
img   = run("generate/image/v1",        {"prompt": "product on a plain table"})
staged = run("background/change/image/v1", {"input_image": img, "prompt": "marble kitchen counter"})
final = run("upscale/image/v1",         {"input_image": staged, "width": 2048, "height": 2048})
print(final)
```

:::tip
For long chains in production, use [webhooks](/concepts/jobs#webhooks) and a small
state machine instead of blocking polls, each step kicks off the next on callback.
:::
