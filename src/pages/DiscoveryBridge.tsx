import { useState, useCallback } from 'react';
import {
  FlaskConical,
  Search,
  Target,
  Atom,
  ShieldAlert,
  ClipboardList,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  Loader2,
  Pill,
  Microscope,
  FlaskRound,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState, EmptyState } from '@/components/States';
import { RecordCard } from '@/components/RecordCard';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { searchTargetByGene, getCancerMondo } from '@/lib/opentargets';
import { lookupCompoundByName, lookupCompoundBySmiles, validateSmiles } from '@/lib/pubchem';
import { unifiedSearch } from '@/lib/search';
import type { DiscoveryResult, TargetInfo, CompoundInfo, ResearchRecord } from '@/types';

const TRACTABILITY_MODALITIES: Record<string, string> = {
  SM: 'Small Molecule',
  AB: 'Antibody',
  PR: 'Proteolysis-targeting chimera (PROTAC)',
  OC: 'Other Modalities',
};

const DATATYPE_LABELS: Record<string, string> = {
  genetic_association: 'Genetic Association',
  somatic_mutation: 'Somatic Mutation',
  known_drug: 'Known Drug',
  affected_pathway: 'Affected Pathway',
  literature: 'Literature',
  animal_model: 'Animal Model',
  RNA_expression: 'RNA Expression',
  genetic_literature: 'Genetic Literature',
  clinical: 'Clinical',
};

