import type { ResearchRecord, SourceError } from '@/types';

const PMC_BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest';

interface PMCSearchResponse {
  hitCount: number;
  resultList: {
    result: PMCResult[];
  };
}

interface PMCResult {
  id: string;
  source: string;
  pmid?: string;
  doi?: string;
  pmcid?: string;
  title: string;
  authorString?: string;
  journalTitle?: string;
  pubYear?: string;
  firstPublicationDate?: string;
  abstractText?: string;
  pubTypeList?: { pubType: string }[];
  isOpenAccess?: 'Y' | 'N';
  inEPMC?: 'Y' | 'N';
  inPMC?: 'Y' | 'N';
}

function buildQuery(params: {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
}): string {
  const terms: string[] = [];
  if (params.cancerType) terms.push(params.cancerType);
  if (params.gene) terms.push(params.gene);
  if (params.drug) terms.push(params.drug);
  if (params.treatment) terms.push(params.treatment);
  if (params.question) terms.push(params.question);
  if (params.extraTerms) terms.push(...params.extraTerms);
  return terms.filter(Boolean).join(' AND ');
}

export async function searchEuropePMC(params: {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
  maxResults?: number;
}): Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }> {
  const query = buildQuery(params);
  if (!query.trim()) {
    return { records: [], totalFound: 0 };
  }

  const maxResults = params.maxResults ?? 20;

  try {
    const url = new URL(`${PMC_BASE}/search`);
    url.searchParams.set('query', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('pageSize', String(maxResults));
    url.searchParams.set('sort', 'P_PDATE_D desc');

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      return {
        records: [],
        totalFound: 0,
        error: { provider: 'europepmc', message: `Europe PMC search failed: HTTP ${resp.status}` },
      };
    }

    const data: PMCSearchResponse = await resp.json();
    const results = data.resultList?.result ?? [];

    const records: ResearchRecord[] = results.map((r) => {
      const pmid = r.pmid;
      const doi = r.doi;
      const pmcid = r.pmcid;

      const sourceUrl = pmid
        ? `https://europepmc.org/article/med/${pmid}`
        : doi
          ? `https://europepmc.org/article/doi/${doi}`
          : `https://europepmc.org/article/${r.source}/${r.id}`;

      const pubTypes = (r.pubTypeList ?? []).map((p) => p.pubType);
      const isReview = pubTypes.some((t) => t.toLowerCase().includes('review'));
      const publicationType = isReview ? 'Review' : pubTypes[0] ?? 'Article';

      const accessStatus: ResearchRecord['accessStatus'] =
        r.isOpenAccess === 'Y' ? 'open' : r.inPMC === 'Y' ? 'free' : 'unknown';

      const authors = (r.authorString ?? '')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      return {
        id: `europepmc-${r.source}-${r.id}`,
        kind: 'publication' as const,
        provider: 'europepmc' as const,
        title: r.title ?? 'Untitled',
        authors,
        journal: r.journalTitle,
        pubDate: r.firstPublicationDate ?? r.pubYear,
        abstract: r.abstractText,
        pmid,
        doi,
        pmcid,
        sourceUrl,
        retrievedAt: new Date().toISOString(),
        cancerTerms: [],
        targetTerms: [],
        treatmentTerms: [],
        accessStatus,
        publicationType,
      };
    });

    return { records, totalFound: data.hitCount ?? 0 };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: [],
      totalFound: 0,
      error: { provider: 'europepmc', message: `Europe PMC error: ${message}` },
    };
  }
}
