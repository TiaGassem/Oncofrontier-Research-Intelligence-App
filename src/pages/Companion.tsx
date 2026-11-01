import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Heart, Search, BookOpen, TrendingUp, Activity, ClipboardList,
  MessageSquare, ShieldCheck, Send, ExternalLink, AlertTriangle,
  Info, Eye, Copy, Printer, CheckCircle2, ArrowLeft,
  AlertCircle, Lightbulb, Mic, Paperclip, FileText, X,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { BrandMark } from '@/components/BrandMark';
import { useApp } from '@/context/AppContext';
import { getTranslation, type CompanionT } from '@/lib/i18n';
import {
  useCompanionChat, ChatBubble, MicStatusBanner, QuickPrompts,
} from '@/components/CompanionChatCore';
import { useA11ySpeech } from '@/lib/a11yPrefs';
import { ConversationManager } from '@/components/ConversationManager';
import {
  CANCER_DICTIONARY, SURVIVAL_STATS, COMORBIDITIES, CONDITIONS,
  AWARENESS_PREVENTION, AWARENESS_SCREENING, AWARENESS_MYTHS,
  AWARENESS_WHEN_TO_SEE_DOCTOR, APPOINTMENT_QUESTIONS,
  type CancerEntry,
} from '@/lib/companionData';

type CompanionTab = 'welcome' | 'understand' | 'prognosis' | 'conditions' | 'whatToDo' | 'chat' | 'awareness';

export function Companion() {
  const { language, direction } = useApp();
  const t = getTranslation(language);
  const tc = t.companion;
  const [tab, setTab] = useState<CompanionTab>('welcome');

  const tabs: { id: CompanionTab; label: string; desc: string; icon: typeof Heart }[] = [
    { id: 'understand', label: tc.understandCancer, desc: tc.understandCancerDesc, icon: BookOpen },
    { id: 'prognosis', label: tc.prognosis, desc: tc.prognosisDesc, icon: TrendingUp },
    { id: 'conditions', label: tc.conditions, desc: tc.conditionsDesc, icon: Activity },
    { id: 'whatToDo', label: tc.whatToDo, desc: tc.whatToDoDesc, icon: ClipboardList },
    { id: 'chat', label: tc.chat, desc: tc.chatDesc, icon: MessageSquare },
    { id: 'awareness', label: tc.awareness, desc: tc.awarenessDesc, icon: ShieldCheck },
  ];

  return (
    <div className="animate-fade-in" dir={direction}>
      {tab === 'welcome' ? (
        <WelcomeView tc={tc} tabs={tabs} onNavigate={setTab} />
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setTab('welcome')}
              className="flex items-center gap-1 text-xs text-navy-500 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {tc.backToCompanion}
            </button>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-4 flex items-start gap-2">
            <Heart className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-900 leading-relaxed">{tc.companionDisclaimer}</p>
          </div>

          {tab === 'understand' && <UnderstandCancer tc={tc} />}
          {tab === 'prognosis' && <SurvivalPrognosis tc={tc} />}
          {tab === 'conditions' && <ConditionNavigator tc={tc} />}
          {tab === 'whatToDo' && <WhatCanIDo tc={tc} />}
          {tab === 'chat' && <CompanionChat tc={tc} />}
          {tab === 'awareness' && <CancerAwareness tc={tc} />}
        </>
      )}
    </div>
  );
}

// ─── Welcome View ────────────────────────────────────────────────────────────

function WelcomeView({
  tc, tabs, onNavigate,
}: {
  tc: CompanionT;
  tabs: { id: CompanionTab; label: string; desc: string; icon: typeof Heart }[];
  onNavigate: (tab: CompanionTab) => void;
}) {
  return (
    <>
      <PageHeader
        icon={<Heart className="w-6 h-6 text-teal-400" />}
        title={tc.welcome}
        subtitle={tc.welcomeSubtitle}
        accent="teal"
      />

      <div className="bg-gradient-to-br from-teal-50 to-navy-50/50 rounded-2xl p-6 md:p-8 mb-6 border border-teal-100">
        <p className="text-sm md:text-base text-navy-700 leading-relaxed">{tc.welcomeIntro}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-teal-700">
          <Heart className="w-4 h-4" />
          <span className="font-medium">{tc.forPatients}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="group bg-white rounded-2xl border border-navy-100 p-5 text-start hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-sm mb-1">{tab.label}</h3>
              <p className="text-xs text-navy-500 leading-relaxed">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.companionLongDisclaimer}</p>
        </div>
      </div>
    </>
  );
}

