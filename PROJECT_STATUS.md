# ONCOFRONTIER — Release Verification

Checked: 2026-10-29. This supersedes the 2026-10-20 report, whose "BLOCKED"
rows were caused by a Windows `spawn EPERM` esbuild failure and do not apply to
this environment.

## Repository state found

- The repository root contained **build output, not source**: `index-DXo83J1d.js`,
  `index-Bktchn_t.css`, `pdf-*.js`, `pdf.worker.min-*`, and a duplicate root
  `_redirects` sat alongside `package.json` and `index.html`. There was no `src/`.
- The complete source existed only inside
  `OncoFrontiers_Cloudflare_Pages_Source_v3.zip` (108 files). `v2` is the same
  archive minus `src/test/clinicaltrials.test.ts`, so `v3` is authoritative.
- That build output has been moved to `_archive/build-output/` and the v3 source
  promoted to the repository root. Nothing was deleted; both ZIPs remain.
- Atlas anatomy was **not** missing: `src/pages/CancerAnatomy.tsx` (468 lines)
  exists, is routed as `#/anatomy`, and is listed in the sidebar. It is now also
  covered by a render test.

## Verification matrix

| Area | Status | Evidence / limitation |
|---|---|---|
| Archive integrity | PASS | `unzip -t`: no errors, 108/108 files extracted. |
| Source completeness | PASS | 36 `.tsx` + 36 `.ts`; 19,693 lines TS/TSX; zero compiled bundles under `src/`. |
| Dependency install | PASS | `npm ci` from the committed lockfile, no lockfile change. |
| TypeScript | PASS | `npm run typecheck` — 0 errors. |
| ESLint | PASS | `npm run lint` — 0 errors, 0 warnings. |
| Unit tests | PASS | `npm test` — 27/27 across 5 files. |
| Production build | PASS | `npm run build` succeeds (~6.4s) incl. SEO post-build step. |
| Dev server | PASS | `vite` starts and serves `index.html` (see notes below). |
| Atlas anatomy | PASS | `CancerAnatomy` renders organ/system content; asserted in `src/test/atlas.test.tsx`. |
| Public homepage | PASS | `#/home` renders hero, capabilities, steps, both CTAs, without auth. Asserted in tests. |
| Onboarding | PASS | 5 steps; role + density persisted to `oncofrontier-experience`; finish routes to the role's start module. Asserted in tests. |
| Accessibility choices in onboarding | PASS | Selecting "Larger text" applies `a11y-large-text` to `<html>` (asserted). |
| Role-aware navigation | PASS | Sidebar orders role modules first; others remain under "All modules". |
| Localization (en/fr/ar) | PASS (unit) | New landing/onboarding strings exist for en/fr/ar with English fallback for other locales; parity asserted. |
| Localization (full UI) | PARTIAL | en/fr/ar remain the only complete interfaces; 16 other locales are core-labels-only, as before. |
| RTL direction logic | PASS (unit) | `direction` resolves to `rtl` for Arabic and back to `ltr` for English (`src/test/a11y.test.tsx`). |
| RTL visual layout | BLOCKED | Chromium cannot run in this environment (`libnspr4` missing, no root to install dependencies), so mirrored layout was never seen rendered. |
| Automated a11y rules | PASS | axe-core WCAG 2 A/AA scan: 0 serious/critical violations on landing, onboarding and legal pages. jsdom skips geometry rules, so contrast is **not** covered. |
| Screen-reader / keyboard audit | NOT TESTED | No NVDA/VoiceOver/JAWS run; requires a real assistive technology session. |
| Voice / microphone path | NOT TESTED | Unchanged by this pass; requires real browser + microphone hardware. |
| Scientific APIs (live calls) | PASS | All seven endpoints returned HTTP 200 with real payloads on 2026-10-29: PubMed (9,272 hits), Europe PMC (177,214), ClinicalTrials.gov, Crossref, OpenAlex, PubChem (CID 2244), Open Targets GraphQL (`approvedSymbol: EGFR`). |
| Supabase RLS (schema) | PASS | `npm run audit:rls`: all 8 tables have RLS enabled and every policy is owner-anchored (direct `auth.uid() = user_id`, or via parent project for `project_items`). |
| Supabase auth (live project) | BLOCKED | No credentials in the archive, by design. Cross-account isolation and live policy state cannot be tested without them. |
| Secrets in bundle | PASS | Scan of `dist/` for service-role keys, JWTs, `postgresql://` and `sk-` patterns: 0 hits. |
| SEO files | PASS | `robots.txt`, `sitemap.xml`, canonical + OG tags generated from `PUBLIC_SITE_URL`. |
| Deployable artifact | PASS | `dist/` builds with SPA fallback (`public/_redirects`), SEO files and the service worker. |
| Independent deployment | BLOCKED | No host credentials or domain. Nothing was published; steps are in `DEPLOYMENT.md`. |
| Legal pages | PARTIAL | Draft Privacy, Terms and Contact pages added and routed. They describe real behaviour but need owner/legal review and a real contact address before public accounts. Text is English-only. |
| PWA offline shell | PARTIAL | `public/sw.js` built by `scripts/build-sw.mjs`: 31-file precache, network-first navigations, cache-first hashed assets, no API/third-party caching, registered in production only. Install/prompt-to-install not browser-tested. |

