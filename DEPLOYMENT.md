# ONCOFRONTIER — Deployment Notes

## Current state — LIVE

The application is a Vite, React, and TypeScript single-page app, and it is
running publicly on Freebuff Sites (Cloudflare Workers), free tier:

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | https://site-003121db6e354dc9a774e4d106b499db.freebuff.page | Published |
| Preview | https://site-e116a2f11ddf473b8eeabf392fd8984e.freebuff.page | Published |

Verified over HTTP against the production URL: `200` for `/`, the JS/CSS
bundles, `robots.txt`, `sitemap.xml`, `sw.js`, `manifest.json` and every icon;
`text/html` / `text/javascript` / `text/css` content types correct; unknown
paths fall back to `index.html`; canonical, `robots.txt` and `sitemap.xml` all
point at the production origin; zero source maps and no Supabase key in the
bundle.

The build passes locally: typecheck 0 errors, lint 0 problems, full test suite
green, `npm run build` clean. The earlier `spawn EPERM` note referred to an old
Windows environment and no longer applies.

Also configured: Netlify build and SPA fallback (`npm run build` → `dist`) and
Cloudflare Pages (below).

## Repository layout

The application source now lives at the repository root (`src/`, `public/`,
`index.html`, `vite.config.ts`). The previous root contained only build output;
those files were preserved under `_archive/build-output/` along with the original
source ZIPs, and that folder is git-ignored. Build from the root.

`PUBLIC_SITE_URL` is required for a production build: the post-build step
(`scripts/sync-seo-origin.mjs`) rewrites canonical, Open Graph, `robots.txt` and
`sitemap.xml` to that origin and fails the build rather than publishing the wrong
host. Set it to the final HTTPS domain before building outside Netlify.

## Environment

Add these only in the hosting provider's private environment settings when account features are required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The browser uses only the public anon key. Never add a Supabase service-role key to frontend variables or the submission archive. Existing database migrations scope user tables to `auth.uid()`; verify policies against the actual Supabase project before release.

Companion AI secrets belong in Supabase Edge Function Secrets:

- `LLM_API_KEY` (required to enable the server-side AI path)
- `LLM_BASE_URL` (optional)
- `LLM_MODEL` (optional)

Without the LLM secret, the app reports that AI chat is not configured and falls back to public-source retrieval where possible. When configured, the AI endpoint verifies the caller's signed-in Supabase user. Guests retain public research retrieval. Application-level rate limiting is not implemented; set provider-side budgets/limits before enabling the AI path.

Image analysis, recorded-audio transcription, and speech fallback are separate user-started Puter features and may transmit selected content to that provider. Review and disclose current provider terms before enabling these workflows publicly.

## Netlify publishing

1. In Netlify, choose **Add new site → Import an existing project** and connect the GitHub repository containing this folder.
2. Select the production branch. The checked-in `netlify.toml` supplies `npm run build` and `dist`.
3. Add only the public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` if account features are needed. Put model-provider secrets in Supabase Edge Function Secrets, never in Netlify frontend variables.
4. Deploy. The build uses Netlify's site URL for canonical, social, `robots.txt`, and sitemap metadata. Set `PUBLIC_SITE_URL` to the final HTTPS custom domain after attaching it in Netlify. Outside Netlify, set `PUBLIC_SITE_URL` before building; the build stops instead of publishing incorrect host metadata when no public URL is configured.

The automatic GitHub workflow runs type checking, lint, tests, and production build on pushes and pull requests. It has not run from this local package yet. The Windows runner used for this repair denied the esbuild child process (`spawn EPERM`), so its tests and production build remain unverified until CI runs.

## Cloudflare Pages (chosen host)

The app is a static Vite build, so Cloudflare runs two commands and serves the
result. Nothing server-side is required for the app itself.

### 1. Push the source to GitHub

The Cloudflare project connects to a Git repository. Push this branch (or merge
it to `main` and push that) — never upload `dist/`, a ZIP, or build output.

### 2. Create the project

1. Cloudflare dashboard → **Workers & Pages → Create application → Pages →
   Connect to Git** → select the repository.
2. **Production branch:** the branch you pushed (or `main` if you merged).
3. **Build command:** `npm run build`
4. **Build output directory:** `dist`
5. **Node version:** `.nvmrc` pins Node 22 — set it in the build environment if
   the project default is older.

### 3. Environment variables (Settings → Environment variables → Production)

| Variable | Required | Value |
|----------|----------|-------|
| `PUBLIC_SITE_URL` | **Yes** | `https://<your-project>.pages.dev` (later `https://yourdomain.com`) |
| `VITE_SUPABASE_URL` | Only for accounts | your project URL (browser-safe) |
| `VITE_SUPABASE_ANON_KEY` | Only for accounts | your anon key (browser-safe) |

The build **fails on purpose** if `PUBLIC_SITE_URL` is missing — that is
`scripts/sync-seo-origin.mjs` refusing to publish canonical, `robots.txt` and
`sitemap.xml` pointing at the wrong host. Set it before the first build, and
again after you attach a custom domain.

Never add `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` or `LLM_API_KEY` to
Pages. Those belong in Supabase, not in a static host.

### 4. Deploy and verify

