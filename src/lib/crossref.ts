import type { ResearchRecord, SourceError } from '@/types';

// Crossref: DOI-registered scholarly metadata. Full-text search across all
// registered works via the public REST API (no key; polite pool via mailto).

const BASE = 'https://api.crossref.org/works';

export async function searchCrossref(params: {
  question?: string;
  maxResults?: number;
}): Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }> {
  const query = params.question?.trim();
  if (!query) return { records: [], totalFound: 0 };
  const rows = Math.min(params.maxResults ?? 20, 50);

  try {
    const url = new URL(BASE);
    url.searchParams.set('query', query);
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('select', 'DOI,title,author,container-title,issued,type,URL,abstract');
    url.searchParams.set('mailto', 'contact@oncofrontier.app');

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      return {
        records: [],
        totalFound: 0,
        error: { provider: 'crossref', message: `Crossref search failed: HTTP ${resp.status}` },
      };
    }
    const json = await resp.json();
    const items: CrossrefItem[] = json?.message?.items ?? [];
    const totalFound: number = json?.message?.['total-results'] ?? 0;

    const records: ResearchRecord[] = items
      .filter((it) => !!it.title?.[0])
      .map((it) => ({
        id: `crossref-${it.DOI}`,
        kind: 'publication' as const,
        provider: 'crossref' as const,
        title: it.title![0],
        authors: (it.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(' ')),
        journal: it['container-title']?.[0],
        pubDate: it.issued?.['date-parts']?.[0]?.filter(Boolean).join('-'),
        doi: it.DOI,
        sourceUrl: it.URL ?? `https://doi.org/${it.DOI}`,
        retrievedAt: new Date().toISOString(),
        cancerTerms: [],
        targetTerms: [],
        treatmentTerms: [],
        accessStatus: 'unknown' as const,
        abstract: typeof it.abstract === 'string' ? it.abstract.replace(/<[^>]+>/g, '').trim() : undefined,
      }));

    return { records, totalFound };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: [],
      totalFound: 0,
      error: { provider: 'crossref', message: `Crossref error: ${message}` },
    };
  }
}

interface CrossrefItem {
  DOI: string;
  title?: string[];
  author?: { given?: string; family?: string }[];
  'container-title'?: string[];
  issued?: { 'date-parts'?: number[][] };
  URL?: string;
  abstract?: string;
}

export async function checkCrossref(): Promise<void> {
  const resp = await fetch(`${BASE}?rows=1&mailto=contact@oncofrontier.app`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
}