## Changes in this repair

- Promoted the authoritative v3 source to the repository root; preserved the old
  build output under `_archive/build-output/` and both ZIPs.
- Added a public landing page (`src/pages/Landing.tsx`) reachable at `#/home`,
  shown to first-time visitors instead of the research dashboard.
- Added a five-step onboarding wizard (`src/components/OnboardingWizard.tsx`)
  covering language, role, accessibility, workspace density and a summary.
- Added `src/lib/experience.ts` + `src/context/PreferencesContext.tsx`: role,
  density and onboarding state persisted locally (no account, no health data).
- Added `src/lib/onboardingTranslations.ts` with en/fr/ar copy for the new
  surfaces and explicit English fallback for other locales.
- Made navigation role-aware while keeping every module reachable, and added
  "Home" and "Change experience" affordances to the sidebar.
- Ordered dashboard modules by the selected role.
- Added workspace density rules in `src/index.css` driven by `data-density`.
- Added 12 tests (`experience.test.tsx`, `atlas.test.tsx`) and updated the
  navigation test for the new first-run behaviour.
- Added a service worker + `scripts/build-sw.mjs` so the app has an offline
  shell; it caches no API, Supabase or non-GET traffic.
- Added draft Privacy, Terms and Contact pages (`src/pages/Legal.tsx`) routed as
  `#/privacy`, `#/terms`, `#/contact` and linked from the sidebar and homepage.
- Added `scripts/audit-rls.mjs` (`npm run audit:rls`) which verifies every
  migrated table is RLS-enabled and owner-anchored.
- Added `scripts/audit-browser.mjs` for a real-browser RTL/keyboard/axe/deep-link
  audit. It requires Playwright and system Chromium libraries, which this
  environment cannot install — it is ready to run on a normal workstation or CI.
- Added axe-core as a dev dependency and `src/test/a11y.test.tsx`.

## Notes and limitations

- The fr/ar copy for the new landing and onboarding surfaces is model-written and
  has **not** been reviewed by a native speaker or medical translator. Existing
  module translations are unchanged.
- Dark mode was already implemented as the `nightMode` accessibility preference
  (`a11y-night`); it was reused rather than duplicated. New surfaces inherit it.
- No browser automation was available in this environment, so visual, keyboard,
  RTL and voice behaviour are reported as NOT TESTED rather than working.
- Atlas anatomy was never lost; the "missing" report likely referred to the
  hosted Bolt deployment lagging behind this source.

## Release recommendation: SOURCE READY, DEPLOYMENT PENDING

The source builds, lints and tests cleanly. Remaining blockers are external:
hosting credentials/domain, live Supabase verification, legal pages, and
browser-level accessibility and voice testing.
