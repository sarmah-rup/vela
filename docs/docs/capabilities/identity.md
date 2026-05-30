---
id: identity
title: Identity
sidebar_label: Identity
---

# Identity

Core identity primitives: face swap, identity lock, identity replace, instamodel,
virtual try-on, and voice clone. Pair any of these with an
[identity profile](/concepts/profiles) for consistent results.

## Faceswap

`POST /identity/faceswap/image/v1`, swap the `source` face onto the `target` image.

```bash
curl https://api.imagepipeline.io/identity/faceswap/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://.../scene.webp",
    "source": "https://.../face.webp",
    "upscale": 1.5,
    "restore_weight": 0.5
  }'
```

## Identity Lock

`POST /identity/lock/image/v1`, generate a new image that **preserves** a person's
identity from `input_image`, guided by `prompt`.

```json
{ "input_image": "https://.../face.webp", "prompt": "as a firefighter, photoreal" }
```

## Identity Replace

`POST /identity/replace/image/v1`, replace the identity in an existing image while
keeping pose and composition.

## Instamodel

`POST /creator/instamodel/image/v1`, generate social-ready model shots from a single
`input_face` and a `prompt`.

```json
{ "input_face": "https://.../face.webp", "prompt": "streetwear lookbook, urban backdrop" }
```

## Virtual Try-On

`POST /creator/tryon/image/v1`, dress a `person_image` in a `clothing_image`.

```json
{
  "person_image": "https://.../person.webp",
  "clothing_image": "https://.../jacket.webp",
  "gender": "woman"
}
```

<div className="ba-grid">
  <figure>
    <img src="/docs/img/examples/tryon-flat.avif" alt="Garment flat lay" />
    <figcaption>Input, garment flat lay</figcaption>
  </figure>
  <figure>
    <img src="/docs/img/examples/tryon-model.avif" alt="On-model render" />
    <figcaption>Output, on-model render</figcaption>
  </figure>
</div>

## Voice Clone

`POST /identity/voice/clone/v1`, clone a voice from `reference_voice_url` and speak
`text`. Outputs are watermarked by default.

```json
{ "text": "Hello from my cloned voice.", "reference_voice_url": "https://.../sample.wav" }
```

Every endpoint returns a `job_id` and has a matching `…/status/{job_id}` route, see
[Jobs](/concepts/jobs).
