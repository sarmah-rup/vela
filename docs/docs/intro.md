---
id: intro
title: Introduction
sidebar_label: Introduction
---

# ImagePipeline

**Identity generation API for developers and product teams.**

ImagePipeline lets you **generate, preserve, swap, and animate real people** using
open-source models. Every endpoint is an independent primitive that composes freely
into full content workflows.

![ImagePipeline generation console](/img/hero-console.svg)

```
Base path   /<resource>/v1
Auth        X-API-Key: <your_api_key>
Format      flat JSON — no nested "payload" wrapper
Jobs        asynchronous — poll or receive a webhook
```

## What you can build

| Area | Endpoints |
| --- | --- |
| **[Generate](/capabilities/generate)** | Text-to-image, image-to-video, text-to-speech, image-to-3D |
| **[Identity](/capabilities/identity)** | Faceswap, identity lock, identity replace, instamodel, virtual try-on, voice clone |
| **[Editing](/capabilities/editing)** | Instruction-based image editing in natural language |
| **[Background](/capabilities/background)** | Background replacement and relighting |
| **[Branding](/capabilities/branding)** | Logo generation and branded templates |
| **[Upscale](/capabilities/upscale)** | Resolution upscaling and detail enhancement |

## How it works

1. **Authenticate** every request with an [`X-API-Key`](/authentication) header.
2. **Call a compute endpoint** — it returns immediately with a `job_id` and
   `status: queued`. See [Jobs & Webhooks](/concepts/jobs).
3. **Get the result** by polling the status endpoint or receiving a
   [webhook](/concepts/jobs#webhooks).
4. **Download the file immediately** — `result_url` is a temporary pre-signed link that
   [expires within 24 hours](/concepts/jobs#result-url-lifecycle).

## Where to go next

- **[Quickstart](/quickstart)** — generate your first image in a few minutes.
- **[Composable Workflows](/concepts/workflows)** — chain primitives into pipelines.
- **[API Reference](/api/)** — the complete reference, generated from the OpenAPI spec.

:::tip Compliance built in
All outputs embed **C2PA provenance metadata** satisfying EU AI Act Article 50.
ImagePipeline processes media ephemerally — see [Compliance](/reference/compliance).
:::
