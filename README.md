# ONCOFRONTIER — Pan-Cancer Research Intelligence Platform

A professional, evidence-grounded pan-cancer research workspace for academic researchers, students, translational scientists, clinical researchers, pharmaceutical R&D teams, and — in a clearly separated experience — patients, caregivers, and the public. English, French, and Arabic have complete interface translations; 16 additional languages have partial core translations, and Tunisian Arabic uses the Arabic interface.

ONCOFRONTIER retrieves **real data** from public research APIs. No fabricated papers, no invented citations, no hardcoded results. Every record traces back to a verifiable source.

## Features

### Research modules

1. **Discovery Bridge** — Cancer drug discovery workspace
   - Evidence-backed target assessment via Open Targets Platform API
   - Target–disease associations with datatype-specific scores
   - Drug and clinical candidates with maximum clinical stage
   - Safety liabilities from Open Targets
   - Compound lookup via PubChem REST API (name or SMILES)
   - SMILES validation with basic chemical syntax checking
   - Molecule explorer with structured handoff for computational chemistry
   - Resistance context from remaining publications and trials
   - Translational validation planner with evidence levels, controls, and missing information
   - Research brief export (Markdown copy / download)

2. **CUREMAP** — Evidence Explorer
   - Unified search across PubMed, Europe PMC, ClinicalTrials.gov, Crossref, and OpenAlex
   - Filters by cancer type, gene, drug, treatment, research question, and date range
   - Source comparison, deduplication (PMID/DOI/NCT ID), and study-context labels
   - Original source links and verified identifiers

3. **Resistance Atlas** — Treatment Resistance
   - Reported resistance mechanisms by cancer type, therapy, target, and gene
   - Every finding links to its supporting publication

4. **Cancer Equity Radar** — Research Gaps
   - Publication activity and registered trial activity by cancer type
   - No fabricated statistics — clearly states data limitations

5. **Action Planner** — Research Brief Builder
   - Collect selected records into an exportable research brief
   - Markdown export with source traceability

6. **Research Assistant** — Retrieval-based Q&A
   - Keyword-based retrieval from connected sources
   - Accurately described as a retrieval-based assistant (no generative AI model connected)
   - Cites source-dependent claims

7. **Research Library** — Reference manager & workspace (requires sign-in)
   - Favorites: saved publications and trials with identifiers and source links
   - Import: paste BibTeX or RIS entries, or lists of DOIs/PMIDs — real metadata fetched from Crossref and PubMed, duplicate detection by DOI/PMID
   - Export: CSV, RIS, and BibTeX downloads of the whole saved library
   - Projects: named collections of saved papers (create, add/remove papers, delete)
   - Search history, persisted across sessions
   - Automations: saved queries with manual "Check now" for newly published papers (no background scheduler — checks run only while the app is open). Works without an account: the list is then stored in this browser and the page says so.

8. **Connected Data Sources** — Live connector status
   - Real reachability checks with latency, last-checked time, and error states
   - Per-connector retest and test-all actions

9. **Methodology** — Sources & Limitations
   - Transparent documentation of all data sources, their APIs, and limitations

### Patient & caregiver companion (separate experience)

- Plain-language explanations of cancer types with staging and treatment context
- Evidence-linked survival statistics with an explicit "what this statistic cannot tell you" panel — population statistics are never presented as individual prognoses
- Clinical-trials context in plain language
- Appointment question checklists with copy and print support
- Every entry carries a source name and link (public-health and scientific resources)
- Text-first and usable without an account; optional voice input/output and accessibility controls
- Urgent-danger messages route to emergency care rather than in-app management
- Floating companion bubble available on any page

### International accessibility

- **20 language options**: English, French, and Arabic have complete interface translations; 16 more languages (Spanish, German, Portuguese, Italian, Turkish, Chinese, Japanese, Korean, Hindi, Urdu, Persian, Bengali, Indonesian, Vietnamese, Thai, Swahili) have partial core translations with English fallback for longer module text; Tunisian Arabic is a dialect option using the Arabic interface
- **RTL layout** for Arabic, Urdu, and Persian (automatic `dir="rtl"` on the document element; mirrored layouts via logical CSS properties)
- **Language picker before sign-in** on the login page; the choice persists locally so switching language never loses selected records or in-progress work
- Scientific terms, gene symbols, compound names, and identifiers preserved untranslated

### Accessibility and colour vision

- **Colour-blind palettes** — default, deuteranopia, protanopia, tritanopia and
  monochromacy. Each palette replaces the accent, alert, warning and success
  hues plus the chart series, and is applied through `<html data-cb="…">` so it
  covers the whole interface. Available in the onboarding wizard, the
  accessibility menu and the appearance switcher on the public site; the choice
  persists in `oncofrontier-a11y`.
