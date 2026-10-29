import type { ResearchRecord, SourceError } from '@/types';

const CT_BASE = 'https://clinicaltrials.gov/api/v2/studies';

interface CTSearchResponse {
  studies: CTStudy[];
  totalCount?: number;
  nextPageToken?: string;
}

interface CTStudy {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
    };
    statusModule: {
      overallStatus?: string;
      startDateStruct?: { date: string };
      completionDateStruct?: { date: string };
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name: string };
    };
    conditionsModule?: {
      conditions?: string[];
    };
    interventionsModule?: {
      interventions?: { type: string; name: string }[];
    };
    designModule?: {
      phases?: string[];
      enrollmentInfo?: { count?: number };
    };
    locationsModule?: {
      locations?: { country: string; city?: string; facility?: string }[];
    };
  };
  hasResults?: boolean;
}

function buildQuery(params: {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
}): string {
  const terms: string[] = [];
  if (params.cancerType) terms.push(params.cancerType);
  if (params.gene) terms.push(`AREA[InterventionName]${params.gene}`);
  if (params.drug) terms.push(params.drug);
  if (params.treatment) terms.push(params.treatment);
  if (params.question) terms.push(params.question);
  if (params.extraTerms) terms.push(...params.extraTerms);
  return terms.filter(Boolean).join(' AND ');
}

function uniqueTerms(terms: Array<string | undefined>): string[] {
  return [...new Set(terms.map((term) => term?.trim()).filter((term): term is string => Boolean(term)))];
}

export async function searchClinicalTrials(params: {
  cancerType?: string;
  gene?: string;
  drug?: string;
  treatment?: string;
  question?: string;
  extraTerms?: string[];
  maxResults?: number;
}): Promise<{ records: ResearchRecord[]; totalFound: number; error?: SourceError }> {
  const query = buildQuery(params);
  if (!query.trim()) {
    return { records: [], totalFound: 0 };
  }

  const maxResults = params.maxResults ?? 20;

  try {
    const url = new URL(CT_BASE);
    // Map the form fields to ClinicalTrials.gov's matching search areas. The old
    // implementation sent an empty condition and ignored the user's question,
    // which returned recent but unrelated studies.
    if (params.cancerType?.trim()) {
      url.searchParams.set('query.cond', params.cancerType.trim());
    }

    const interventions = uniqueTerms([params.drug, params.treatment]);
    if (interventions.length > 0) {
      url.searchParams.set('query.intr', interventions.join(' AND '));
    }

    const otherTerms = uniqueTerms([
      params.gene,
      params.question,
      ...(params.extraTerms ?? []),
    ]);
    if (otherTerms.length > 0) {
      url.searchParams.set('query.term', otherTerms.join(' AND '));
    }
    url.searchParams.set('pageSize', String(maxResults));
    url.searchParams.set('format', 'json');
    url.searchParams.set('sort', 'LastUpdatePostDate:desc');
    url.searchParams.set('countTotal', 'true');

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      return {
        records: [],
        totalFound: 0,
        error: {
          provider: 'clinicaltrials',
          message: `ClinicalTrials.gov search failed: HTTP ${resp.status}`,
        },
      };
    }

    const data: CTSearchResponse = await resp.json();
    const studies = data.studies ?? [];

    const records: ResearchRecord[] = studies.map((s) => {
      const proto = s.protocolSection;
      const ident = proto.identificationModule;
      const status = proto.statusModule;
      const design = proto.designModule;
      const conditions = proto.conditionsModule;
      const interventions = proto.interventionsModule;
      const locations = proto.locationsModule;
      const sponsor = proto.sponsorCollaboratorsModule;

      const nctId = ident.nctId;
      const trialLocations = (locations?.locations ?? []).map(
        (l) => `${l.city ? l.city + ', ' : ''}${l.country}`
      );

      return {
        id: `ct-${nctId}`,
        kind: 'trial' as const,
        provider: 'clinicaltrials' as const,
        title: ident.briefTitle ?? ident.officialTitle ?? 'Untitled',
        authors: [],
        journal: undefined,
        pubDate: status.startDateStruct?.date,
        nctId,
        sourceUrl: `https://clinicaltrials.gov/study/${nctId}`,
        retrievedAt: new Date().toISOString(),
        cancerTerms: conditions?.conditions ?? [],
        targetTerms: [],
        treatmentTerms: (interventions?.interventions ?? []).map((i) => i.name),
        accessStatus: 'open' as const,
        publicationType: 'Clinical Trial',
        trialStatus: status.overallStatus,
        trialPhase: design?.phases?.join(', '),
        trialEnrollment: design?.enrollmentInfo?.count,
        trialStartDate: status.startDateStruct?.date,
        trialCompletionDate: status.completionDateStruct?.date,
        trialLocations,
        trialSponsor: sponsor?.leadSponsor?.name,
        trialConditions: conditions?.conditions,
        trialInterventions: (interventions?.interventions ?? []).map((i) => i.name),
      };
    });

    return { records, totalFound: data.totalCount ?? studies.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      records: [],
      totalFound: 0,
      error: {
        provider: 'clinicaltrials',
        message: `ClinicalTrials.gov error: ${message}`,
      },
    };
  }
}