// ─── Feature A: Understand My Cancer ─────────────────────────────────────────

function UnderstandCancer({ tc }: { tc: CompanionT }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CancerEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const matches = useMemo(() => {
    if (!search.trim()) return [];
    const lower = search.toLowerCase();
    return CANCER_DICTIONARY.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.aliases.some((a) => a.toLowerCase().includes(lower)) ||
        c.id.includes(lower)
    ).slice(0, 8);
  }, [search]);

  if (selected) {
    return (
      <CancerDetail
        cancer={selected}
        tc={tc}
        onBack={() => {
          setSelected(null);
          setShowDetail(false);
        }}
        showDetail={showDetail}
        onToggleDetail={() => setShowDetail(!showDetail)}
      />
    );
  }

  return (
    <>
      <PageHeader
        icon={<BookOpen className="w-6 h-6 text-teal-400" />}
        title={tc.understandCancer}
        subtitle={tc.understandCancerDesc}
        accent="teal"
      />

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <label className="text-sm font-medium text-navy-700 mb-2 block">{tc.searchCancer}</label>
        <div className="relative">
          <Search className="w-5 h-5 text-navy-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tc.searchPlaceholder}
            className="w-full ps-11 pe-4 py-3 text-sm bg-navy-50 rounded-xl border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            autoFocus
          />
        </div>

        {search.trim() && matches.length === 0 && (
          <div className="mt-4 bg-navy-50 rounded-xl p-4">
            <p className="text-sm text-navy-600">{tc.noMatch}</p>
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-4 space-y-2">
            {matches.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-start p-4 bg-navy-50/50 hover:bg-teal-50 border border-navy-100 hover:border-teal-200 rounded-xl transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy-900 text-sm">{c.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    {tc.uncertainMatch}
                  </span>
                </div>
                <p className="text-xs text-navy-500 line-clamp-2">{c.simpleExplanation}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-teal-900 leading-relaxed">{tc.confirmWithDoctor}</p>
        </div>
      </div>
    </>
  );
}

function CancerDetail({
  cancer, tc, onBack, showDetail, onToggleDetail,
}: {
  cancer: CancerEntry;
  tc: CompanionT;
  onBack: () => void;
  showDetail: boolean;
  onToggleDetail: () => void;
}) {
  return (
    <>
      <PageHeader
        icon={<BookOpen className="w-6 h-6 text-teal-400" />}
        title={cancer.name}
        subtitle={tc.simpleExplain}
        accent="teal"
      />

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.whatIs}</h3>
        <p className="text-sm text-navy-700 leading-relaxed">{cancer.simpleExplanation}</p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.whereStarts}</h3>
        <p className="text-sm text-navy-700 leading-relaxed">{cancer.whereItStarts}</p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.howSpreads}</h3>
        <p className="text-sm text-navy-700 leading-relaxed">{cancer.howItSpreads}</p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          {tc.riskFactors}
        </h3>
        <ul className="space-y-1.5">
          {cancer.riskFactors.map((rf, i) => (
            <li key={i} className="text-sm text-navy-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              {rf}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          {tc.symptoms}
        </h3>
        <ul className="space-y-1.5">
          {cancer.symptoms.map((s, i) => (
            <li key={i} className="text-sm text-navy-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.diagnosis}</h3>
        <p className="text-sm text-navy-700 leading-relaxed">{cancer.diagnosis}</p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.staging}</h3>
        <p className="text-sm text-navy-700 leading-relaxed">{cancer.staging}</p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
        <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-500" />
          {tc.treatments}
        </h3>
        <ul className="space-y-1.5">
          {cancer.treatments.map((tx, i) => (
            <li key={i} className="text-sm text-navy-700 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
              {tx}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onToggleDetail}
        className="w-full bg-navy-50 hover:bg-navy-100 rounded-xl p-3 text-sm font-medium text-navy-700 transition-colors mb-4"
      >
        {showDetail ? tc.deeperDetail : tc.simpleExplain}
      </button>

      <div className="bg-navy-50/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">{tc.source}</span>
        </div>
        <a
          href={cancer.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
        >
          {cancer.sourceName} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.notMedicalAdvice}</p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-navy-600 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {tc.backToCompanion}
      </button>
    </>
  );
}

// ─── Feature B: Survival & Prognosis ─────────────────────────────────────────

function SurvivalPrognosis({ tc }: { tc: CompanionT }) {
  const [selectedCancer, setSelectedCancer] = useState<string>('');

  const cancerStats = useMemo(
    () => (selectedCancer ? SURVIVAL_STATS.filter((s) => s.cancerId === selectedCancer) : []),
    [selectedCancer]
  );

  const cancerOptions = useMemo(() => {
    const ids = new Set(SURVIVAL_STATS.map((s) => s.cancerId));
    return CANCER_DICTIONARY.filter((c) => ids.has(c.id));
  }, []);

  return (
    <>
      <PageHeader
        icon={<TrendingUp className="w-6 h-6 text-teal-400" />}
        title={tc.prognosis}
        subtitle={tc.prognosisDesc}
        accent="teal"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.survivalDisclaimer}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <label className="text-sm font-medium text-navy-700 mb-2 block">{tc.searchCancer}</label>
        <select
          value={selectedCancer}
          onChange={(e) => setSelectedCancer(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-navy-50 rounded-xl border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
        >
          <option value="">-- {tc.searchPlaceholder}</option>
          {cancerOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {!selectedCancer && (
        <div className="text-center py-12 text-navy-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{tc.searchCancer}</p>
        </div>
      )}

      {selectedCancer && cancerStats.length === 0 && (
        <div className="bg-navy-50 rounded-xl p-6 text-center">
          <p className="text-sm text-navy-600">{tc.noSurvivalData}</p>
        </div>
      )}

      {cancerStats.length > 0 && (
        <div className="space-y-4">
          {cancerStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-5 text-white">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-teal-50 mt-1">{stat.statisticType}</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-navy-400 uppercase">{tc.population}</span>
                    <p className="text-xs text-navy-700">{stat.population}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-navy-400 uppercase">{tc.geography}</span>
                    <p className="text-xs text-navy-700">{stat.geography}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-navy-400 uppercase">{tc.dataPeriod}</span>
                    <p className="text-xs text-navy-700">{stat.dataPeriod}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-navy-400 uppercase">{tc.source}</span>
                    <a
                      href={stat.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                    >
                      {stat.sourceName} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-3">
                  <span className="text-[10px] font-semibold text-teal-700 uppercase">{tc.whatItMeans}</span>
                  <p className="text-xs text-navy-700 mt-1 leading-relaxed">{stat.whatItMeans}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-3">
                  <span className="text-[10px] font-semibold text-amber-700 uppercase">{tc.whatItCantTell}</span>
                  <p className="text-xs text-navy-700 mt-1 leading-relaxed">{stat.whatItCantTell}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Feature C: Condition Navigator ──────────────────────────────────────────

function ConditionNavigator({ tc }: { tc: CompanionT }) {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedCancer, setSelectedCancer] = useState<string>('');

  const availableCancers = useMemo(() => {
    if (!selectedCondition) return [];
    const cancerIds = new Set(
      COMORBIDITIES.filter((c) => c.conditionId === selectedCondition).map((c) => c.cancerId)
    );
    return CANCER_DICTIONARY.filter((c) => cancerIds.has(c.id));
  }, [selectedCondition]);

  const comorbidity = useMemo(
    () =>
      COMORBIDITIES.find(
        (c) => c.conditionId === selectedCondition && c.cancerId === selectedCancer
      ),
    [selectedCondition, selectedCancer]
  );

  const evidenceLevelConfig = {
    established: { label: 'Established evidence', color: 'bg-green-100 text-green-700 border-green-200' },
    emerging: { label: 'Emerging evidence', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    limited: { label: 'Limited evidence', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  };

  return (
    <>
      <PageHeader
        icon={<BrandMark className="w-6 h-6 text-teal-400" />}
        title={tc.conditions}
        subtitle={tc.conditionsDesc}
        accent="teal"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.conditionsDisclaimer}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-navy-700 mb-2 block">{tc.selectCondition}</label>
          <select
            value={selectedCondition}
            onChange={(e) => {
              setSelectedCondition(e.target.value);
              setSelectedCancer('');
            }}
            className="w-full px-4 py-2.5 text-sm bg-navy-50 rounded-xl border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
          >
            <option value="">-- {tc.selectCondition}</option>
            {CONDITIONS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {availableCancers.length > 0 && (
          <div>
            <label className="text-sm font-medium text-navy-700 mb-2 block">{tc.searchCancer}</label>
            <select
              value={selectedCancer}
              onChange={(e) => setSelectedCancer(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-navy-50 rounded-xl border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
            >
              <option value="">-- {tc.searchCancer}</option>
              {availableCancers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedCondition && selectedCancer && !comorbidity && (
        <div className="bg-navy-50 rounded-xl p-6 text-center">
          <p className="text-sm text-navy-600">{tc.noConditionData}</p>
        </div>
      )}

      {comorbidity && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${evidenceLevelConfig[comorbidity.evidenceLevel].color}`}>
              {evidenceLevelConfig[comorbidity.evidenceLevel].label}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.cancerRisk}</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{comorbidity.cancerRisk}</p>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.prognosisImpact}</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{comorbidity.prognosisImpact}</p>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.treatmentInteractions}</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{comorbidity.treatmentInteractions}</p>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.management}</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{comorbidity.management}</p>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{tc.evidenceGaps}</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{comorbidity.evidenceGaps}</p>
          </div>

          <div className="bg-navy-50/50 rounded-xl p-4">
            <a
              href={comorbidity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              {comorbidity.sourceName} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Feature D: What Can I Do Now ────────────────────────────────────────────

function WhatCanIDo({ tc }: { tc: CompanionT }) {
  const [copied, setCopied] = useState(false);
  const checklistRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    const text = APPOINTMENT_QUESTIONS.map((cat) =>
      `${cat.category}\n${cat.questions.map((q) => `  - ${q}`).join('\n')}`
    ).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const sections: { title: string; icon: typeof Heart; content: string }[] = [
    { title: tc.appointmentPrep, icon: ClipboardList, content: 'Write down your questions before the appointment. Bring a notebook or use your phone to take notes. Consider bringing a family member or friend — it is hard to remember everything. Ask if you can record the conversation (with permission). Bring a list of all your medications, including supplements and over-the-counter drugs.' },
    { title: tc.medicationTracking, icon: ClipboardList, content: 'Keep an up-to-date list of all medications, including: prescription drugs, over-the-counter medicines, vitamins, and herbal supplements. Some supplements can interact with cancer treatments. Always tell your care team about everything you take. Never stop or change a medication without discussing with your doctor first.' },
    { title: tc.symptomTracking, icon: ClipboardList, content: 'Keep a daily diary of how you feel. Note: pain (where and how strong, 0-10), side effects (nausea, fatigue, etc.), appetite and what you ate, temperature (if you have a fever, call your care team), and any new symptoms. This helps your doctor understand how treatment is affecting you.' },
    { title: tc.nutrition, icon: ClipboardList, content: 'Eating well during cancer treatment helps maintain strength. Eat small, frequent meals if you have nausea. Stay hydrated — drink water throughout the day. Some treatments require avoiding certain foods. Ask if you should see a dietitian. Gentle activity like short walks can help with appetite and energy. Ask your doctor before starting any exercise program.' },
    { title: tc.emotionalSupport, icon: Heart, content: 'It is normal to feel scared, angry, or sad. These feelings are valid. Consider talking to a counselor or therapist who specializes in cancer. Join a support group — connecting with others who understand can help. Caregivers also need support — do not forget to care for yourself if you are caring for someone. Ask your care team about available psychological support.' },
    { title: tc.palliativeCare, icon: Heart, content: 'Palliative care is specialized care focused on quality of life. It is NOT only for end of life — it can be helpful at any stage of cancer treatment. Palliative care helps manage pain, symptoms, and stress. It can be provided alongside curative treatment. Ask your oncologist if palliative care might help you or your loved one.' },
    { title: tc.clinicalTrialsInfo, icon: ClipboardList, content: 'Clinical trials test new treatments. They may offer access to treatments not yet widely available. Participation is voluntary and you can leave at any time. Trials have strict eligibility criteria — not everyone qualifies. Being in a trial does not guarantee benefit. Ask your oncologist if there are any trials that might be appropriate for your situation. You can also search at ClinicalTrials.gov.' },
  ];

  return (
    <>
      <PageHeader
        icon={<ClipboardList className="w-6 h-6 text-teal-400" />}
        title={tc.whatToDo}
        subtitle={tc.whatToDoDesc}
        accent="teal"
      />

      <div className="space-y-3 mb-6">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="text-sm font-bold text-navy-900 mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4 text-teal-500" />
                {s.title}
              </h3>
              <p className="text-sm text-navy-600 leading-relaxed">{s.content}</p>
            </div>
          );
        })}
      </div>

      {/* Appointment checklist */}
      <div ref={checklistRef} className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-500" />
            {tc.checklist}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-navy-50 text-navy-600 rounded-lg hover:bg-navy-100 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? tc.copied : tc.copyChecklist}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-navy-50 text-navy-600 rounded-lg hover:bg-navy-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              {tc.printChecklist}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {APPOINTMENT_QUESTIONS.map((cat, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">{cat.category}</h4>
              <ul className="space-y-1.5">
                {cat.questions.map((q, j) => (
                  <li key={j} className="text-sm text-navy-700 flex items-start gap-2">
                    <span className="w-4 h-4 border-2 border-navy-200 rounded flex-shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.whatToDoDisclaimer}</p>
        </div>
      </div>
    </>
  );
}

// ─── Feature E: Companion Chat ───────────────────────────────────────────────
// The chat engine (state, AI provider, fallback, voice) lives in
// CompanionChatCore and is shared with the floating bubble.

function CompanionChat({ tc }: { tc: CompanionT }) {
  const a11y = useA11ySpeech();
  const [showHistory, setShowHistory] = useState(false);
  const {
    messages, input, setInput, loading, aiNotice,
    mic, dismissMicMessage, stopSpeaking,
    listening, speakingMsgId, send, speak, toggleListening, canListen, canSpeak,
    startNewChat,
    attachments, addFiles, removeAttachment, attachmentErrors, dismissAttachmentErrors,
    needsAudioConsent, grantAudioConsent,
  } = useCompanionChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPrompt = (text: string) => {
    if (text === tc.qpReadAloud) {
      const last = [...messages].reverse().find((m) => m.role === 'assistant' && m.content.trim());
      if (last) speak(last);
      return;
    }
    void send(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <>
      <PageHeader
        icon={<MessageSquare className="w-6 h-6 text-teal-400" />}
        title={tc.chat}
        subtitle={tc.chatDesc}
        accent="teal"
      />

      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-800 leading-relaxed">{tc.chatSafetyBanner}</p>
      </div>

      {aiNotice !== 'none' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4" role="status">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              {aiNotice === 'auth' && tc.aiProviderAuth}
              {aiNotice === 'signIn' && tc.aiSignInRequired}
              {aiNotice === 'network' && tc.aiProviderNetwork}
              {aiNotice === 'quota' && tc.aiProviderQuota}
              {aiNotice === 'error' && tc.aiProviderError}
            </p>
          </div>
        </div>
      )}

      {attachmentErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4" role="alert">
          {attachmentErrors.map((e, i) => (
            <p key={i} className="text-xs text-red-800 leading-relaxed">{e}</p>
          ))}
          <button onClick={dismissAttachmentErrors} className="text-xs text-red-700 underline mt-1">
            Dismiss
          </button>
        </div>
      )}

      <MicStatusBanner
        mic={mic}
        onDismiss={dismissMicMessage}
        input={input}
        send={() => void send()}
        needsAudioConsent={needsAudioConsent}
        onGrantConsent={grantAudioConsent}
        micStop={toggleListening}
      />

      <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 mb-4">
        <p className="text-[11px] text-amber-800 leading-relaxed">{tc.privacyNotice}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-navy-400">
          {messages.length > 0 ? `${messages.length}` : ''}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            aria-expanded={showHistory}
            className="text-xs text-navy-500 hover:text-teal-600 transition-colors"
          >
            {showHistory ? 'Hide history' : 'Chat history'}
          </button>
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              className="text-xs text-navy-500 hover:text-teal-600 transition-colors"
            >
              Start new conversation
            </button>
          )}
        </div>
      </div>

      {showHistory && (
        <div className="bg-white rounded-xl border border-navy-100 mb-4 max-h-72 overflow-hidden flex flex-col">
          <ConversationManager />
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-100 p-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-navy-200 mx-auto mb-3" />
            <p className="text-sm text-navy-500">{tc.chatIntro}</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              canSpeak={canSpeak}
              speaking={speakingMsgId === msg.id}
              onSpeak={() => speak(msg)}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs text-navy-500">
                {loading
                  ? (messages.length > 0 && messages[messages.length - 1]?.role === 'assistant'
                    ? 'Thinking...'
                    : 'Searching medical sources...')
                  : ''}
              </p>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-2">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pt-1 pb-2">
            {attachments.map((att) => (
              <span key={att.id} className="inline-flex items-center gap-1.5 bg-navy-50 rounded-lg ps-2 pe-1 py-1">
                {att.kind === 'image' && att.previewUrl ? (
                  <img src={att.previewUrl} alt={att.file.name} className="w-6 h-6 rounded object-cover" />
                ) : (
                  <FileText className="w-4 h-4 text-navy-500 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="text-[11px] text-navy-700 truncate max-w-[10rem]">{att.file.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  aria-label={`Remove ${att.file.name}`}
                  className="p-0.5 rounded hover:bg-navy-100"
                >
                  <X className="w-3.5 h-3.5 text-navy-500" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label={tc.attachFile}
            title={tc.attachFileMax}
            className="p-2 rounded-lg bg-navy-50 text-navy-500 hover:bg-navy-100 transition-colors"
          >
            <Paperclip className="w-4 h-4" aria-hidden="true" />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={tc.chatPlaceholder}
            aria-label={tc.chatPlaceholder}
            aria-describedby="companion-type-hint"
            dir={/[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(input) ? 'rtl' : 'ltr'}
            className="flex-1 resize-none max-h-28 bg-transparent text-sm leading-relaxed text-navy-900 placeholder-navy-300 outline-none px-2 py-1.5"
            style={{ height: `${Math.min(7, Math.max(1, input.split('\n').length)) * 1.5 + 0.75}rem` }}
          />
          {canListen && (
            <button
              onClick={toggleListening}
              aria-pressed={listening}
              className={`p-2 rounded-lg transition-colors ${
                listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="sr-only">{listening ? tc.stopVoiceInput : tc.voiceInput}</span>
            </button>
          )}
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            {tc.sendToChat}
          </button>
        </div>
      </div>

      <p id="companion-type-hint" className="text-xs text-navy-400 mt-3 leading-relaxed">
        {tc.typeInsteadHint}
      </p>
      <p className="text-xs text-navy-400 mt-2 leading-relaxed">{tc.chatDisclaimer}</p>

      <QuickPrompts
        tc={tc}
        onPrompt={onPrompt}
        canSpeak={canSpeak}
        speaking={speakingMsgId !== null}
        onStopSpeaking={stopSpeaking}
        quickPhrases={a11y.quickPhrases}
      />
    </>
  );
}

// ─── Feature F: Cancer Awareness ─────────────────────────────────────────────

function CancerAwareness({ tc }: { tc: CompanionT }) {
  const [section, setSection] = useState<'prevention' | 'screening' | 'myths' | 'whenToSee'>('prevention');

  const sections: { id: typeof section; label: string; icon: typeof Heart }[] = [
    { id: 'prevention', label: tc.prevention, icon: ShieldCheck },
    { id: 'screening', label: tc.screening, icon: Eye },
    { id: 'myths', label: tc.myths, icon: Lightbulb },
    { id: 'whenToSee', label: tc.whenToSeeDoctor, icon: AlertTriangle },
  ];

  return (
    <>
      <PageHeader
        icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
        title={tc.awareness}
        subtitle={tc.awarenessDesc}
        accent="teal"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                active ? 'bg-teal-500 text-white shadow-sm' : 'bg-white text-navy-600 border border-navy-100 hover:border-teal-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {section === 'prevention' && (
        <div className="space-y-3">
          {AWARENESS_PREVENTION.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="text-sm font-bold text-navy-900 mb-2">{item.title}</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-3">{item.content}</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
              >
                {item.sourceName} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}

      {section === 'screening' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>{tc.screeningVsDiagnosis}:</strong> {tc.screeningVsDiagnosisBody}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {AWARENESS_SCREENING.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed mb-3">{item.content}</p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                >
                  {item.sourceName} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'myths' && (
        <div className="space-y-3">
          {AWARENESS_MYTHS.map((mf, i) => (
            <div key={i} className="bg-white rounded-2xl border border-navy-100 p-5">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">{tc.mythBadge}</span>
                <p className="text-sm text-navy-700">{mf.myth}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">{tc.factBadge}</span>
                <p className="text-sm text-navy-600 leading-relaxed">{mf.fact}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'whenToSee' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-navy-100 p-6">
            <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              {tc.whenToSeeDoctor}
            </h3>
            <ul className="space-y-2">
              {AWARENESS_WHEN_TO_SEE_DOCTOR.map((sign, i) => (
                <li key={i} className={`text-sm flex items-start gap-2 ${sign.startsWith('Note:') ? 'text-navy-500 italic mt-2' : 'text-navy-700'}`}>
                  {!sign.startsWith('Note:') && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />}
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tc.awarenessDisclaimer}</p>
        </div>
      </div>
    </>
  );
}
