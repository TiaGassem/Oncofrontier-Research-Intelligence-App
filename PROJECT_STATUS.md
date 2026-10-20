# ONCOFRONTIER — Release Verification

Checked: 2026-10-20. This report distinguishes the local submission source from the currently hosted Bolt app. Local code changes have not been deployed.

## Verification matrix

| Area | Status | Evidence / limitation |
|---|---|---|
| TypeScript | PASS | `npm run typecheck` passes on the local source. |
| ESLint | PASS | `npm run lint` passes on the local source. |
| Unit tests | BLOCKED | `npm test` cannot start Vitest: Windows denies esbuild child-process launch (`spawn EPERM`). Existing tests remain unverified. A GitHub Actions workflow is included to run them on a hosted runner, but has not run. |
| Production build | BLOCKED | `npm run build` fails before compilation for the same `spawn EPERM`. The GitHub Actions workflow is configured to build on a hosted runner; no successful build artifact exists yet. |
| Hosted app entry | PASS | User-provided Bolt URL loaded in the browser and rendered the dashboard. |
| Display/accessibility controls | PARTIAL | Live settings panel opened. Blindness Support toggled larger text, listening mode, voice guide, and larger touch targets; Reset restored their original off state. No screen-reader or full keyboard audit was completed. |
| Live evidence search | FAIL | Live query “EGFR resistance lung cancer” returned 61 records but displayed only “EGFR” as the query and included visibly unrelated records. Local source handles the whole quick-search string, but the hosted app is stale relative to local changes; deploy and retest before release. |
| Source integrations | PARTIAL | Source code uses public PubMed, Europe PMC, ClinicalTrials.gov, Crossref, OpenAlex, Open Targets, and PubChem APIs. Live search returned records; each provider's current health and relevance were not separately verified in this pass. |
| Research assistant | PARTIAL | Local assistant is retrieval and formatting, not generative AI; results link to source records. Evidence comparison and source-passage-grounded synthesis are not implemented. |
| PDF reader | PARTIAL | Local PDF text extraction and keyword passage search; scanned-page OCR, rendered page navigation, highlights, annotations, bookmarks, and citation capture are not implemented. File selection is now keyboard reachable, but that change was not browser-tested. |
| Companion AI chat | PARTIAL | The edge function keeps the model key server-side. Local code now verifies a signed-in Supabase user before the configured LLM call and avoids repeating failed model calls; guests retain public retrieval. Both chat views disclose search/AI provider processing and avoid-identifier guidance. The changed edge function has not been deployed or end-to-end tested. Provider-side limits are still required; application rate limiting is absent. |
| Voice and listening | PARTIAL | Browser speech recognition/synthesis and explicit Puter-based audio fallback exist. Support varies by browser, device, installed voices, and network. No microphone hardware test was performed. |
| Accessibility implementation | PARTIAL | Four presets and persistent display settings exist. A keyboard skip link, modal focus handling, and accessible PDF upload were added locally. No NVDA, VoiceOver, TalkBack, WCAG audit, color-simulation audit, or mobile assistive-technology test was performed. |
| Interface languages | PARTIAL | English, French, and Arabic have full resources. Sixteen more locales have partial core translations with English fallback for longer content. Tunisian Arabic shares Arabic UI. Translation tests check selected strings but could not run; no linguistic review was performed. Do not advertise “20 languages supported.” |
| Saved data and RLS | PARTIAL | Local migrations scope user tables to `auth.uid()`. No safe live sign-in, cross-account isolation, storage-policy, backup, or current Supabase security-advisor test was run. |
| Automations | PARTIAL | Saved searches can be checked manually in the app; there is no verified background scheduler or email delivery. |
| SEO/public metadata | PARTIAL | Build-time script now points canonical, Open Graph/Twitter, robots, and sitemap metadata at Netlify's configured public URL (or `PUBLIC_SITE_URL`). Not deployed or crawl/index tested; hash routes are not separate crawlable pages. |
| Public legal/support pages | BLOCKED | Approved Privacy, Terms, Contact, and account-deletion information are absent. Do not invite public accounts until these are supplied. |
| Poster discovery and templates | NOT TESTED | No verified global poster-search workflow or complete reusable template library was found in this pass. |
| Promotional PDF | PARTIAL | Existing demo PDF is one page and describes 3 full interface translations plus 16 partial locales. Text/page count checked; no new render was made in this pass. |

## Changes in this repair

- Kept the Heart companion launcher and open chat on the physical right edge with safe-area spacing, including one-handed mode (`src/components/FloatingCompanion.tsx`, `src/index.css`).
- Added a localized skip-to-main-content link and made the PDF upload control keyboard reachable, with accessible progress and error announcements.
- Added focus placement, Escape handling, and Tab containment to the display/accessibility dialog.
- Changed the dashboard metric to the three complete interface translations instead of claiming all 20 language options are fully supported.
- Added build-time canonical/social metadata and sitemap generation from the actual hosting domain; no Bolt URL remains hard-coded in app metadata.
- Required a verified signed-in Supabase user for configured server-side AI chat; public retrieval stays available to guests. Removed an immediate duplicate AI request after failure.
- Added translated Companion privacy notices before chat input and made the PDF reader's upload, progress, and errors accessible to keyboard and assistive-technology users.
- Corrected deployment and product documentation to disclose partial translations, unavailable features, provider dependencies, and public-release blockers.
- Added a Netlify-aware post-build SEO sync and GitHub Actions checks workflow. Both still require a hosted build to verify.
- Removed privileged Supabase service-role/database entries from `.env.example`; the submission ZIP excludes the local `.env` file.

## Privacy/security notes

- The submission archive excludes `.env`, `node_modules`, `dist`, `.bolt`, and `.git`; `.env.example` contains placeholders only.
- Database RLS was reviewed statically in the local migrations; remote policy state was not inspected in this pass.
- Companion LLM requests and local retrieval have different data flows. User-started Puter image/audio/TTS features may transmit content to that provider; explain this to users before public launch.
- The Edge Function still needs deployed auth changes, provider usage limits, and abuse/rate-limit controls before enabling an LLM secret publicly.

## Release recommendation: NOT READY

The hosted app does not yet contain the local fixes, the live search returned poor results for a basic query, the current Windows environment could not run unit tests or build, and legal/support pages and abuse controls are incomplete. Netlify credentials/domain are not connected, so the Bolt live site has not been updated and no Netlify URL exists yet. Cloudflare Pages setup is documented as a free static-hosting alternative; it is not deployed. A public GitHub screenshot showed `.env`; if the repository is public, rotate its values and remove the file/history before reconnecting any host. Deploy the updated package, run CI, retest the search and auth paths, and close the disclosed public-release blockers before submission.
