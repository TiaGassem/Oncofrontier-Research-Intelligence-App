import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Info,
  GraduationCap,
  Stethoscope,
  Microscope,
  Users,
  ClipboardList,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { unifiedSearch } from '@/lib/search';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { useBilling } from '@/context/BillingContext';
import { billingT, featureLabel } from '@/lib/billingTranslations';
import type { ChatMessage, ExplanationLevel, ResearchRecord, SearchResult } from '@/types';

const LEVEL_CONFIG: Record<
  ExplanationLevel,
  { label: string; icon: typeof Users; description: string }
> = {
  public: { label: 'Public', icon: Users, description: 'Plain language, no jargon' },
  student: { label: 'Student', icon: GraduationCap, description: 'Educational with key terms explained' },
  researcher: { label: 'Researcher', icon: Microscope, description: 'Technical, detailed evidence' },
  clinical: { label: 'Clinical/Industry', icon: Stethoscope, description: 'Evidence level, limitations, provenance' },
};

const SUGGESTED_QUESTIONS = [
  'What is known about EGFR resistance in lung cancer?',
  'Find recent trials for glioblastoma immunotherapy',
  'What mechanisms drive CDK4/6 inhibitor resistance in breast cancer?',
  'Summarize research on MGMT and temozolomide resistance in glioblastoma',
];

function parseQuery(input: string): {
  cancerType?: string;
  gene?: string;
  drug?: string;
  question?: string;
} {
  const lower = input.toLowerCase();
  const result: { cancerType?: string; gene?: string; drug?: string; question?: string } = {};

  const cancerKeywords = [
    'breast cancer', 'lung cancer', 'glioblastoma', 'colorectal cancer', 'prostate cancer',
    'pancreatic cancer', 'melanoma', 'leukemia', 'ovarian cancer', 'bladder cancer',
    'lymphoma', 'myeloma', 'thyroid cancer', 'liver cancer', 'gastric cancer',
    'esophageal cancer', 'cervical cancer', 'head and neck cancer', 'kidney cancer',
    'sarcoma', 'mesothelioma',
  ];

  for (const c of cancerKeywords) {
    if (lower.includes(c.toLowerCase())) {
      result.cancerType = c;
      break;
    }
  }

  const genePatterns = [
    'EGFR', 'CDK4', 'CDK6', 'TP53', 'KRAS', 'BRAF', 'MGMT', 'AR', 'PTEN', 'PIK3CA',
    'BRCA1', 'BRCA2', 'ALK', 'ROS1', 'MET', 'HER2', 'MYC', 'APC', 'VHL', 'RB1',
  ];

  for (const g of genePatterns) {
    const regex = new RegExp(`\\b${g}\\b`, 'i');
    if (regex.test(input)) {
      result.gene = g;
      break;
    }
  }

  const drugKeywords = [
    'temozolomide', 'cisplatin', 'carboplatin', 'paclitaxel', 'doxorubicin',
    'imatinib', 'gefitinib', 'erlotinib', 'osimertinib', 'crizotinib',
    'vemurafenib', 'dabrafenib', 'trametinib', 'pembrolizumab', 'nivolumab',
    'trastuzumab', 'bevacizumab', 'cetuximab', 'rituximab', 'enzalutamide',
    'palbociclib', 'ribociclib', 'abemaciclib', 'CDK4/6 inhibitor',
    'EGFR inhibitor', 'BRAF inhibitor', 'immunotherapy', 'checkpoint inhibitor',
    'CAR-T', 'chemotherapy', 'radiation', 'radiotherapy',
  ];

  for (const d of drugKeywords) {
    if (lower.includes(d.toLowerCase())) {
      result.drug = d;
      break;
    }
  }

  if (lower.includes('resistance')) result.question = 'resistance mechanism';
  else if (lower.includes('trial') || lower.includes('clinical trial')) result.question = 'clinical trial';
  else if (lower.includes('treatment') || lower.includes('therapy')) result.question = 'treatment';
  else if (lower.includes('mechanism')) result.question = 'mechanism';
  else if (lower.includes('prognos') || lower.includes('survival')) result.question = 'prognosis';
  else if (lower.includes('diagnos') || lower.includes('biomarker')) result.question = 'biomarker';

  return result;
}