1. Deploy, then note the assigned URL (`https://<project>.pages.dev`).
2. Open it, refresh a deep link such as `/#/anatomy`, and use back/forward.
3. Confirm `/robots.txt` and `/sitemap.xml` show your final URL, not `localhost`.
4. Check the console for errors and the Network tab for failed requests.
5. Test sign-in and confirm one account cannot see another's saved records.

### 5. Custom `.com` later

**Workers & Pages → your project → Custom domains → Set up a custom domain**,
then point DNS (apex `A` to Cloudflare's target, `www` CNAME). Afterwards set
`PUBLIC_SITE_URL` to `https://yourdomain.com` and redeploy so SEO metadata and
the sitemap move to the real domain.

Cloudflare's free Pages allowance is 500 builds/month, one build at a time.
See [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) and
[custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Freebuff Sites (the host this repo is live on)

Sites deploys a prebuilt Worker plus static assets — no build step runs on the
platform, so build locally first (`npm run build`) and deploy the output.

Files involved:

- `worker.js` — entry point: `env.ASSETS.fetch(request)` serves the SPA.
- `freebuff.manifest.json` — `entrypoint`, `modules`, `assetsDirectory: "./dist"`,
  `spa: true` (unknown paths fall back to `index.html`).

Deploy sequence after any source change:

1. `PUBLIC_SITE_URL=<production-url> npm run build`
2. **`rm dist/_redirects`** — required, see below.
3. `sites_deploy` with the manifest path, one request id per intended change.
4. `sites_set_published` if the environment is offline.
5. Re-verify `/`, both bundles, `robots.txt` and `sitemap.xml` over HTTP.

### `rm dist/_redirects` is mandatory

Cloudflare rejects a file named `_redirects` in a Worker asset upload with
error code **100324**, stage `worker_upload`, HTTP 400. This was isolated by
bisection: deploys containing it failed, the same payload without it succeeded.

`public/_redirects` stays in the repository because Cloudflare **Pages** needs
it for its own SPA fallback. It only has to be removed from the `dist` that is
handed to `sites_deploy`, and a fresh build re-creates it — so strip it at
step 2 every time. `spa: true` in the manifest provides the equivalent
fallback on Sites.

### Environment variables on Sites

`PUBLIC_SITE_URL` is applied at **build** time, not deploy time — a rebuild is
what moves canonical/robots/sitemap to a new host. `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are the only frontend values needed for accounts, and
they must be present in the environment when `npm run build` runs.

The current live build has **no** Supabase values, so account features (sign-in,
saved favourites, per-user notes, companion chat) report their
"requires configuration" state rather than failing. The public browsing,
search, anatomy, legal and accessibility features all work.

## Getting found on Google

Submit this sitemap today (it is already live):
`https://site-003121db6e354dc9a774e4d106b499db.freebuff.page/sitemap.xml`

1. **Google Search Console** → Add property → verify with a DNS TXT record →
   submit the sitemap above (URL-prefix property works without DNS).
2. **Bing Webmaster Tools** → same verification and sitemap (Bing also feeds
   DuckDuckGo and Copilot).
3. Validate social cards with LinkedIn's and Twitter's card validators — the
   share image is `icon-512.png` unless a dedicated 1200×630 image is added.
4. Indexing usually takes days to weeks, and no one can guarantee a ranking.
5. Routes are hash-based (`/#/curemap`), so **only `/` is a crawlable URL**.
   Search engines will not index each module separately; the public homepage is
   what carries the description.

## Routes and search metadata

Routes use URL fragments such as `/#/dashboard`. `robots.txt` and the sitemap cover the public application root; fragment views are not separate crawlable paths. Authentication and row-level security protect private records. Robots rules are not an access-control mechanism.

Build-time metadata follows Netlify's configured public URL, or `PUBLIC_SITE_URL` when set. Search engines decide whether and where to index the site; sitemap submission is not a ranking guarantee. A custom `.com` requires a domain registered by the owner and attached in Netlify.

## Manual release checks

After a successful build and deployment:

1. Open the public URL, refresh a deep link, and check browser back/forward navigation.
2. Search a known cancer/gene query; inspect source links, query summary, relevance, and API errors.
3. Sign in with a safe test account; verify saved records and notes remain owner-scoped.
4. Test display presets, keyboard-only navigation, focus return, Arabic RTL, mobile layout, and PDF upload using a keyboard.
5. Test speech only with explicit permission and disclose any external audio/image processing.
6. Check the Edge Function with no LLM secret, an unauthenticated caller, an authenticated caller, and provider/network failure cases.

No screen-reader certification or independent WCAG audit has been performed. Browser/device speech support varies.

## Public-release blockers

The application does not include approved Privacy, Terms, Contact, or account-deletion pages. Obtain real policy text and a support contact before inviting public accounts or collecting personal research. Poster search, email alerts, PDF annotations/bookmarks, OCR for scanned files, and a complete 20-language interface are not implemented.

## Repository secret cleanup

If `.env` was pushed to a public GitHub repository, make the repository private while cleaning it up, remove `.env` from the repository, and rotate any credentials it contained. Deleting the file from the latest commit alone does not revoke credentials or erase older Git history. This source package excludes `.env`; the remote repository was not changed here.
