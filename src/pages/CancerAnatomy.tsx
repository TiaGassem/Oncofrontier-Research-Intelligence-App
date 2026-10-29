import { useState } from 'react';
import { Heart, Brain, Wind, Salad, Droplet, Shield, Eye, Microscope, ExternalLink, AlertCircle, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { PageHeader } from '@/components/PageHeader';

type SystemId = 'digestive' | 'respiratory' | 'reproductive' | 'endocrine' | 'hematologic' | 'urinary' | 'breast' | 'skin' | 'headNeck' | 'nervous';

interface OrganInfo {
  name: string;
  cancers: { name: string; globalCases: string; fiveYearSurvival: string }[];
  anatomy: string;
  function: string;
  riskFactors: string[];
  earlySigns: string[];
  whoRegionMostAffected: string;
}

const SYSTEMS: Record<SystemId, { icon: typeof Heart; color: string; organs: OrganInfo[] }> = {
  digestive: {
    icon: Salad, color: '#0d9488',
    organs: [
      {
        name: 'Colon & Rectum',
        cancers: [
          { name: 'Colorectal adenocarcinoma', globalCases: '1.93M (3rd most common)', fiveYearSurvival: '65% (localized), 14% (metastatic)' },
          { name: 'Anal squamous cell carcinoma', globalCases: '~50,000', fiveYearSurvival: '70-80% (early stage)' },
        ],
        anatomy: 'Large intestine: cecum, ascending/transverse/descending/sigmoid colon, rectum, anus. ~1.5m length.',
        function: 'Water absorption, electrolyte balance, formation and storage of feces, gut microbiome homeostasis.',
        riskFactors: ['Age >50', 'Western diet (red/processed meat)', 'Obesity', 'Smoking', 'Alcohol', 'Family history / Lynch syndrome', 'Inflammatory bowel disease (IBD)'],
        earlySigns: ['Change in bowel habits', 'Rectal bleeding', 'Unexplained weight loss', 'Persistent abdominal pain', 'Iron deficiency anemia'],
        whoRegionMostAffected: 'Europe & Western Pacific (highest incidence); Eastern Mediterranean & Africa (rising)',
      },
      {
        name: 'Stomach',
        cancers: [
          { name: 'Gastric adenocarcinoma (intestinal)', globalCases: '968,769 (5th most common)', fiveYearSurvival: '35% (overall), 70% (early stage in screened populations)' },
          { name: 'Gastric adenocarcinoma (diffuse)', globalCases: 'Subset of above', fiveYearSurvival: '~20% (often diagnosed late)' },
        ],
        anatomy: 'J-shaped organ in upper abdomen: cardia, fundus, body, antrum, pylorus. Four layers: mucosa, submucosa, muscularis, serosa.',
        function: 'Mechanical and chemical digestion; acid (HCl) and pepsin secretion; intrinsic factor for B12 absorption; ghrelin (hunger hormone).',
        riskFactors: ['Helicobacter pylori infection', 'High-salt/smoked/pickled diet', 'Tobacco', 'Family history / CDH1 mutation', 'Atrophic gastritis', 'EBV-associated (~9%)'],
        earlySigns: ['Persistent indigestion', 'Loss of appetite', 'Early satiety', 'Upper abdominal discomfort', 'Unintentional weight loss'],
        whoRegionMostAffected: 'Western Pacific (Japan, Korea — highest incidence); Eastern Mediterranean',
      },
      {
        name: 'Liver & Biliary',
        cancers: [
          { name: 'Hepatocellular carcinoma (HCC)', globalCases: '865,413 (6th most common)', fiveYearSurvival: '20% (overall), 70% (early resection/transplant)' },
          { name: 'Cholangiocarcinoma (bile duct)', globalCases: '~300,000', fiveYearSurvival: '~10% (advanced)' },
        ],
        anatomy: 'Largest internal organ, right upper quadrant. 8 segments (Couinaud). Bile ducts: intrahepatic, perihilar, distal.',
        function: 'Detoxification, protein synthesis, bile production, glucose/glycogen regulation, lipid metabolism, vitamin storage.',
        riskFactors: ['HBV/HCV infection', 'Cirrhosis (any cause)', 'Aflatoxin exposure', 'Alcohol', 'NAFLD/MASH', 'Diabetes/obesity', 'Hemochromatosis'],
        earlySigns: ['Right upper quadrant pain', 'Unexplained weight loss', 'Jaundice (late)', 'Ascites (late)', 'Elevated AFP on screening'],
        whoRegionMostAffected: 'Western Pacific & South-East Asia (HBV-driven); Africa (HBV + aflatoxin); Americas/Europe (rising HCV/NAFLD-driven)',
      },
      {
        name: 'Pancreas',
        cancers: [
          { name: 'Pancreatic ductal adenocarcinoma (PDAC)', globalCases: '510,982 (9th most common)', fiveYearSurvival: '~12% (all stages), <5% (metastatic)' },
          { name: 'Pancreatic neuroendocrine tumors (pNET)', globalCases: '~50,000', fiveYearSurvival: '50-80% (varies by grade)' },
        ],
        anatomy: 'Retroperitoneal organ: head, neck, body, tail. Exocrine (acini/ducts) + endocrine (islets of Langerhans).',
        function: 'Exocrine: digestive enzymes (amylase, lipase, proteases). Endocrine: insulin, glucagon, somatostatin.',
        riskFactors: ['Smoking', 'Chronic pancreatitis', 'Diabetes (new-onset in older adults)', 'Obesity', 'Family history / BRCA2, PALB2', 'Heavy alcohol use'],
        earlySigns: ['Often silent until advanced', 'New-onset diabetes', 'Jaundice (head of pancreas)', 'Back pain', 'Unexplained weight loss'],
        whoRegionMostAffected: 'Europe & North America (highest incidence); rapidly rising in all regions',
      },
      {
        name: 'Esophagus',
        cancers: [
          { name: 'Esophageal squamous cell carcinoma', globalCases: '~604,000', fiveYearSurvival: '~20% (overall)' },
          { name: 'Esophageal adenocarcinoma', globalCases: '~530,000', fiveYearSurvival: '~25% (overall)' },
        ],
        anatomy: 'Muscular tube ~25cm: cervical, thoracic, abdominal segments. Upper 2/3 squamous epithelium, lower 1/3 columnar.',
        function: 'Transport of food and liquids from pharynx to stomach. Upper/lower esophageal sphincters prevent reflux.',
        riskFactors: ['Smoking + alcohol (synergistic for SCC)', 'Barrett esophagus / GERD (adenocarcinoma)', 'Obesity', 'Hot beverages (>65°C)', 'Achalasia', 'Betel nut chewing'],
        earlySigns: ['Dysphagia (progressive)', 'Odynophagia', 'Weight loss', 'Chest discomfort', 'Regurgitation'],
        whoRegionMostAffected: 'Western Pacific & South-East Asia (SCC); Europe & Americas (adenocarcinoma rising)',
      },
    ],
  },
  respiratory: {
    icon: Wind, color: '#0ea5e9',
    organs: [
      {
        name: 'Lung',
        cancers: [
          { name: 'Non-small cell lung cancer (NSCLC)', globalCases: '2.09M (2nd most common)', fiveYearSurvival: '65% (localized), 9% (metastatic)' },
          { name: 'Small cell lung cancer (SCLC)', globalCases: '~400,000', fiveYearSurvival: '~7% (extensive stage)' },
        ],
        anatomy: 'Right lung: 3 lobes (upper, middle, lower). Left lung: 2 lobes. Bronchopulmonary segments. Pleura: visceral + parietal.',
        function: 'Gas exchange: O2/CO2 diffusion across alveolar-capillary membrane. ~480 million alveoli. Respiratory defense: mucociliary clearance.',
        riskFactors: ['Tobacco smoking (>80% of cases)', 'Secondhand smoke', 'Radon exposure', 'Asbestos', 'Air pollution (PM2.5)', 'Family history', 'Radiation therapy history'],
        earlySigns: ['Persistent cough (change in pattern)', 'Hemoptysis', 'Chest pain', 'Shortness of breath', 'Recurrent pneumonia', 'Unexplained weight loss'],
        whoRegionMostAffected: 'Western Pacific & Europe (highest); Africa (lowest but rising with tobacco industry expansion)',
      },
      {
        name: 'Larynx & Pharynx',
        cancers: [
          { name: 'Laryngeal squamous cell carcinoma', globalCases: '~190,000', fiveYearSurvival: '60% (early), 30% (advanced)' },
          { name: 'Nasopharyngeal carcinoma', globalCases: '~129,000', fiveYearSurvival: '70% (stage I-II)' },
        ],
        anatomy: 'Larynx: supraglottis, glottis (vocal cords), subglottis. Pharynx: nasopharynx, oropharynx, hypopharynx.',
        function: 'Larynx: voice production, airway protection, breathing. Pharynx: pathway for air and food.',
        riskFactors: ['Smoking + alcohol', 'HPV infection (oropharyngeal)', 'EBV (nasopharyngeal)', 'Occupational exposures (asbestos, nickel)', 'Betel nut'],
        earlySigns: ['Hoarseness >2 weeks', 'Neck lump', 'Sore throat not resolving', 'Ear pain (referred)', 'Difficulty swallowing'],
        whoRegionMostAffected: 'South-East Asia & Western Pacific (nasopharyngeal, EBV-associated); Europe & Americas (oropharyngeal, HPV-associated)',
      },
    ],
  },
  reproductive: {
    icon: Shield, color: '#8b5cf6',
    organs: [
      {
        name: 'Cervix uteri',
        cancers: [
          { name: 'Cervical squamous cell carcinoma', globalCases: '661,021 (8th most common)', fiveYearSurvival: '92% (early), 17% (metastatic)' },
          { name: 'Cervical adenocarcinoma', globalCases: '~120,000', fiveYearSurvival: '80% (early), 15% (metastatic)' },
        ],
        anatomy: 'Lower narrow portion of uterus. Transformation zone: squamocolumnar junction (most cancer origin site).',
        function: 'Passage for menstrual flow, sperm entry, cervical mucus production (hormone-dependent), structural support for uterus.',
        riskFactors: ['HPV 16/18 infection (>95% of cases)', 'Multiple sexual partners', 'Early sexual activity', 'Smoking', 'HIV/immunosuppression', 'Long-term oral contraceptives'],
        earlySigns: ['Often asymptomatic (screening critical)', 'Post-coital bleeding', 'Irregular bleeding', 'Vaginal discharge', 'Pelvic pain (late)'],
        whoRegionMostAffected: 'Africa & South-East Asia (highest mortality, lack of screening); Americas & Europe (declining with HPV vaccination)',
      },
      {
        name: 'Ovary',
        cancers: [
          { name: 'High-grade serous carcinoma', globalCases: '~300,000 (majority)', fiveYearSurvival: '~50% (overall), 30% (advanced)' },
          { name: 'Ovarian clear cell / endometrioid', globalCases: '~50,000', fiveYearSurvival: '70-80% (early)' },
        ],
        anatomy: 'Paired organs, fallopian tubes, fimbriae. Origin now includes distal fallopian tube (STIC lesions for serous).',
        function: 'Oocyte production, ovulation, steroid hormone synthesis (estrogen, progesterone, testosterone).',
        riskFactors: ['BRCA1/2 mutations', 'Lynch syndrome', 'Nulliparity / late menopause', 'Endometriosis (clear cell/endometrioid)', 'Family history', 'Reduced by: oral contraceptives, tubal ligation'],
        earlySigns: ['Often silent ("silent killer")', 'Bloating', 'Early satiety', 'Pelvic/abdominal pain', 'Urinary urgency', 'CA-125 elevation (non-specific)'],
        whoRegionMostAffected: 'Europe & North America (highest incidence); Africa (lowest)',
      },
      {
        name: 'Prostate',
        cancers: [
          { name: 'Prostate acinar adenocarcinoma', globalCases: '1.47M (3rd most common)', fiveYearSurvival: '~100% (localized), 32% (metastatic)' },
          { name: 'Neuroendocrine prostate cancer (rare)', globalCases: '~20,000', fiveYearSurvival: '~12% (aggressive)' },
        ],
        anatomy: 'Walnut-shaped gland below bladder, surrounding urethra. Zones: peripheral (70% of cancer origin), central, transition.',
        function: 'Prostatic fluid production (seminal fluid component), PSA secretion, smooth muscle for ejaculation.',
        riskFactors: ['Age (>65 majority)', 'African ancestry (~2x risk)', 'Family history', 'BRCA2 mutations', 'Androgen receptor signaling', 'Diet high in saturated fat'],
        earlySigns: ['Often asymptomatic (screening with PSA)', 'Urinary frequency/urgency', 'Weak stream', 'Hematuria/hematospermia', 'Bone pain (metastatic)'],
        whoRegionMostAffected: 'Americas & Europe (highest, PSA screening); Africa (high mortality, less screening); Asia (lowest incidence)',
      },
      {
        name: 'Testis',
        cancers: [
          { name: 'Seminoma', globalCases: '~45,000', fiveYearSurvival: '~99% (all stages)' },
          { name: 'Non-seminomatous germ cell tumor', globalCases: '~35,000', fiveYearSurvival: '~95% (all stages)' },
        ],
        anatomy: 'Paired oval glands in scrotum. Seminiferous tubules (spermatogenesis). Leydig cells (testosterone).',
        function: 'Sperm production (~100 million/day), testosterone synthesis, male reproductive function.',
        riskFactors: ['Cryptorchidism (undescended testis)', 'Family history', 'Klinefelter syndrome', 'HIV/AIDS', 'Prior testicular cancer (contralateral)'],
        earlySigns: ['Painless testicular lump or swelling', 'Heaviness in scrotum', 'Dull ache in lower abdomen', 'Back pain (metastatic)'],
        whoRegionMostAffected: 'Europe & Americas (highest); Africa & Asia (lowest); peak age 20-40',
      },
    ],
  },
  endocrine: {
    icon: Heart, color: '#f59e0b',
    organs: [
      {
        name: 'Thyroid',
        cancers: [
          { name: 'Papillary thyroid carcinoma', globalCases: '~600,000 (majority)', fiveYearSurvival: '~100% (localized), 75% (metastatic)' },
          { name: 'Follicular / Medullary / Anaplastic', globalCases: '~220,000', fiveYearSurvival: '85% follicular; 40% medullary; <10% anaplastic' },
        ],
        anatomy: 'Butterfly-shaped gland in anterior neck. Two lobes, isthmus. Follicular cells (T3/T4) + parafollicular C cells (calcitonin).',
        function: 'Thyroid hormone (T3/T4) production: regulates metabolism, heart rate, temperature, growth. Calcitonin: calcium homeostasis.',
        riskFactors: ['Radiation exposure (especially childhood)', 'Female sex (4:1)', 'Family history / MEN2 (medullary)', 'Iodine deficiency (follicular)', 'RET/PTC, BRAF mutations'],
        earlySigns: ['Painless neck lump/nodule', 'Neck swelling', 'Hoarseness', 'Difficulty swallowing', 'Cervical lymphadenopathy'],
        whoRegionMostAffected: 'Western Pacific & Americas (highest, increased detection); Africa (lowest reported)',
      },
    ],
  },
  hematologic: {
    icon: Droplet, color: '#dc2626',
    organs: [
      {
        name: 'Bone marrow & Blood',
        cancers: [
          { name: 'Acute myeloid leukemia (AML)', globalCases: '~150,000', fiveYearSurvival: '30% (overall), <10% (>65 years)' },
          { name: 'Acute lymphoblastic leukemia (ALL)', globalCases: '~65,000', fiveYearSurvival: '90% (children), 40% (adults)' },
          { name: 'Chronic lymphocytic leukemia (CLL)', globalCases: '~190,000', fiveYearSurvival: '~83% (5-year, varies by stage)' },
          { name: 'Multiple myeloma', globalCases: '~180,000', fiveYearSurvival: '~55% (improving with novel therapies)' },
          { name: 'Non-Hodgkin lymphoma', globalCases: '~560,000', fiveYearSurvival: '73% (overall, subtype-dependent)' },
        ],
        anatomy: 'Bone marrow (axial skeleton: pelvis, sternum, ribs, vertebrae). Lymphatic system: nodes, spleen, thymus, MALT.',
        function: 'Hematopoiesis: RBCs (oxygen transport), WBCs (immunity), platelets (clotting). Lymphatic: fluid balance, immune surveillance.',
        riskFactors: ['Ionizing radiation', 'Benzene/chemical exposure', 'Down syndrome (ALL, AML)', 'Prior chemotherapy', 'HTLV-1 (adult T-cell leukemia)', 'EBV (Burkitt, Hodgkin)', 'H. pylori (MALT lymphoma)'],
        earlySigns: ['Fatigue (anemia)', 'Frequent infections', 'Easy bruising/bleeding', 'Bone pain (myeloma)', 'Lymphadenopathy (lymphoma)', 'Night sweats + fever + weight loss (B symptoms)'],
        whoRegionMostAffected: 'North America & Europe (highest leukemia); Africa (Burkitt lymphoma, HTLV-1 associated T-cell leukemia)',
      },
    ],
  },
  urinary: {
    icon: Droplet, color: '#06b6d4',
    organs: [
      {
        name: 'Kidney',
        cancers: [
          { name: 'Renal cell carcinoma (clear cell)', globalCases: '~400,000 (majority)', fiveYearSurvival: '75% (localized), 14% (metastatic)' },
          { name: 'Transitional cell carcinoma (upper tract)', globalCases: '~50,000', fiveYearSurvival: '60% (early)' },
        ],
        anatomy: 'Paired retroperitoneal organs. Cortex (glomeruli, tubules), medulla (loops of Henle), pelvis/calices. Nephron: filtering unit.',
        function: 'Filtration (~180L/day), reabsorption, urine production. Erythropoietin (RBC production), renin (BP regulation), acid-base balance, vitamin D activation.',
        riskFactors: ['Smoking', 'Obesity', 'Hypertension', 'Dialysis/acquired cystic disease', 'Von Hippel-Lindau syndrome', 'Occupational (cadmium, trichloroethylene)'],
        earlySigns: ['Hematuria (visible or microscopic)', 'Flank pain', 'Palpable abdominal mass', 'Unexplained weight loss', 'Paraneoplastic: polycythemia, hypercalcemia'],
        whoRegionMostAffected: 'Europe & North America (highest); Africa (lowest); rising globally with obesity epidemic',
      },
      {
        name: 'Bladder',
        cancers: [
          { name: 'Urothelial (transitional cell) carcinoma', globalCases: '~600,000 (10th most common)', fiveYearSurvival: '77% (all stages), 8% (metastatic)' },
          { name: 'Squamous cell carcinoma (schistosomiasis-associated)', globalCases: '~60,000', fiveYearSurvival: '~50% (often advanced at diagnosis)' },
        ],
        anatomy: 'Hollow muscular organ in pelvis. Detrusor muscle. Trigone. Urothelium (transitional epithelium) lines bladder.',
        function: 'Urine storage (~400-600mL) and controlled voiding. Urothelium serves as barrier to concentrated urine.',
        riskFactors: ['Smoking (3x risk, >50% of cases)', 'Occupational (aromatic amines, dyes, rubber)', 'Schistosoma haematobium (SCC)', 'Chronic cystitis / catheter use', 'Cyclophosphamide chemotherapy', 'Arsenic in drinking water'],
        earlySigns: ['Painless hematuria (most common)', 'Urinary frequency/urgency', 'Dysuria', 'Recurrent UTIs', 'Flank pain (upper tract obstruction)'],
        whoRegionMostAffected: 'Europe & North America (urothelial); Africa & Middle East (schistosomiasis-associated SCC)',
      },
    ],
  },
  breast: {
    icon: Shield, color: '#ec4899',
    organs: [
      {
        name: 'Breast',
        cancers: [
          { name: 'Invasive ductal carcinoma (no special type)', globalCases: '1.5M (majority of breast cancers)', fiveYearSurvival: '99% (localized), 31% (metastatic)' },
          { name: 'Invasive lobular carcinoma', globalCases: '~180,000', fiveYearSurvival: 'Similar to ductal; often bilateral' },
          { name: 'Triple-negative breast cancer (TNBC)', globalCases: '~250,000 (15%)', fiveYearSurvival: '77% (stage I-III), 12% (metastatic)' },
        ],
        anatomy: 'Mammary gland: 15-20 lobes, ductal-lobular system. Tail of Spence (axillary extension). Lymphatic drainage: axillary, internal mammary.',
        function: 'Lactation (milk production and delivery). Hormone-responsive tissue (estrogen, progesterone, prolactin).',
        riskFactors: ['Female sex (100x > male)', 'Age', 'BRCA1/2 mutations', 'Early menarche / late menopause', 'Nulliparity / late first pregnancy', 'Hormone replacement therapy', 'Alcohol', 'Obesity (postmenopausal)', 'Dense breast tissue'],
        earlySigns: ['New breast lump', 'Skin changes (dimpling, peau d\'orange)', 'Nipple retraction/discharge', 'Asymmetry', 'Axillary lymphadenopathy', 'Mammographic calcifications'],
        whoRegionMostAffected: 'All regions (most common cancer worldwide in 2022); Europe & North America (highest incidence); Africa (rising, diagnosed later, higher TNBC proportion)',
      },
    ],
  },
  skin: {
    icon: Eye, color: '#f97316',
    organs: [
      {
        name: 'Skin',
        cancers: [
          { name: 'Non-melanoma skin cancer (BCC/SCC)', globalCases: '~1.2M (often underreported)', fiveYearSurvival: '~100% (BCC localized), 95% (SCC localized)' },
          { name: 'Melanoma', globalCases: '~150,000', fiveYearSurvival: '99% (localized), 35% (metastatic)' },
        ],
        anatomy: 'Epidermis (squamous, basal, melanocyte cells), dermis (vessels, nerves, appendages), hypodermis. ~2m² surface area.',
        function: 'Barrier (mechanical, chemical, UV), thermoregulation (sweat), vitamin D synthesis, immune surveillance (Langerhans cells), sensation.',
        riskFactors: ['UV radiation (sun exposure, tanning beds)', 'Fair skin / freckling', 'Family history / CDKN2A mutation', 'Multiple nevi / dysplastic nevi', 'Immunosuppression', 'Prior skin cancer', 'Arsenic exposure'],
        earlySigns: ['New or changing mole (ABCDE: Asymmetry, Border, Color, Diameter, Evolving)', 'Non-healing skin lesion', 'Pearly papule with telangiectasia (BCC)', 'Scaling/crusting plaque (SCC)', 'Pigmented streak under nail (subungual melanoma)'],
        whoRegionMostAffected: 'Australia/New Zealand (highest melanoma, UV index); Americas & Europe; lower in darker skin populations (but often diagnosed later)',
      },
    ],
  },
  headNeck: {
    icon: Microscope, color: '#6366f1',
    organs: [
      {
        name: 'Oral cavity & Pharynx',
        cancers: [
          { name: 'Oral squamous cell carcinoma', globalCases: '~377,000', fiveYearSurvival: '65% (early), 25% (advanced)' },
          { name: 'Oropharyngeal (HPV-related)', globalCases: '~98,000', fiveYearSurvival: '85% (HPV-positive, better prognosis)' },
        ],
        anatomy: 'Oral cavity: lips, tongue, floor of mouth, buccal mucosa, hard palate, retromolar trigone, gums. Oropharynx: tonsils, base of tongue, soft palate.',
        function: 'Speech, taste (anterior 2/3 tongue), chewing, first phase of swallowing. Oropharynx: airway, immune (tonsils).',
        riskFactors: ['Tobacco (smoking + smokeless)', 'Alcohol', 'Betel quid / gutka', 'HPV 16 (oropharyngeal)', 'Poor oral hygiene', 'Nutritional deficiency (iron, B vitamins)'],
        earlySigns: ['Non-healing oral ulcer >2 weeks', 'White/red patch (leukoplakia/erythroplakia)', 'Lump in mouth or neck', 'Difficulty chewing/swallowing', 'Voice changes', 'Ear pain (referred)'],
        whoRegionMostAffected: 'South-East Asia (highest — betel quid, smokeless tobacco); Europe (alcohol-related); Americas (HPV-related oropharyngeal rising)',
      },
    ],
  },
  nervous: {
    icon: Brain, color: '#7c3aed',
    organs: [
      {
        name: 'Brain & Central Nervous System',
        cancers: [
          { name: 'Glioblastoma multiforme (GBM, WHO grade 4)', globalCases: '~150,000 (most common malignant)', fiveYearSurvival: '~7% (dismal, median survival ~15 months)' },
          { name: 'Meningioma (benign, grade 1)', globalCases: '~300,000 (most common primary CNS tumor)', fiveYearSurvival: '~90% (complete resection)' },
          { name: 'Medulloblastoma (pediatric)', globalCases: '~10,000', fiveYearSurvival: '70-80% (standard risk)' },
        ],
        anatomy: 'Cerebrum (4 lobes), cerebellum, brainstem, spinal cord. Meninges: dura, arachnoid, pia. Ventricular system (CSF).',
        function: 'Cognition, motor/sensory control, language, vision/hearing, autonomic regulation, consciousness, memory, emotion.',
        riskFactors: ['Ionizing radiation', 'Family history syndromes (NF1/NF2, Li-Fraumeni, Turcot)', 'Age (varies by tumor type)', 'Immunosuppression (CNS lymphoma)', 'Most cases have no identifiable risk factor'],
        earlySigns: ['Progressive headache (worse in morning)', 'Seizures (new onset)', 'Focal neurological deficits', 'Cognitive/personality changes', 'Nausea/vomiting (raised ICP)', 'Visual changes'],
        whoRegionMostAffected: 'All regions (relatively uniform incidence); higher detection in regions with MRI access',
      },
    ],
  },
};

export function CancerAnatomy() {
  const { language, direction } = useApp();
  const t = getTranslation(language);
  const ta = t.anatomy;

  const [selectedSystem, setSelectedSystem] = useState<SystemId>('digestive');
  const [selectedOrgan, setSelectedOrgan] = useState(0);

  const system = SYSTEMS[selectedSystem];
  const organ = system.organs[selectedOrgan];

  const systemEntries = Object.entries(SYSTEMS) as [SystemId, typeof system][];

  return (
    <div className="animate-fade-in" dir={direction}>
      <PageHeader
        icon={<User className="w-5 h-5 text-teal-400" />}
        title={ta.title}
        subtitle={ta.subtitle}
      />

      {/* System selector pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {systemEntries.map(([id, sys]) => {
          const Icon = sys.icon;
          const active = selectedSystem === id;
          return (
            <button
              key={id}
              onClick={() => { setSelectedSystem(id); setSelectedOrgan(0); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                active ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-200'
              }`}
            >
              <Icon className="w-4 h-4" style={active ? { color: sys.color } : undefined} />
              {ta.systemLabels[id]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organ list */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">{ta.organ}s</h3>
          {system.organs.map((org, i) => (
            <button
              key={org.name}
              onClick={() => setSelectedOrgan(i)}
              className={`w-full text-start p-3 rounded-xl transition-all ${
                selectedOrgan === i ? 'bg-white border-2 border-teal-400 shadow-sm' : 'bg-white border border-navy-100 hover:border-navy-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-navy-900">{org.name}</span>
                <span className="text-[10px] text-navy-400">{org.cancers.length} type{org.cancers.length > 1 ? 's' : ''}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Organ detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Organ header */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-5 text-white">
            <h2 className="text-xl font-bold mb-1">{organ.name}</h2>
            <p className="text-xs text-navy-300">{ta.systems}: {ta.systemLabels[selectedSystem]}</p>
          </div>

          {/* Cancer types with stats */}
          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-teal-500" />
              {ta.commonCancers}
            </h3>
            <div className="space-y-3">
              {organ.cancers.map((c) => (
                <div key={c.name} className="bg-navy-50/50 rounded-xl p-3">
                  <div className="font-medium text-sm text-navy-900 mb-2">{c.name}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-navy-400 uppercase">{ta.statistics}</span>
                      <p className="text-xs text-navy-700">{c.globalCases}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-navy-400 uppercase">5-Year Survival</span>
                      <p className="text-xs text-navy-700">{c.fiveYearSurvival}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anatomy & Function */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">{ta.anatomy}</h3>
              <p className="text-sm text-navy-700 leading-relaxed">{organ.anatomy}</p>
            </div>
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">{ta.function}</h3>
              <p className="text-sm text-navy-700 leading-relaxed">{organ.function}</p>
            </div>
          </div>

          {/* Risk factors */}
          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              {ta.riskFactors}
            </h3>
            <div className="flex flex-wrap gap-2">
              {organ.riskFactors.map((rf, i) => (
                <span key={i} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                  {rf}
                </span>
              ))}
            </div>
          </div>

          {/* Early warning signs */}
          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              {ta.earlySigns}
            </h3>
            <ul className="space-y-1.5">
              {organ.earlySigns.map((sign, i) => (
                <li key={i} className="text-sm text-navy-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>

          {/* WHO Regional pattern */}
          <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">{ta.statistics} — WHO Regions</h3>
            <p className="text-sm text-navy-700 leading-relaxed">{organ.whoRegionMostAffected}</p>
          </div>
        </div>
      </div>

      {/* Data source */}
      <div className="mt-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-navy-500">{ta.dataSource}:</span>
        <a href="https://gco.iarc.who.int/media/globocan/projects/2022" target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
          GLOBOCAN 2022, IARC/WHO <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-xs text-navy-400">·</span>
        <a href="https://www.nccn.org/professionals/physician_gls/default.aspx" target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
          NCCN Guidelines <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
        <p className="text-xs text-amber-800 leading-relaxed">{ta.disclaimer}</p>
      </div>
    </div>
  );
}