function generateSummary(
  searchResult: SearchResult,
  parsed: { cancerType?: string; gene?: string; drug?: string; question?: string },
  level: ExplanationLevel
): { content: string; caveats: string[] } {
  const pubs = searchResult.records.filter((r) => r.kind === 'publication');
  const trials = searchResult.records.filter((r) => r.kind === 'trial');
  const caveats: string[] = [];

  const contextParts = [parsed.cancerType, parsed.gene, parsed.drug]
    .filter(Boolean)
    .join(' · ');

  const lines: string[] = [];

  // Level-appropriate intro
  if (level === 'public') {
    lines.push(
      `Here's what I found about ${contextParts || 'your question'} in published research and clinical trials.`
    );
  } else if (level === 'student') {
    lines.push(
      `I searched PubMed, Europe PMC, and ClinicalTrials.gov for "${contextParts}". Here's a structured summary of what the sources show.`
    );
  } else if (level === 'researcher') {
    lines.push(
      `Search results for "${searchResult.query}" across PubMed, Europe PMC, and ClinicalTrials.gov (retrieved ${new Date(searchResult.timestamp).toLocaleString()}).`
    );
  } else {
    lines.push(
      `Source-grounded retrieval for "${searchResult.query}". Retrieved ${new Date(searchResult.timestamp).toISOString()}. Results below are from PubMed E-utilities, Europe PMC REST API, and ClinicalTrials.gov API v2.`
    );
  }

  lines.push('');

  if (searchResult.records.length === 0) {
    lines.push('No records were retrieved for this query.');
    caveats.push('No results returned from any source. Consider broadening or rephrasing the query.');
    if (searchResult.errors.length > 0) {
      caveats.push(`${searchResult.errors.length} source(s) returned errors.`);
    }
    return { content: lines.join('\n'), caveats };
  }

  // Publications summary
  if (pubs.length > 0) {
    lines.push(`## Publications Found: ${pubs.length}`);
    lines.push('');
    const topPubs = pubs.slice(0, 5);
    topPubs.forEach((pub, i) => {
      const id = pub.pmid ? `PMID: ${pub.pmid}` : pub.doi ? `DOI: ${pub.doi}` : '';
      const date = pub.pubDate ? ` (${pub.pubDate.split(' ')[0]})` : '';
      lines.push(`${i + 1}. **${pub.title}**${date}`);
      if (pub.journal) lines.push(`   Journal: ${pub.journal}`);
      if (id) lines.push(`   ${id}`);
      if (level === 'clinical' || level === 'researcher') {
        if (pub.publicationType) lines.push(`   Type: ${pub.publicationType}`);
        if (pub.accessStatus === 'open') lines.push(`   Access: Open access`);
        else if (pub.accessStatus === 'free') lines.push(`   Access: Free full text`);
        else lines.push(`   Access: ${pub.accessStatus}`);
      }
      lines.push(`   Source: ${pub.sourceUrl}`);
    });
    if (pubs.length > 5) lines.push(`\n... and ${pubs.length - 5} more publications.`);
  }

  // Trials summary
  if (trials.length > 0) {
    lines.push(`\n## Clinical Trials Found: ${trials.length}`);
    lines.push('');
    const topTrials = trials.slice(0, 5);
    topTrials.forEach((trial, i) => {
      lines.push(`${i + 1}. **${trial.title}**`);
      if (trial.nctId) lines.push(`   NCT: ${trial.nctId}`);
      if (trial.trialStatus) lines.push(`   Status: ${trial.trialStatus}`);
      if (trial.trialPhase) lines.push(`   Phase: ${trial.trialPhase}`);
      if (trial.trialSponsor) lines.push(`   Sponsor: ${trial.trialSponsor}`);
      if (trial.trialEnrollment != null) lines.push(`   Enrollment: ${trial.trialEnrollment.toLocaleString()}`);
      lines.push(`   Source: ${trial.sourceUrl}`);
    });
    if (trials.length > 5) lines.push(`\n... and ${trials.length - 5} more trials.`);
  }

  // Level-specific caveats
  lines.push('');
  if (level === 'public') {
    lines.push('**Important:** These are real research papers and trials, not medical advice. Talk to a doctor for health decisions.');
  } else if (level === 'student') {
    lines.push('**Note:** These results show what has been published, not what is proven. Some papers may contradict others, and many findings are preliminary.');
  } else if (level === 'researcher') {
    lines.push('**Evidence notes:** Results include mixed publication types (original research, reviews, etc.). Abstracts may not reflect full-text findings. Deduplication was performed by PMID/DOI.');
  } else {
    lines.push('**Clinical/Industry caveats:**');
    lines.push('- Evidence levels vary across retrieved records (preclinical, observational, RCT)');
    lines.push('- Abstracts are source-reported; full-text verification is required before clinical application');
    lines.push('- Trial statuses are as reported to ClinicalTrials.gov and may not reflect real-time enrollment');
    lines.push('- This tool does not provide clinical recommendations');
  }

  // Source errors
  if (searchResult.errors.length > 0) {
    caveats.push(`${searchResult.errors.length} source(s) returned errors. Results may be incomplete.`);
    searchResult.errors.forEach((err) => caveats.push(`${err.provider}: ${err.message}`));
  }

  if (searchResult.totalFound > searchResult.records.length) {
    caveats.push(
      `Total matching records across sources: ${searchResult.totalFound}. Showing top ${searchResult.records.length} after deduplication.`
    );
  }

  caveats.push('This assistant retrieves and organizes real records. It does not generate novel interpretations or claims beyond what the sources state.');

  return { content: lines.join('\n'), caveats };
}

