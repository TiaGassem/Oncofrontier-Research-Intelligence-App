import { FileText, FlaskConical, Database, Target, Atom } from 'lucide-react';
import type { SourceProvider } from '@/types';

interface SourceBadgeProps {
  provider: SourceProvider;
  size?: 'sm' | 'md';
}

export function SourceBadge({ provider, size = 'sm' }: SourceBadgeProps) {
  const config: Record<SourceProvider, { label: string; icon: typeof FileText; color: string }> = {
    pubmed: { label: 'PubMed', icon: FileText, color: 'bg-blue-50 text-blue-700' },
    europepmc: { label: 'Europe PMC', icon: Database, color: 'bg-teal-50 text-teal-700' },
    clinicaltrials: { label: 'ClinicalTrials.gov', icon: FlaskConical, color: 'bg-amber-50 text-amber-700' },
    opentargets: { label: 'Open Targets', icon: Target, color: 'bg-purple-50 text-purple-700' },
    pubchem: { label: 'PubChem', icon: Atom, color: 'bg-green-50 text-green-700' },
    crossref: { label: 'Crossref', icon: FileText, color: 'bg-sky-50 text-sky-700' },
    openalex: { label: 'OpenAlex', icon: Database, color: 'bg-orange-50 text-orange-700' },
  };

  const { label, icon: Icon, color } = config[provider];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${color} ${sizeClass}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}

export function RecordTypeBadge({ kind, size = 'sm' }: { kind: 'publication' | 'trial'; size?: 'sm' | 'md' }) {
  const config = {
    publication: { label: 'Publication', color: 'bg-navy-50 text-navy-700' },
    trial: { label: 'Trial', color: 'bg-teal-50 text-teal-700' },
  };

  const { label, color } = config[kind];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded font-medium ${color} ${sizeClass}`}>
      {label}
    </span>
  );
}
