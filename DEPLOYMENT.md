# ONCOFRONTIER — Deployment Notes

## Current state

The application is a Vite, React, and TypeScript single-page app. The user-provided Bolt URL loads, but source edits in this package are not automatically deployed there. The current source has not passed a production build in this Windows environment because Vite/esbuild cannot start its child process (`spawn EPERM`).

The project includes Netlify build and SPA-fallback configuration. Build command: `npm run build`; publish directory: `dist`.

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
