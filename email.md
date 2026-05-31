# Email copy

All transactional + lifecycle email copy in one place for review. Source of truth
for sending lives in `lib/email/` (`sequence.ts`, `transactional.ts`, `layout.ts`).

**Conventions**
- Sender: `ImagePipeline <noreply@imagepipeline.io>`
- Brand-consistent monochrome layout (matches the site), wordmark header, footer.
- **No em dashes** anywhere in copy.
- Every onboarding email has a primary CTA + a secondary **Book a demo** link.
- Links use the app URL in env (production URL in prod). `{firstName}` is the
  user's first name (falls back to the email handle).

---

## Onboarding drip (Clerk `user.created` → scheduled via Resend, all within 30 days)

Triggered on sign-up: the contact is added to the Resend audience and all 8 emails
are scheduled at once by day-offset. Unsubscribing cancels the remaining sends.

### 0 · Welcome — day 0 (sent immediately)
**Subject:** Welcome to ImagePipeline
**Preheader:** Grab your API key and make your first call.
**Heading:** Welcome, {firstName}

> ImagePipeline is the image AI API for product and fashion commerce. On-model imagery, virtual try-on, background and relight, generation, and more, all from one key.
>
> Your dashboard is ready. Grab your API key, then run any endpoint right in the browser with Try now. Over the next few weeks we will show you one practical use case at a time.

**CTA:** Open your dashboard → `/dashboard` · **Secondary:** Book a demo

### 1 · Generate a product shot — day 1
**Subject:** Use case: generate a product shot
**Preheader:** One POST, then poll for the result URL.
**Heading:** Generate a product shot

> Say you need a clean studio shot of a product. Send one POST with a prompt and dimensions. You get back a job id.
>
> Poll the status endpoint until it returns a result_url. Every job on ImagePipeline works this same async way.

```
curl -X POST https://api.imagepipeline.io/generate/image/v1 \
  -H "X-API-Key: $IMAGEPIPELINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"studio photo of a perfume bottle on marble, soft daylight","width":1024,"height":1024}'

# then GET /generate/image/v1/status/{job_id} until result_url is set
```

**CTA:** Try it in the dashboard → `/dashboard` · **Secondary:** Book a demo

### 2 · Flat-lay to on-model — day 3
**Subject:** Use case: flat-lay to on-model
**Preheader:** Turn a flat-lay into a styled on-model photo.
**Heading:** Flat-lay to on-model, without a photoshoot

> Have a garment but no model shoot? Pass a face and a prompt to the instamodel endpoint and get a styled on-model image back.
>
> This is how catalogs go from sample to storefront in minutes instead of weeks.

```
POST /creator/instamodel/image/v1
{
  "prompt": "on-model editorial fashion photo, studio lighting",
  "input_face": "https://your-image-url/face.png",
  "height": 1024,
  "width": 768
}
```

**CTA:** See on-model use cases → `/use-cases` · **Secondary:** Book a demo

### 3 · Virtual try-on — day 5
**Subject:** Use case: virtual try-on
**Preheader:** Put any garment on any person, pixel accurate.
**Heading:** Drop a garment onto a model

> Virtual try-on takes a person image and a clothing image and renders the garment onto the person. Useful for PDP variants, size and color combinations, and ad creative.
>
> Two image inputs, one call.

```
POST /creator/tryon/image/v1
{
  "person_image": "https://your-image-url/person.png",
  "clothing_image": "https://your-image-url/garment.png",
  "gender": "woman"
}
```

**CTA:** Try virtual try-on → `/dashboard` · **Secondary:** Book a demo

### 4 · Swap and relight backgrounds — day 8
**Subject:** Use case: swap and relight backgrounds
**Preheader:** One product photo, many on-brand scenes.
**Heading:** Swap and relight the background

> Shoot a product once, then place it in any scene. Send the image and describe the background you want.
>
> Pair it with upscale to ship crisp, high-resolution variants for every channel.

```
POST /background/change/image/v1
{
  "input_image": "https://your-image-url/product.png",
  "prompt": "clean seamless white studio background"
}
```

**CTA:** Try the editing endpoints → `/dashboard` · **Secondary:** Book a demo

### 5 · Animate a hero image into video — day 12
**Subject:** Use case: animate a hero image into video
**Preheader:** Turn a still into short, on-brand motion.
**Heading:** Animate a still into video

> Give a still image and a motion prompt to get a short video back. Good for hero sections, social, and paid placements.
>
> Same async pattern: submit, then poll for the result_url.

```
POST /generate/video/v1
{
  "input_image": "https://your-image-url/hero.png",
  "prompt": "cinematic motion, smooth animation",
  "duration_seconds": 2
}
```

**CTA:** Explore the platform → `/platform` · **Secondary:** Book a demo

### 6 · One identity across a campaign — day 18
**Subject:** Use case: one identity across a campaign
**Preheader:** Keep the same face consistent everywhere.
**Heading:** Keep one identity across a campaign

> Create an identity profile once, then reference it across generations so the same model stays consistent through a whole campaign.
>
> Lock identity, faceswap, and replace are built on the same idea, with licensed output.

```
POST /profiles/v1
{
  "name": "Spring campaign model",
  "description": "editorial on-model look"
}
```

**CTA:** Read the developer guides → `/developers` · **Secondary:** Book a demo

### 7 · Ready to scale? — day 25
**Subject:** Ready to scale?
**Preheader:** More credits, higher limits, priority GPUs.
**Heading:** Ready to scale?

> If ImagePipeline is earning its place in your stack, scaling up gets you more credits, higher rate limits, and priority GPUs.
>
> Take a look at the plans and pick the one that fits your volume.

**CTA:** See plans → `/pricing` · **Secondary:** Book a demo

---

## Transactional

### Purchase confirmation (Stripe `checkout.session.completed`)
Sent once per purchase. No unsubscribe (transactional).

**Subject:** Thank you for your purchase, {Plan} is active
**Preheader:** Your {Plan} plan is active.
**Heading:** Thank you for your purchase

> Hi {firstName}, thanks for upgrading. Your {Plan} plan is now active and your new credits and rate limits are live.
>
> You can review usage, manage billing, and grab your API key from the dashboard at any time.

**CTA:** Open your dashboard → `/dashboard`
