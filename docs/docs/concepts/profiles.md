---
id: profiles
title: Identity Profiles
sidebar_label: Identity Profiles
---

# Identity Profiles

An **identity profile** is a named, reusable configuration snapshot — generation
defaults plus an adapter config — that you can pass to any identity endpoint via
`profile_id`. Create it once, reference it everywhere.

:::tip Zero data retention
ImagePipeline **never stores face images**. A profile's storage config is a *pointer to
your own bucket* — the API never accesses it, and your encryption key is never sent to or
stored by the API.
:::

## Create a profile

Only `name` is required. You can pin generation defaults (prompt template, steps, CFG
scale, seed strategy, dimensions, palette) so every run is consistent.

```bash
curl https://api.imagepipeline.io/profiles/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spokesperson — Maya",
    "description": "Brand spokesperson identity",
    "tags": ["brand", "spokesperson"],
    "prompt_template": ", studio lighting, editorial photography",
    "prompt_template_mode": "suffix",
    "seed_strategy": "fixed",
    "fixed_seed": 42
  }'
```

## Use a profile

Pass `profile_id` to identity, generation, try-on, edit, or upscale endpoints to apply
the snapshot:

```json
{ "prompt": "Maya presenting at a conference", "profile_id": "prof_123" }
```

## Manage profiles

| Operation | Endpoint |
| --- | --- |
| Create | `POST /profiles/v1` |
| List | `GET /profiles/v1` |
| Get | `GET /profiles/v1/{profile_id}` |
| Update | `PATCH /profiles/v1/{profile_id}` |
| Delete | `DELETE /profiles/v1/{profile_id}` |

See the [API Reference](/api/) for the full `IdentityProfileCreate` schema.
