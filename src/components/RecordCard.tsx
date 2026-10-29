import { useState } from 'react';
import {
  ExternalLink,
  FileText,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  BookOpen,
  Lock,
  Unlock,
} from 'lucide-react';
import type { ResearchRecord } from '@/types';
import { formatAuthors, formatDate } from '@/lib/search';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

interface RecordCardProps {
  record: ResearchRecord;
  onSelect?: (record: ResearchRecord) => void;
  selected?: boolean;
  defaultExpanded?: boolean;
}

export function RecordCard({ record, onSelect, selected, defaultExpanded = false }: RecordCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { language } = useApp();
  const t = getTranslation(language).recordCard;
  const isTrial = record.kind === 'trial';

  const providerLabel =
    record.provider === 'pubmed'
      ? 'PubMed'
      : record.provider === 'europepmc'
        ? 'Europe PMC'
        : record.provider === 'crossref'
          ? 'Crossref'
          : record.provider === 'openalex'
            ? 'OpenAlex'
            : 'ClinicalTrials.gov';

  const idLabel = record.pmid
    ? `PMID: ${record.pmid}`
    : record.doi
      ? `DOI: ${record.doi}`
      : record.nctId
        ? `NCT: ${record.nctId}`
        : `ID: ${record.id}`;

  return (
    <div
      className={`
        bg-white rounded-xl border transition-all duration-200 animate-slide-up
        ${selected ? 'border-teal-400 ring-1 ring-teal-400/30' : 'border-navy-100 hover:border-navy-200 hover:shadow-md'}
      `}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
              ${isTrial ? 'bg-teal-50 text-teal-600' : 'bg-navy-50 text-navy-600'}
            `}
          >
            {isTrial ? <FlaskConical className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                  ${isTrial ? 'bg-teal-50 text-teal-700' : 'bg-navy-50 text-navy-700'}
                `}
              >
                {isTrial ? t.clinicalTrial : record.publicationType ?? t.publication}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {providerLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {idLabel}
              </span>
              {record.accessStatus === 'open' && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                  <Unlock className="w-3 h-3" /> {t.open}
                </span>
              )}
              {record.accessStatus === 'free' && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                  <BookOpen className="w-3 h-3" /> {t.free}
                </span>
              )}
              {record.accessStatus === 'restricted' && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                  <Lock className="w-3 h-3" /> {t.restricted}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-navy-900 text-sm leading-snug mb-1">
              {record.title}
            </h3>

            {/* Authors + date + journal */}
            <p className="text-xs text-navy-500 leading-relaxed">
              {isTrial ? (
                <>
                  {record.trialStatus && (
                    <span className="font-medium text-navy-700">{record.trialStatus}</span>
                  )}
                  {record.trialPhase && <> · Phase {record.trialPhase}</>}
                  {record.trialSponsor && <> · Sponsor: {record.trialSponsor}</>}
                </>
              ) : (
                <>
                  {formatAuthors(record.authors)} · {formatDate(record.pubDate)}
                  {record.journal && <> · {record.journal}</>}
                </>
              )}
            </p>
          </div>

          {/* Select button */}
          {onSelect && (
            <button
              onClick={() => onSelect(record)}
              className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${
                  selected
                    ? 'bg-teal-500 text-white'
                    : 'bg-navy-50 text-navy-400 hover:bg-navy-100 hover:text-navy-600'
                }
              `}
              aria-label={selected ? t.deselect : t.select}
              title={selected ? t.selectedTitle : t.addTitle}
            >
              {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Trial details */}
        {isTrial && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {record.trialConditions && record.trialConditions.length > 0 && (
              <div className="bg-navy-50 rounded-lg px-2.5 py-1.5">
                <span className="text-navy-400">{t.conditions} </span>
                <span className="text-navy-700 font-medium">
                  {record.trialConditions.slice(0, 3).join(', ')}
                </span>
              </div>
            )}
            {record.trialInterventions && record.trialInterventions.length > 0 && (
              <div className="bg-navy-50 rounded-lg px-2.5 py-1.5">
                <span className="text-navy-400">{t.interventions} </span>
                <span className="text-navy-700 font-medium">
                  {record.trialInterventions.slice(0, 3).join(', ')}
                </span>
              </div>
            )}
            {record.trialEnrollment != null && (
              <div className="bg-navy-50 rounded-lg px-2.5 py-1.5">
                <span className="text-navy-400">{t.enrollment} </span>
                <span className="text-navy-700 font-medium">{record.trialEnrollment.toLocaleString()}</span>
              </div>
            )}
            {record.trialLocations && record.trialLocations.length > 0 && (
              <div className="bg-navy-50 rounded-lg px-2.5 py-1.5">
                <span className="text-navy-400">{t.sites} </span>
                <span className="text-navy-700 font-medium">
                  {record.trialLocations.slice(0, 3).join(', ')}
                  {record.trialLocations.length > 3 && ` +${record.trialLocations.length - 3} ${t.moreSites}`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Abstract toggle */}
        {record.abstract && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? t.hideAbstract : t.showAbstract}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-navy-600 leading-relaxed bg-navy-50/50 rounded-lg p-3">
                {record.abstract}
              </p>
            )}
          </div>
        )}

        {/* Source link */}
        <div className="mt-3 flex items-center justify-between">
          <a
            href={record.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-teal-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {t.viewOn} {providerLabel}
          </a>
          {record.doi && (
            <a
              href={`https://doi.org/${record.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-navy-400 hover:text-teal-600 transition-colors"
            >
              doi:{record.doi}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
