# silo

Static Astro site for silorecording.com, served by Cloudflare Workers as an
assets-only Worker (no server code). Build output in `dist/` is uploaded as-is.

## Setup

1. Node **22.23.4** (pinned in `mise.toml` and `.node-version`; `package.json`
   requires `>=22.23.4`). With mise: `mise install`.
2. Install dependencies: `npm ci` (or `mise run install`).
3. Start the dev server: see Development below. Site runs at http://localhost:4321.
4. Deploying needs a Cloudflare login once: `npx wrangler login`.

## Commands

| Task | npm | mise |
| --- | --- | --- |
| Dev server | `npm run dev` | `mise run dev` |
| Build to `dist/` | `npm run build` | `mise run build` |
| Preview build (Astro) | `npm run preview` | `mise run preview` |
| Serve build as Cloudflare will (headers, 404s) | `npm run serve` | `mise run serve` |
| Build and deploy | `npm run deploy` | `mise run deploy` |
| Remove `dist/` and `.astro/` | | `mise run clean` |

## Layout

- `src/pages/` – routes: `index.astro` (the homepage), `decamp.astro` (the DeCamp one-sheet), `404.astro`
- `src/layouts/Base.astro` – shared page shell
- `src/components/` – the homepage's parts: `TopBar`, `Masthead` (SILO title and banner), `Mycelium` (the network drawing; one SVG per layout in `MyceliumNet`), `SiloDetail` (a silo's page beside the drawing), `Panels` (the About panel), `SocialIcon`
- `src/data/catalog.ts` – site content (label info, pillars and items, social accounts, DeCamp one-sheet lists); edit this to change what's listed
- `src/lib/` – build-time code: `mycelium.ts` (grows the network), `mycelium-layouts.ts` (wide and tall drawings), `usmap.ts` (US map paths), `links.ts` (markup helpers)
- `src/scripts/` – browser code shared between components: `mycelium.ts`, `reveal.ts` (motion and keyboard helpers), `signup.ts` (email forms)
- `src/styles/silo.css` – global styles: tokens (`--accent`, pillar colours), the panel title and sign-up row
- `src/assets/` – images processed by Astro at build time (output in `/_astro/`, hashed)
- `public/` – copied verbatim into `dist/`: `_headers` (security and cache headers), `favicon.svg`, `fonts/`, `silo/` (marks and grain)
- `astro.config.mjs` – Astro config, including the Content-Security-Policy
- `wrangler.jsonc` – Worker config: custom domains, no workers.dev or preview URLs

## Constraints

- **CSP is strict.** Astro hashes its own scripts and styles into a CSP `<meta>`;
  everything else is `'self'` only. No third-party fonts, images, scripts or
  frames. The only exceptions are Cloudflare Web Analytics (`static.cloudflareinsights.com`
  and `cloudflareinsights.com`). Add any new origin to `astro.config.mjs`, and keep
  `public/_headers` consistent with it.
- Syntax highlighting is off on purpose (Shiki's inline styles would break the CSP).
- Files in `public/fonts/` and `/_astro/` are served `immutable`; rename a font file if it changes. `public/silo/` is cached for a day.
- Inline scripts aren't hashed by Astro: render them from a string and add the hash with `Astro.csp.insertScriptHash` (see `Mycelium.astro`).
- Keep the Node version in `mise.toml` and `.node-version` in sync (Cloudflare Workers Builds reads `.node-version`).
- Never commit secrets: `.env*` and `.dev.vars*` are gitignored.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
