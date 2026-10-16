# ONCOFRONTIER — Project Status

## Current release

ONCOFRONTIER is a Vite + React + TypeScript application. It builds to `dist/` and is deployable from a clean GitHub checkout on standard static hosts. `netlify.toml` configures Netlify build and client-side route fallback; `public/_redirects` is copied into the production output.

## Scientific sources

The application calls public, key-free APIs directly from the browser:

- PubMed / NCBI E-utilities
- Europe PMC
- ClinicalTrials.gov API v2
- Open Targets Platform GraphQL API
- PubChem REST API

All five APIs returned successful test responses during this release verification, and the API responses allow browser cross-origin requests. Dashboard links now open each provider's valid public landing/search page instead of an API root that returns 404. API failures remain visible in the research screens rather than being replaced with fabricated records.

## Authentication and data

Supabase remains the independently managed database and authentication provider. The existing migration defines `search_history`, `favorites`, `projects`, `project_items`, and `notes` with authenticated row-level ownership policies.

The frontend now treats Supabase as optional for public deployments: without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, guests can still use all public research features and private account actions show a clear configuration message. Existing Supabase data and accounts are not altered or migrated by this release.

## Bolt dependency classification

- `.bolt/config.json`: editor/template metadata only; not imported by the application or production build.
- Supabase credentials: backend service configuration, not a Bolt runtime dependency.
- Public scientific APIs: independent external services; no Bolt proxy is used.
- Vite, React, TypeScript, Tailwind, and Supabase client: standard project dependencies.

No application runtime code requires a Bolt editor session or Bolt hosting URL.

## Verification

- Public API checks: PubMed, Europe PMC, ClinicalTrials.gov, Open Targets, and PubChem returned HTTP 200 for representative requests.
- CORS checks: all five endpoints allowed browser requests from a local origin.
- TypeScript typecheck: passed.
- ESLint: passed with the existing two react-refresh warnings and no errors.
- Production build: passed.
- Secret safety: `.env` is ignored; `.env.example` contains placeholders only.

## Remaining setup

To enable sign-in, favorites, and search history on an independent host, add the existing Supabase project URL and anon key as host environment variables. No database reset, account migration, or destructive backend change was performed. Email alerts, server-side API proxying, and full project management remain outside the implemented release.
