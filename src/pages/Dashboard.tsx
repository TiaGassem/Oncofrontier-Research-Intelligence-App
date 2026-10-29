import {
  Search,
  ShieldAlert,
  BarChart3,
  ClipboardList,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Database,
  FileText,
  FlaskConical,
  Target,
  Atom,
  Globe2,
  Dna,
  User,
  Heart,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePreferences } from '@/context/PreferencesContext';
import { orderModulesForRole } from '@/lib/experience';
import { getTranslation } from '@/lib/i18n';
import { FULL_INTERFACE_LANGUAGES } from '@/lib/languageSupport';
import { BrandMark } from '@/components/BrandMark';
import type { ViewName } from '@/types';

interface DashboardProps {
  onNavigate: (view: ViewName) => void;
}

const MODULES = [
  {
    id: 'discovery' as ViewName,
    titleKey: 'discovery' as const,
    subtitle: 'Cancer Drug Discovery',
    descEn: 'Evidence-backed target assessment from Open Targets, compound lookup from PubChem, resistance context, translational validation planning, and research brief export.',
    descFr: 'Évaluation des cibles basée sur des preuves depuis Open Targets, recherche de composés depuis PubChem, contexte de résistance, planification de validation translationnelle, et export de brief.',
    descAr: 'تقييم الأهداف المدعوم بالأدلة من Open Targets، البحث عن المركبات من PubChem، سياق المقاومة، تخطيط التحقق الانتقالي، وتصدير الملخص.',
    icon: FlaskConical,
    color: 'teal',
    stat: 'Open Targets + PubChem',
  },
  {
    id: 'curemap' as ViewName,
    titleKey: 'curemap' as const,
    subtitle: 'Evidence Explorer',
    descEn: 'Search cancer types, genes, drugs, and research questions across published literature. Retrieve real publications with source-supported findings, study context, and uncertainty.',
    descFr: 'Recherchez types de cancer, gènes, médicaments et questions de recherche dans la littérature publiée. Récupérez de vraies publications avec résultats, contexte d\'étude et incertitude.',
    descAr: 'ابحث عن أنواع السرطان، الجينات، الأدوية، وأسئلة البحث في المنشورات المنشورة. استرد منشورات حقيقية مع نتائج مدعومة بالمصدر وسياق الدراسة وعدم اليقين.',
    icon: Search,
    color: 'navy',
    stat: 'PubMed + Europe PMC',
  },
  {
    id: 'resistance' as ViewName,
    titleKey: 'resistance' as const,
    subtitle: 'Treatment Resistance',
    descEn: 'Explore reported treatment-resistance mechanisms by cancer type, therapy, target, and gene. Every finding links to its supporting publication with PMID/DOI.',
    descFr: 'Explorez les mécanismes de résistance aux traitements par type de cancer, thérapie, cible et gène. Chaque résultat renvoie à sa publication avec PMID/DOI.',
    descAr: 'استكشف آليات مقاومة العلاج المبلغ عنها حسب نوع السرطان والعلاج والهدف والجين. كل نتيجة مرتبطة بمنشورها الداعم بـ PMID/DOI.',
    icon: ShieldAlert,
    color: 'teal',
    stat: 'Source-grounded',
  },
  {
    id: 'equity' as ViewName,
    titleKey: 'equity' as const,
    subtitle: 'Research Gaps',
    descEn: 'Explore publication activity and registered trial activity by cancer type. See where research is concentrated and where gaps may exist. No fabricated statistics.',
    descFr: 'Explorez l\'activité de publication et d\'essais cliniques par type de cancer. Voyez où la recherche se concentre et où des lacunes peuvent exister. Aucune statistique fabriquée.',
    descAr: 'استكشف نشاط المنشورات والتجارب المسجلة حسب نوع السرطان. تعرف على تركيز البحث وأين قد توجد فجوات. لا إحصائيات ملفقة.',
    icon: BarChart3,
    color: 'navy',
    stat: 'PubMed + ClinicalTrials.gov',
  },
  {
    id: 'burden' as ViewName,
    titleKey: 'burden' as const,
    subtitle: 'Global Burden Atlas',
    descEn: 'Real-world cancer statistics from GLOBOCAN 2022 (IARC/WHO). Compare incidence, mortality, and 5-year prevalence across all six WHO regions and 185 countries.',
    descFr: 'Statistiques réelles sur le cancer depuis GLOBOCAN 2022 (CIRC/OMS). Comparez l\'incidence, la mortalité et la prévalence à 5 ans dans les six régions OMS et 185 pays.',
    descAr: 'إحصائيات حقيقية للسرطان من GLOBOCAN 2022 (IARC/WHO). قارن الإصابة والوفيات والانتشار عبر جميع مناطق الصحة العالمية الست و185 دولة.',
    icon: Globe2,
    color: 'teal',
    stat: 'GLOBOCAN 2022 · IARC/WHO',
  },
  {
    id: 'biomarkers' as ViewName,
    titleKey: 'biomarkers' as const,
    subtitle: 'Biomarker Atlas',
    descEn: 'Clinically validated biomarkers — EGFR, KRAS, BRAF, HER2, BRCA1/2, PD-L1, ALK, MSI/MMR and more — with testing methods, assay types, therapeutic relevance, and prevalence by population.',
    descFr: 'Biomarqueurs validés cliniquement — EGFR, KRAS, BRAF, HER2, BRCA1/2, PD-L1, ALK, MSI/MMR et plus — avec méthodes de test, types d\'analyse, pertinence thérapeutique et prévalence.',
    descAr: 'واسمات حيوية مثبتة سريرياً — EGFR، KRAS، BRAF، HER2، BRCA1/2، PD-L1، ALK، MSI/MMR والمزيد — مع طرق الاختبار وأنواع التحليل والصلة العلاجية والانتشار.',
    icon: Dna,
    color: 'navy',
    stat: 'NCCN · ASCO · CAP Guidelines',
  },
  {
    id: 'anatomy' as ViewName,
    titleKey: 'anatomy' as const,
    subtitle: 'Cancer Anatomy',
    descEn: 'Explore the human body by organ system — 10 body systems, 20+ organs. Common cancers, anatomy, function, risk factors, early warning signs, and WHO regional patterns.',
    descFr: 'Explorez le corps humain par système organique — 10 systèmes, 20+ organes. Cancers courants, anatomie, fonction, facteurs de risque, signes d\'alerte et schémas régionaux OMS.',
    descAr: 'استكشف جسم الإنسان حسب الأجهزة العضوية — 10 أجهزة، أكثر من 20 عضواً. السرطانات الشائعة والتشريح والوظيفة وعوامل الخطر وعلامات الإنذار والأنماط الإقليمية لمنظمة الصحة العالمية.',
    icon: User,
    color: 'teal',
    stat: 'WHO/IARC · GLOBOCAN 2022',
  },
  {
    id: 'companion' as ViewName,
    titleKey: 'companion' as const,
    subtitle: 'For Patients & Families',
    descEn: 'Understand cancer in plain language — what it is, survival statistics explained honestly, cancer plus other conditions, practical guidance, and a dedicated patient chatbot.',
    descFr: "Comprendre le cancer en termes simples — ce que c'est, statistiques de survie expliquées honnêtement, cancer et autres maladies, conseils pratiques, et un chatbot dédié aux patients.",
    descAr: 'افهم السرطان بلغة بسيطة — ما هو، إحصائيات البقاء مشروحة بأمانة، السرطان وأمراض أخرى، إرشادات عملية، ودردشة مخصصة للمرضى.',
    icon: Heart,
    color: 'navy',
    stat: 'Patient & Family Support',
  },
];

