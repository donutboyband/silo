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

The code is organized as feature slices, in three layers. Imports go one way:
`pages` → `views` → `features` → `shared`. Features don't import each other;
a view composes them (for example, `Home` puts `SiloDetail` inside the
drawing's `FocusPanel`). Aliases: `@views/*`, `@features/*`, `@shared/*`.

- `src/pages/` – routes only, each a line or two:
  - `index.astro` – `/`
  - `[silo].astro` – `/recording/`, `/decamp/`, `/creators/`, `/label/`: the homepage with that silo in focus
  - `decamp/one-sheet.astro` – `/decamp/one-sheet/`
  - `404.astro`
- `src/views/` – whole pages built from features: `home/Home.astro`, `decamp-one-sheet/` (with its images)
- `src/features/` – one folder per feature, with an `index.ts` as its public API:
  - `mycelium/` – the network drawing: components, `mycelium.client.ts` (browser code, including the URL handling), `lib/` (build-time network, layouts, US map)
  - `silo-detail/` – a silo's page beside the drawing
  - `about/` – the About panel
  - `top-bar/` – social menus, Subscribe, Contact
  - `masthead/` – the title and news banner
- `src/shared/` – used by several features:
  - `content/catalog.ts` – site content (the main name, label info, pillars and items, social accounts, DeCamp one-sheet lists); edit this to change what's listed
  - `content/routes.ts` – every URL and page title
  - `content/social-menus.ts`
  - `layouts/Base.astro` – the page shell
  - `styles/silo.css` – global styles and tokens (`--accent`, pillar colours)
  - `lib/` – `links.ts` (markup helpers), `reveal.ts` (motion and keyboard helpers)
  - `ui/` – `SocialIcon`, `signup/` (the email row and its handler)
- `public/` – copied verbatim into `dist/`: `_headers` (security and cache headers), `favicon.svg`, `fonts/`, `silo/` (marks and grain)
- `astro.config.mjs` – Astro config, including the Content-Security-Policy
- `wrangler.jsonc` – Worker config: custom domains, no workers.dev or preview URLs

## Routing

Astro's file routes, all built as static HTML. Each silo URL is its own page
with that silo already open, so it works on a direct load and without JS. On
the homepage, opening or closing a silo changes the URL and title through the
History API (`mycelium.client.ts`), and Back and Forward work without a
reload. Page-to-page navigation cross-fades with CSS view transitions.
Astro's `<ClientRouter />` isn't used: it swaps pages in without applying each
page's CSP. Links use the trailing-slash form Cloudflare serves (`/decamp/`).

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
