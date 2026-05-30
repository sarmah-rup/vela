---
id: authentication
title: Authentication
sidebar_label: Authentication
---

# Authentication

Every request to ImagePipeline requires an **`X-API-Key`** header. Get your key from
the [dashboard](https://imagepipeline.io/dashboard).

```
X-API-Key: <your_api_key>
```

The security scheme, from the OpenAPI spec:

```yaml
securitySchemes:
  ApiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key
```

## Example

```bash
curl https://api.imagepipeline.io/health \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY"
```

## Handling keys safely

- Treat your API key as a secret, never commit it or ship it in client-side code.
- Store it in an environment variable:

```bash
export IMAGEPIPELINE_API_KEY="<your_api_key>"
```

- Rotate keys from the dashboard if one is exposed.

:::warning
A missing or invalid key is rejected. See [Errors](/reference/errors) for the full
error model and failure reason codes.
:::
