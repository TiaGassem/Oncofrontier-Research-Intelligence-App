import type { ResearchRecord, SourceError } from '@/types';

// OpenAlex: open catalog of scholarly works with rich metadata, filterable
// concepts, and citation counts. Public API, no key.

const BASE = 'https://api.openalex.org/works';

export async function searchOpenAlex(params: {
  question?: string;
  maxResults?: number;
}): Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }> {
  const query = params.question?.trim();
  if (!query) return { records: [], totalFound: 0 };
  const perPage = Math.min(params.maxResults ?? 20, 50);

  try {
    const url = new URL(BASE);
    url.searchParams.set('search', query);
    url.searchParams.set('per-page', String(perPage));
    url.searchParams.set('mailto', 'contact@oncofrontier.app');

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      return {
        records: [],
        totalFound: 0,
        error: { provider: 'openalex', message: `OpenAlex search failed: HTTP ${resp.status}` },
      };
    }
    const json = await resp.json();
    const results: OpenAlexWork[] = json?.results ?? [];
    const totalFound: number = json?.meta?.count ?? 0;

    const records: ResearchRecord[] = results.map((w) => ({
      id: `openalex-${w.id}`,
      kind: 'publication' as const,
      provider: 'openalex' as const,
      title: w.display_name ?? 'Untitled',
      authors: (w.authorships ?? []).map((a) => a.author?.display_name ?? '').filter(Boolean),
      journal: w.primary_location?.source?.display_name ?? undefined,
      pubDate: w.publication_date,
      doi: w.doi?.replace('https://doi.org/', ''),
      citedBy: w.cited_by_count,
      sourceUrl:
        w.doi ??
        (w.landing_page_url ?? `https://openalex.org/${w.id.replace('https://openalex.org/', '')}`),
      retrievedAt: new Date().toISOString(),
      cancerTerms: [],
      targetTerms: [],
      treatmentTerms: [],
      accessStatus:
        w.open_access?.is_oa ? 'open' : ('unknown' as ResearchRecord['accessStatus']),
      abstract: abstractFromInvertedIndex(w.abstract_inverted_index),
    }));

    return { records, totalFound };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: [],
      totalFound: 0,
      error: { provider: 'openalex', message: `OpenAlex error: ${message}` },
    };
  }
}

interface OpenAlexWork {
  id: string;
  display_name?: string;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: { source?: { display_name?: string } | null } | null;
  publication_date?: string;
  doi?: string;
  landing_page_url?: string;
  cited_by_count?: number;
  open_access?: { is_oa?: boolean } | null;
  abstract_inverted_index?: Record<string, number[]> | null;
}

// OpenAlex stores abstracts as an inverted word index; rebuild plain text.
function abstractFromInvertedIndex(
  index?: Record<string, number[]> | null
): string | undefined {
  if (!index) return undefined;
  const words: { pos: number; word: string }[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) words.push({ pos, word });
  }
  if (words.length === 0) return undefined;
  return words
    .sort((a, b) => a.pos - b.pos)
    .map((w) => w.word)
    .join(' ');
}

export async function checkOpenAlex(): Promise<void> {
  const resp = await fetch(`${BASE}?per-page=1&mailto=contact@oncofrontier.app`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
}
