import type { ResearchRecord, SourceError } from '@/types';

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

interface PubMedESummaryDoc {
  uid: string;
  title?: string;
  authors?: { name: string }[];
  fulljournalname?: string;
  pubdate?: string;
  epubdate?: string;
  pubtype?: string[];
  articleids?: { idtype: string; value: string }[];
  sortfirstauthor?: string;
}

interface PubMedSearchResult {
  esearchresult: {
    idlist: string[];
    count: string;
  };
}

interface PubMedSummaryResult {
  result: {
    uids: string[];
  } & Record<string, PubMedESummaryDoc | string[]>;
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

export async function searchPubMed(params: {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
  maxResults?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }> {
  const query = buildQuery(params);
  if (!query.trim()) {
    return { records: [], totalFound: 0 };
  }

  const maxResults = params.maxResults ?? 20;

  try {
    const searchUrl = new URL(`${EUTILS_BASE}/esearch.fcgi`);
    searchUrl.searchParams.set('db', 'pubmed');
    searchUrl.searchParams.set('term', query);
    searchUrl.searchParams.set('retmax', String(maxResults));
    searchUrl.searchParams.set('retmode', 'json');
    searchUrl.searchParams.set('sort', 'pub_date');
    if (params.dateFrom) searchUrl.searchParams.set('mindate', params.dateFrom);
    if (params.dateTo) searchUrl.searchParams.set('maxdate', params.dateTo);
    if (params.dateFrom || params.dateTo) searchUrl.searchParams.set('datetype', 'pdat');

    const searchResp = await fetch(searchUrl.toString());
    if (!searchResp.ok) {
      return {
        records: [],
        totalFound: 0,
        error: { provider: 'pubmed', message: `PubMed search failed: HTTP ${searchResp.status}` },
      };
    }

    const searchData: PubMedSearchResult = await searchResp.json();
    const ids = searchData.esearchresult?.idlist ?? [];
    const totalFound = parseInt(searchData.esearchresult?.count ?? '0', 10);

    if (ids.length === 0) {
      return { records: [], totalFound: 0 };
    }

    const summaryUrl = new URL(`${EUTILS_BASE}/esummary.fcgi`);
    summaryUrl.searchParams.set('db', 'pubmed');
    summaryUrl.searchParams.set('id', ids.join(','));
    summaryUrl.searchParams.set('retmode', 'json');

    const summaryResp = await fetch(summaryUrl.toString());
    if (!summaryResp.ok) {
      return {
        records: [],
        totalFound,
        error: { provider: 'pubmed', message: `PubMed summary fetch failed: HTTP ${summaryResp.status}` },
      };
    }

    const summaryData: PubMedSummaryResult = await summaryResp.json();
    const result = summaryData.result;
    const uids = result.uids;

    const records: ResearchRecord[] = uids.map((uid) => {
      const doc = result[uid] as PubMedESummaryDoc;
      const articleIds = doc.articleids ?? [];

      const pmid = articleIds.find((a) => a.idtype === 'pubmed')?.value ?? uid;
      const doi = articleIds.find((a) => a.idtype === 'doi')?.value;
      const pmcid = articleIds.find((a) => a.idtype === 'pmc')?.value;

      const pubTypes = doc.pubtype ?? [];
      const isReview = pubTypes.some((t) => t.toLowerCase().includes('review'));
      const publicationType = isReview ? 'Review' : pubTypes[0] ?? 'Article';

      const accessStatus = pmcid ? 'free' : 'unknown';

      const records: ResearchRecord = {
        id: `pubmed-${pmid}`,
        kind: 'publication',
        provider: 'pubmed',
        title: doc.title ?? 'Untitled',
        authors: (doc.authors ?? []).map((a) => a.name),
        journal: doc.fulljournalname,
        pubDate: doc.pubdate ?? doc.epubdate,
        pmid,
        doi,
        pmcid,
        sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        retrievedAt: new Date().toISOString(),
        cancerTerms: [],
        targetTerms: [],
        treatmentTerms: [],
        accessStatus,
        publicationType,
      };
      return records;
    });

    return { records, totalFound };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: [],
      totalFound: 0,
      error: { provider: 'pubmed', message: `PubMed error: ${message}` },
    };
  }
}
