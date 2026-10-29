import { useState, useCallback } from 'react';
import { BarChart3, AlertTriangle, Info, TrendingUp, FlaskConical, FileText } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState, EmptyState } from '@/components/States';
import { RecordCard } from '@/components/RecordCard';
import { searchPubMed } from '@/lib/pubmed';
import { searchClinicalTrials } from '@/lib/clinicaltrials';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import type { ResearchRecord } from '@/types';

interface EquityData {
  cancerType: string;
  pubCount: number;
  trialCount: number;
  trials: ResearchRecord[];
  recentPubs: ResearchRecord[];
  errors: string[];
  timestamp: string;
}

const COMPARISON_CANCERS = [
  'Breast cancer',
  'Lung cancer',
  'Prostate cancer',
  'Colorectal cancer',
  'Pancreatic cancer',
  'Glioblastoma',
  'Ovarian cancer',
  'Melanoma',
  'Leukemia',
  'Bladder cancer',
];

export function EquityRadar() {
  const [data, setData] = useState<EquityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<EquityData[] | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [cancerInput, setCancerInput] = useState('');

  const { toggleRecord, isRecordSelected, setCurrentView, selectedRecords, language } = useApp();
  const t = getTranslation(language);

  const handleSearch = useCallback(async (ct?: string) => {
    const cancerType = ct ?? cancerInput;
    if (!cancerType.trim()) return;
    setCancerInput(cancerType);
    setLoading(true);
    setData(null);

    const errors: string[] = [];

    const [pubResult, trialResult] = await Promise.all([
      searchPubMed({ cancerType, maxResults: 5 }),
      searchClinicalTrials({ cancerType, maxResults: 10 }),
    ]);

    if (pubResult.error) errors.push(pubResult.error.message);
    if (trialResult.error) errors.push(trialResult.error.message);

    setData({
      cancerType,
      pubCount: pubResult.totalFound,
      trialCount: trialResult.totalFound,
      trials: trialResult.records,
      recentPubs: pubResult.records,
      errors,
      timestamp: new Date().toISOString(),
    });
    setLoading(false);
  }, [cancerInput]);

  const handleCompare = useCallback(async () => {
    setCompareLoading(true);
    setCompareData(null);

    const results: EquityData[] = [];
    for (const ct of COMPARISON_CANCERS) {
      const [pubResult, trialResult] = await Promise.all([
        searchPubMed({ cancerType: ct, maxResults: 1 }),
        searchClinicalTrials({ cancerType: ct, maxResults: 1 }),
      ]);
      results.push({
        cancerType: ct,
        pubCount: pubResult.totalFound,
        trialCount: trialResult.totalFound,
        trials: [],
        recentPubs: [],
        errors: [],
        timestamp: new Date().toISOString(),
      });
    }

    setCompareData(results);
    setCompareLoading(false);
  }, []);

  const sortedCompare = compareData
    ? [...compareData].sort((a, b) => b.pubCount - a.pubCount)
    : [];
  const maxPubCount = sortedCompare.length > 0 ? sortedCompare[0].pubCount : 1;
  const maxTrialCount = sortedCompare.length > 0
    ? Math.max(...sortedCompare.map((r) => r.trialCount))
    : 1;

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<BarChart3 className="w-6 h-6" />}
        title={t.equity.title}
        subtitle={t.equity.subtitle}
      />

      {/* Info banner */}
      <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-navy-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-navy-700">
          <p className="font-medium mb-1">{t.equity.howItWorks}</p>
          <p className="text-xs text-navy-600 leading-relaxed">
            {t.equity.howItWorksBody}
          </p>
        </div>
      </div>

      {/* Single cancer search */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 mb-6">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.equity.cancerType}</label>
            <input
              type="text"
              value={cancerInput}
              onChange={(e) => setCancerInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              list="equity-cancers"
              placeholder="e.g. Glioblastoma"
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
            <datalist id="equity-cancers">
              {COMPARISON_CANCERS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-5 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors"
          >
            {t.equity.analyze}
          </button>
        </div>
      </div>

      {/* Comparison chart */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-navy-900 text-base">{t.equity.comparison}</h2>
            <p className="text-xs text-navy-400 mt-0.5">
              {t.equity.comparisonNote}
            </p>
          </div>
          <button
            onClick={handleCompare}
            disabled={compareLoading}
            className="px-4 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            {compareLoading ? t.common.loading : t.equity.generate}
          </button>
        </div>

        {compareLoading && <LoadingState message={t.equity.loadingCompare} />}

        {!compareLoading && !compareData && (
          <EmptyState
            title={t.equity.noCompareTitle}
            message={t.equity.noCompareMessage}
            icon={TrendingUp}
          />
        )}

        {!compareLoading && compareData && (
          <div className="space-y-4 animate-fade-in" data-chart>
            {/* Publications bar chart */}
            <div>
              <h3 className="text-sm font-semibold text-navy-700 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-navy-500" />
                {t.equity.pubsChart}
              </h3>
              <div className="space-y-2">
                {sortedCompare.map((d) => (
                  <div key={d.cancerType} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-navy-600 text-end flex-shrink-0 truncate">
                      {d.cancerType}
                    </div>
                    <div className="flex-1 bg-navy-50 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pe-2"
                        style={{ width: `${Math.max((d.pubCount / maxPubCount) * 100, 2)}%`, backgroundColor: 'var(--chart-1)' }}
                      >
                        <span className="text-xs text-white font-medium whitespace-nowrap">
                          {d.pubCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trials bar chart */}
            <div>
              <h3 className="text-sm font-semibold text-navy-700 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                {t.equity.trialsChart}
              </h3>
              <div className="space-y-2">
                {[...sortedCompare].sort((a, b) => b.trialCount - a.trialCount).map((d) => (
                  <div key={d.cancerType} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-navy-600 text-end flex-shrink-0 truncate">
                      {d.cancerType}
                    </div>
                    <div className="flex-1 bg-teal-50 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pe-2"
                        style={{ width: `${Math.max((d.trialCount / maxTrialCount) * 100, 2)}%`, backgroundColor: 'var(--chart-2)' }}
                      >
                        <span className="text-xs text-navy-900 font-medium whitespace-nowrap">
                          {d.trialCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-navy-400 pt-2 border-t border-navy-50">
              {t.equity.chartNote}
            </p>
          </div>
        )}
      </div>

      {/* Single cancer detail */}
      {loading && <LoadingState message={`${t.equity.loadingAnalyze} ${cancerInput}…`} />}

      {!loading && data && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-navy-500" />
                <span className="text-sm text-navy-500 font-medium">{t.equity.pubsStat}</span>
              </div>
              <div className="text-2xl font-bold text-navy-900">
                {data.pubCount.toLocaleString()}
              </div>
              <div className="text-xs text-navy-400 mt-1">
                {t.equity.totalFor} "{data.cancerType}"
              </div>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-navy-500 font-medium">{t.equity.trialsStat}</span>
              </div>
              <div className="text-2xl font-bold text-teal-700">
                {data.trialCount.toLocaleString()}
              </div>
              <div className="text-xs text-navy-400 mt-1">
                {t.equity.ctResultsFor} "{data.cancerType}"
              </div>
            </div>
          </div>

          {/* Errors */}
          {data.errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800">
                  {data.errors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-navy-400">
            {t.equity.queryLabel} "{data.cancerType}" · {t.equity.retrievedAt} {new Date(data.timestamp).toLocaleString()}
            · {t.equity.sourceNote}
          </div>

          {/* Recent trials */}
          {data.trials.length > 0 && (
            <div>
              <h3 className="font-bold text-navy-900 text-base mb-3">{t.equity.recentTrials}</h3>
              <div className="space-y-3">
                {data.trials.slice(0, 5).map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onSelect={toggleRecord}
                    selected={isRecordSelected(record)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent publications */}
          {data.recentPubs.length > 0 && (
            <div>
              <h3 className="font-bold text-navy-900 text-base mb-3">{t.equity.recentPubs}</h3>
              <div className="space-y-3">
                {data.recentPubs.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onSelect={toggleRecord}
                    selected={isRecordSelected(record)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !data && !compareLoading && !compareData && (
        <div className="mt-6">
          <EmptyState
            title={t.equity.startTitle}
            message={t.equity.startMessage}
            icon={BarChart3}
          />
        </div>
      )}

      {/* Selected records indicator */}
      {selectedRecords.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
          <span className="text-sm text-teal-800">
            {selectedRecords.length} {t.equity.selectedFor}
          </span>
          <button
            onClick={() => setCurrentView('planner')}
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {t.equity.viewPlanner}
          </button>
        </div>
      )}
    </div>
  );
}
