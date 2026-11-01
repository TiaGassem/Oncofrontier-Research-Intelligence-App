import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Copy,
  Download,
  Trash2,
  FileText,
  FlaskConical,
  Check,
  GitCompare,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/States';
import { RecordCard } from '@/components/RecordCard';
import { useApp } from '@/context/AppContext';
import { useBilling } from '@/context/BillingContext';
import { getPlanCatalog } from '@/lib/billing';
import { billingT, featureLabel } from '@/lib/billingTranslations';
import { getTranslation } from '@/lib/i18n';
import type { ResearchBrief } from '@/types';

export function ActionPlanner() {
  const { selectedRecords, removeRecord, clearRecords, setCurrentView, language } = useApp();
  const t = getTranslation(language);
  const bt = billingT(language);
  const { planId, canUse, recordUse } = useBilling();
  const catalog = getPlanCatalog();
  // Plan-metered multi-document comparison: Free gets 3 per month (and up to
  // 3 records side by side); Pro/Institutional are unlimited. Sources and
  // citations inside the comparison always stay free.
  const compareAllowed = canUse('articleComparisons');
  const [comparison, setComparison] = useState(false);
  const [question, setQuestion] = useState('');
  const [cancerContext, setCancerContext] = useState('');
  const [findings, setFindings] = useState('');
  const [limitations, setLimitations] = useState('');
  const [unanswered, setUnanswered] = useState('');
  const [proposedNext, setProposedNext] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Auto-derive context from selected records
  const autoContext = useMemo(() => {
    const cancerTypes = new Set<string>();
    const genes = new Set<string>();
    const drugs = new Set<string>();

    selectedRecords.forEach((r) => {
      r.cancerTerms.forEach((t) => cancerTypes.add(t));
      r.targetTerms.forEach((t) => genes.add(t));
      r.treatmentTerms.forEach((t) => drugs.add(t));
    });

    const parts: string[] = [];
    if (cancerTypes.size > 0) parts.push(`Cancer: ${Array.from(cancerTypes).join(', ')}`);
    if (genes.size > 0) parts.push(`Targets: ${Array.from(genes).join(', ')}`);
    if (drugs.size > 0) parts.push(`Therapies: ${Array.from(drugs).join(', ')}`);
    return parts.join(' · ');
  }, [selectedRecords]);

  const pubCount = selectedRecords.filter((r) => r.kind === 'publication').length;
  const trialCount = selectedRecords.filter((r) => r.kind === 'trial').length;

  const buildBrief = (): ResearchBrief => {
    const references = selectedRecords.map((r) => {
      const id = r.pmid
        ? `PMID: ${r.pmid}`
        : r.doi
          ? `DOI: ${r.doi}`
          : r.nctId
            ? `NCT: ${r.nctId}`
            : r.id;
      return `${r.title}. ${id}. ${r.sourceUrl}`;
    });

    const evidenceTypes: string[] = [];
    if (pubCount > 0) evidenceTypes.push(`${pubCount} publication(s) from PubMed/Europe PMC`);
    if (trialCount > 0) evidenceTypes.push(`${trialCount} registered clinical trial(s) from ClinicalTrials.gov`);

    return {
      question: question || 'Research question to be defined',
      cancerContext: cancerContext || autoContext || 'Cancer context to be defined',
      records: selectedRecords,
      findings: findings
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      evidenceTypes,
      limitations: limitations
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      unansweredQuestions: unanswered
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      conflicts: [],
      proposedNextSteps: proposedNext
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      references,
      createdAt: new Date().toISOString(),
    };
  };

  const brief = buildBrief();

  const generateMarkdown = (): string => {
    const lines: string[] = [];
    lines.push(`# Research Action Brief`);
    lines.push(``);
    lines.push(`**Generated:** ${new Date(brief.createdAt).toLocaleString()}`);
    lines.push(`**Tool:** ONCOFRONTIER Research Intelligence Prototype`);
    lines.push(``);
    lines.push(`## Research Question`);
    lines.push(brief.question);
    lines.push(``);
    lines.push(`## Cancer Context`);
    lines.push(brief.cancerContext);
    lines.push(``);
    lines.push(`## Evidence Base`);
    lines.push(`- ${brief.evidenceTypes.join('\n- ')}`);
    lines.push(``);
    if (brief.findings.length > 0) {
      lines.push(`## Source-Supported Findings`);
      lines.push(`> NOTE: These are user-entered notes based on reviewing the selected records.`);
      brief.findings.forEach((f) => lines.push(`- ${f}`));
      lines.push(``);
    }
    if (brief.limitations.length > 0) {
      lines.push(`## Evidence Limitations`);
      brief.limitations.forEach((l) => lines.push(`- ${l}`));
      lines.push(``);
    }
    if (brief.unansweredQuestions.length > 0) {
      lines.push(`## Unanswered Questions`);
      brief.unansweredQuestions.forEach((q) => lines.push(`- ${q}`));
      lines.push(``);
    }
    if (brief.proposedNextSteps.length > 0) {
      lines.push(`## Proposed Next Steps`);
      lines.push(`> HYPOTHESIS / PROPOSED EXPERIMENT — not validated. Label clearly in any derivative work.`);
      brief.proposedNextSteps.forEach((s) => lines.push(`- ${s}`));
      lines.push(``);
    }
    lines.push(`## Selected Records (${brief.records.length})`);
    brief.records.forEach((r, i) => {
      const id = r.pmid ? `PMID: ${r.pmid}` : r.nctId ? `NCT: ${r.nctId}` : r.doi ? `DOI: ${r.doi}` : r.id;
      lines.push(`${i + 1}. **${r.title}** — ${id} [Source: ${r.provider}]`);
      lines.push(`   URL: ${r.sourceUrl}`);
    });
    lines.push(``);
    lines.push(`## References`);
    brief.references.forEach((ref, i) => lines.push(`${i + 1}. ${ref}`));
    lines.push(``);
    lines.push(`---`);
    lines.push(`*Generated by ONCOFRONTIER. This is a research discovery prototype, not a clinical decision-support product.*`);

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oncofrontier-brief-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  if (selectedRecords.length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader
          icon={<ClipboardList className="w-6 h-6" />}
          title={t.planner.title}
          subtitle={t.planner.subtitle}
        />
        <EmptyState
          title={t.planner.emptyTitle}
          message={t.planner.emptyMessage}
          icon={ClipboardList}
        />
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setCurrentView('curemap')}
            className="px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors"
          >
            {t.planner.goToCuremap}
          </button>
          <button
            onClick={() => setCurrentView('resistance')}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors"
          >
            {t.planner.goToResistance}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<ClipboardList className="w-6 h-6" />}
        title={t.planner.title}
        subtitle={t.planner.subtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: form */}
        <div className="space-y-4">
          {/* Selected records */}
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy-900 text-sm">
                {t.planner.selectedRecords} ({selectedRecords.length})
              </h3>
              <button
                onClick={clearRecords}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t.planner.clearAll}
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-2 bg-navy-50/50 rounded-lg p-2"
                >
                  {record.kind === 'trial' ? (
                    <FlaskConical className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-navy-600 flex-shrink-0" />
                  )}
                  <span className="text-xs text-navy-700 flex-1 truncate">{record.title}</span>
                  <button
                    onClick={() => removeRecord(record)}
                    className="text-navy-300 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-document comparison (plan-metered) */}
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy-900 text-sm flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-teal-600" aria-hidden /> {featureLabel('articleComparisons', language)}
              </h3>
              <button
                onClick={() => {
                  if (!compareAllowed) return;
                  recordUse('articleComparisons');
                  setComparison(true);
                }}
                disabled={selectedRecords.length < 2 || !compareAllowed}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 disabled:opacity-40"
              >
                {compareAllowed ? (language.startsWith('fr') ? 'Comparer' : language.startsWith('ar') ? 'قارن' : 'Compare') : bt.limitReachedCta}
              </button>
            </div>
            {!compareAllowed && (
              <p role="status" className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2">
                {bt.limitReachedNotice}{' '}
                <button onClick={() => setCurrentView('pricing')} className="underline font-medium">{bt.limitReachedCta}</button>
              </p>
            )}
            {compareAllowed && !comparison && (
              <p className="text-xs text-navy-500">
                {planId === 'free' && `${catalog.free.limits.articleComparisons} / ${language.startsWith('fr') ? 'mois' : language.startsWith('ar') ? 'شهر' : 'month'}`}
              </p>
            )}
            {compareAllowed && comparison && selectedRecords.length >= 2 && (
              <div className="overflow-x-auto" role="table" aria-label={featureLabel('articleComparisons', language)}>
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th scope="col" className="text-start p-2 text-navy-500">#</th>
                      {selectedRecords.slice(0, planId === 'free' ? 3 : 10).map((r, i) => (
                        <th scope="col" key={r.id} className="text-start p-2 font-medium text-navy-800">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {([
                      'title', 'kind', 'journal', 'pubDate', 'sourceUrl',
                    ] as const).map((field) => (
                      <tr key={field}>
                        <th scope="row" className="text-start font-medium text-navy-600 p-2 align-top">{field}</th>
                        {selectedRecords.slice(0, planId === 'free' ? 3 : 10).map((r) => (
                          <td key={r.id + field} className="p-2 align-top text-navy-700 break-words max-w-[12rem]">
                            {field === 'sourceUrl'
                              ? <a href={r.sourceUrl} className="text-teal-700 underline" target="_blank" rel="noreferrer">↗</a>
                              : String(r[field] ?? '—').slice(0, 80)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="text-start font-medium text-navy-600 p-2 align-top">cancerTerms</th>
                      {selectedRecords.slice(0, planId === 'free' ? 3 : 10).map((r) => (
                        <td key={r.id + '-ct'} className="p-2 align-top text-navy-700">{r.cancerTerms.join(', ') || '—'}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="text-start font-medium text-navy-600 p-2 align-top">targetTerms</th>
                      {selectedRecords.slice(0, planId === 'free' ? 3 : 10).map((r) => (
                        <td key={r.id + '-tt'} className="p-2 align-top text-navy-700">{r.targetTerms.join(', ') || '—'}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="text-start font-medium text-navy-600 p-2 align-top">treatmentTerms</th>
                      {selectedRecords.slice(0, planId === 'free' ? 3 : 10).map((r) => (
                        <td key={r.id + '-st'} className="p-2 align-top text-navy-700">{r.treatmentTerms.join(', ') || '—'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Brief form */}
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-navy-900 text-sm">{t.planner.briefDetails}</h3>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">{t.planner.researchQuestion}</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                placeholder={t.planner.questionPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">
                {t.planner.cancerContext} {!cancerContext && autoContext && t.planner.autoDetected}
              </label>
              <textarea
                value={cancerContext || autoContext}
                onChange={(e) => setCancerContext(e.target.value)}
                rows={2}
                placeholder={t.planner.contextPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">
                {t.planner.findings}
              </label>
              <textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                rows={3}
                placeholder={t.planner.findingsPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">
                {t.planner.limitations}
              </label>
              <textarea
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                rows={2}
                placeholder={t.planner.limitationsPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">
                {t.planner.unanswered}
              </label>
              <textarea
                value={unanswered}
                onChange={(e) => setUnanswered(e.target.value)}
                rows={2}
                placeholder={t.planner.unansweredPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">
                {t.planner.proposedNext}
              </label>
              <textarea
                value={proposedNext}
                onChange={(e) => setProposedNext(e.target.value)}
                rows={2}
                placeholder={t.planner.proposedPlaceholder}
                className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400 resize-none"
              />
              <p className="text-xs text-amber-600 mt-1">
                {t.planner.hypothesisNote}
              </p>
            </div>
          </div>
        </div>

        {/* Right: preview + export */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy-900 text-sm">{t.planner.briefPreview}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-navy-50 text-navy-700 rounded-lg hover:bg-navy-100 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.planner.copied : t.planner.copyMd}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  {downloaded ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Download className="w-3.5 h-3.5" />}
                  {downloaded ? t.planner.saved : t.planner.download}
                </button>
              </div>
            </div>

            <div className="bg-navy-50/30 rounded-lg p-3 max-h-[500px] overflow-y-auto">
              <div className="text-xs text-navy-600 space-y-2 font-mono leading-relaxed">
                <p className="font-bold text-navy-900 text-sm">{t.planner.title}</p>
                <p>{t.planner.generated} {new Date(brief.createdAt).toLocaleString()}</p>
                <hr className="border-navy-100 my-2" />
                <p><span className="text-navy-400">{t.planner.questionLabel}</span> {brief.question}</p>
                <p><span className="text-navy-400">{t.planner.contextLabel}</span> {brief.cancerContext}</p>
                <p><span className="text-navy-400">{t.planner.evidenceLabel}</span></p>
                <ul className="ps-3 list-disc">
                  {brief.evidenceTypes.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
                {brief.findings.length > 0 && (
                  <>
                    <p><span className="text-navy-400">{t.planner.findingsLabel}</span></p>
                    <ul className="ps-3 list-disc">
                      {brief.findings.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </>
                )}
                {brief.limitations.length > 0 && (
                  <>
                    <p><span className="text-navy-400">{t.planner.limitationsLabel}</span></p>
                    <ul className="ps-3 list-disc">
                      {brief.limitations.map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </>
                )}
                {brief.unansweredQuestions.length > 0 && (
                  <>
                    <p><span className="text-navy-400">{t.planner.unansweredLabel}</span></p>
                    <ul className="ps-3 list-disc">
                      {brief.unansweredQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </>
                )}
                {brief.proposedNextSteps.length > 0 && (
                  <>
                    <p className="text-amber-600">{t.planner.proposedLabel}</p>
                    <ul className="ps-3 list-disc text-amber-700">
                      {brief.proposedNextSteps.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}
                <p><span className="text-navy-400">{t.planner.referencesLabel} ({brief.references.length}):</span></p>
                <ol className="ps-3 list-decimal">
                  {brief.references.slice(0, 10).map((ref, i) => (
                    <li key={i} className="truncate">{ref}</li>
                  ))}
                  {brief.references.length > 10 && <li>... +{brief.references.length - 10} {t.planner.more}</li>}
                </ol>
              </div>
            </div>
          </div>

          {/* Records list */}
          <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-4">
            <h3 className="font-semibold text-navy-900 text-sm mb-3">{t.planner.recordsInBrief}</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onSelect={removeRecord}
                  selected={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
