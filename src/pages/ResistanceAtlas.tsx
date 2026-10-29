import { useState, useCallback } from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { RecordCard } from '@/components/RecordCard';
import { LoadingState, EmptyState } from '@/components/States';
import { unifiedSearch } from '@/lib/search';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import type { SearchResult } from '@/types';

const RESISTANCE_EXAMPLE_PARAMS = [
  { key: 'exampleBreast', cancerType: 'Breast cancer', gene: 'CDK4', drug: 'CDK4/6 inhibitor' },
  { key: 'exampleLung', cancerType: 'Lung cancer', gene: 'EGFR', drug: 'EGFR inhibitor' },
  { key: 'exampleGbm', cancerType: 'Glioblastoma', gene: 'MGMT', drug: 'temozolomide' },
  { key: 'exampleProstate', cancerType: 'Prostate cancer', gene: 'AR', drug: 'enzalutamide' },
  { key: 'exampleMelanoma', cancerType: 'Melanoma', gene: 'BRAF', drug: 'BRAF inhibitor' },
  { key: 'exampleColorectal', cancerType: 'Colorectal cancer', gene: 'KRAS', drug: 'cetuximab' },
] as const;

export function ResistanceAtlas() {
  const [cancerType, setCancerType] = useState('');
  const [gene, setGene] = useState('');
  const [drug, setDrug] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { toggleRecord, isRecordSelected, setCurrentView, selectedRecords, language } = useApp();
  const t = getTranslation(language);

  const handleSearch = useCallback(
    async (ct?: string, g?: string, d?: string) => {
      const finalCt = ct ?? cancerType;
      const finalG = g ?? gene;
      const finalD = d ?? drug;
      if (!finalCt && !finalG && !finalD) return;
      setCancerType(finalCt);
      setGene(finalG);
      setDrug(finalD);
      setLoading(true);
      const res = await unifiedSearch({
        cancerType: finalCt,
        gene: finalG,
        drug: finalD,
        treatment: finalD,
        question: 'resistance mechanism',
        extraTerms: ['drug resistance'],
        maxResults: 25,
      });
      setResult(res);
      setLoading(false);
    },
    [cancerType, gene, drug]
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<ShieldAlert className="w-6 h-6" />}
        title={t.resistance.title}
        subtitle={t.resistance.subtitle}
        accent="teal"
      />

      {/* Info banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-teal-900">
          <p className="font-medium mb-1">{t.resistance.howItWorks}</p>
          <p className="text-teal-800 text-xs leading-relaxed">
            {t.resistance.howItWorksBody}
          </p>
        </div>
      </div>

      {/* Quick examples */}
      <div className="mb-6">
        <p className="text-sm font-medium text-navy-700 mb-2">{t.resistance.scenarios}</p>
        <div className="flex flex-wrap gap-2">
          {RESISTANCE_EXAMPLE_PARAMS.map((ex) => (
            <button
              key={ex.key}
              onClick={() => handleSearch(ex.cancerType, ex.gene, ex.drug)}
              className="text-sm px-3 py-1.5 rounded-xl bg-white border border-navy-100 text-navy-700
                hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700 transition-all"
            >
              {t.resistance[ex.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Custom search inputs */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.cancerType}</label>
            <input
              type="text"
              value={cancerType}
              onChange={(e) => setCancerType(e.target.value)}
              placeholder={t.resistance.searchPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.gene}</label>
            <input
              type="text"
              value={gene}
              onChange={(e) => setGene(e.target.value)}
              placeholder={t.resistance.genePlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.therapy}</label>
            <input
              type="text"
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              placeholder={t.resistance.therapyPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
        </div>
        <button
          onClick={() => handleSearch()}
          className="mt-3 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors"
        >
          {t.resistance.searchButton}
        </button>
      </div>

      {/* Selected records indicator */}
      {selectedRecords.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
          <span className="text-sm text-teal-800">
            {selectedRecords.length} {t.resistance.selectedFor}
          </span>
          <button
            onClick={() => setCurrentView('planner')}
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {t.resistance.viewPlanner}
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-2">
        {loading && <LoadingState message={t.resistance.searchHint} />}

        {!loading && !result && (
          <EmptyState
            title={t.resistance.emptyTitle}
            message={t.resistance.emptyMessage}
            icon={ShieldAlert}
          />
        )}

        {!loading && result && (
          <>
            {result.errors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium mb-1">{t.resistance.someErrors}</p>
                    {result.errors.map((err, i) => (
                      <p key={i}>• {err.provider}: {err.message}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="font-semibold text-navy-900">{result.records.length}</span>
              <span className="text-navy-500">{t.resistance.recordsFound}</span>
            </div>

            {result.records.length === 0 ? (
              <EmptyState
                title={t.resistance.noResultsTitle}
                message={t.resistance.noResultsMessage}
                icon={ShieldAlert}
              />
            ) : (
              <div className="space-y-3">
                {result.records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onSelect={toggleRecord}
                    selected={isRecordSelected(record)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
