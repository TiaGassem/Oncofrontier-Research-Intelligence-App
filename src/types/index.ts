export type SourceProvider = 'pubmed' | 'europepmc' | 'clinicaltrials' | 'opentargets' | 'pubchem' | 'crossref' | 'openalex';

export type RecordKind = 'publication' | 'trial';

export type AccessStatus = 'open' | 'free' | 'restricted' | 'unknown';

export interface ResearchRecord {
  id: string;
  kind: RecordKind;
  provider: SourceProvider;
  title: string;
  authors: string[];
  journal?: string;
  pubDate?: string;
  abstract?: string;
  pmid?: string;
  doi?: string;
  pmcid?: string;
  nctId?: string;
  sourceUrl: string;
  retrievedAt: string;
  cancerTerms: string[];
  targetTerms: string[];
  treatmentTerms: string[];
  accessStatus: AccessStatus;
  citedBy?: number;
  publicationType?: string;
  trialStatus?: string;
  trialPhase?: string;
  trialEnrollment?: number;
  trialStartDate?: string;
  trialCompletionDate?: string;
  trialLocations?: string[];
  trialSponsor?: string;
  trialConditions?: string[];
  trialInterventions?: string[];
}

export interface SearchResult {
  records: ResearchRecord[];
  totalFound: number;
  query: string;
  sources: SourceProvider[];
  timestamp: string;
  errors: SourceError[];
}

export interface SourceError {
  provider: SourceProvider;
  message: string;
}

export type ExplanationLevel = 'public' | 'student' | 'researcher' | 'clinical';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ResearchRecord[];
  caveats?: string[];
  level?: ExplanationLevel;
}

export interface ResearchBrief {
  question: string;
  cancerContext: string;
  records: ResearchRecord[];
  findings: string[];
  evidenceTypes: string[];
  limitations: string[];
  unansweredQuestions: string[];
  conflicts: string[];
  proposedNextSteps: string[];
  references: string[];
  createdAt: string;
}

export interface SearchFilters {
  cancerType: string;
  gene: string;
  drug: string;
  treatment: string;
  question: string;
  dateFrom?: string;
  dateTo?: string;
  publicationType?: string;
}

// Discovery Bridge types

export interface TargetDiseaseAssociation {
  diseaseId: string;
  diseaseName: string;
  score: number;
  datatypeScores: { id: string; score: number }[];
  source: string;
}

export interface TargetInfo {
  ensemblId: string;
  approvedSymbol: string;
  approvedName: string;
  biotype: string;
  tractability: { modality: string; value: boolean }[];
  associatedDiseases: TargetDiseaseAssociation[];
  safetyLiabilities: { biosafetyId?: string; event?: string; description?: string }[];
  drugCandidates: {
    drugId: string;
    drugName: string;
    drugType: string;
    maxClinicalStage: string;
    diseaseName?: string;
  }[];
  sourceUrl: string;
}

export interface CompoundInfo {
  cid?: number;
  name: string;
  smiles?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  iupacName?: string;
  synonyms?: string[];
  sourceUrl: string;
  source: 'pubchem';
}

export interface DiscoveryResult {
  target: TargetInfo | null;
  compound: CompoundInfo | null;
  publications: ResearchRecord[];
  trials: ResearchRecord[];
  errors: string[];
  query: string;
  timestamp: string;
}

export type ViewName =
  | 'home'
  | 'welcome'
  | 'dashboard'
  | 'curemap'
  | 'resistance'
  | 'equity'
  | 'planner'
  | 'assistant'
  | 'methodology'
  | 'discovery'
  | 'pdf'
  | 'library'
  | 'account'
  | 'burden'
  | 'biomarkers'
  | 'anatomy'
  | 'companion'
  | 'privacy'
  | 'terms'
  | 'contact';

export type Language =
  | 'en' | 'fr' | 'ar' | 'ar-TN'
  | 'es' | 'de' | 'pt' | 'it' | 'tr'
  | 'zh' | 'ja' | 'ko' | 'hi' | 'ur' | 'fa' | 'bn'
  | 'id' | 'vi' | 'th' | 'sw';
