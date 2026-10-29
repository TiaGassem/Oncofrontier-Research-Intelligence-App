import type { TargetInfo, TargetDiseaseAssociation } from '@/types';

const OT_API = 'https://api.platform.opentargets.org/api/v4/graphql';

async function otQuery(query: string): Promise<Record<string, unknown>> {
  const resp = await fetch(OT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!resp.ok) {
    throw new Error(`Open Targets API failed: HTTP ${resp.status}`);
  }
  const data = await resp.json();
  if (data.errors) {
    throw new Error(`Open Targets GraphQL error: ${data.errors[0]?.message ?? 'Unknown'}`);
  }
  return data.data as Record<string, unknown>;
}

// Cancer type → MONDO disease ID mapping (common cancers)
const CANCER_MONDO: Record<string, string> = {
  'breast cancer': 'MONDO_0007254',
  'lung cancer': 'MONDO_0008903',
  'non-small cell lung cancer': 'MONDO_0005233',
  'lung adenocarcinoma': 'MONDO_0005061',
  'glioblastoma': 'MONDO_0008078',
  'colorectal cancer': 'MONDO_0005575',
  'prostate cancer': 'MONDO_0005151',
  'pancreatic cancer': 'MONDO_0005160',
  'melanoma': 'MONDO_0005229',
  'ovarian cancer': 'MONDO_0006472',
  'leukemia': 'MONDO_0005059',
  'bladder cancer': 'MONDO_0005008',
  'head and neck cancer': 'MONDO_0005236',
  'thyroid cancer': 'MONDO_0005044',
  'liver cancer': 'MONDO_0007255',
  'gastric cancer': 'MONDO_0005031',
  'esophageal cancer': 'MONDO_0005035',
  'cervical cancer': 'MONDO_0005009',
  'kidney cancer': 'MONDO_0005087',
  'cancer': 'MONDO_0004992',
};

export function getCancerMondo(cancerType: string): string | null {
  const lower = cancerType.toLowerCase().trim();
  if (CANCER_MONDO[lower]) return CANCER_MONDO[lower];
  // Try partial match
  for (const [key, val] of Object.entries(CANCER_MONDO)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

export async function searchTarget(geneSymbol: string): Promise<string | null> {
  const q = `{ search(queryString:"${geneSymbol}" entityNames:["target"]) { hits { id name entity } } }`;
  const data = await otQuery(q);
  const search = data.search as { hits: { id: string; name: string; entity: string }[] };
  const hits = search?.hits ?? [];
  // Find exact symbol match first
  const exact = hits.find((h) => h.name.toUpperCase() === geneSymbol.toUpperCase());
  if (exact) return exact.id;
  // Otherwise return first target hit
  const targetHit = hits.find((h) => h.entity === 'target');
  return targetHit?.id ?? null;
}

export async function getTargetInfo(ensemblId: string): Promise<TargetInfo> {
  const q = `{ target(ensemblId:"${ensemblId}") {
    id approvedSymbol approvedName biotype
    tractability { modality value }
    associatedDiseases {
      rows { disease { id name } score datatypeScores { id score } }
    }
    safetyLiabilities { biosafetyId event description }
    drugAndClinicalCandidates {
      rows { drug { id name drugType maximumClinicalStage } disease { id name } }
    }
  } }`;
  const data = await otQuery(q);
  const t = data.target as {
    id: string;
    approvedSymbol: string;
    approvedName: string;
    biotype: string;
    tractability: { modality: string; value: boolean }[];
    associatedDiseases: { rows: { disease: { id: string; name: string }; score: number; datatypeScores: { id: string; score: number }[] }[] };
    safetyLiabilities: { biosafetyId?: string; event?: string; description?: string }[];
    drugAndClinicalCandidates: { rows: { drug: { id: string; name: string; drugType: string; maximumClinicalStage: string }; disease: { id: string; name: string } }[] };
  };

  const associatedDiseases: TargetDiseaseAssociation[] = (t.associatedDiseases?.rows ?? []).map((r) => ({
    diseaseId: r.disease.id,
    diseaseName: r.disease.name,
    score: r.score,
    datatypeScores: r.datatypeScores ?? [],
    source: 'Open Targets Platform',
  }));

  const drugCandidates = (t.drugAndClinicalCandidates?.rows ?? []).map((r) => ({
    drugId: r.drug.id,
    drugName: r.drug.name,
    drugType: r.drug.drugType,
    maxClinicalStage: r.drug.maximumClinicalStage,
    diseaseName: r.disease?.name,
  }));

  return {
    ensemblId: t.id,
    approvedSymbol: t.approvedSymbol,
    approvedName: t.approvedName,
    biotype: t.biotype,
    tractability: t.tractability ?? [],
    associatedDiseases,
    safetyLiabilities: t.safetyLiabilities ?? [],
    drugCandidates,
    sourceUrl: `https://platform.opentargets.org/target/${t.id}/associations`,
  };
}

export async function searchTargetByGene(geneSymbol: string): Promise<TargetInfo | null> {
  const ensemblId = await searchTarget(geneSymbol);
  if (!ensemblId) return null;
  return getTargetInfo(ensemblId);
}
