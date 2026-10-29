// Live data-source status checks. Each check performs a minimal real request
// to the public API so the app can report truthfully whether the source is
// reachable right now — never a fabricated "connected" badge.

import { checkCrossref } from './crossref';
import { checkOpenAlex } from './openalex';

export type ConnectorStatus = 'idle' | 'checking' | 'ok' | 'error';

export interface ConnectorCheck {
  status: ConnectorStatus;
  latencyMs: number | null;
  checkedAt: string | null;
  /** Short human-readable failure reason when status is 'error'. */
  error?: string;
}

export type ConnectorId = 'pubmed' | 'europepmc' | 'clinicaltrials' | 'opentargets' | 'pubchem' | 'crossref' | 'openalex';

export interface ConnectorInfo {
  id: ConnectorId;
  name: string;
  docsUrl: string;
  needsKey: false;
  run: () => Promise<void>;
}

const TIMEOUT_MS = 12_000;

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const CONNECTORS: ConnectorInfo[] = [
  {
    id: 'pubmed',
    name: 'PubMed / NCBI E-utilities',
    docsUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
    needsKey: false,
    run: async () => {
      const resp = await fetchWithTimeout(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1&term=cancer'
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    },
  },
  {
    id: 'europepmc',
    name: 'Europe PMC',
    docsUrl: 'https://www.ebi.ac.uk/europepmc/webservices/rest/',
    needsKey: false,
    run: async () => {
      const resp = await fetchWithTimeout(
        'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=cancer&format=json&pageSize=1'
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    },
  },
  {
    id: 'clinicaltrials',
    name: 'ClinicalTrials.gov',
    docsUrl: 'https://clinicaltrials.gov/api/v2/',
    needsKey: false,
    run: async () => {
      const resp = await fetchWithTimeout(
        'https://clinicaltrials.gov/api/v2/studies?pageSize=1&fields=NCTId'
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    },
  },
  {
    id: 'opentargets',
    name: 'Open Targets Platform',
    docsUrl: 'https://platform.opentargets.org/',
    needsKey: false,
    run: async () => {
      const resp = await fetchWithTimeout('https://api.platform.opentargets.org/api/v4/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ target(ensemblId: "ENSG00000141510") { approvedSymbol } }' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    },
  },
  {
    id: 'pubchem',
    name: 'PubChem',
    docsUrl: 'https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest',
    needsKey: false,
    run: async () => {
      const resp = await fetchWithTimeout(
        'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/imatinib/property/MolecularFormula/JSON'
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    },
  },
  {
    id: 'crossref',
    name: 'Crossref',
    docsUrl: 'https://api.crossref.org/swagger-ui/index.html',
    needsKey: false,
    run: checkCrossref,
  },
  {
    id: 'openalex',
    name: 'OpenAlex',
    docsUrl: 'https://docs.openalex.org/',
    needsKey: false,
    run: checkOpenAlex,
  },
];

export async function checkConnector(connector: ConnectorInfo): Promise<ConnectorCheck> {
  const started = performance.now();
  try {
    await connector.run();
    return {
      status: 'ok',
      latencyMs: Math.round(performance.now() - started),
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    return {
      status: 'error',
      latencyMs: null,
      checkedAt: new Date().toISOString(),
      error: aborted ? 'timeout' : err instanceof Error ? err.message : 'error',
    };
  }
}
