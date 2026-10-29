import type { ResearchRecord, SearchResult, SourceError, SourceProvider } from '@/types';
import { searchPubMed } from './pubmed';
import { searchEuropePMC } from './europepmc';
import { searchClinicalTrials } from './clinicaltrials';
import { searchCrossref } from './crossref';
import { searchOpenAlex } from './openalex';

interface UnifiedSearchParams {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
  maxResults?: number;
  dateFrom?: string;
  dateTo?: string;
  sources?: SourceProvider[];
}

function tagTerms(
  record: ResearchRecord,
  cancerType?: string,
  gene?: string,
  drug?: string,
  treatment?: string
): ResearchRecord {
  const cancer = cancerType ? [cancerType] : [];
  const targets = gene ? [gene] : [];
  const treatments = [drug, treatment].filter(Boolean) as string[];

  return {
    ...record,
    cancerTerms: record.cancerTerms.length > 0 ? record.cancerTerms : cancer,
    targetTerms: record.targetTerms.length > 0 ? record.targetTerms : targets,
    treatmentTerms: record.treatmentTerms.length > 0 ? record.treatmentTerms : treatments,
  };
}

function deduplicate(records: ResearchRecord[]): ResearchRecord[] {
  const seen = new Map<string, ResearchRecord>();

  for (const record of records) {
    let key: string | undefined;

    if (record.pmid) {
      key = `pmid-${record.pmid}`;
    } else if (record.doi) {
      key = `doi-${record.doi}`;
    } else if (record.nctId) {
      key = `nct-${record.nctId}`;
    } else {
      key = record.id;
    }

    if (!seen.has(key)) {
      seen.set(key, record);
    } else {
      const existing = seen.get(key)!;
      if (!existing.abstract && record.abstract) {
        seen.set(key, { ...existing, abstract: record.abstract });
      }
      if (!existing.pmid && record.pmid) {
        seen.set(key, { ...existing, pmid: record.pmid });
      }
      if (!existing.doi && record.doi) {
        seen.set(key, { ...existing, doi: record.doi });
      }
      if (!existing.pmcid && record.pmcid) {
        seen.set(key, { ...existing, pmcid: record.pmcid });
      }
    }
  }

  return Array.from(seen.values());
}

export async function unifiedSearch(params: UnifiedSearchParams): Promise<SearchResult> {
  const {
    cancerType,
    gene,
    drug,
    treatment,
    question,
    extraTerms,
    maxResults,
    dateFrom,
    dateTo,
    sources = ['pubmed', 'europepmc', 'clinicaltrials'] as SourceProvider[],
  } = params;

  const queryParts = [cancerType, gene, drug, treatment, question]
    .filter(Boolean)
    .join(' AND ');
  const timestamp = new Date().toISOString();
  const errors: SourceError[] = [];

  const promises: Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }>[] =
    [];

  if (sources.includes('pubmed')) {
    promises.push(
      searchPubMed({
        cancerType,
        gene,
        drug,
        treatment,
        question,
        extraTerms,
        maxResults,
        dateFrom,
        dateTo,
      })
    );
  }

  if (sources.includes('europepmc')) {
    promises.push(
      searchEuropePMC({
        cancerType,
        gene,
        drug,
        treatment,
        question,
        extraTerms,
        maxResults,
      })
    );
  }

  if (sources.includes('clinicaltrials')) {
    promises.push(
      searchClinicalTrials({
        cancerType,
        gene,
        drug,
        treatment,
        question,
        extraTerms,
        maxResults,
      })
    );
  }

  if (sources.includes('crossref')) {
    promises.push(searchCrossref({ question, maxResults }));
  }

  if (sources.includes('openalex')) {
    promises.push(searchOpenAlex({ question, maxResults }));
  }

  const results = await Promise.all(promises);

  let allRecords: ResearchRecord[] = [];
  let totalFound = 0;

  for (const result of results) {
    if (result.error) {
      errors.push(result.error);
    }
    allRecords = allRecords.concat(result.records);
    totalFound += result.totalFound;
  }

  allRecords = allRecords.map((r) =>
    tagTerms(r, cancerType, gene, drug, treatment)
  );

  const deduped = deduplicate(allRecords);

  deduped.sort((a, b) => {
    const dateA = a.pubDate ?? a.trialStartDate ?? '';
    const dateB = b.pubDate ?? b.trialStartDate ?? '';
    return dateB.localeCompare(dateA);
  });

  return {
    records: deduped,
    totalFound,
    query: queryParts,
    sources,
    timestamp,
    errors,
  };
}

export function formatAuthors(authors: string[], maxShow: number = 3): string {
  if (authors.length === 0) return 'Unknown authors';
  if (authors.length <= maxShow) return authors.join(', ');
  return `${authors.slice(0, maxShow).join(', ')}, et al.`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Date not available';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
