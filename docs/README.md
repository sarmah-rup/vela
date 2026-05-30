# ImagePipeline Docs

Documentation site for the **ImagePipeline** API — an identity generation API for
developers and product teams (generate, preserve, swap, and animate real people).

Built with [Docusaurus](https://docusaurus.io/) and themed to match the **Vela** app
design language (indigo `#5b5bd6`, Geist typography, dark code surfaces, 96px section
rhythm, generous whitespace — see `../app/globals.css`).

The API reference is generated **per endpoint** from the OpenAPI spec
(`api/vela-openapi.json`) using
[`docusaurus-plugin-openapi-docs`](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs)
+ `docusaurus-theme-openapi-docs`, which renders an interactive **"Try it"** request
console on every endpoint page.

## Develop

```bash
npm install --legacy-peer-deps   # theme pins an older Docusaurus peer range
npm run gen-api                  # generate docs/api/*.mdx from the OpenAPI spec
npm start                        # dev server at http://localhost:3000
```

> Run `npm run gen-api` once after install (and whenever the spec changes). It writes
> the per-endpoint MDX pages and `docs/api/sidebar.ts`, which `sidebars.ts` imports.

## Build

```bash
npm run gen-api && npm run build   # static output in ./build
npm run serve                      # preview the production build
```

`npm run clean-api` removes the generated API pages.

## Structure

```
docs/
  intro, quickstart, authentication      Getting started
  concepts/                              Jobs & webhooks, identity profiles, workflows
  capabilities/                          Generate, identity, editing, background, branding, upscale
  reference/                             Errors, compliance
  api/                                   GENERATED per-endpoint pages + sidebar.ts (gitignored)
api/vela-openapi.json                    Source OpenAPI spec
src/pages/index.tsx                      Themed landing page (hero console, capability cards, workflow band)
src/css/custom.css                       Vela design tokens mapped onto Docusaurus/Infima
static/img/                              Logo, favicon, social card, hero console, capability icons, diagrams
```

## Design provenance

Visual system lifted from the Vela app: Vela Indigo (`#5b5bd6`), glow (`#a5a5f5`),
ink (`#0a0a0f`), slate code surfaces, Geist Sans/Mono, tight heading tracking, 8/12px
radii, 96px section rhythm. The product *content* comes from the ImagePipeline OpenAPI
spec; the API method chips, "Try it" console, and code samples are themed to match.

This project lives inside `vela-site/` but is fully self-contained — it is excluded from
the Next.js app's `tsconfig.json` and `eslint.config.mjs`, and ignored via
`docs/.gitignore`.