- **Presets** — "Assisted hands" (large targets, one-handed spacing, listening
  mode, quick phrases, voice guide), "Blindness support" (voice guide, listening
  mode, large text, large targets), "Low vision" and "Dyslexia friendly".
  Presets set the same individual preferences, so they can be combined and
  reset.
- **Keyboard and screen reader** — skip link to `#main-content`, focus moves to
  the page region on every navigation, page changes are announced (live speech
  when voice guide is on), and the chat composer is a textarea: Enter sends,
  Shift+Enter adds a line.

## Data sources

| Source | API | Purpose |
|--------|-----|---------|
| PubMed / NCBI E-utilities | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/` | Biomedical literature citations |
| Europe PMC REST API | `https://www.ebi.ac.uk/europepmc/webservices/rest/` | European life science articles |
| ClinicalTrials.gov API v2 | `https://clinicaltrials.gov/api/v2/` | Registered clinical studies |
| Open Targets Platform | `https://api.platform.opentargets.org/api/v4/graphql` | Target–disease associations, tractability, safety |
| PubChem REST API | `https://pubchem.ncbi.nlm.nih.gov/rest/pug/` | Compound names, SMILES, molecular properties |
| Crossref REST API | `https://api.crossref.org/works` | DOI-registered scholarly metadata |
| OpenAlex | `https://api.openalex.org/works` | Open scholarly works with citation counts and open-access flags |

All literature APIs are public and require no API keys.

Companion chat runs through a Supabase Edge Function that keeps the LLM key server-side. When configured, the AI path requires a signed-in Supabase user; guests can still use source-based retrieval. There is no user-paid chat fallback. Image analysis, audio transcription, and speech fallback may use Puter as separate, user-initiated features.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom navy/teal color system
- **Icons**: lucide-react
- **State**: React Context (AppContext) for record selection, navigation, and language
- **API clients**: `src/lib/` — separate modules for each data source
- **Persistence**: Supabase with owner-scoped RLS on every table
- **i18n**: `src/lib/i18n.ts` (EN/FR/AR full translations) + `src/lib/coreTranslations.ts`, `src/lib/eyeComfortTranslations.ts`, `src/lib/chatUiTranslations.ts` (centralized partials for the 16 additional locales)

```
src/
├── App.tsx                    # Root component with view routing + RTL
├── context/
│   ├── AppContext.tsx         # Global state: selected records, view, language
│   ├── AuthContext.tsx        # Supabase email/password auth
│   └── A11yContext.tsx        # Accessibility preferences
├── lib/
│   ├── pubmed.ts              # PubMed/NCBI E-utilities client
│   ├── europepmc.ts           # Europe PMC REST client
│   ├── clinicaltrials.ts      # ClinicalTrials.gov API v2 client
│   ├── crossref.ts            # Crossref client
│   ├── openalex.ts            # OpenAlex client (incl. inverted-index abstracts)
│   ├── search.ts              # Unified search + deduplication
│   ├── opentargets.ts         # Open Targets GraphQL client
│   ├── pubchem.ts             # PubChem compound lookup + SMILES validation
│   ├── connectors.ts          # Live connector status checks
│   ├── persistence.ts         # Favorites + search history
│   ├── projects.ts            # Research projects
│   ├── automations.ts         # Saved search automations
│   ├── referenceFormats.ts    # BibTeX/RIS/CSV import + export, DOI/PMID lookup
│   ├── chatHistory.ts         # Conversation persistence
│   ├── aiProvider.ts          # Edge-function chat client + vision/TTS fallbacks
│   ├── transcription.ts       # Voice transcription
│   ├── languageSupport.ts     # Language detection + speech support
│   ├── companionData.ts       # Plain-language cancer dictionary + survival stats
│   └── i18n.ts                # EN/FR/AR translations + merge of 16 locale partials
├── pages/                     # Dashboard, Companion, CureMap, DiscoveryBridge,
│                              # ResistanceAtlas, EquityRadar, ActionPlanner,
│                              # ResearchAssistant, Library, PdfReader,
│                              # LoginPage, Methodology, GlobalBurdenAtlas,
│                              # BiomarkerAtlas, CancerAnatomy
├── components/                # Sidebar, FloatingCompanion, DataSourceStatus,
│                              # RecordCard, SearchBar, SourceBadge, PageHeader,
│                              # ConversationManager, AccessibilityMenu, States, ...
└── types/index.ts             # Shared TypeScript types
```

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Tests
npm test
```

## Environment variables

`.env.example` lists variable names only — copy it to `.env` and fill in real values locally; never commit it.

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (browser-safe) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only — never expose in frontend |
| `SUPABASE_DB_URL` | Database connection URL — server-side only |

**Server-side secret configuration:** the Companion LLM key is stored as a Supabase Edge Function secret (`LLM_API_KEY`, set via the Supabase dashboard or CLI), never in frontend code. Configured AI chat checks the caller's signed-in Supabase session. Image analysis, audio transcription, and speech fallback can send selected image/audio/text to Puter after the user starts that feature; review its current terms and privacy handling before enabling those workflows publicly.

Public research features and device-local automations work without Supabase. Accounts, saved favorites, search history and projects require it.

## Scientific integrity

- **No fabricated data**: Every paper, trial, target, and compound comes from a real API response
- **Source traceability**: All records include original source URLs and stable identifiers (PMID, DOI, NCT ID, Ensembl ID, PubChem CID)
- **Honest limitations**: Missing data is displayed as "Unknown" or "Insufficient evidence"
- **No clinical claims**: Database scores are annotations, not probabilities of drug success
- **Hypothesis labeling**: Proposed experiments are clearly labeled as hypotheses, not results
- **Not a medical device**: ONCOFRONTIER is a research discovery prototype, not a clinical decision-support product

## Independent deployment

The project is portable and does not require a Bolt editor or hosting session. Netlify is configured through `netlify.toml` (build: `npm run build`, publish: `dist/`, SPA fallback redirect); `public/_redirects` provides the same fallback for other static hosts. Direct navigation and page refresh on client-side routes resolve to `index.html`.

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Deploy the `dist/` folder to Netlify (or any static host with SPA fallback). Configure the two `VITE_SUPABASE_*` variables in the host environment only when private account features are needed. Never expose service-role or database credentials in frontend environment variables.

## Public site, onboarding, and personalization

Added on top of the existing modules. Nothing was removed or replaced.

- **Public homepage** (`#/home`) — explains the platform, names the connected
  data sources, and works without an account. A first-time visitor lands here
  instead of the research dashboard.