export function DiscoveryBridge() {
  const [cancerType, setCancerType] = useState('');
  const [gene, setGene] = useState('');
  const [drug, setDrug] = useState('');
  const [smiles, setSmiles] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [smilesValidation, setSmilesValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('target');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { toggleRecord, isRecordSelected, setCurrentView, selectedRecords, language } = useApp();
  const t = getTranslation(language);

  const handleInvestigate = useCallback(async () => {
    if (!cancerType && !gene && !drug && !smiles && !question) return;
    setLoading(true);
    setResult(null);

    const errors: string[] = [];
    let target: TargetInfo | null = null;
    let compound: CompoundInfo | null = null;
    let publications: ResearchRecord[] = [];
    let trials: ResearchRecord[] = [];

    // 1. Open Targets lookup
    if (gene) {
      try {
        target = await searchTargetByGene(gene);
        if (!target) {
          errors.push(`No target found in Open Targets for "${gene}".`);
        }
      } catch (err) {
        errors.push(`Open Targets error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }

    // 2. PubChem compound lookup
    if (smiles) {
      const validation = validateSmiles(smiles);
      setSmilesValidation(validation);
      if (validation.valid) {
        try {
          compound = await lookupCompoundBySmiles(smiles);
          if (!compound) {
            errors.push('No compound found in PubChem for this SMILES.');
          }
        } catch (err) {
          errors.push(`PubChem error: ${err instanceof Error ? err.message : 'Unknown'}`);
        }
      } else {
        errors.push(`SMILES validation: ${validation.message}`);
      }
    } else if (drug) {
      try {
        compound = await lookupCompoundByName(drug);
        if (!compound) {
          errors.push(`No compound found in PubChem for "${drug}".`);
        }
      } catch (err) {
        errors.push(`PubChem error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }

    // 3. Literature & trials search
    try {
      const searchResult = await unifiedSearch({
        cancerType,
        gene,
        drug,
        treatment: drug,
        question: question || 'resistance mechanism',
        maxResults: 15,
      });
      publications = searchResult.records.filter((r) => r.kind === 'publication');
      trials = searchResult.records.filter((r) => r.kind === 'trial');
      if (searchResult.records.length === 0) {
        errors.push('No publications or trials found for these search terms.');
      }
      searchResult.errors.forEach((e) => errors.push(`${e.provider}: ${e.message}`));
    } catch (err) {
      errors.push(`Search error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }

    const queryParts = [cancerType, gene, drug, smiles, question].filter(Boolean).join(' · ');

    setResult({
      target,
      compound,
      publications,
      trials,
      errors,
      query: queryParts,
      timestamp: new Date().toISOString(),
    });
    setLoading(false);
  }, [cancerType, gene, drug, smiles, question]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const generateMarkdown = (): string => {
    if (!result) return '';
    const lines: string[] = [];
    lines.push('# Discovery Bridge Research Brief');
    lines.push('');
    lines.push(`**Generated:** ${new Date(result.timestamp).toLocaleString()}`);
    lines.push(`**Query:** ${result.query}`);
    lines.push(`**Tool:** ONCOFRONTIER Discovery Bridge (Research Prototype)`);
    lines.push('');
    lines.push('## Search Parameters');
    if (cancerType) lines.push(`- Cancer type: ${cancerType}`);
    if (gene) lines.push(`- Gene/target: ${gene}`);
    if (drug) lines.push(`- Drug/compound: ${drug}`);
    if (smiles) lines.push(`- SMILES: ${smiles}`);
    if (question) lines.push(`- Research question: ${question}`);
    lines.push('');

    if (result.target) {
      const t = result.target;
      lines.push('## Target Assessment (Open Targets Platform)');
      lines.push(`- Target: ${t.approvedSymbol} (${t.approvedName})`);
      lines.push(`- Ensembl ID: ${t.ensemblId}`);
      lines.push(`- Biotype: ${t.biotype}`);
      lines.push(`- Source: ${t.sourceUrl}`);
      lines.push('');
      if (t.associatedDiseases.length > 0) {
        lines.push('### Target-Disease Associations');
        t.associatedDiseases.slice(0, 10).forEach((a) => {
          lines.push(`- ${a.diseaseName} (ID: ${a.diseaseId}) — Score: ${a.score.toFixed(4)}`);
        });
        lines.push('');
      }
      if (t.drugCandidates.length > 0) {
        lines.push('### Drug & Clinical Candidates');
        t.drugCandidates.slice(0, 10).forEach((d) => {
          lines.push(`- ${d.drugName} (type: ${d.drugType}, max stage: ${d.maxClinicalStage})${d.diseaseName ? ` — ${d.diseaseName}` : ''}`);
        });
        lines.push('');
      }
      if (t.safetyLiabilities.length > 0) {
        lines.push('### Safety Liabilities');
        t.safetyLiabilities.forEach((s) => {
          lines.push(`- ${s.event || 'Unknown'}: ${s.description || 'No description'}`);
        });
        lines.push('');
      }
    }

    if (result.compound) {
      const c = result.compound;
      lines.push('## Compound Information (PubChem)');
      lines.push(`- Name: ${c.name}`);
      if (c.cid) lines.push(`- PubChem CID: ${c.cid}`);
      if (c.molecularFormula) lines.push(`- Molecular Formula: ${c.molecularFormula}`);
      if (c.molecularWeight) lines.push(`- Molecular Weight: ${c.molecularWeight}`);
      if (c.smiles) lines.push(`- Canonical SMILES: ${c.smiles}`);
      if (c.iupacName) lines.push(`- IUPAC Name: ${c.iupacName}`);
      lines.push(`- Source: ${c.sourceUrl}`);
      lines.push('');
    }

    if (result.publications.length > 0) {
      lines.push(`## Publications (${result.publications.length})`);
      result.publications.forEach((p, i) => {
        const id = p.pmid ? `PMID: ${p.pmid}` : p.doi ? `DOI: ${p.doi}` : '';
        lines.push(`${i + 1}. ${p.title} ${id ? `[${id}]` : ''}`);
        lines.push(`   ${p.sourceUrl}`);
      });
      lines.push('');
    }

    if (result.trials.length > 0) {
      lines.push(`## Clinical Trials (${result.trials.length})`);
      result.trials.forEach((t, i) => {
        lines.push(`${i + 1}. ${t.title} [NCT: ${t.nctId}]`);
        lines.push(`   ${t.sourceUrl}`);
      });
      lines.push('');
    }

    if (result.errors.length > 0) {
      lines.push('## Limitations & Errors');
      result.errors.forEach((e) => lines.push(`- ${e}`));
      lines.push('');
    }

    lines.push('---');
    lines.push('*Generated by ONCOFRONTIER Discovery Bridge. This is a research discovery prototype, not a clinical decision-support product. Database scores are annotations, not probabilities of drug success.*');

    return lines.join('\n');
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oncofrontier-discovery-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<FlaskConical className="w-6 h-6" />}
        title={t.discovery.title}
        subtitle={t.discovery.subtitle}
        accent="teal"
      />

      {/* Disclaimer */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-teal-900 leading-relaxed">
          {t.discovery.disclaimer}
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.cancerType}</label>
            <input
              type="text"
              value={cancerType}
              onChange={(e) => setCancerType(e.target.value)}
              placeholder={t.discovery.cancerPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.gene}</label>
            <input
              type="text"
              value={gene}
              onChange={(e) => setGene(e.target.value)}
              placeholder={t.discovery.genePlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.drug}</label>
            <input
              type="text"
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              placeholder={t.discovery.drugPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.researchQuestion}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.discovery.questionPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* SMILES input */}
        <div className="mb-3">
          <label className="text-xs font-medium text-navy-500 mb-1 block">{t.discovery.smilesLabel}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={smiles}
              onChange={(e) => {
                setSmiles(e.target.value);
                setSmilesValidation(null);
              }}
              placeholder={t.discovery.smilesPlaceholder}
              className="flex-1 px-3 py-2 text-sm font-mono bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
            />
            {smiles && (
              <button
                onClick={() => {
                  const v = validateSmiles(smiles);
                  setSmilesValidation(v);
                }}
                className="px-3 py-2 text-xs font-medium bg-navy-50 text-navy-700 rounded-lg hover:bg-navy-100 transition-colors"
              >
                {t.discovery.validate}
              </button>
            )}
          </div>
          {smilesValidation && (
            <p className={`text-xs mt-1 ${smilesValidation.valid ? 'text-green-600' : 'text-red-500'}`}>
              {smilesValidation.valid ? <Check className="w-3 h-3 inline me-1" /> : <AlertTriangle className="w-3 h-3 inline me-1" />}
              {smilesValidation.message}
            </p>
          )}
          <p className="text-xs text-navy-400 mt-1">
            {t.discovery.smilesNote}
          </p>
        </div>

        <button
          onClick={handleInvestigate}
          disabled={loading || (!cancerType && !gene && !drug && !smiles && !question)}
          className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? t.discovery.investigating : t.discovery.investigate}
        </button>
      </div>

      {/* Results */}
      {loading && <LoadingState message={t.discovery.loadingMessage} />}

      {!loading && !result && (
        <EmptyState
          title={t.discovery.emptyTitle}
          message={t.discovery.emptyMessage}
          icon={FlaskConical}
        />
      )}

      {!loading && result && (
        <div className="space-y-4 animate-fade-in">
          {/* Query info */}
          <div className="text-xs text-navy-400">
            {t.discovery.queryLabel} "{result.query}" · {t.discovery.retrievedAt} {new Date(result.timestamp).toLocaleString()}
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 space-y-0.5">
                  {result.errors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Target Assessment */}
          {result.target && (
            <CollapsibleSection
              id="target"
              title={t.discovery.targetSection}
              icon={<Target className="w-5 h-5 text-teal-600" />}
              expanded={expandedSection === 'target'}
              onToggle={toggleSection}
            >
              <TargetAssessment target={result.target} />
            </CollapsibleSection>
          )}

          {/* Compound Information */}
          {result.compound && (
            <CollapsibleSection
              id="compound"
              title={t.discovery.compoundSection}
              icon={<Atom className="w-5 h-5 text-navy-600" />}
              expanded={expandedSection === 'compound'}
              onToggle={toggleSection}
            >
              <CompoundDisplay compound={result.compound} />
            </CollapsibleSection>
          )}

          {/* Molecule Explorer */}
          <CollapsibleSection
            id="molecule"
            title={t.discovery.moleculeSection}
            icon={<FlaskRound className="w-5 h-5 text-navy-600" />}
            expanded={expandedSection === 'molecule'}
            onToggle={toggleSection}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 bg-navy-50 rounded-lg p-3">
                <Info className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <p className="text-xs text-navy-600">
                  {t.discovery.moleculeInfo}
                </p>
              </div>
              {result.compound ? (
                <div className="text-sm text-navy-700">
                  <p>PubChem CID: <span className="font-mono">{result.compound.cid}</span></p>
                  <p className="mt-1">{t.discovery.moleculeHandoff}</p>
                  <ul className="list-disc ps-5 text-xs text-navy-600 mt-1 space-y-0.5">
                    <li>Canonical SMILES: <span className="font-mono">{result.compound.smiles}</span></li>
                    <li>Molecular formula: {result.compound.molecularFormula}</li>
                    <li>Molecular weight: {result.compound.molecularWeight}</li>
                    <li>PubChem URL: <a href={result.compound.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">{result.compound.sourceUrl}</a></li>
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-navy-500">{t.discovery.moleculeEmpty}</p>
              )}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 inline me-1" />
                  {t.discovery.moleculeWarning}
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Resistance Context */}
          {(result.publications.length > 0 || result.trials.length > 0) && (
            <CollapsibleSection
              id="resistance"
              title={`${t.discovery.resistanceSection} — ${result.publications.length} ${t.discovery.publications.toLowerCase()}, ${result.trials.length} ${t.discovery.trials.toLowerCase()}`}
              icon={<ShieldAlert className="w-5 h-5 text-teal-600" />}
              expanded={expandedSection === 'resistance'}
              onToggle={toggleSection}
            >
              <div className="p-4 space-y-3">
                {result.publications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy-700 mb-2">{t.discovery.publications}</h4>
                    <div className="space-y-2">
                      {result.publications.slice(0, 8).map((r) => (
                        <RecordCard
                          key={r.id}
                          record={r}
                          onSelect={toggleRecord}
                          selected={isRecordSelected(r)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {result.trials.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy-700 mb-2 mt-3">{t.discovery.trials}</h4>
                    <div className="space-y-2">
                      {result.trials.slice(0, 5).map((r) => (
                        <RecordCard
                          key={r.id}
                          record={r}
                          onSelect={toggleRecord}
                          selected={isRecordSelected(r)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Translational Validation Planner */}
          <CollapsibleSection
            id="validation"
            title={t.discovery.validationSection}
            icon={<ClipboardList className="w-5 h-5 text-navy-600" />}
            expanded={expandedSection === 'validation'}
            onToggle={toggleSection}
          >
            <ValidationPlanner result={result} cancerType={cancerType} gene={gene} drug={drug} question={question} />
          </CollapsibleSection>

          {/* Export */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-navy-50 text-navy-700 rounded-lg hover:bg-navy-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? t.common.copied : t.discovery.copyMd}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
            >
              {downloaded ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
              {downloaded ? t.common.saved : t.discovery.downloadBrief}
            </button>
          </div>

          {/* Selected records indicator */}
          {selectedRecords.length > 0 && (
            <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
              <span className="text-sm text-teal-800">
                {selectedRecords.length} {t.discovery.selectedFor}
              </span>
              <button
                onClick={() => setCurrentView('planner')}
                className="text-sm font-medium text-teal-700 hover:text-teal-900"
              >
                {t.discovery.viewPlanner}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

function CollapsibleSection({ id, title, icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-navy-50/30 transition-colors"
      >
        {icon}
        <span className="flex-1 text-start font-semibold text-navy-900 text-sm">{title}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-navy-400" /> : <ChevronDown className="w-4 h-4 text-navy-400" />}
      </button>
      {expanded && <div className="border-t border-navy-100">{children}</div>}
    </div>
  );
}

function TargetAssessment({ target }: { target: TargetInfo }) {
  const mondo = getCancerMondo('cancer');
  void mondo;

  const cancerAssociations = target.associatedDiseases.filter((a) =>
    a.diseaseName.toLowerCase().includes('cancer') ||
    a.diseaseName.toLowerCase().includes('carcinoma') ||
    a.diseaseName.toLowerCase().includes('tumor') ||
    a.diseaseName.toLowerCase().includes('leukemia') ||
    a.diseaseName.toLowerCase().includes('melanoma') ||
    a.diseaseName.toLowerCase().includes('glioblastoma') ||
    a.diseaseName.toLowerCase().includes('lymphoma')
  );
  const otherAssociations = target.associatedDiseases.filter((a) => !cancerAssociations.includes(a));

  return (
    <div className="p-4 space-y-4">
      {/* Target header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy-900 text-base">{target.approvedSymbol}</h3>
          <p className="text-sm text-navy-500">{target.approvedName}</p>
          <p className="text-xs text-navy-400 mt-1">Ensembl ID: {target.ensemblId} · Biotype: {target.biotype}</p>
        </div>
        <a
          href={target.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open Targets
        </a>
      </div>

      {/* Tractability */}
      {target.tractability.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Tractability</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TRACTABILITY_MODALITIES).map(([mod, label]) => {
              const entries = target.tractability.filter((t) => t.modality === mod && t.value);
              if (entries.length === 0) return null;
              return (
                <span key={mod} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium">
                  <Check className="w-3 h-3" /> {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancer associations */}
      {cancerAssociations.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Cancer Associations</h4>
          <div className="space-y-2">
            {cancerAssociations.slice(0, 8).map((a) => (
              <div key={a.diseaseId} className="bg-navy-50/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-navy-900">{a.diseaseName}</span>
                  <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Score: {a.score.toFixed(4)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {a.datatypeScores.map((dt) => (
                    <span key={dt.id} className="text-xs px-2 py-0.5 rounded bg-white text-navy-600 border border-navy-100">
                      {DATATYPE_LABELS[dt.id] || dt.id}: {dt.score.toFixed(3)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-2">
            Scores are Open Targets database annotations representing evidence strength across data types.
            They are not probabilities of drug success, proof of causality, or clinical validation.
          </p>
        </div>
      )}

      {/* Drug candidates */}
      {target.drugCandidates.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Drug & Clinical Candidates</h4>
          <div className="space-y-1.5">
            {target.drugCandidates.slice(0, 8).map((d) => (
              <div key={d.drugId} className="flex items-center gap-2 bg-white border border-navy-100 rounded-lg p-2">
                <Pill className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="text-sm text-navy-800 flex-1">{d.drugName}</span>
                <span className="text-xs text-navy-400">{d.drugType}</span>
                {d.maxClinicalStage && <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Stage {d.maxClinicalStage}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety liabilities */}
      {target.safetyLiabilities.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Safety Liabilities</h4>
          <div className="space-y-1.5">
            {target.safetyLiabilities.slice(0, 5).map((s, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                <span className="text-sm font-medium text-amber-900">{s.event || 'Unknown event'}</span>
                {s.description && <p className="text-xs text-amber-700 mt-0.5">{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {otherAssociations.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-navy-500 text-xs hover:text-navy-700">
            Show {otherAssociations.length} non-cancer disease associations
          </summary>
          <div className="mt-2 space-y-1">
            {otherAssociations.slice(0, 10).map((a) => (
              <div key={a.diseaseId} className="text-xs text-navy-600">
                {a.diseaseName} — Score: {a.score.toFixed(4)}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function CompoundDisplay({ compound }: { compound: CompoundInfo }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy-900 text-base">{compound.name}</h3>
          {compound.cid && <p className="text-xs text-navy-400">PubChem CID: {compound.cid}</p>}
        </div>
        <a
          href={compound.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" /> PubChem
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {compound.molecularFormula && (
          <div className="bg-navy-50/50 rounded-lg p-2.5">
            <span className="text-xs text-navy-400 block">Molecular Formula</span>
            <span className="text-sm font-mono text-navy-800">{compound.molecularFormula}</span>
          </div>
        )}
        {compound.molecularWeight && (
          <div className="bg-navy-50/50 rounded-lg p-2.5">
            <span className="text-xs text-navy-400 block">Molecular Weight</span>
            <span className="text-sm text-navy-800">{compound.molecularWeight} g/mol</span>
          </div>
        )}
        {compound.iupacName && (
          <div className="bg-navy-50/50 rounded-lg p-2.5 sm:col-span-2">
            <span className="text-xs text-navy-400 block">IUPAC Name</span>
            <span className="text-sm text-navy-800">{compound.iupacName}</span>
          </div>
        )}
        {compound.smiles && (
          <div className="bg-navy-50/50 rounded-lg p-2.5 sm:col-span-2">
            <span className="text-xs text-navy-400 block">Canonical SMILES</span>
            <span className="text-sm font-mono text-navy-800 break-all">{compound.smiles}</span>
          </div>
        )}
      </div>

      {compound.synonyms && compound.synonyms.length > 0 && (
        <div>
          <span className="text-xs text-navy-400 block mb-1">Synonyms</span>
          <div className="flex flex-wrap gap-1.5">
            {compound.synonyms.slice(0, 8).map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-navy-50 text-navy-600">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationPlanner({
  result,
  cancerType,
  gene,
  drug,
  question,
}: {
  result: DiscoveryResult;
  cancerType: string;
  gene: string;
  drug: string;
  question: string;
}) {
  const hasTarget = !!result.target;
  const hasCompound = !!result.compound;
  const hasPubs = result.publications.length > 0;
  const hasTrials = result.trials.length > 0;

  return (
    <div className="p-4 space-y-4">
      {/* Biological rationale */}
      <div>
        <h4 className="text-sm font-semibold text-navy-700 mb-2">Biological Rationale</h4>
        <div className="bg-navy-50/50 rounded-lg p-3 text-sm text-navy-700">
          <p>
            {cancerType ? `Cancer type: ${cancerType}. ` : ''}
            {gene ? `Molecular target: ${gene}${hasTarget ? ` (Open Targets: ${result.target!.approvedName})` : ''}. ` : ''}
            {drug ? `Compound: ${drug}${hasCompound ? ` (PubChem CID: ${result.compound!.cid})` : ''}. ` : ''}
            {question ? `Research question: ${question}.` : ''}
          </p>
          {!cancerType && !gene && !drug && !question && (
            <p className="text-navy-400">No search parameters provided.</p>
          )}
        </div>
      </div>

      {/* Evidence level */}
      <div>
        <h4 className="text-sm font-semibold text-navy-700 mb-2">Evidence Level & Limitations</h4>
        <ul className="text-sm text-navy-600 space-y-1">
          {hasTarget && (
            <li className="flex items-start gap-2">
              <Microscope className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              Open Targets provides {result.target!.associatedDiseases.length} disease associations with database-derived scores.
              These are not clinical validation.
            </li>
          )}
          {hasCompound && (
            <li className="flex items-start gap-2">
              <Atom className="w-4 h-4 text-navy-600 flex-shrink-0 mt-0.5" />
              PubChem confirms the compound exists in a chemical database. Database presence does not establish biological activity or safety.
            </li>
          )}
          {hasPubs && (
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 text-navy-400 flex-shrink-0 mt-0.5">•</span>
              {result.publications.length} publications retrieved. Evidence types may include preclinical, observational, and clinical studies.
            </li>
          )}
          {hasTrials && (
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 text-navy-400 flex-shrink-0 mt-0.5">•</span>
              {result.trials.length} registered clinical trials found on ClinicalTrials.gov.
            </li>
          )}
          {result.errors.length > 0 && (
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              {result.errors.length} retrieval error(s) occurred. Evidence may be incomplete.
            </li>
          )}
        </ul>
      </div>

      {/* Proposed validation stages */}
      <div>
        <h4 className="text-sm font-semibold text-navy-700 mb-2">Proposed Validation Stages</h4>
        <div className="space-y-2">
          <div className="bg-teal-50/30 border border-teal-100 rounded-lg p-3">
            <p className="text-xs font-medium text-teal-800">HYPOTHESIS — Not a reported result</p>
            <ul className="text-sm text-navy-600 mt-1 space-y-1">
              {gene && <li>1. Confirm target expression and relevance in {cancerType || 'the relevant cancer'} model</li>}
              {hasCompound && <li>2. Verify target engagement using biochemical and cell-based assays</li>}
              <li>3. Assess selectivity against related targets{hasTarget ? ` (Open Targets lists ${result.target!.associatedDiseases.length} disease associations)` : ''}</li>
              <li>4. Evaluate in relevant cancer cell lines{cancerType ? ` (${cancerType})` : ''}</li>
              <li>5. Consider resistance mechanisms{result.publications.length > 0 ? ' identified in retrieved literature' : ''}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Missing information */}
      <div>
        <h4 className="text-sm font-semibold text-navy-700 mb-2">Missing Information</h4>
        <ul className="text-sm text-navy-500 space-y-1">
          {!hasTarget && gene && <li>• No Open Targets data found for this gene — target tractability unknown</li>}
          {!hasCompound && (drug || '') && <li>• No PubChem compound found — structure verification needed</li>}
          {!hasPubs && <li>• No publications retrieved — literature evidence insufficient</li>}
          {!hasTrials && <li>• No registered trials found — clinical development status unknown</li>}
          <li>• In vivo efficacy data: {hasPubs ? 'Check retrieved publications' : 'Insufficient evidence'}</li>
          <li>• Safety profile: {hasTarget && result.target!.safetyLiabilities.length > 0 ? 'See Open Targets safety liabilities' : 'Unknown'}</li>
        </ul>
      </div>

      {/* Essential controls */}
      <div>
        <h4 className="text-sm font-semibold text-navy-700 mb-2">Essential Controls & Confounders</h4>
        <ul className="text-sm text-navy-600 space-y-1">
          <li>• Positive and negative controls for target engagement assays</li>
          <li>• Dose-response characterization with appropriate concentration ranges</li>
          <li>• Vehicle control for compound studies</li>
          <li>• Genetic control (knockout/knockdown) for target validation</li>
          <li>• Multiple cancer cell lines to account for heterogeneity</li>
        </ul>
      </div>
    </div>
  );
}
