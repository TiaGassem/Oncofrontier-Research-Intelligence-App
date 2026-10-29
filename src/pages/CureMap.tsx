import { useState, useCallback } from 'react';
import { Search, Filter, AlertTriangle, ClipboardList } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { RecordCard } from '@/components/RecordCard';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { SourceBadge } from '@/components/SourceBadge';
import { unifiedSearch } from '@/lib/search';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import type { SearchResult, ResearchRecord } from '@/types';

interface CureMapSearchParams {
  cancerType: string;
  gene: string;
  drug: string;
  treatment: string;
  question: string;
  maxResults: number;
}

export function CureMap() {
  const [cancerType, setCancerType] = useState('');
  const [gene, setGene] = useState('');
  const [drug, setDrug] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<CureMapSearchParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterKind, setFilterKind] = useState<string>('all');

  const { toggleRecord, isRecordSelected, setCurrentView, selectedRecords, language } = useApp();
  const t = getTranslation(language);

  const runSearch = useCallback(async (params: CureMapSearchParams) => {
    setLoading(true);
    setSearchError(null);
    try {
      const res = await unifiedSearch(params);
      setResult(res);
    } catch (err) {
      setResult(null);
      setSearchError(err instanceof Error ? err.message : 'The research search could not be completed.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((quickQuery?: string) => {
    const searchQuestion = [question.trim(), quickQuery?.trim()].filter(Boolean).join(' ');
    if ((!cancerType && !gene && !drug && !searchQuestion) || loading) return;
    const params = {
      cancerType,
      gene,
      drug,
      treatment: drug,
      question: searchQuestion,
      maxResults: 25,
    };
    setLastSearchParams(params);
    void runSearch(params);
  }, [cancerType, gene, drug, question, loading, runSearch]);

  const retrySearch = useCallback(() => {
    if (lastSearchParams && !loading) void runSearch(lastSearchParams);
  }, [lastSearchParams, loading, runSearch]);

  const filteredRecords = (result?.records ?? []).filter((r) => {
    if (filterProvider !== 'all' && r.provider !== filterProvider) return false;
    if (filterKind !== 'all' && r.kind !== filterKind) return false;
    return true;
  });

  const pubCount = (result?.records ?? []).filter((r) => r.kind === 'publication').length;
  const trialCount = (result?.records ?? []).filter((r) => r.kind === 'trial').length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<Search className="w-6 h-6" />}
        title={t.curemap.title}
        subtitle={t.curemap.subtitle}
      />

      <SearchBar
        onSearch={handleSearch}
        cancerType={cancerType}
        setCancerType={setCancerType}
        gene={gene}
        setGene={setGene}
        drug={drug}
        setDrug={setDrug}
        question={question}
        setQuestion={setQuestion}
        placeholder="e.g. Breast cancer CDK4/6 inhibitor resistance"
        isLoading={loading}
      />

      {/* Selected records indicator */}
      {selectedRecords.length > 0 && (
        <div className="mt-3 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
          <span className="text-sm text-teal-800">
            <ClipboardList className="w-4 h-4 inline me-1.5" />
            {selectedRecords.length} {t.curemap.selectedFor}
          </span>
          <button
            onClick={() => setCurrentView('planner')}
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {t.curemap.viewPlanner}
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        {loading && <LoadingState />}

        {!loading && !result && !searchError && (
          <EmptyState
            title={t.curemap.emptyTitle}
            message={t.curemap.emptyMessage}
          />
        )}

        {!loading && searchError && (
          <ErrorState title={t.states.errorTitle} message={searchError} onRetry={retrySearch} />
        )}

        {!loading && result && result.records.length === 0 && result.errors.length > 0 && (
          <ErrorState
            title={t.curemap.someErrors}
            message={result.errors.map((err) => `${err.provider}: ${err.message}`).join(' ')}
            onRetry={retrySearch}
          />
        )}

        {!loading && result && !(result.records.length === 0 && result.errors.length > 0) && (
          <>
            {/* Results summary */}
            <div aria-live="polite" aria-atomic="true" className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-navy-900">{result.records.length}</span>
                <span className="text-navy-500">{t.curemap.recordsRetrieved}</span>
                <span className="text-navy-300">·</span>
                <span className="text-navy-500">
                  {pubCount} {t.curemap.publicationsLabel} {trialCount} {t.curemap.trialsLabel}
                </span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-navy-400" />
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  aria-label={t.curemap.filterSourceLabel}
                  className="text-xs bg-white border border-navy-100 rounded-lg px-2 py-1.5 text-navy-700 outline-none focus:border-teal-400"
                >
                  <option value="all">{t.curemap.allSources}</option>
                  <option value="pubmed">PubMed</option>
                  <option value="europepmc">Europe PMC</option>
                  <option value="clinicaltrials">ClinicalTrials.gov</option>
                </select>
                <select
                  value={filterKind}
                  onChange={(e) => setFilterKind(e.target.value)}
                  aria-label={t.curemap.filterTypeLabel}
                  className="text-xs bg-white border border-navy-100 rounded-lg px-2 py-1.5 text-navy-700 outline-none focus:border-teal-400"
                >
                  <option value="all">{t.curemap.allTypes}</option>
                  <option value="publication">{t.curemap.publications}</option>
                  <option value="trial">{t.curemap.trials}</option>
                </select>
              </div>
            </div>

            {/* Source errors */}
            {result.errors.length > 0 && (
              <div role="alert" className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium mb-1">{t.curemap.someErrors}</p>
                    {result.errors.map((err, i) => (
                      <p key={i}>• {err.provider}: {err.message}</p>
                    ))}
                    <p className="mt-1">{t.curemap.noMatchMessage2}</p>
                    <button onClick={retrySearch} className="mt-2 underline underline-offset-2 font-medium">
                      {t.states.retry}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Query info */}
            <div className="text-xs text-navy-400 mb-3">
              {t.curemap.queryLabel} "{result.query}" · {t.curemap.retrievedAt} {new Date(result.timestamp).toLocaleTimeString()}
            </div>

            {/* Records */}
            {filteredRecords.length === 0 ? (
              <EmptyState
                title={t.curemap.noMatchTitle}
                message={t.curemap.noMatchMessage}
              />
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((record: ResearchRecord) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onSelect={toggleRecord}
                    selected={isRecordSelected(record)}
                  />
                ))}
              </div>
            )}

            {/* Source badges footer */}
            <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-navy-100">
              <span className="text-xs text-navy-400">{t.curemap.sourcesSearched}</span>
              {result.sources.map((s) => (
                <SourceBadge key={s} provider={s} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
