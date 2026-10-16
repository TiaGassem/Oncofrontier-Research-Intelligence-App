# ONCOFRONTIER — Pan-Cancer Research Intelligence Platform

A professional, multilingual (English / French / Arabic), evidence-grounded pan-cancer research intelligence platform for academic researchers, students, translational scientists, clinical researchers, and pharmaceutical R&D teams.

ONCOFRONTIER retrieves **real data** from public research APIs. No fabricated papers, no invented citations, no hardcoded results. Every record traces back to a verifiable source.

## Features

### Research Modules

1. **Discovery Bridge** — Cancer drug discovery workspace
   - Evidence-backed target assessment via Open Targets Platform API
   - Target–disease associations with datatype-specific scores
   - Drug and clinical candidates with maximum clinical stage
   - Safety liabilities from Open Targets
   - Compound lookup via PubChem REST API (name or SMILES)
   - SMILES validation with basic chemical syntax checking
   - Molecule explorer with structured handoff for computational chemistry
   - Resistance context from retrieved publications and trials
   - Translational validation planner with evidence levels, controls, and missing information
   - Research brief export (Markdown copy / download)

2. **CUREMAP** — Evidence Explorer
   - Unified search across PubMed, Europe PMC, and ClinicalTrials.gov
   - Filters by cancer type, gene, drug, treatment, and research question
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

7. **Methodology** — Sources & Limitations
   - Transparent documentation of all data sources, their APIs, and limitations

### International Accessibility

- **3 languages**: English, French, Arabic
- **RTL layout** for Arabic (automatic `dir="rtl"` on document element)
- Scientific terms, gene symbols, compound names, and identifiers preserved untranslated

## Data Sources

| Source | API | Purpose |
|--------|-----|---------|
| PubMed / NCBI E-utilities | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/` | Biomedical literature citations |
| Europe PMC REST API | `https://www.ebi.ac.uk/europepmc/webservices/rest/` | European life science articles |
| ClinicalTrials.gov API v2 | `https://clinicaltrials.gov/api/v2/` | Registered clinical studies |
| Open Targets Platform | `https://api.platform.opentargets.org/api/v4/graphql` | Target–disease associations, tractability, safety |
| PubChem REST API | `https://pubchem.ncbi.nlm.nih.gov/rest/pug/` | Compound names, SMILES, molecular properties |

All APIs are public and require no API keys.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom navy/teal color system
- **Icons**: lucide-react
- **State**: React Context (AppContext) for record selection, navigation, and language
- **API clients**: `src/lib/` — separate modules for each data source
- **i18n**: `src/lib/i18n.ts` — translation strings for EN/FR/AR

```
src/
├── App.tsx                    # Root component with view routing + RTL
├── context/AppContext.tsx     # Global state: selected records, view, language
├── lib/
│   ├── pubmed.ts              # PubMed/NCBI E-utilities client
│   ├── europepmc.ts           # Europe PMC REST client
│   ├── clinicaltrials.ts      # ClinicalTrials.gov API v2 client
│   ├── search.ts              # Unified search + deduplication
│   ├── opentargets.ts         # Open Targets GraphQL client
│   ├── pubchem.ts             # PubChem compound lookup + SMILES validation
│   └── i18n.ts                # EN/FR/AR translations
├── pages/
│   ├── Dashboard.tsx
│   ├── DiscoveryBridge.tsx    # Drug discovery workspace
│   ├── CureMap.tsx
│   ├── ResistanceAtlas.tsx
│   ├── EquityRadar.tsx
│   ├── ActionPlanner.tsx
│   ├── ResearchAssistant.tsx
│   └── Methodology.tsx
├── components/
│   ├── Sidebar.tsx            # Navigation + language selector
│   ├── RecordCard.tsx
│   ├── SearchBar.tsx
│   ├── SourceBadge.tsx
│   ├── PageHeader.tsx
│   └── States.tsx             # Loading/Empty/Error states
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
```

## Environment Variables

No external API keys are required. The app uses only public, key-free APIs.

Supabase is used only for optional authentication and private library data. Public research features do not require Supabase. For an independent deployment, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the host environment to enable accounts, favorites, and search history.

## Scientific Integrity

- **No fabricated data**: Every paper, trial, target, and compound comes from a real API response
- **Source traceability**: All records include original source URLs and stable identifiers (PMID, DOI, NCT ID, Ensembl ID, PubChem CID)
- **Honest limitations**: Missing data is displayed as "Unknown" or "Insufficient evidence"
- **No clinical claims**: Database scores are annotations, not probabilities of drug success
- **Hypothesis labeling**: Proposed experiments are clearly labeled as hypotheses, not results
- **Not a medical device**: ONCOFRONTIER is a research discovery prototype, not a clinical decision-support product

## Independent deployment

The project is portable and does not require a Bolt editor or hosting session. Netlify is configured through `netlify.toml`; the production output is `dist/`, and client-side routes fall back to `index.html`. The same `npm run build` output can be deployed to any static host that supports SPA fallbacks.

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only when private account features are needed. Never expose service-role or database credentials in frontend environment variables.

## Limitations

- Email research alerts are not implemented.
- No generative AI model is connected; Research Assistant uses retrieval and source records.
- No de novo molecular generation; the interface labels that capability as not connected.
- The public APIs can apply their own rate limits or experience outages; errors are shown to users.
- Browser-based visual testing is not available in this environment.

## License

MIT License — see [LICENSE](LICENSE) for full text. Data from external APIs retains their respective licenses.
