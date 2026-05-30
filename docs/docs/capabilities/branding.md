---
id: branding
title: Branding
sidebar_label: Branding
---

# Branding

Logo generation and branded template creation. Inject brand colors and style rules via
the `palette` and `logo_url` fields.

## Generate a logo

`POST /branding/logo/image/v1`, generate a logo from `prompt`.

```bash
curl https://api.imagepipeline.io/branding/logo/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "minimal geometric mark for a developer tools company",
    "palette": ["#5b5bd6", "#0a0a0f"],
    "width": 1024,
    "height": 1024
  }'
```

## Generate a branded template

`POST /branding/template/image/v1`, generate a branded layout/template from `prompt`,
honoring your `palette`.

```json
{ "prompt": "social announcement card with headline space", "palette": ["#5b5bd6", "#a5a5f5"] }
```

Both return a `job_id` with matching `…/status/{job_id}` routes. Pass an existing
`logo_url` to incorporate your real mark.
