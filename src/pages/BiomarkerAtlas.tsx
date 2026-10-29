import { useState, useMemo } from 'react';
import { Dna, Microscope, Search, ExternalLink, AlertCircle, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { PageHeader } from '@/components/PageHeader';

type BiomarkerCategory = 'predictive' | 'prognostic' | 'diagnostic';

interface Biomarker {
  gene: string;
  protein: string;
  cancerType: string;
  category: BiomarkerCategory;
  clinicalSignificance: string;
  testingMethod: string;
  assayType: string;
  therapeuticRelevance: string;
  positivityRate: string;
  prognosis: 'favorable' | 'unfavorable' | 'unknown';
  source: string;
  sourceUrl: string;
}

const BIOMARKERS: Biomarker[] = [
  {
    gene: 'EGFR', protein: 'Epidermal Growth Factor Receptor', cancerType: 'Non-small cell lung cancer',
    category: 'predictive', clinicalSignificance: 'Activating mutations (exon 19 del, L858R) predict response to EGFR tyrosine kinase inhibitors (erlotinib, gefitinib, osimertinib). T790M confers resistance to first-gen TKIs.',
    testingMethod: 'Tissue biopsy DNA extraction', assayType: 'PCR / NGS / Sanger sequencing',
    therapeuticRelevance: 'Osimertinib (3rd-gen TKI), Erlotinib, Gefitinib, Afatinib',
    positivityRate: '10-15% in Caucasians, 40-50% in East Asians', prognosis: 'favorable',
    source: 'NCCN Guidelines NSCLC (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/nscl.pdf',
  },
  {
    gene: 'KRAS', protein: 'KRAS GTPase', cancerType: 'Pancreatic / Colorectal / Lung',
    category: 'predictive', clinicalSignificance: 'KRAS G12C mutation predicts response to KRAS G12C inhibitors (sotorasib, adagrasib). KRAS mutations predict resistance to anti-EGFR therapy in colorectal cancer.',
    testingMethod: 'Tissue or liquid biopsy', assayType: 'PCR / NGS / ddPCR',
    therapeuticRelevance: 'Sotorasib, Adagrasib (G12C); anti-EGFR resistance marker in CRC',
    positivityRate: '~90% pancreatic, ~40% CRC, ~25% NSCLC', prognosis: 'unfavorable',
    source: 'NCCN Guidelines Colon Cancer (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/colon.pdf',
  },
  {
    gene: 'BRAF', protein: 'BRAF serine/threonine kinase', cancerType: 'Melanoma / Colorectal / Thyroid',
    category: 'predictive', clinicalSignificance: 'V600E mutation predicts response to BRAF inhibitors (vemurafenib, dabrafenib) + MEK inhibitors (trametinib). In CRC, requires anti-EGFR combination.',
    testingMethod: 'Tissue biopsy IHC or molecular', assayType: 'IHC (VE1 clone) / PCR / NGS',
    therapeuticRelevance: 'Dabrafenib + Trametinib, Vemurafenib, Encorafenib + Cetuximab (CRC)',
    positivityRate: '~50% melanoma, ~10% CRC, ~45% papillary thyroid', prognosis: 'unfavorable',
    source: 'NCCN Guidelines Melanoma (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/cutaneous_melanoma.pdf',
  },
  {
    gene: 'HER2 / ERBB2', protein: 'Human Epidermal Growth Factor Receptor 2', cancerType: 'Breast / Gastric',
    category: 'predictive', clinicalSignificance: 'Overexpression/amplification predicts response to HER2-targeted therapies. Trastuzumab, pertuzumab, T-DM1, trastuzumab deruxtecan.',
    testingMethod: 'Tissue biopsy IHC + ISH', assayType: 'IHC (3+ positive) / FISH / DISH / NGS',
    therapeuticRelevance: 'Trastuzumab, Pertuzumab, T-DM1, T-DXd, Lapatinib',
    positivityRate: '~15-20% breast, ~15-20% gastric', prognosis: 'unfavorable',
    source: 'ASCO/CAP HER2 Testing Guidelines (2023)', sourceUrl: 'https://ascopubs.org/doi/10.1200/JCO.22.02864',
  },
  {
    gene: 'BRCA1/2', protein: 'Breast Cancer susceptibility proteins', cancerType: 'Breast / Ovarian / Prostate / Pancreatic',
    category: 'predictive', clinicalSignificance: 'Germline mutations predict response to PARP inhibitors (olaparib, niraparib, rucaparib). Also indicate hereditary cancer risk for family counseling.',
    testingMethod: 'Germline DNA (blood or saliva) + somatic testing', assayType: 'NGS panel / BRCAnalysis / targeted sequencing',
    therapeuticRelevance: 'Olaparib, Niraparib, Rucaparib, Talazoparib (PARP inhibitors)',
    positivityRate: '~5-10% breast/ovarian, ~12% metastatic prostate', prognosis: 'favorable',
    source: 'NCCN Guidelines Genetic/Familial High-Risk Assessment (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/genetics_bop.pdf',
  },
  {
    gene: 'PD-L1', protein: 'Programmed Death-Ligand 1', cancerType: 'NSCLC / Melanoma / Bladder / Head & Neck',
    category: 'predictive', clinicalSignificance: 'PD-L1 expression (TPS, CPS, IC scores) predicts likelihood of response to immune checkpoint inhibitors. Higher expression = better response to monotherapy.',
    testingMethod: 'Tissue biopsy IHC', assayType: 'IHC (22C3, 28-8, SP142, SP263 clones)',
    therapeuticRelevance: 'Pembrolizumab, Nivolumab, Atezolizumab, Durvalumab',
    positivityRate: 'Variable by cancer and cutoff (TPS >=50% in ~30% NSCLC)', prognosis: 'favorable',
    source: 'NCCN Guidelines NSCLC / KEYNOTE trials', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/nscl.pdf',
  },
  {
    gene: 'ALK', protein: 'Anaplastic Lymphoma Kinase', cancerType: 'NSCLC / Anaplastic large cell lymphoma',
    category: 'predictive', clinicalSignificance: 'ALK rearrangements predict strong response to ALK inhibitors. Patients often younger, never/light smokers.',
    testingMethod: 'Tissue biopsy FISH or IHC', assayType: 'FISH (Vysis) / IHC (D5F3) / NGS',
    therapeuticRelevance: 'Alectinib, Lorlatinib, Brigatinib, Ceritinib, Crizotinib',
    positivityRate: '~5% NSCLC', prognosis: 'favorable',
    source: 'NCCN Guidelines NSCLC (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/nscl.pdf',
  },
  {
    gene: 'ROS1', protein: 'ROS1 receptor tyrosine kinase', cancerType: 'NSCLC',
    category: 'predictive', clinicalSignificance: 'ROS1 rearrangements predict response to ROS1/ALK inhibitors. Similar demographic to ALK-positive patients.',
    testingMethod: 'Tissue biopsy FISH or NGS', assayType: 'FISH / IHC / NGS',
    therapeuticRelevance: 'Crizotinib, Entrectinib, Lorlatinib, Repotrectinib',
    positivityRate: '~1-2% NSCLC', prognosis: 'favorable',
    source: 'NCCN Guidelines NSCLC (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/nscl.pdf',
  },
  {
    gene: 'MSI / MMR', protein: 'Microsatellite Instability / Mismatch Repair proteins', cancerType: 'Colorectal / Endometrial / Gastric',
    category: 'predictive', clinicalSignificance: 'MSI-High / dMMR status predicts response to immune checkpoint inhibitors (pembrolizumab) and indicates Lynch syndrome risk. Also predicts lack of benefit from 5-FU monotherapy in stage II CRC.',
    testingMethod: 'Tissue biopsy IHC + molecular', assayType: 'IHC (MLH1, MSH2, MSH6, PMS2) / PCR (5-panel) / NGS',
    therapeuticRelevance: 'Pembrolizumab, Nivolumab, Ipilimumab',
    positivityRate: '~15% stage II CRC, ~4% metastatic CRC, ~30% endometrial', prognosis: 'favorable',
    source: 'NCCN Guidelines Colon Cancer (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/colon.pdf',
  },
  {
    gene: 'PIK3CA', protein: 'Phosphatidylinositol-4,5-bisphosphate 3-kinase catalytic subunit alpha', cancerType: 'Breast',
    category: 'predictive', clinicalSignificance: 'PIK3CA mutations predict response to PI3K inhibitors (alpelisib) in HR+/HER2- advanced breast cancer.',
    testingMethod: 'Tissue or liquid biopsy', assayType: 'PCR / NGS (therascreen PIK3CA RGQ)',
    therapeuticRelevance: 'Alpelisib (in combination with fulvestrant)',
    positivityRate: '~40% HR+/HER2- breast cancer', prognosis: 'unknown',
    source: 'NCCN Guidelines Breast Cancer (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/breast.pdf',
  },
  {
    gene: 'IDH1/2', protein: 'Isocitrate Dehydrogenase 1/2', cancerType: 'Glioma / AML / Cholangiocarcinoma',
    category: 'prognostic', clinicalSignificance: 'IDH mutations have favorable prognosis in gliomas (better overall survival). In AML, predict response to IDH inhibitors. In cholangiocarcinoma, predict response to ivosidenib.',
    testingMethod: 'Tissue biopsy DNA extraction', assayType: 'PCR / NGS / IHC (R132H)',
    therapeuticRelevance: 'Ivosidenib (IDH1), Enasidenib (IDH2), Vorasidenib (glioma)',
    positivityRate: '~70% low-grade glioma, ~20% AML, ~20% cholangiocarcinoma', prognosis: 'favorable',
    source: 'NCCN Guidelines CNS Cancers (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/cns.pdf',
  },
  {
    gene: 'TP53', protein: 'Tumor protein p53', cancerType: 'Pan-cancer',
    category: 'prognostic', clinicalSignificance: 'TP53 mutations are the most frequent alteration in human cancers. Generally associated with worse prognosis and resistance to therapy, though context-dependent.',
    testingMethod: 'Tissue biopsy NGS', assayType: 'NGS / Sanger sequencing / IHC',
    therapeuticRelevance: 'No direct targeted therapy yet; guides chemotherapy intensity decisions',
    positivityRate: '~50% of all cancers', prognosis: 'unfavorable',
    source: 'IARC TP53 Database / COSMIC', sourceUrl: 'https://tp53.iarc.fr/',
  },
  {
    gene: 'MET', protein: 'Mesenchymal-Epithelial Transition factor', cancerType: 'NSCLC',
    category: 'predictive', clinicalSignificance: 'MET exon 14 skipping mutations predict response to MET inhibitors. MET amplification is a resistance mechanism to EGFR TKIs.',
    testingMethod: 'Tissue or liquid biopsy', assayType: 'NGS / FISH (amplification) / IHC',
    therapeuticRelevance: 'Capmatinib, Tepotinib, Savolitinib',
    positivityRate: '~3% NSCLC (exon 14 skip)', prognosis: 'favorable',
    source: 'NCCN Guidelines NSCLC (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/nscl.pdf',
  },
  {
    gene: 'RET', protein: 'Rearranged during Transfection receptor tyrosine kinase', cancerType: 'NSCLC / Thyroid',
    category: 'predictive', clinicalSignificance: 'RET rearrangements predict response to selective RET inhibitors. RET M918T mutation in medullary thyroid cancer indicates aggressive disease.',
    testingMethod: 'Tissue biopsy NGS or FISH', assayType: 'NGS / FISH / PCR',
    therapeuticRelevance: 'Selpercatinib, Pralsetinib',
    positivityRate: '~1-2% NSCLC, ~25% medullary thyroid', prognosis: 'favorable',
    source: 'NCCN Guidelines Thyroid Carcinoma (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/thyroid.pdf',
  },
  {
    gene: 'NTRK', protein: 'Neurotrophic Receptor Tyrosine Kinase', cancerType: 'Pan-cancer (rare)',
    category: 'predictive', clinicalSignificance: 'NTRK gene fusions are rare but highly actionable — predict dramatic response to TRK inhibitors regardless of cancer type (tumor-agnostic biomarker).',
    testingMethod: 'Tissue biopsy NGS / IHC screen', assayType: 'IHC (screening) / NGS (RNA fusion panels)',
    therapeuticRelevance: 'Larotrectinib, Entrectinib (tumor-agnostic approval)',
    positivityRate: '<1% common cancers; >90% some rare tumors (secretory breast, mammary analog)', prognosis: 'favorable',
    source: 'FDA Tissue-Agnostic Approvals / NCCN', sourceUrl: 'https://www.fda.gov/news-events/press-announcements',
  },
  {
    gene: 'ESR1', protein: 'Estrogen Receptor alpha', cancerType: 'Breast',
    category: 'predictive', clinicalSignificance: 'ER positivity predicts response to endocrine therapy (tamoxifen, aromatase inhibitors, fulvestrant). ESR1 mutations indicate acquired resistance to aromatase inhibitors.',
    testingMethod: 'Tissue biopsy IHC', assayType: 'IHC (Allred score) / NGS (mutations)',
    therapeuticRelevance: 'Tamoxifen, Anastrozole, Letrozole, Exemestane, Fulvestrant',
    positivityRate: '~70-75% breast cancers', prognosis: 'favorable',
    source: 'ASCO/CAP ER/PgR Testing Guidelines', sourceUrl: 'https://ascopubs.org/doi/10.1200/JCO.2009.25.2636',
  },
  {
    gene: 'APC', protein: 'Adenomatous Polyposis Coli protein', cancerType: 'Colorectal',
    category: 'diagnostic', clinicalSignificance: 'APC mutations are the initiating event in >80% of sporadic colorectal cancers. Germline mutations cause familial adenomatous polyposis (FAP).',
    testingMethod: 'Tissue or germline DNA', assayType: 'NGS / Sanger sequencing',
    therapeuticRelevance: 'No direct targeted therapy; screening/surgical prevention in FAP',
    positivityRate: '~80% sporadic CRC', prognosis: 'unknown',
    source: 'COSMIC / NCCN Colon Cancer (2024)', sourceUrl: 'https://www.nccn.org/professionals/physician_gls/pdf/colon.pdf',
  },
];

const CANCER_FILTERS = ['All cancers', 'Non-small cell lung cancer', 'Breast', 'Colorectal', 'Pancreatic', 'Melanoma', 'Ovarian', 'Thyroid', 'Glioma', 'Bladder'];
const CATEGORY_FILTERS: { id: BiomarkerCategory | 'all'; labelKey: 'allCategories' | 'predictive' | 'prognosis' | 'diagnostic' }[] = [
  { id: 'all', labelKey: 'allCategories' },
  { id: 'predictive', labelKey: 'predictive' },
  { id: 'prognostic', labelKey: 'prognosis' },
  { id: 'diagnostic', labelKey: 'diagnostic' },
];

const PROGNOSIS_COLORS = {
  favorable: 'bg-green-100 text-green-700 border-green-200',
  unfavorable: 'bg-red-100 text-red-700 border-red-200',
  unknown: 'bg-gray-100 text-gray-600 border-gray-200',
};

const CATEGORY_COLORS = {
  predictive: 'bg-teal-50 text-teal-700 border-teal-200',
  prognostic: 'bg-blue-50 text-blue-700 border-blue-200',
  diagnostic: 'bg-purple-50 text-purple-700 border-purple-200',
};

export function BiomarkerAtlas() {
  const { language, direction } = useApp();
  const t = getTranslation(language);
  const tb = t.biomarkers;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<BiomarkerCategory | 'all'>('all');
  const [cancerFilter, setCancerFilter] = useState('All cancers');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return BIOMARKERS.filter(b => {
      const matchSearch = !search ||
        b.gene.toLowerCase().includes(search.toLowerCase()) ||
        b.protein.toLowerCase().includes(search.toLowerCase()) ||
        b.cancerType.toLowerCase().includes(search.toLowerCase()) ||
        b.therapeuticRelevance.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || b.category === categoryFilter;
      const matchCancer = cancerFilter === 'All cancers' || b.cancerType.includes(cancerFilter);
      return matchSearch && matchCategory && matchCancer;
    });
  }, [search, categoryFilter, cancerFilter]);

  return (
    <div className="animate-fade-in" dir={direction}>
      <PageHeader
        icon={<Dna className="w-5 h-5 text-teal-400" />}
        title={tb.title}
        subtitle={tb.subtitle}
      />

      {/* Search + filters */}
      <div className="bg-white rounded-2xl border border-navy-100 p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-navy-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tb.searchPlaceholder}
            className="w-full ps-9 pe-3 py-2.5 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
            {CATEGORY_FILTERS.map(cf => (
              <button
                key={cf.id}
                onClick={() => setCategoryFilter(cf.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  categoryFilter === cf.id ? 'bg-teal-500 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                }`}
              >
                {cf.id === 'all' ? tb.allCategories : tb[cf.labelKey]}
              </button>
            ))}
          </div>

          {/* Cancer type filter */}
          <select
            value={cancerFilter}
            onChange={(e) => setCancerFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-navy-50 rounded-lg border border-navy-100 text-navy-700 outline-none focus:border-teal-400 sm:ml-auto"
          >
            {CANCER_FILTERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="text-xs text-navy-400">{filtered.length} {tb.biomarker}{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-navy-400">
          <Microscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{tb.noResults}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const isExpanded = expanded === b.gene;
            return (
              <div key={b.gene} className="bg-white rounded-2xl border border-navy-100 overflow-hidden transition-all">
                <button
                  onClick={() => setExpanded(isExpanded ? null : b.gene)}
                  className="w-full text-start p-4 hover:bg-navy-50/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <Dna className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-navy-900 text-base">{b.gene}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[b.category]}`}>
                            {b.category === 'prognostic' ? tb.prognosis : tb[b.category as 'predictive' | 'diagnostic']}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PROGNOSIS_COLORS[b.prognosis]}`}>
                            {tb[b.prognosis]}
                          </span>
                        </div>
                        <p className="text-xs text-navy-500 truncate">{b.protein} — {b.cancerType}</p>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-navy-50 pt-3">
                    <div>
                      <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{tb.clinicalSignificance}</div>
                      <p className="text-sm text-navy-700 leading-relaxed">{b.clinicalSignificance}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{tb.testingMethod}</div>
                        <p className="text-sm text-navy-700">{b.testingMethod}</p>
                        <p className="text-xs text-navy-500 mt-0.5">{tb.assayType}: {b.assayType}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{tb.therapeuticRelevance}</div>
                        <p className="text-sm text-navy-700">{b.therapeuticRelevance}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{tb.positivity}</div>
                        <p className="text-sm text-navy-700">{b.positivityRate}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">{tb.source}</div>
                        <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
                          {b.source} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{tb.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