export function ResearchAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<ExplanationLevel>('researcher');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { toggleRecord, isRecordSelected, setCurrentView, selectedRecords, language } = useApp();
  const { canUse, recordUse, limitReached } = useBilling();
  const bt = billingT(language);
  const [planBlocked, setPlanBlocked] = useState(false);
  const t = getTranslation(language);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(
    async (queryText?: string) => {
      const text = (queryText ?? input).trim();
      if (!text || loading) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        level,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      const parsed = parseQuery(text);

      if (!parsed.cancerType && !parsed.gene && !parsed.drug && !parsed.question) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: `I can help you explore cancer research. To search effectively, I need at least one of these:\n\n- **Cancer type** (e.g. "breast cancer", "glioblastoma")\n- **Gene or target** (e.g. "EGFR", "CDK4")\n- **Drug or therapy** (e.g. "temozolomide", "immunotherapy")\n- **Research topic** (e.g. "resistance", "clinical trials")\n\nTry asking something like: "What is known about EGFR resistance in lung cancer?"`,
          timestamp: new Date().toISOString(),
          caveats: ['No searchable terms detected in your question.'],
          level,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        return;
      }

      if (!canUse('assistantQueries')) {
        setPlanBlocked(true);
        setLoading(false);
        return;
      }
      setPlanBlocked(false);

      const searchResult = await unifiedSearch({
        cancerType: parsed.cancerType,
        gene: parsed.gene,
        drug: parsed.drug,
        treatment: parsed.drug,
        question: parsed.question,
        maxResults: 15,
      });
      recordUse('assistantQueries');

      const { content, caveats } = generateSummary(searchResult, parsed, level);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        sources: searchResult.records,
        caveats,
        level,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    },
    [input, loading, level, canUse, recordUse]
  );
  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-2rem)]">
      <PageHeader
        icon={<MessageSquare className="w-6 h-6" />}
        title={t.assistant.title}
        subtitle={t.assistant.subtitle}
      />

      {planBlocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            {bt.limitReachedNotice}{' '}
            <button onClick={() => setCurrentView('pricing')} className="underline font-medium">
              {bt.limitReachedCta}
            </button>
          </p>
        </div>
      )}
      {limitReached.assistantQueries && !planBlocked && (
        <p className="text-xs text-amber-800 mb-2" role="note">
          {bt.usage}: {featureLabel('assistantQueries', language)}
        </p>
      )}

      {/* Transparency banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-4 flex items-start gap-2">
        <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-teal-900 leading-relaxed">
          {t.assistant.transparencyBanner}
        </p>
      </div>

      {/* Explanation level selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-medium text-navy-500">{t.assistant.explanationLevel}</span>
        {(Object.keys(LEVEL_CONFIG) as ExplanationLevel[]).map((lvl) => {
          const cfg = LEVEL_CONFIG[lvl];
          const Icon = cfg.icon;
          const active = level === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${active ? 'bg-navy-700 text-white' : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-200'}
              `}
              title={cfg.description}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Selected records indicator */}
      {selectedRecords.length > 0 && (
        <div className="mb-3 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5">
          <span className="text-xs text-teal-800">
            {selectedRecords.length} {t.assistant.inPlanner}
          </span>
          <button
            onClick={() => setCurrentView('planner')}
            className="text-xs font-medium text-teal-700 hover:text-teal-900"
          >
            {t.curemap.viewPlanner}
          </button>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-navy-100 p-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-navy-200 mx-auto mb-3" />
            <h3 className="font-semibold text-navy-800 text-sm mb-1">{t.assistant.emptyTitle}</h3>
            <p className="text-xs text-navy-400 mb-4 max-w-md mx-auto">
              {t.assistant.emptyMessage}
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-sm px-4 py-2 rounded-xl bg-navy-50 text-navy-700 hover:bg-teal-50 hover:text-teal-700 transition-all text-start"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onToggleRecord={toggleRecord}
              isRecordSelected={isRecordSelected}
              onGoToPlanner={() => setCurrentView('planner')}
            />
          ))}

          {loading && (
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
              </div>
              <p className="text-sm text-navy-500">{t.assistant.searching}</p>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-navy-100 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder={t.assistant.inputPlaceholder}
          className="flex-1 bg-transparent text-sm text-navy-900 placeholder-navy-300 outline-none px-2"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          {t.assistant.send}
        </button>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  onToggleRecord: (record: ResearchRecord) => void;
  isRecordSelected: (record: ResearchRecord) => boolean;
  onGoToPlanner: () => void;
}

function ChatBubble({ message, onToggleRecord, isRecordSelected, onGoToPlanner }: ChatBubbleProps) {
  const { language } = useApp();
  const t = getTranslation(language);
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-navy-700 text-white rounded-2xl rounded-tr-md px-4 py-2.5">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] w-full">
        <div className="bg-navy-50/50 rounded-2xl rounded-tl-md px-4 py-3 border border-navy-100">
          <div className="text-sm text-navy-800 whitespace-pre-wrap leading-relaxed">
            {message.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return (
                  <p key={i} className="font-bold text-navy-900 text-sm mt-2 mb-1">
                    {line.replace('## ', '')}
                  </p>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold text-navy-700 text-xs mt-2">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }
              return <p key={i} className={line.startsWith('- ') ? 'ps-3 text-xs' : 'text-xs'}>{line}</p>;
            })}
          </div>

          {/* Caveats */}
          {message.caveats && message.caveats.length > 0 && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 space-y-0.5">
                  {message.caveats.map((c, i) => (
                    <p key={i}>{c}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-navy-700">
                  {t.assistant.sourcesCount} ({message.sources.length})
                </p>
                <button
                  onClick={onGoToPlanner}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                  <ClipboardList className="w-3 h-3" /> {t.assistant.addToPlanner}
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {message.sources.slice(0, 8).map((src) => {
                  const selected = isRecordSelected(src);
                  const idLabel = src.pmid
                    ? `PMID: ${src.pmid}`
                    : src.nctId
                      ? `NCT: ${src.nctId}`
                      : src.doi
                        ? `DOI: ${src.doi}`
                        : '';
                  return (
                    <div
                      key={src.id}
                      className="flex items-start gap-2 bg-white rounded-lg p-2 border border-navy-100"
                    >
                      <button
                        onClick={() => onToggleRecord(src)}
                        className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all ${
                          selected ? 'bg-teal-500 text-white' : 'bg-navy-50 text-navy-400 hover:bg-navy-100'
                        }`}
                        aria-label="Toggle selection"
                      >
                        {selected ? <span className="text-xs">✓</span> : <Plus className="w-3 h-3" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-navy-800 truncate">{src.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {idLabel && <span className="text-xs text-navy-400">{idLabel}</span>}
                          <a
                            href={src.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-xs text-teal-600 hover:text-teal-700"
                          >
                            <ExternalLink className="w-3 h-3" /> {t.assistant.view}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {message.sources.length > 8 && (
                  <p className="text-xs text-navy-400 text-center">
                    + {message.sources.length - 8} {t.assistant.moreSources}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