const DATA_SOURCES = [
  { name: 'PubMed / NCBI E-utilities', url: 'https://pubmed.ncbi.nlm.nih.gov/', icon: FileText, descEn: '35M+ biomedical citations from MEDLINE and life science journals', descFr: '35M+ citations biomédicales de MEDLINE et journaux de sciences du vivant', descAr: 'أكثر من 35 مليون استشهاد طبي حيوي من MEDLINE ومجلات علوم الحياة' },
  { name: 'Europe PMC REST API', url: 'https://europepmc.org/', icon: Database, descEn: 'Full-text articles, abstracts, and preprints from European life sciences', descFr: 'Articles en texte intégral, résumés et prépublications des sciences de la vie européennes', descAr: 'مقالات كاملة وملخصات وطبعات مسبقة من علوم الحياة الأوروبية' },
  { name: 'ClinicalTrials.gov API v2', url: 'https://clinicaltrials.gov/search', icon: FlaskConical, descEn: 'Registered clinical studies from around the world', descFr: 'Études cliniques enregistrées du monde entier', descAr: 'دراسات سريرية مسجلة من جميع أنحاء العالم' },
  { name: 'Open Targets Platform API', url: 'https://platform.opentargets.org/', icon: Target, descEn: 'Target-disease associations, tractability, safety liabilities, and drug candidates', descFr: 'Associations cible-maladie, tractabilité, risques de sécurité et candidats médicaments', descAr: 'ارتباطات الهدف بالمرض، القابلية للعلاج، المخاطر الصحية، ومرشحو الأدوية' },
  { name: 'PubChem REST API', url: 'https://pubchem.ncbi.nlm.nih.gov/', icon: Atom, descEn: 'Compound names, SMILES, molecular formula, weight, and IUPAC names', descFr: 'Noms de composés, SMILES, formule moléculaire, poids et noms IUPAC', descAr: 'أسماء المركبات، SMILES، الصيغة الجزيئية، الوزن، وأسماء IUPAC' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { selectedRecords, language, direction } = useApp();
  const t = getTranslation(language);
  const { role } = usePreferences();
  // Modules the visitor's chosen role relies on appear first; the rest keep
  // their original order below, so nothing is hidden.
  const orderedModules = orderModulesForRole(MODULES, role);
  const descKey = language === 'fr' ? 'descFr' : language === 'ar' ? 'descAr' : 'descEn';

  return (
    <div className="animate-fade-in" dir={direction}>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 rounded-2xl p-8 md:p-10 mb-8">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #2cc3b1 0%, transparent 50%), radial-gradient(circle at 80% 70%, #2cc3b1 0%, transparent 40%)'
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <BrandMark className="w-6 h-6 text-teal-400" />
            <span className="text-teal-300 font-semibold text-sm tracking-widest uppercase">
              {t.dashboard.badge}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight max-w-2xl mb-3">
            {t.dashboard.title}
          </h1>
          <p className="text-navy-200 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
            {t.dashboard.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('discovery')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-xl hover:bg-teal-400 transition-colors"
            >
              <FlaskConical className="w-4 h-4" /> {t.nav.discovery} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <MessageSquare className="w-4 h-4" /> {t.dashboard.askAssistant}
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-navy-100 p-4">
          <div className="text-2xl font-bold text-navy-900">5</div>
          <div className="text-xs text-navy-500 mt-1">{t.dashboard.sources}</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4">
          <div className="text-2xl font-bold text-navy-900">8</div>
          <div className="text-xs text-navy-500 mt-1">{t.dashboard.modules}</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4">
          <div className="text-2xl font-bold text-teal-600">{selectedRecords.length}</div>
          <div className="text-xs text-navy-500 mt-1">{t.dashboard.recordsInPlanner}</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4">
          <div className="text-2xl font-bold text-navy-900">{FULL_INTERFACE_LANGUAGES.length}</div>
          <div className="text-xs text-navy-500 mt-1">{t.dashboard.languages}</div>
        </div>
      </div>

      {/* Module cards */}
      <h2 className="text-lg font-bold text-navy-900 mb-4">{t.dashboard.modules}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {orderedModules.map((mod) => {
          const Icon = mod.icon;
          const isTeal = mod.color === 'teal';
          return (
            <button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="group bg-white rounded-xl border border-navy-100 p-5 text-start hover:shadow-lg hover:border-navy-200 transition-all duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  isTeal ? 'bg-teal-50 text-teal-600' : 'bg-navy-50 text-navy-600'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-0.5">{t.nav[mod.titleKey]}</h3>
              <p className="text-xs text-navy-400 font-medium mb-2">{mod.subtitle}</p>
              <p className="text-sm text-navy-600 leading-relaxed mb-3">{mod[descKey]}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400">{mod.stat}</span>
                <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-navy-900 mb-4">{t.dashboard.tools}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => onNavigate('planner')}
          className="flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-4 text-start hover:border-teal-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-navy-900 text-sm">{t.nav.planner}</div>
            <div className="text-xs text-navy-400">
              {selectedRecords.length > 0
                ? `${selectedRecords.length} ✦`
                : '✦'}
            </div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('assistant')}
          className="flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-4 text-start hover:border-teal-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-navy-900 text-sm">{t.nav.assistant}</div>
            <div className="text-xs text-navy-400">✦</div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('methodology')}
          className="flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-4 text-start hover:border-teal-300 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-navy-900 text-sm">{t.nav.methodology}</div>
            <div className="text-xs text-navy-400">✦</div>
          </div>
        </button>
      </div>

      {/* Data sources */}
      <h2 className="text-lg font-bold text-navy-900 mb-4">{t.dashboard.sources}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {DATA_SOURCES.map((src) => {
          const Icon = src.icon;
          return (
            <div key={src.name} className="bg-white rounded-xl border border-navy-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-navy-600" />
                <h3 className="font-semibold text-navy-900 text-sm">{src.name}</h3>
              </div>
              <p className="text-xs text-navy-500 leading-relaxed mb-2">{src[descKey]}</p>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                {t.dashboard.dataSources} →
              </a>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
        <p className="text-xs text-amber-800 leading-relaxed">
          {t.dashboard.disclaimer}
        </p>
      </div>
    </div>
  );
}