- **Onboarding** (`#/welcome`) — five steps: language, intended use,
  accessibility preferences, workspace density, and a summary. Choices are
  written to the real preference stores, so they change the interface.
- **Role-aware navigation** — the sidebar shows the modules that match the chosen
  role first and keeps every other module under "All modules".
- **Workspace density** — simple / standard / advanced controls reading width and
  whether secondary detail is shown.
- **Change experience** — the sidebar link reopens onboarding without touching
  saved data.
- **Dark mode** reuses the existing `nightMode` accessibility preference rather
  than adding a second theme system.

New files: `src/pages/Landing.tsx`, `src/components/OnboardingWizard.tsx`,
`src/lib/experience.ts`, `src/context/PreferencesContext.tsx`,
`src/lib/onboardingTranslations.ts`.

## Known limitations

- Email research alerts are not implemented; automations check manually.
- Research Assistant uses retrieval and source records; only Companion chat uses the LLM endpoint.
- No de novo molecular generation; the interface labels that capability as not connected.
- Companion chat replies fall back to English when the model cannot comply with the requested language; speech recognition quality varies by browser and installed device voices.
- OCR is not available for scanned PDFs; the app warns rather than pretending to read them.
- The public literature APIs apply their own rate limits and can have outages; errors and retry actions are shown to users.
- Browser checks were run in headless Chromium (Chromium 129) against the dev server: layout, palettes, presets, chat sending and automation creation. A real microphone, OS speech voices and screen readers cannot be exercised in a headless VM, so microphone capture, live transcription and screen-reader output remain unverified here.
- Speech input depends on the browser's speech service or, when that is blocked, on the transcription endpoint; if neither responds the app now says so after 15 seconds and points to typing instead of leaving the mic spinning.

## Business model (freemium)

- **Free plan** — basic literature search, limited monthly AI summaries,
  article comparisons, PDF summaries and assistant queries, selected
  templates, the public Atlas, and every accessibility feature. Accounts keep
  saved research history where Supabase is configured.
- **Individual Pro** — proposed list prices €9.99/month or €79.99/year
  (suggested, NOT validated market prices), stored in the plan catalogue the
  admin dashboard can edit (~#/admin).
- **Institutional licences** — multi-user, shared workspaces, admin tools,
  support; custom pricing via an enquiry form on the pricing page (~#/pricing).

Implementation status, stated in the UI itself:

- **Payment processing is pending** — no provider is connected, so planning
  upgrades create a *pending request* on the device (never a charge, and the
  signed-up plan stays Free until a backend verifies a real payment).
- **Entitlement enforcement is device-local** until a backend exists;
  `src/lib/billing.ts` marks exactly where server-side checks must land
  (`getResolvedPlan()`), and the billing page repeats the disclaimer.
- Monthly usage counters (`oncofrontier-usage`) reset on the UTC
  month and power the usage meters, limit notices and the upgrade prompts.
- Restricted features: AI summaries, article comparisons (3/month on Free),
  PDF summaries, assistant queries, automation count. Not gated, by design and
  in code: literature search, reading, every source citation, and all
  accessibility features.

## License

AGPL-3.0 License — see [LICENSE](LICENSE) for full text. This license requires that anyone who modifies the app and offers it as a network service must also release their modified source code. Data from external APIs retains their respective licenses.
