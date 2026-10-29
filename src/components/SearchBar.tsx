import { Search as SearchIcon, X } from 'lucide-react';
import { useId, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

interface SearchBarProps {
  onSearch: (quickQuery?: string) => void;
  cancerType: string;
  setCancerType: (v: string) => void;
  gene: string;
  setGene: (v: string) => void;
  drug: string;
  setDrug: (v: string) => void;
  question: string;
  setQuestion: (v: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

const COMMON_CANCERS = [
  'Breast cancer',
  'Lung cancer',
  'Glioblastoma',
  'Colorectal cancer',
  'Prostate cancer',
  'Pancreatic cancer',
  'Melanoma',
  'Leukemia',
  'Ovarian cancer',
  'Bladder cancer',
];

export function SearchBar({
  onSearch,
  cancerType,
  setCancerType,
  gene,
  setGene,
  drug,
  setDrug,
  question,
  setQuestion,
  placeholder = 'e.g. Breast cancer CDK4/6 inhibitor resistance',
  isLoading = false,
}: SearchBarProps) {
  const { language } = useApp();
  const t = getTranslation(language);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const id = useId();
  const quickSearchId = `quick-search-${id}`;
  const cancerTypesId = `cancer-types-${id}`;

  const handleQuickSearch = () => {
    if (!isLoading) onSearch(quickQuery.trim() || undefined);
  };

  const handleQuickKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const hasFilters = Boolean(cancerType || gene || drug || question);
  const activeCount = [cancerType, gene, drug, question].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
      {/* Quick search */}
      <div className="flex items-center gap-2 px-4 py-3">
        <SearchIcon className="w-5 h-5 text-navy-400 flex-shrink-0" />
        <label className="sr-only" htmlFor={quickSearchId}>{t.curemap.searchLabel}</label>
        <input
          id={quickSearchId}
          type="text"
          value={quickQuery}
          onChange={(e) => setQuickQuery(e.target.value)}
          onKeyDown={handleQuickKey}
          placeholder={placeholder}
          aria-label={t.curemap.searchLabel}
          className="flex-1 bg-transparent text-sm text-navy-900 placeholder-navy-300 outline-none"
        />
        {quickQuery && (
          <button
            onClick={() => {
              setQuickQuery('');
              setCancerType('');
              setGene('');
              setDrug('');
              setQuestion('');
            }}
            className="p-1 rounded text-navy-300 hover:text-navy-500 transition-colors"
            aria-label={t.common.clearAll}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls={`advanced-search-${id}`}
          className={`
            text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
            ${showAdvanced || hasFilters ? 'bg-teal-50 text-teal-700' : 'text-navy-400 hover:bg-navy-50'}
          `}
        >
          {t.common.filters}{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <button
          onClick={handleQuickSearch}
          disabled={isLoading}
          aria-busy={isLoading}
          className="px-4 py-1.5 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors flex-shrink-0"
        >
          {t.common.search}
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div id={`advanced-search-${id}`} className="border-t border-navy-100 px-4 py-3 space-y-3 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`cancer-type-${id}`} className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.cancerType}</label>
              <input
                id={`cancer-type-${id}`}
                type="text"
                value={cancerType}
                onChange={(e) => setCancerType(e.target.value)}
                list={cancerTypesId}
                placeholder={t.resistance.searchPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
              />
              <datalist id={cancerTypesId}>
                {COMMON_CANCERS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor={`gene-${id}`} className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.gene}</label>
              <input
                id={`gene-${id}`}
                type="text"
                value={gene}
                onChange={(e) => setGene(e.target.value)}
                placeholder={t.resistance.genePlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label htmlFor={`drug-${id}`} className="text-xs font-medium text-navy-500 mb-1 block">{t.resistance.therapy}</label>
              <input
                id={`drug-${id}`}
                type="text"
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
                placeholder={t.resistance.therapyPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label htmlFor={`question-${id}`} className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.researchQuestion}</label>
              <input
                id={`question-${id}`}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.discovery.questionPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs text-navy-400 self-center me-1">{t.common.examples}</span>
            {[
              { label: 'Breast cancer CDK4/6 resistance', ct: 'Breast cancer', g: 'CDK4', d: 'CDK4/6 inhibitor', q: 'resistance' },
              { label: 'Lung cancer EGFR resistance', ct: 'Lung cancer', g: 'EGFR', d: 'EGFR inhibitor', q: 'resistance' },
              { label: 'Glioblastoma trials', ct: 'Glioblastoma', g: '', d: '', q: '' },
            ].map((ex) => (
              <button
                key={ex.label}
                onClick={() => {
                  setCancerType(ex.ct);
                  setGene(ex.g);
                  setDrug(ex.d);
                  setQuestion(ex.q);
                  setQuickQuery('');
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-navy-50 text-navy-500 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
