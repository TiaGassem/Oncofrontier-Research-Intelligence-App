// Companion data: cancer dictionary, survival statistics, comorbidities, awareness content.
// All medical claims sourced from authoritative organizations with verifiable URLs.
// Survival statistics are population-level, never individual predictions.

export interface CancerEntry {
  id: string;
  name: string;
  aliases: string[];
  simpleExplanation: string;
  whereItStarts: string;
  howItSpreads: string;
  riskFactors: string[];
  symptoms: string[];
  diagnosis: string;
  staging: string;
  treatments: string[];
  sourceName: string;
  sourceUrl: string;
}

export interface SurvivalStat {
  cancerId: string;
  statisticType: string;
  population: string;
  geography: string;
  dataPeriod: string;
  value: string;
  whatItMeans: string;
  whatItCantTell: string;
  sourceName: string;
  sourceUrl: string;
}

export interface ComorbidityEntry {
  conditionId: string;
  conditionName: string;
  cancerId: string;
  cancerRisk: string;
  prognosisImpact: string;
  treatmentInteractions: string;
  management: string;
  evidenceGaps: string;
  evidenceLevel: 'established' | 'emerging' | 'limited';
  sourceName: string;
  sourceUrl: string;
}

export interface ConditionOption {
  id: string;
  name: string;
}

export interface AwarenessItem {
  id: string;
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
}

export interface MythFact {
  myth: string;
  fact: string;
}

// ─── Cancer Dictionary ──────────────────────────────────────────────────────

export const CANCER_DICTIONARY: CancerEntry[] = [
  {
    id: 'breast',
    name: 'Breast cancer',
    aliases: ['breast', 'mammary', 'ductal', 'lobular', 'triple negative', 'HER2 positive', 'ER positive', 'inflammatory breast'],
    simpleExplanation:
      'Breast cancer starts when cells in the breast begin to grow out of control. It is the most common cancer in women worldwide, but men can get it too. Most breast cancers are found in the ducts (tubes that carry milk) or lobules (milk-producing glands).',
    whereItStarts:
      'It usually begins in the milk ducts (ductal carcinoma) or the milk-producing glands called lobules (lobular carcinoma). Less commonly, it starts in other breast tissues.',
    howItSpreads:
      'If not treated, breast cancer can spread to nearby lymph nodes (under the arm) and then to other parts of the body, most commonly the bones, lungs, liver, and brain.',
    riskFactors: [
      'Being female (though men can get it too)',
      'Increasing age',
      'Inherited gene changes (BRCA1, BRCA2)',
      'Family history of breast or ovarian cancer',
      'Early menstruation or late menopause',
      'Never having been pregnant or having first pregnancy after age 30',
      'Hormone replacement therapy after menopause',
      'Alcohol consumption',
      'Being overweight after menopause',
      'Dense breast tissue (seen on mammograms)',
    ],
    symptoms: [
      'A new lump in the breast or underarm',
      'Swelling of part of the breast',
      'Skin dimpling (like orange peel)',
      'Nipple pulling inward or pain',
      'Nipple discharge (especially bloody)',
      'Change in breast size or shape',
      'Redness or flaky skin on the nipple or breast',
    ],
    diagnosis:
      'Breast cancer is usually found by a mammogram (X-ray of the breast) or by feeling a lump. If something suspicious is found, a biopsy (taking a small piece of tissue) is done to confirm whether it is cancer. Lab tests on the biopsy also determine the cancer type (hormone receptor status, HER2 status).',
    staging:
      'Staging uses numbers from 0 to 4. Stage 0 means the cancer has not spread beyond the ducts (DCIS). Stages 1-3 mean the cancer is in the breast and possibly nearby lymph nodes. Stage 4 means the cancer has spread to other parts of the body (metastatic).',
    treatments: [
      'Surgery (lumpectomy to remove the tumor, or mastectomy to remove the breast)',
      'Radiation therapy to destroy any remaining cancer cells',
      'Hormone (endocrine) therapy for hormone-receptor-positive cancers',
      'Targeted therapy for HER2-positive cancers (e.g. trastuzumab)',
      'Chemotherapy to kill cancer cells throughout the body',
      'Immunotherapy for certain types like triple-negative breast cancer',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/breast-cancer.html',
  },
  {
    id: 'lung',
    name: 'Lung cancer',
    aliases: ['lung', 'pulmonary', 'NSCLC', 'SCLC', 'non-small cell', 'small cell', 'adenocarcinoma lung', 'squamous lung'],
    simpleExplanation:
      'Lung cancer starts when cells in the lungs grow out of control. It is one of the most common cancers worldwide and the leading cause of cancer death. There are two main types: non-small cell lung cancer (about 85% of cases) and small cell lung cancer (about 15%).',
    whereItStarts:
      'It begins in the tissues of the lungs, usually in the cells lining the air passages. Non-small cell lung cancer includes adenocarcinoma, squamous cell carcinoma, and large cell carcinoma. Small cell lung cancer tends to grow and spread faster.',
    howItSpreads:
      'Lung cancer can spread to nearby lymph nodes, the other lung, and then to other organs including the brain, bones, liver, and adrenal glands.',
    riskFactors: [
      'Smoking tobacco (the cause of about 80-90% of lung cancer deaths)',
      'Secondhand smoke exposure',
      'Radon gas exposure in homes',
      'Asbestos exposure',
      'Air pollution',
      'Family history of lung cancer',
      'Previous radiation therapy to the chest',
    ],
    symptoms: [
      'A cough that does not go away or gets worse',
      'Coughing up blood or rust-colored phlegm',
      'Chest pain that is worse with deep breathing',
      'Hoarseness',
      'Shortness of breath',
      'Feeling tired or weak',
      'Unexplained weight loss',
      'Recurrent infections like pneumonia or bronchitis',
    ],
    diagnosis:
      'Lung cancer may be found on a chest X-ray or CT scan. If a suspicious spot is seen, a biopsy is done (often through a needle or bronchoscopy). Molecular testing is increasingly done to look for specific gene mutations that can guide targeted treatment.',
    staging:
      'Stages range from 1 (cancer is only in the lung) to 4 (cancer has spread to both lungs or other parts of the body). Small cell lung cancer is often described as "limited" or "extensive" rather than numbered stages.',
    treatments: [
      'Surgery to remove the tumor (for early-stage)',
      'Radiation therapy',
      'Chemotherapy',
      'Targeted therapy for specific mutations (e.g. EGFR, ALK, ROS1)',
      'Immunotherapy (checkpoint inhibitors like pembrolizumab)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/lung-cancer.html',
  },
  {
    id: 'colorectal',
    name: 'Colorectal cancer',
    aliases: ['colon', 'rectal', 'colorectal', 'bowel cancer', 'large intestine', 'polyp', 'CRC'],
    simpleExplanation:
      'Colorectal cancer starts in the colon or rectum, which are parts of the large intestine. It usually begins as a small growth called a polyp that can slowly turn into cancer over many years. This is why screening can prevent it — polyps can be found and removed before they become cancer.',
    whereItStarts:
      'It most often starts in the inner lining of the colon or rectum. Most are adenocarcinomas, a type of cancer that forms in gland cells.',
    howItSpreads:
      'It can grow through the wall of the intestine and spread to nearby lymph nodes, and then to the liver, lungs, and other organs.',
    riskFactors: [
      'Age over 45 (risk increases with age)',
      'Family history of colorectal cancer or polyps',
      'Inherited syndromes (Lynch syndrome, familial adenomatous polyposis)',
      'Inflammatory bowel disease (Crohns disease, ulcerative colitis)',
      'Diet high in red and processed meats',
      'Low-fiber diet',
      'Obesity',
      'Smoking and heavy alcohol use',
      'Physical inactivity',
    ],
    symptoms: [
      'A change in bowel habits (diarrhea, constipation, or narrowing of stool)',
      'Blood in the stool (bright red or very dark)',
      'Abdominal pain or cramps that do not go away',
      'Feeling that you need to have a bowel movement that does not go away',
      'Unexplained weight loss',
      'Weakness or fatigue (can be from anemia)',
    ],
    diagnosis:
      'Screening is done with colonoscopy (a doctor looks inside the colon with a camera), stool tests that check for blood, or a combination. If a suspicious polyp or tumor is found, a biopsy confirms the diagnosis.',
    staging:
      'Stages range from 0 (cancer only in the innermost layer) to 4 (spread to other organs). Most colorectal cancers are staged using the TNM system which looks at tumor size, lymph node involvement, and spread.',
    treatments: [
      'Surgery to remove the tumor and nearby lymph nodes',
      'Chemotherapy (especially for stage 3 and 4)',
      'Radiation therapy (mainly for rectal cancer)',
      'Targeted therapy (e.g. bevacizumab, cetuximab)',
      'Immunotherapy for MSI-high tumors',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/colon-rectal-cancer.html',
  },
  {
    id: 'prostate',
    name: 'Prostate cancer',
    aliases: ['prostate', 'prostatic', 'PSA', 'adenocarcinoma prostate'],
    simpleExplanation:
      'Prostate cancer starts in the prostate, a small gland in men that makes fluid for semen. It is one of the most common cancers in men. Many prostate cancers grow slowly and may never cause serious problems, but some are more aggressive.',
    whereItStarts:
      'It usually starts in the gland cells of the prostate. Most are adenocarcinomas. It often starts in the peripheral zone (outer part) of the prostate.',
    howItSpreads:
      'It can spread to nearby tissues, seminal vesicles, lymph nodes, and bones. When prostate cancer spreads, bones are the most common site.',
    riskFactors: [
      'Age (most common in men over 65)',
      'African ancestry (higher risk)',
      'Family history of prostate cancer',
      'Inherited gene changes (BRCA2, HOXB13)',
    ],
    symptoms: [
      'Difficulty starting or stopping urination',
      'Weak or interrupted urine flow',
      'Frequent urination, especially at night',
      'Blood in urine or semen',
      'Pain in the hips, spine, or ribs (if spread to bones)',
      'Erectile dysfunction',
    ],
    diagnosis:
      'Screening is done with a PSA blood test and sometimes a digital rectal exam. If PSA is elevated or a lump is felt, a biopsy is done. MRI is increasingly used to guide biopsies.',
    staging:
      'Stages range from 1 (small, only in prostate) to 4 (spread to other parts of the body). The Gleason score (how aggressive the cells look) and PSA level are also used to assess risk.',
    treatments: [
      'Active surveillance (monitoring slow-growing cancers without immediate treatment)',
      'Surgery (prostatectomy to remove the prostate)',
      'Radiation therapy',
      'Hormone therapy (blocking testosterone, which fuels prostate cancer)',
      'Chemotherapy (for advanced cases)',
      'Immunotherapy and targeted therapy (for specific cases)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/prostate-cancer.html',
  },
  {
    id: 'lung_small_cell',
    name: 'Small cell lung cancer',
    aliases: ['SCLC', 'small cell', 'oat cell'],
    simpleExplanation:
      'Small cell lung cancer (SCLC) is a faster-growing type of lung cancer. It makes up about 15% of all lung cancers. It is almost always caused by smoking.',
    whereItStarts:
      'It starts in the lungs, in small cells called neuroendocrine cells. It tends to grow and spread more quickly than non-small cell lung cancer.',
    howItSpreads:
      'It often spreads to the brain, liver, bones, and other organs. It is often found after it has already spread.',
    riskFactors: ['Smoking (almost all cases are linked to smoking)', 'Secondhand smoke', 'Radon exposure'],
    symptoms: [
      'Persistent cough',
      'Shortness of breath',
      'Chest pain',
      'Coughing up blood',
      'Unexplained weight loss',
      'Fatigue',
    ],
    diagnosis:
      'Found on imaging (CT, PET) and confirmed with biopsy. Brain MRI is usually done because SCLC often spreads to the brain.',
    staging:
      'SCLC is usually described as "limited stage" (cancer is only on one side of the chest) or "extensive stage" (cancer has spread beyond one side).',
    treatments: ['Chemotherapy (the main treatment)', 'Radiation therapy to the chest and brain', 'Immunotherapy (atezolizumab, durvalumab)'],
    sourceName: 'American Cancer Society',
    sourceUrl: 'https://www.cancer.org/cancer/small-cell-lung-cancer.html',
  },
  {
    id: 'leukemia',
    name: 'Leukemia',
    aliases: ['leukemia', 'leukaemia', 'AML', 'ALL', 'CLL', 'CML', 'blood cancer', 'bone marrow'],
    simpleExplanation:
      'Leukemia is a cancer of the blood and bone marrow. It causes the body to make too many abnormal white blood cells. There are several types, including acute (fast-growing) and chronic (slower-growing) forms.',
    whereItStarts:
      'It starts in the bone marrow, the spongy tissue inside bones where blood cells are made. The abnormal cells crowd out healthy blood cells.',
    howItSpreads:
      'Leukemia cells travel through the bloodstream, so it is considered a "systemic" disease rather than one that forms a solid tumor. It can affect the liver, spleen, lymph nodes, brain, and other organs.',
    riskFactors: [
      'Previous chemotherapy or radiation therapy',
      'Certain genetic disorders (Down syndrome, Fanconi anemia)',
      'Exposure to high levels of radiation',
      'Exposure to benzene and certain chemicals',
      'Smoking (increases risk of AML)',
      'Certain viral infections (HTLV-1)',
    ],
    symptoms: [
      'Feeling tired or weak (from anemia)',
      'Frequent infections (from low healthy white blood cells)',
      'Easy bruising or bleeding (from low platelets)',
      'Fever',
      'Bone or joint pain',
      'Swollen lymph nodes, liver, or spleen',
      'Unexplained weight loss',
    ],
    diagnosis:
      'Diagnosis starts with blood tests showing abnormal blood counts. A bone marrow biopsy confirms the type of leukemia. Special tests identify the exact subtype.',
    staging:
      'Unlike most cancers, leukemia is not staged with numbers. Instead, it is classified by type (acute vs chronic, myeloid vs lymphoid) and by specific genetic features.',
    treatments: [
      'Chemotherapy (the main treatment for most types)',
      'Targeted therapy (e.g. imatinib for CML)',
      'Immunotherapy and CAR-T cell therapy (for certain types)',
      'Stem cell transplant (bone marrow transplant)',
      'Radiation therapy (sometimes, for brain involvement)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/leukemia.html',
  },
  {
    id: 'lymphoma',
    name: 'Lymphoma',
    aliases: ['lymphoma', 'Hodgkin', 'non-Hodgkin', 'NHL', 'HL', 'lymph node', 'lymphatic'],
    simpleExplanation:
      'Lymphoma is a cancer that starts in the lymphatic system, which is part of the bodys immune system. There are two main types: Hodgkin lymphoma and non-Hodgkin lymphoma. It often starts in lymph nodes (which you may feel as lumps under the skin).',
    whereItStarts:
      'It starts in lymphocytes, a type of white blood cell. It can start in lymph nodes, the spleen, bone marrow, or other lymphatic tissues throughout the body.',
    howItSpreads:
      'It spreads through the lymphatic system to other lymph node groups and can also involve the bone marrow, liver, and other organs.',
    riskFactors: [
      'Weakened immune system (HIV/AIDS, immunosuppressive drugs)',
      'Certain infections (Epstein-Barr virus, H. pylori)',
      'Age (non-Hodgkin: risk increases with age; Hodgkin: often affects young adults)',
      'Family history',
      'Previous chemotherapy or radiation',
    ],
    symptoms: [
      'Painless swelling of lymph nodes (neck, armpits, or groin)',
      'Unexplained fever',
      'Night sweats',
      'Unexplained weight loss',
      'Fatigue',
      'Itching (especially in Hodgkin lymphoma)',
    ],
    diagnosis:
      'A biopsy of an enlarged lymph node is needed to confirm lymphoma. Imaging (CT, PET) and bone marrow tests determine how far it has spread.',
    staging:
      'Stages 1-4 are used. Stage 1 means one lymph node area is involved. Stage 4 means spread to organs outside the lymphatic system. Letters A or B indicate whether symptoms like fever, night sweats, or weight loss are present.',
    treatments: [
      'Chemotherapy',
      'Radiation therapy',
      'Immunotherapy (rituximab, brentuximab)',
      'Targeted therapy',
      'CAR-T cell therapy (for certain types)',
      'Stem cell transplant',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/lymphoma.html',
  },
  {
    id: 'melanoma',
    name: 'Melanoma (skin cancer)',
    aliases: ['melanoma', 'skin cancer', 'mole cancer', 'melanoma skin'],
    simpleExplanation:
      'Melanoma is a serious type of skin cancer that starts in melanocytes, the cells that give skin its color. It is less common than other skin cancers but more dangerous because it can spread quickly if not caught early.',
    whereItStarts:
      'It usually starts on the skin, often in an existing mole or as a new dark spot. Less commonly, it can start in the eyes, mouth, or other areas with pigment.',
    howItSpreads:
      'If not caught early, melanoma can spread to nearby lymph nodes and then to other organs including the lungs, liver, brain, and bones.',
    riskFactors: [
      'Ultraviolet (UV) light exposure (sun, tanning beds)',
      'Fair skin, light hair, and light eyes',
      'History of sunburns, especially blistering sunburns in childhood',
      'Many moles or unusual moles (dysplastic nevi)',
      'Family history of melanoma',
      'Personal history of skin cancer',
      'Weakened immune system',
    ],
    symptoms: [
      'A new mole or a change in an existing mole',
      'Use the ABCDE rule: Asymmetry, Border irregularity, Color changes, Diameter larger than 6mm, Evolving (changing)',
      'A sore that does not heal',
      'A dark streak under a fingernail or toenail',
      'A spot that itches, bleeds, or is painful',
    ],
    diagnosis:
      'A dermatologist examines the skin and removes the suspicious spot (or part of it) for a biopsy. If melanoma is confirmed, a sentinel lymph node biopsy may be done to check for spread.',
    staging:
      'Stages 0-4. Stage 0 is only in the top layer of skin. Higher stages mean the melanoma is thicker or has spread to lymph nodes or other organs.',
    treatments: [
      'Surgery to remove the melanoma (main treatment for early-stage)',
      'Immunotherapy (pembrolizumab, nivolumab, ipilimumab)',
      'Targeted therapy for BRAF-mutated melanoma (dabrafenib, trametinib)',
      'Radiation therapy (sometimes)',
      'Chemotherapy (less common now)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/melanoma-skin-cancer.html',
  },
  {
    id: 'pancreatic',
    name: 'Pancreatic cancer',
    aliases: ['pancreas', 'pancreatic', 'PDAC', 'pancreatic adenocarcinoma', 'exocrine pancreas'],
    simpleExplanation:
      'Pancreatic cancer starts in the pancreas, an organ behind the stomach that helps with digestion and blood sugar control. It is often found at a late stage because it does not usually cause symptoms early on.',
    whereItStarts:
      'Most pancreatic cancers start in the ducts that carry digestive enzymes. These are called exocrine tumors (about 95% of cases). A small number start in the hormone-making cells (neuroendocrine tumors).',
    howItSpreads:
      'It can spread to nearby organs (liver, stomach, intestines), lymph nodes, and then to more distant organs. It often spreads before it is found.',
    riskFactors: [
      'Smoking',
      'Chronic pancreatitis (long-term inflammation of the pancreas)',
      'Diabetes (especially new-onset diabetes in older adults)',
      'Obesity',
      'Family history of pancreatic cancer',
      'Inherited gene changes (BRCA2, PALB2)',
      'Heavy alcohol use',
      'Age (most cases are over 65)',
    ],
    symptoms: [
      'Often no symptoms until advanced',
      'Yellowing of the skin and eyes (jaundice)',
      'Upper abdominal or back pain',
      'Unexplained weight loss',
      'Loss of appetite',
      'New-onset diabetes',
      'Light-colored stools and dark urine',
    ],
    diagnosis:
      'It is hard to find early. Imaging (CT, MRI, endoscopic ultrasound) is used. A biopsy confirms the diagnosis. Blood test CA 19-9 is sometimes used but is not definitive.',
    staging:
      'Stages 1-4. Stage 1 means the cancer is only in the pancreas. Stage 4 means it has spread to other organs. Many pancreatic cancers are found at stage 3 or 4.',
    treatments: [
      'Surgery (Whipple procedure or distal pancreatectomy, if the tumor can be removed)',
      'Chemotherapy (FOLFIRINOX or gemcitabine-based)',
      'Radiation therapy',
      'Targeted therapy (for specific mutations)',
      'Palliative care to manage symptoms and improve quality of life',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/pancreatic-cancer.html',
  },
  {
    id: 'ovarian',
    name: 'Ovarian cancer',
    aliases: ['ovarian', 'ovary', 'fallopian tube', 'peritoneal', 'serous', 'ovarian cyst cancer'],
    simpleExplanation:
      'Ovarian cancer starts in the ovaries, which are the organs that produce eggs and hormones in women. It is often called a "silent killer" because symptoms can be vague and it is often found at a late stage.',
    whereItStarts:
      'Most ovarian cancers start in the cells on the surface of the ovary (epithelial ovarian cancer). Some start in the fallopian tubes. Less common types start in the egg-producing cells (germ cell tumors) or hormone-producing cells (stromal tumors).',
    howItSpreads:
      'It can spread to the other ovary, the uterus, the lining of the abdomen (peritoneum), and then to the liver, lungs, and other organs.',
    riskFactors: [
      'BRCA1 or BRCA2 gene mutations',
      'Family history of ovarian, breast, or colorectal cancer',
      'Lynch syndrome',
      'Nulliparity (never having been pregnant)',
      'Endometriosis',
      'Long-term use of hormone replacement therapy',
    ],
    symptoms: [
      'Bloating or swelling of the abdomen',
      'Feeling full quickly when eating',
      'Pelvic or abdominal pain',
      'Frequent or urgent urination',
      'Changes in bowel habits',
      'Fatigue',
      'Unexplained weight loss',
    ],
    diagnosis:
      'There is no reliable screening test. A pelvic exam, ultrasound, and CA-125 blood test may suggest ovarian cancer. Surgery is needed to confirm the diagnosis and see how far it has spread.',
    staging:
      'Stages 1-4. Stage 1 means only in one or both ovaries. Stage 4 means spread to distant organs.',
    treatments: [
      'Surgery to remove the ovaries, fallopian tubes, and uterus',
      'Chemotherapy (usually after surgery)',
      'Targeted therapy (PARP inhibitors like olaparib for BRCA-mutated)',
      'Hormone therapy (for some types)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/ovarian-cancer.html',
  },
  {
    id: 'cervical',
    name: 'Cervical cancer',
    aliases: ['cervical', 'cervix', 'HPV cancer', 'cervical smear', 'Pap smear'],
    simpleExplanation:
      'Cervical cancer starts in the cervix, the lower part of the uterus. It is almost always caused by long-lasting infection with certain types of human papillomavirus (HPV). It can often be prevented with the HPV vaccine and regular screening.',
    whereItStarts:
      'It starts in the cells of the cervix, usually where two types of cells meet (the transformation zone). Most are squamous cell carcinomas, and some are adenocarcinomas.',
    howItSpreads:
      'It can spread to nearby tissues (vagina, bladder, rectum), lymph nodes, and then to the lungs, liver, and bones.',
    riskFactors: [
      'HPV infection (cause of nearly all cervical cancers)',
      'Not getting the HPV vaccine',
      'Not having regular Pap or HPV tests',
      'Smoking',
      'HIV or a weakened immune system',
      'Multiple sexual partners (increases HPV exposure)',
      'Long-term use of oral contraceptives',
    ],
    symptoms: [
      'Often no symptoms until later stages (screening is key)',
      'Abnormal vaginal bleeding (between periods, after sex, or after menopause)',
      'Unusual vaginal discharge',
      'Pelvic pain',
      'Pain during sex',
    ],
    diagnosis:
      'Found through screening (Pap test or HPV test). If abnormal cells are found, a colposcopy (close examination of the cervix) and biopsy are done.',
    staging:
      'Stages 1-4. Stage 1 means cancer is only in the cervix. Stage 4 means spread to nearby or distant organs.',
    treatments: [
      'Surgery (for early stages: cone biopsy, hysterectomy)',
      'Radiation therapy',
      'Chemotherapy (often combined with radiation)',
      'Targeted therapy (bevacizumab)',
      'Immunotherapy (pembrolizumab for advanced cases)',
    ],
    sourceName: 'American Cancer Society / WHO',
    sourceUrl: 'https://www.cancer.org/cancer/cervical-cancer.html',
  },
  {
    id: 'thyroid',
    name: 'Thyroid cancer',
    aliases: ['thyroid', 'papillary thyroid', 'follicular thyroid', 'medullary thyroid', 'anaplastic thyroid', 'neck lump'],
    simpleExplanation:
      'Thyroid cancer starts in the thyroid, a butterfly-shaped gland in the front of the neck that makes hormones controlling metabolism. Most thyroid cancers are very treatable and have high survival rates.',
    whereItStarts:
      'It starts in the thyroid gland. The most common type is papillary thyroid cancer (about 80%). Other types include follicular, medullary, and anaplastic (the most aggressive but rarest).',
    howItSpreads:
      'It can spread to nearby lymph nodes, and less commonly to the lungs and bones.',
    riskFactors: [
      'Radiation exposure (especially in childhood)',
      'Female sex (about 3 times more common in women)',
      'Family history of thyroid cancer',
      'Inherited syndromes (MEN2 for medullary thyroid cancer)',
      'Iodine deficiency (for follicular type)',
    ],
    symptoms: [
      'A lump or nodule in the neck (often painless)',
      'Swelling in the neck',
      'Pain in the front of the neck (sometimes going up to the ears)',
      'Hoarseness or voice changes',
      'Difficulty swallowing or breathing',
      'A cough that does not go away',
    ],
    diagnosis:
      'A neck ultrasound is usually the first test. If a nodule looks suspicious, a fine needle biopsy is done. Blood tests check thyroid function.',
    staging:
      'Stages 1-4 vary by type and age. For papillary and follicular in people under 55, staging is simpler (only stage 1 or 2). For older patients and other types, staging uses tumor size and spread.',
    treatments: [
      'Surgery (removal of part or all of the thyroid)',
      'Radioactive iodine therapy (to destroy remaining thyroid tissue)',
      'Thyroid hormone therapy (to replace hormones and prevent regrowth)',
      'Targeted therapy (for advanced cases)',
      'External radiation therapy (rarely)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/thyroid-cancer.html',
  },
  {
    id: 'stomach',
    name: 'Stomach (gastric) cancer',
    aliases: ['stomach', 'gastric', 'gastric adenocarcinoma', 'H. pylori cancer', 'stomach ulcer cancer'],
    simpleExplanation:
      'Stomach cancer starts in the stomach, the organ that holds and breaks down food. It is more common in some parts of Asia and South America than in Western countries.',
    whereItStarts:
      'Most stomach cancers start in the inner lining of the stomach (mucosa). These are called adenocarcinomas. There are two main types: intestinal (slow-growing) and diffuse (spreads more quickly).',
    howItSpreads:
      'It can grow through the stomach wall and spread to nearby lymph nodes, the liver, pancreas, esophagus, and other organs.',
    riskFactors: [
      'Helicobacter pylori infection (a common stomach bacteria)',
      'Diet high in salted, smoked, or pickled foods',
      'Low intake of fruits and vegetables',
      'Smoking',
      'Family history of stomach cancer',
      'Chronic atrophic gastritis',
      'Previous stomach surgery',
    ],
    symptoms: [
      'Persistent indigestion or heartburn',
      'Loss of appetite',
      'Feeling full after eating small amounts',
      'Upper abdominal pain or discomfort',
      'Nausea and vomiting',
      'Unintended weight loss',
      'Black stools (from bleeding)',
    ],
    diagnosis:
      'Diagnosis is usually made with an endoscopy (a camera passed into the stomach). If a suspicious area is seen, a biopsy is taken during the procedure.',
    staging:
      'Stages 1-4. Stage 1 means the cancer is only in the stomach lining. Stage 4 means it has spread to other organs.',
    treatments: [
      'Surgery to remove part or all of the stomach (gastrectomy)',
      'Chemotherapy (before or after surgery)',
      'Radiation therapy',
      'Targeted therapy for HER2-positive stomach cancer (trastuzumab)',
      'Immunotherapy (pembrolizumab for certain cases)',
    ],
    sourceName: 'American Cancer Society / WHO',
    sourceUrl: 'https://www.cancer.org/cancer/stomach-cancer.html',
  },
  {
    id: 'liver',
    name: 'Liver cancer',
    aliases: ['liver', 'hepatocellular', 'HCC', 'hepatoma', 'bile duct', 'cholangiocarcinoma', 'hepatic'],
    simpleExplanation:
      'Liver cancer starts in the liver, the large organ in the upper right abdomen that filters blood and helps with digestion. The most common type is hepatocellular carcinoma (HCC).',
    whereItStarts:
      'HCC starts in the main liver cells (hepatocytes). Cholangiocarcinoma starts in the bile ducts. In areas where hepatitis B is common, HCC is one of the most common cancers.',
    howItSpreads:
      'It can spread within the liver, to nearby lymph nodes, and then to the lungs and bones.',
    riskFactors: [
      'Hepatitis B or C infection (the biggest risk factor worldwide)',
      'Cirrhosis (scarring of the liver, from any cause)',
      'Heavy alcohol use',
      'Non-alcoholic fatty liver disease (NAFLD/MASH)',
      'Aflatoxin contamination in food (grains, nuts stored in hot, humid conditions)',
      'Hemochromatosis (iron overload)',
      'Obesity and type 2 diabetes',
    ],
    symptoms: [
      'Pain in the upper right abdomen',
      'A lump or heaviness in the upper abdomen',
      'Unexplained weight loss',
      'Loss of appetite',
      'Yellowing of skin and eyes (jaundice, usually later)',
      'Abdominal swelling (ascites, fluid buildup)',
      'Fatigue',
    ],
    diagnosis:
      'Imaging (ultrasound, CT, MRI) is used to look at the liver. Blood tests include AFP (alpha-fetoprotein, which can be elevated). Sometimes a biopsy is done, but imaging may be enough in people with cirrhosis.',
    staging:
      'Staging is complex because treatment depends not just on how far the cancer has spread, but also on how well the liver is functioning (the Barcelona Clinic Liver Cancer system is often used).',
    treatments: [
      'Surgery (removal of the tumor or liver transplant)',
      'Ablation (destroying the tumor with heat or alcohol)',
      'Embolization (blocking blood flow to the tumor, sometimes with chemotherapy: TACE)',
      'Targeted therapy (sorafenib, lenvatinib)',
      'Immunotherapy (atezolizumab + bevacizumab)',
      'Radiation therapy',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/liver-cancer.html',
  },
  {
    id: 'kidney',
    name: 'Kidney cancer',
    aliases: ['kidney', 'renal', 'renal cell', 'RCC', 'clear cell renal', 'Wilms tumor'],
    simpleExplanation:
      'Kidney cancer starts in the kidneys, the two organs on either side of the spine that filter blood and make urine. The most common type is renal cell carcinoma.',
    whereItStarts:
      'Most kidney cancers start in the cells lining the small tubes in the kidney (renal tubules). These are renal cell carcinomas (about 90%). A different type, Wilms tumor, affects young children.',
    howItSpreads:
      'It can spread to nearby lymph nodes, the adrenal gland, and then to the lungs, bones, liver, and brain.',
    riskFactors: [
      'Smoking',
      'Obesity',
      'High blood pressure',
      'Long-term dialysis',
      'Von Hippel-Lindau syndrome',
      'Occupational exposure (cadmium, some herbicides)',
      'Family history of kidney cancer',
    ],
    symptoms: [
      'Blood in the urine (may be visible or found on a test)',
      'Pain in the side or lower back (not from injury)',
      'A lump in the side or abdomen',
      'Unexplained weight loss',
      'Fatigue',
      'Persistent fever not from infection',
    ],
    diagnosis:
      'Often found by accident on a CT or ultrasound done for another reason. If a suspicious mass is seen, more imaging and sometimes a biopsy are done.',
    staging:
      'Stages 1-4. Stage 1 means the tumor is only in the kidney and is small. Stage 4 means it has spread to other organs.',
    treatments: [
      'Surgery (removing part or all of the kidney)',
      'Ablation (for small tumors)',
      'Targeted therapy (tyrosine kinase inhibitors)',
      'Immunotherapy (nivolumab, interleukin-2)',
      'Radiation therapy (mainly for symptom control if spread to bones or brain)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/kidney-cancer.html',
  },
  {
    id: 'bladder',
    name: 'Bladder cancer',
    aliases: ['bladder', 'urothelial', 'transitional cell', 'hematuria cancer'],
    simpleExplanation:
      'Bladder cancer starts in the bladder, the organ that stores urine. It often causes blood in the urine, which is an important warning sign to get checked.',
    whereItStarts:
      'Most bladder cancers start in the inner lining of the bladder (urothelium). These are called urothelial carcinomas (about 90% of cases).',
    howItSpreads:
      'It can grow into the muscle wall of the bladder, and then spread to nearby lymph nodes, the prostate or vagina, and then to the lungs, liver, and bones.',
    riskFactors: [
      'Smoking (the biggest risk factor, causes about half of cases)',
      'Workplace chemical exposure (dyes, rubber, leather, paint)',
      'Chronic bladder inflammation or infections',
      'Previous chemotherapy (cyclophosphamide)',
      'Previous radiation therapy to the pelvis',
      'Schistosomiasis infection (in some regions)',
    ],
    symptoms: [
      'Blood in the urine (most common — the urine may look pink, red, or dark)',
      'Frequent or urgent urination',
      'Pain or burning during urination',
      'Difficulty urinating or weak flow',
      'Lower back pain (on one side)',
    ],
    diagnosis:
      'Blood in the urine leads to a cystoscopy (a doctor looks inside the bladder with a camera). If a tumor is seen, it is removed for biopsy. Imaging (CT urogram) checks the upper urinary tract.',
    staging:
      'Stages 0-4. Stage 0 means only in the inner lining. Stage 4 means it has spread to the abdominal or pelvic wall or other organs.',
    treatments: [
      'Surgery to remove the tumor (through the bladder: TURBT)',
      'Immunotherapy inside the bladder (BCG for early-stage)',
      'Chemotherapy inside the bladder or systemic',
      'Surgery to remove the bladder (cystectomy, for advanced cases)',
      'Immunotherapy (pembrolizumab, atezolizumab for advanced)',
      'Targeted therapy (for specific mutations)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/bladder-cancer.html',
  },
  {
    id: 'brain',
    name: 'Brain tumor (glioblastoma and others)',
    aliases: ['brain', 'brain tumor', 'glioblastoma', 'GBM', 'glioma', 'astrocytoma', 'meningioma', 'CNS', 'central nervous system'],
    simpleExplanation:
      'Brain tumors can start in the brain (primary) or spread there from another cancer elsewhere in the body (metastatic). The most common aggressive primary brain tumor in adults is glioblastoma. Not all brain tumors are cancer — some are benign (non-cancerous).',
    whereItStarts:
      'Primary brain tumors start in brain cells. Gliomas (including glioblastoma) start in supportive cells called glial cells. Meningiomas start in the membranes covering the brain.',
    howItSpreads:
      'Primary brain tumors usually do not spread outside the brain and spinal cord, but they can grow within the brain and cause damage by pressing on healthy tissue.',
    riskFactors: [
      'Previous radiation therapy to the head',
      'Certain inherited syndromes (neurofibromatosis, Li-Fraumeni)',
      'Most brain tumors have no known risk factor',
    ],
    symptoms: [
      'Headaches that are new, different, or worse (especially in the morning)',
      'Seizures (especially new onset in an adult)',
      'Nausea or vomiting',
      'Vision, hearing, or speech problems',
      'Weakness or numbness in the face, arm, or leg',
      'Personality, memory, or thinking changes',
      'Difficulty with balance or walking',
    ],
    diagnosis:
      'An MRI of the brain is the main test. If a tumor is found, a biopsy or surgery is done to determine the exact type and grade.',
    staging:
      'Brain tumors are graded (WHO grades 1-4) rather than staged with numbers. Grade 1 is slow-growing and may be curable with surgery. Grade 4 (like glioblastoma) is the most aggressive.',
    treatments: [
      'Surgery to remove as much of the tumor as safely possible',
      'Radiation therapy',
      'Chemotherapy (temozolomide is common)',
      'Targeted therapy (for specific tumor types)',
      'Tumor-treating fields (electric fields that disrupt cancer cell division, for GBM)',
    ],
    sourceName: 'American Brain Tumor Association / NCI',
    sourceUrl: 'https://www.cancer.gov/types/brain',
  },
  {
    id: 'esophageal',
    name: 'Esophageal cancer',
    aliases: ['esophagus', 'esophageal', 'Barrett esophagus', 'GERD cancer', 'squamous esophagus'],
    simpleExplanation:
      'Esophageal cancer starts in the esophagus, the tube that carries food from the throat to the stomach. There are two main types: squamous cell carcinoma and adenocarcinoma.',
    whereItStarts:
      'Squamous cell carcinoma starts in the cells lining the upper and middle esophagus. Adenocarcinoma starts in gland cells, usually in the lower esophagus near the stomach, often in people with Barrett esophagus.',
    howItSpreads:
      'It can grow through the esophageal wall, spread to nearby lymph nodes, and then to the liver, lungs, and other organs.',
    riskFactors: [
      'Smoking (especially for squamous cell carcinoma)',
      'Heavy alcohol use',
      'Barrett esophagus (from long-term acid reflux/GERD)',
      'Obesity',
      'Drinking very hot beverages regularly',
      'Achalasia (a swallowing disorder)',
      'Betel nut chewing (in some cultures)',
    ],
    symptoms: [
      'Difficulty swallowing (starting with solid food, then liquids)',
      'Feeling like food is stuck in the chest',
      'Chest pain or discomfort',
      'Unintended weight loss',
      'Heartburn or indigestion',
      'Coughing or hoarseness',
    ],
    diagnosis:
      'An endoscopy (camera into the esophagus) is done when swallowing difficulty occurs. A biopsy confirms the diagnosis. A barium swallow X-ray may also be used.',
    staging:
      'Stages 1-4. Stage 1 means the cancer is only in the top layers of the esophagus. Stage 4 means it has spread to other organs.',
    treatments: [
      'Surgery to remove part of the esophagus',
      'Chemotherapy and radiation therapy (often together, before or after surgery)',
      'Immunotherapy (pembrolizumab for certain cases)',
      'Endoscopic procedures for very early-stage tumors',
      'Stent placement to keep the esophagus open (palliative)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/esophagus-cancer.html',
  },
  {
    id: 'endometrial',
    name: 'Endometrial (uterine) cancer',
    aliases: ['endometrial', 'uterine', 'uterus', 'endometrium', 'endometrial hyperplasia'],
    simpleExplanation:
      'Endometrial cancer starts in the lining of the uterus (the endometrium). It is the most common cancer of the female reproductive organs in many countries. It is often found early because it causes abnormal bleeding.',
    whereItStarts:
      'It starts in the inner lining of the uterus (endometrium). Most are endometrioid adenocarcinomas. A more aggressive type called uterine serous carcinoma is less common.',
    howItSpreads:
      'It can grow into the muscle wall of the uterus, and then spread to the cervix, ovaries, lymph nodes, and other organs.',
    riskFactors: [
      'Estrogen exposure without progesterone balance',
      'Obesity (fat tissue produces estrogen)',
      'Never having been pregnant',
      'Early menstruation or late menopause',
      'Tamoxifen use (breast cancer drug)',
      'Polycystic ovary syndrome (PCOS)',
      'Lynch syndrome',
      'Type 2 diabetes',
    ],
    symptoms: [
      'Abnormal uterine bleeding (the most common and important symptom)',
      'Bleeding between periods or after menopause',
      'Unusually heavy or long periods',
      'Pelvic pain or pressure',
      'Abnormal vaginal discharge (not blood)',
      'Unintended weight loss',
    ],
    diagnosis:
      'When abnormal bleeding occurs, an endometrial biopsy or dilation and curettage (D&C) is done. A transvaginal ultrasound may measure the thickness of the endometrium.',
    staging:
      'Stages 1-4. Stage 1 means the cancer is only in the uterus. Stage 4 means it has spread to the bladder, rectum, or distant organs.',
    treatments: [
      'Surgery (hysterectomy to remove the uterus and ovaries)',
      'Radiation therapy',
      'Hormone therapy (for certain types)',
      'Chemotherapy (for advanced cases)',
      'Immunotherapy (dostarlimab for certain cases)',
    ],
    sourceName: 'American Cancer Society / NCI',
    sourceUrl: 'https://www.cancer.org/cancer/endometrial-cancer.html',
  },
  {
    id: 'bone',
    name: 'Bone cancer',
    aliases: ['bone', 'bone cancer', 'cancer des os', 'cancer os', 'osteosarcoma', 'osteosarcome', 'ewing sarcoma', 'sarcome ewing', 'chondrosarcoma', 'chondrosarcome', 'osteosarcome', '3tham', '3azam', 'adhm', 'athem', 'os', 'des os', 'les os', 'عظام', 'عظم', 'سرطان العظام'],
    simpleExplanation:
      'Bone cancer (cancer des os) starts when cells inside a bone grow out of control. It is rare and different from cancers that spread TO the bone from other organs (like breast or prostate). The most common types are osteosarcoma (most often in children and young adults, usually around the knee), Ewing sarcoma, and chondrosarcoma (most often in adults).',
    whereItStarts:
      'True bone cancer starts inside the bone itself. Osteosarcoma usually starts at the ends of long bones (near the knee or shoulder). Ewing sarcoma often starts in the pelvis, chest wall, or long bones. Chondrosarcoma starts in cartilage. Cancers that started in another organ and spread to the bones are called metastatic cancer and are named after where they started.',
    howItSpreads:
      'Bone cancer can grow into nearby tissues and spread to the lungs (the most common site of spread) and other bones.',
    riskFactors: [
      'Rapid bone growth during adolescence (osteosarcoma peaks in the teenage growth spurt)',
      'Previous radiation therapy',
      'Certain inherited conditions (Li-Fraumeni syndrome, hereditary retinoblastoma)',
      'Paget disease of bone (for older adults)',
      'Benign bone tumors (for some chondrosarcomas)',
    ],
    symptoms: [
      'Bone pain that gets worse over time or at night',
      'Swelling or a lump near a bone or joint',
      'A bone that breaks with little or no injury',
      'Reduced movement of the affected limb or joint',
      'Tiredness, fever, or unexplained weight loss (less common)',
    ],
    diagnosis:
      'Usually starts with an X-ray, followed by MRI and sometimes a CT scan. A biopsy (taking a sample of the tumor) done at a specialist centre confirms the type. Blood tests may be used alongside imaging.',
    staging:
      'Staging considers the tumor grade (how abnormal the cells look), its size, whether it has spread to lymph nodes, and whether it has spread to distant sites (most importantly the lungs).',
    treatments: [
      'Surgery to remove the tumor while keeping the limb working when possible (limb-sparing surgery)',
      'Chemotherapy (standard for osteosarcoma and Ewing sarcoma, before and after surgery)',
      'Radiation therapy (mainly for Ewing sarcoma, or when surgery is not possible)',
      'Targeted therapy (imatinib for some rare types like dermatofibrosarcoma)',
    ],
    sourceName: 'American Cancer Society / NCI SEER',
    sourceUrl: 'https://www.cancer.org/cancer/types/bone-cancer.html',
  },
  {
    id: 'testicular',
    name: 'Testicular cancer',
    aliases: ['testicular', 'testis', 'testicle', 'germ cell tumor', 'seminoma', 'nonseminoma'],
    simpleExplanation:
      'Testicular cancer starts in the testicles and is the most common cancer in young men aged 15 to 35. It is also one of the most treatable cancers, even when it has spread.',
    whereItStarts:
      'It starts in germ cells inside the testicle. The two main groups are seminomas and non-seminomas, which grow differently and respond to different treatments.',
    howItSpreads:
      'It typically spreads first to lymph nodes in the back of the abdomen, then to the lungs, liver, and brain.',
    riskFactors: [
      'Undescended testicle (cryptorchidism)',
      'Family history of testicular cancer',
      'Personal history of testicular cancer in the other testicle',
      'Age between 15 and 35 (most common age range)',
    ],
    symptoms: [
      'A painless lump or swelling in a testicle',
      'A feeling of heaviness in the scrotum',
      'A dull ache in the groin or lower abdomen',
      'Sudden fluid collection in the scrotum',
    ],
    diagnosis:
      'Physical exam, ultrasound of the testicles, and blood tests for tumor markers (AFP, hCG, LDH). The testicle is usually removed surgically to confirm the type.',
    staging:
      'Stage 1 is only in the testicle, stage 2 has spread to abdominal lymph nodes, stage 3 has spread to distant organs such as the lungs or liver.',
    treatments: [
      'Surgery (removal of the affected testicle)',
      'Surveillance (close monitoring for early-stage disease)',
      'Chemotherapy (very effective, especially the BEP regimen)',
      'Radiation therapy (mainly for seminoma)',
      'Surgery to remove remaining masses after chemotherapy',
    ],
    sourceName: 'American Cancer Society / NCI SEER',
    sourceUrl: 'https://www.cancer.org/cancer/types/testicular-cancer.html',
  },
  {
    id: 'myeloma',
    name: 'Multiple myeloma',
    aliases: ['myeloma', 'multiple myeloma', 'plasma cell', 'kahler disease', 'myélome', 'مييلوما'],
    simpleExplanation:
      'Multiple myeloma is a cancer of plasma cells, a type of white blood cell found in the bone marrow. It is NOT a bone cancer, but it affects bones because the cancer cells grow inside the bone marrow and can weaken bones. It is most common in people over 60.',
    whereItStarts:
      'It starts in plasma cells inside the bone marrow. Abnormal plasma cells multiply and crowd out healthy blood cells, and can form tumors in multiple bones.',
    howItSpreads:
      'It spreads through the bone marrow to multiple bones, and can affect the kidneys, blood counts, and immune system.',
    riskFactors: [
      'Age over 60',
      'MGUS (monoclonal gammopathy of undetermined significance, a precursor condition)',
      'African ancestry (about twice the risk)',
      'Male sex',
      'Family history of myeloma',
    ],
    symptoms: [
      'Bone pain (often in the back, ribs, or hips)',
      'Tiredness or weakness (from anemia)',
      'Frequent infections',
      'High calcium (causing thirst, confusion, constipation)',
      'Kidney problems',
      'Numbness or weakness (if the spine is affected)',
    ],
    diagnosis:
      'Blood and urine tests looking for abnormal proteins, plus a bone marrow biopsy to confirm. Imaging (MRI, PET-CT, or low-dose CT) shows which bones are affected.',
    staging:
      'The R-ISS staging system uses blood protein levels, specific chromosome changes in the myeloma cells, and LDH to place patients in risk groups rather than numbered stages.',
    treatments: [
      'Targeted therapy (proteasome inhibitors like bortezomib)',
      'Immunomodulators (lenalidomide, thalidomide)',
      'Monoclonal antibodies (daratumumab)',
      'Steroids',
      'Autologous stem cell transplant (for eligible patients)',
      'Bisphosphonates to protect bones',
      'CAR-T cell therapy and bispecific antibodies (for relapsed disease)',
    ],
    sourceName: 'American Cancer Society / NCI SEER',
    sourceUrl: 'https://www.cancer.org/cancer/types/multiple-myeloma.html',
  },
];

// ─── Survival Statistics ────────────────────────────────────────────────────
// All survival statistics from SEER 18 registries (2014-2020), NCI.
// These are population-level survival rates, NOT individual predictions.

export const SURVIVAL_STATS: SurvivalStat[] = [
  {
    cancerId: 'breast',
    statisticType: '5-year relative survival (all SEER stages combined)',
    population: 'Female breast cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '91.2%',
    whatItMeans:
      'Out of 100 women diagnosed with breast cancer in the US, about 91 were alive 5 years after their diagnosis. This includes all stages combined.',
    whatItCantTell:
      'This number comes from women diagnosed years ago. Newer treatments may improve outcomes. Your individual prognosis depends on the cancer stage, type, your age, overall health, and treatment response. This does not mean you have 91% chance of surviving, nor does it predict how long you will live.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/breast.html',
  },
  {
    cancerId: 'breast',
    statisticType: '5-year relative survival (localized)',
    population: 'Female breast cancer, confined to the breast',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '99.6%',
    whatItMeans: 'When breast cancer is found before it has spread outside the breast, about 99 out of 100 women are alive 5 years after diagnosis.',
    whatItCantTell: 'This is for cancer found early. Later stages have lower survival. It does not mean you are cured or predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/breast.html',
  },
  {
    cancerId: 'breast',
    statisticType: '5-year relative survival (distant/metastatic)',
    population: 'Female breast cancer, spread to distant organs (stage 4)',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '31.9%',
    whatItMeans: 'When breast cancer has spread to other parts of the body, about 32 out of 100 women are alive 5 years after diagnosis.',
    whatItCantTell: 'Many women live much longer than 5 years with metastatic breast cancer thanks to newer treatments. This statistic is from past cases and may not reflect current treatment outcomes. It does not predict your survival.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/breast.html',
  },
  {
    cancerId: 'lung',
    statisticType: '5-year relative survival (all SEER stages combined)',
    population: 'Non-small cell lung cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '26.7%',
    whatItMeans: 'Out of 100 people diagnosed with non-small cell lung cancer in the US, about 27 were alive 5 years after diagnosis.',
    whatItCantTell: 'This includes all stages. For early-stage lung cancer, survival is much higher. For advanced lung cancer, it is lower. Newer treatments like immunotherapy and targeted therapy may improve outcomes beyond what these numbers show. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/lungb.html',
  },
  {
    cancerId: 'lung',
    statisticType: '5-year relative survival (localized)',
    population: 'Non-small cell lung cancer, confined to the lung',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '65.4%',
    whatItMeans: 'When lung cancer is found before it has spread outside the lung, about 65 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'This highlights the importance of early detection. Most lung cancers are found at later stages. This number does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/lungb.html',
  },
  {
    cancerId: 'lung',
    statisticType: '5-year relative survival (distant/metastatic)',
    population: 'Non-small cell lung cancer, spread to distant organs',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '9.0%',
    whatItMeans: 'When non-small cell lung cancer has spread to other parts of the body, about 9 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'This is a population statistic from past years. Newer immunotherapy and targeted therapy treatments have improved outcomes for some patients. This does not predict your survival. Some patients respond very well to newer treatments and live much longer.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/lungb.html',
  },
  {
    cancerId: 'colorectal',
    statisticType: '5-year relative survival (all SEER stages combined)',
    population: 'Colorectal cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '65.1%',
    whatItMeans: 'Out of 100 people diagnosed with colorectal cancer in the US, about 65 were alive 5 years after diagnosis.',
    whatItCantTell: 'This combines all stages. Early-stage colorectal cancer has much higher survival. This number does not predict your individual outcome, which depends on stage, location, your health, and treatment response.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/colorectal.html',
  },
  {
    cancerId: 'colorectal',
    statisticType: '5-year relative survival (localized)',
    population: 'Colorectal cancer, confined to the colon or rectum wall',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '91.4%',
    whatItMeans: 'When colorectal cancer is found before it has spread, about 91 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'This is why screening is so important. When found early through screening, colorectal cancer is very treatable. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/colorectal.html',
  },
  {
    cancerId: 'colorectal',
    statisticType: '5-year relative survival (distant/metastatic)',
    population: 'Colorectal cancer, spread to distant organs',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '14.7%',
    whatItMeans: 'When colorectal cancer has spread to other organs, about 15 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'Newer targeted therapies and immunotherapy have improved outcomes for some metastatic colorectal cancer patients. This statistic is from past cases. It does not predict your survival.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/colorectal.html',
  },
  {
    cancerId: 'prostate',
    statisticType: '5-year relative survival (all stages)',
    population: 'Prostate cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '97.1%',
    whatItMeans: 'Out of 100 men diagnosed with prostate cancer in the US, about 97 were alive 5 years after diagnosis.',
    whatItCantTell: 'Most prostate cancers grow slowly. Many men with prostate cancer die of other causes, not prostate cancer. This does not predict your individual outcome, which depends on the cancer grade, stage, your age, and treatment choice.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/prost.html',
  },
  {
    cancerId: 'prostate',
    statisticType: '5-year relative survival (distant/metastatic)',
    population: 'Prostate cancer, spread to distant organs (stage 4)',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '33.9%',
    whatItMeans: 'When prostate cancer has spread to other parts of the body like bones, about 34 out of 100 men are alive 5 years after diagnosis.',
    whatItCantTell: 'Newer hormone therapies and other treatments have improved outcomes. Many men live for years with metastatic prostate cancer. This does not predict your survival.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/prost.html',
  },
  {
    cancerId: 'pancreatic',
    statisticType: '5-year relative survival (all stages)',
    population: 'Pancreatic cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '13.0%',
    whatItMeans: 'Out of 100 people diagnosed with pancreatic cancer in the US, about 13 were alive 5 years after diagnosis.',
    whatItCantTell: 'Pancreatic cancer is often found at a late stage, which lowers this average. When found early and surgically removed, survival is significantly higher. This is a population statistic, not a personal prediction. Newer treatments are being developed. Please discuss your specific situation with your oncologist.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/pancreas.html',
  },
  {
    cancerId: 'pancreatic',
    statisticType: '5-year relative survival (localized)',
    population: 'Pancreatic cancer, confined to the pancreas',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '44.3%',
    whatItMeans: 'When pancreatic cancer is found before it has spread (and can be removed surgically), about 44 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'Only a small percentage of pancreatic cancers are found at this early stage. This statistic does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/pancreas.html',
  },
  {
    cancerId: 'ovarian',
    statisticType: '5-year relative survival (all stages)',
    population: 'Ovarian cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '50.8%',
    whatItMeans: 'Out of 100 women diagnosed with ovarian cancer in the US, about 51 were alive 5 years after diagnosis.',
    whatItCantTell: 'Ovarian cancer is often found at a later stage, which lowers this average. When found early, survival is much higher. Newer treatments like PARP inhibitors have improved outcomes for some women. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/ovary.html',
  },
  {
    cancerId: 'melanoma',
    statisticType: '5-year relative survival (all stages)',
    population: 'Melanoma of the skin, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '93.7%',
    whatItMeans: 'Out of 100 people diagnosed with melanoma in the US, about 94 were alive 5 years after diagnosis.',
    whatItCantTell: 'Melanoma is highly treatable when found early. Survival drops significantly if it has spread. Newer immunotherapy and targeted therapy have dramatically improved outcomes for advanced melanoma. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/melan.html',
  },
  {
    cancerId: 'melanoma',
    statisticType: '5-year relative survival (localized)',
    population: 'Melanoma, confined to the skin',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '99.5%',
    whatItMeans: 'When melanoma is found before it has spread, about 99 out of 100 people are alive 5 years after diagnosis.',
    whatItCantTell: 'This highlights why early detection of skin changes is so important. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/melan.html',
  },
  {
    cancerId: 'thyroid',
    statisticType: '5-year relative survival (all stages)',
    population: 'Thyroid cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '98.5%',
    whatItMeans: 'Out of 100 people diagnosed with thyroid cancer in the US, about 98 were alive 5 years after diagnosis.',
    whatItCantTell: 'This includes all types. The most common type (papillary) has very high survival. Anaplastic thyroid cancer is much more aggressive but rare. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/thyro.html',
  },
  {
    cancerId: 'leukemia',
    statisticType: '5-year relative survival (all types combined)',
    population: 'Leukemia, all types',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '66.7%',
    whatItMeans: 'Out of 100 people diagnosed with leukemia of any type in the US, about 67 were alive 5 years after diagnosis.',
    whatItCantTell: 'This combines all leukemia types. Acute lymphoblastic leukemia in children has about 90% survival. Survival for acute myeloid leukemia in older adults is lower. Your specific type, age, and genetic features matter greatly. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/leuks.html',
  },
  {
    cancerId: 'lymphoma',
    statisticType: '5-year relative survival (non-Hodgkin, all stages)',
    population: 'Non-Hodgkin lymphoma, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '74.8%',
    whatItMeans: 'Out of 100 people diagnosed with non-Hodgkin lymphoma in the US, about 75 were alive 5 years after diagnosis.',
    whatItCantTell: 'There are many subtypes of non-Hodgkin lymphoma with different outcomes. Some are very treatable, others are more challenging. Your subtype matters greatly. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/nhl.html',
  },
  {
    cancerId: 'lymphoma',
    statisticType: '5-year relative survival (Hodgkin lymphoma, all stages)',
    population: 'Hodgkin lymphoma, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '89.6%',
    whatItMeans: 'Out of 100 people diagnosed with Hodgkin lymphoma in the US, about 90 were alive 5 years after diagnosis.',
    whatItCantTell: 'Hodgkin lymphoma is one of the most treatable cancers. Survival is even higher for early-stage disease. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/hodg.html',
  },
  {
    cancerId: 'kidney',
    statisticType: '5-year relative survival (all stages)',
    population: 'Kidney and renal pelvis cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '78.9%',
    whatItMeans: 'Out of 100 people diagnosed with kidney cancer in the US, about 79 were alive 5 years after diagnosis.',
    whatItCantTell: 'When kidney cancer is found early (localized), survival is about 93%. When it has spread, it is lower. Newer targeted and immunotherapy treatments have improved outcomes. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/kidrp.html',
  },
  {
    cancerId: 'bladder',
    statisticType: '5-year relative survival (all stages)',
    population: 'Bladder cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '77.1%',
    whatItMeans: 'Out of 100 people diagnosed with bladder cancer in the US, about 77 were alive 5 years after diagnosis.',
    whatItCantTell: 'Most bladder cancers are found early (in the lining), where survival is about 96%. When it has spread to the muscle wall or beyond, survival is lower. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/urinb.html',
  },
  {
    cancerId: 'cervical',
    statisticType: '5-year relative survival (all stages)',
    population: 'Cervical cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '67.2%',
    whatItMeans: 'Out of 100 women diagnosed with cervical cancer in the US, about 67 were alive 5 years after diagnosis.',
    whatItCantTell: 'When found early through screening, survival is about 92%. In countries without screening programs, outcomes are worse. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/cervix.html',
  },
  {
    cancerId: 'stomach',
    statisticType: '5-year relative survival (all stages)',
    population: 'Stomach cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '36.4%',
    whatItMeans: 'Out of 100 people diagnosed with stomach cancer in the US, about 36 were alive 5 years after diagnosis.',
    whatItCantTell: 'Survival is higher when stomach cancer is found early. In countries with screening programs (like Japan and Korea), more stomach cancers are found early and survival is higher. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/stomach.html',
  },
  {
    cancerId: 'liver',
    statisticType: '5-year relative survival (all stages)',
    population: 'Liver and intrahepatic bile duct cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '22.0%',
    whatItMeans: 'Out of 100 people diagnosed with liver cancer in the US, about 22 were alive 5 years after diagnosis.',
    whatItCantTell: 'When liver cancer is found early and can be treated with surgery or transplant, survival is much higher (about 37%). Most liver cancer is found at later stages. Outcomes vary greatly by region and cause. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/livibd.html',
  },
  {
    cancerId: 'endometrial',
    statisticType: '5-year relative survival (all stages)',
    population: 'Endometrial (uterine corpus) cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '81.3%',
    whatItMeans: 'Out of 100 women diagnosed with endometrial cancer in the US, about 81 were alive 5 years after diagnosis.',
    whatItCantTell: 'Most endometrial cancer is found early because of abnormal bleeding symptoms, which improves survival. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/corp.html',
  },
  {
    cancerId: 'esophageal',
    statisticType: '5-year relative survival (all stages)',
    population: 'Esophageal cancer, all stages',
    geography: 'United States (SEER 18 registries)',
    dataPeriod: '2014-2020',
    value: '22.5%',
    whatItMeans: 'Out of 100 people diagnosed with esophageal cancer in the US, about 22 were alive 5 years after diagnosis.',
    whatItCantTell: 'When esophageal cancer is found early, survival is higher (about 54%). Most is found at later stages because symptoms often appear only after the cancer has grown. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/esoph.html',
  },
  {
    cancerId: 'bone',
    statisticType: '5-year relative survival (all stages)',
    population: 'Bone and joint cancer, all stages',
    geography: 'United States (SEER)',
    dataPeriod: 'SEER 2014-2023 trend data',
    value: '68.7%',
    whatItMeans: 'Out of 100 people diagnosed with bone and joint cancer in the US, about 69 were alive 5 years after diagnosis.',
    whatItCantTell: 'Survival differs a lot by type (osteosarcoma, Ewing sarcoma, chondrosarcoma), stage, and age. Children and young adults with localized osteosarcoma often do much better than this average. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/bones.html',
  },
  {
    cancerId: 'testicular',
    statisticType: '5-year relative survival (all stages)',
    population: 'Testicular cancer, all stages',
    geography: 'United States (SEER)',
    dataPeriod: 'SEER 2014-2023 trend data',
    value: '94.6%',
    whatItMeans: 'Out of 100 men diagnosed with testicular cancer in the US, about 95 were alive 5 years after diagnosis.',
    whatItCantTell: 'Even men with metastatic testicular cancer are often cured with chemotherapy. This does not predict your individual outcome.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/testis.html',
  },
  {
    cancerId: 'myeloma',
    statisticType: '5-year relative survival (all stages)',
    population: 'Multiple myeloma, all stages',
    geography: 'United States (SEER)',
    dataPeriod: 'SEER 2014-2023 trend data',
    value: '63.7%',
    whatItMeans: 'Out of 100 people diagnosed with multiple myeloma in the US, about 64 were alive 5 years after diagnosis.',
    whatItCantTell: 'Newer treatments (targeted therapy, immunotherapy, CAR-T) are improving outcomes beyond what these numbers show. This is a population statistic, not a personal prediction.',
    sourceName: 'NCI SEER Program',
    sourceUrl: 'https://seer.cancer.gov/statfacts/html/mulmy.html',
  },
];

// ─── Comorbidities ──────────────────────────────────────────────────────────

export const CONDITIONS: ConditionOption[] = [
  { id: 'diabetes', name: 'Diabetes' },
  { id: 'cardiovascular', name: 'Cardiovascular disease' },
  { id: 'hypertension', name: 'Hypertension (high blood pressure)' },
  { id: 'kidney_disease', name: 'Chronic kidney disease' },
  { id: 'liver_disease', name: 'Liver disease' },
  { id: 'obesity', name: 'Obesity / metabolic disorders' },
  { id: 'autoimmune', name: 'Autoimmune conditions' },
];

export const COMORBIDITIES: ComorbidityEntry[] = [
  {
    conditionId: 'diabetes',
    conditionName: 'Diabetes',
    cancerId: 'breast',
    cancerRisk: 'Type 2 diabetes is associated with a modestly increased risk of breast cancer, likely due to shared risk factors including obesity and insulin resistance. The evidence is strongest for postmenopausal breast cancer.',
    prognosisImpact: 'Some studies suggest that women with diabetes and breast cancer may have worse outcomes, but this is partly explained by other health factors and differences in cancer treatment. Well-controlled diabetes does not appear to significantly worsen breast cancer prognosis.',
    treatmentInteractions: 'Some cancer treatments can affect blood sugar levels. Steroids (given with chemotherapy to prevent nausea) can raise blood sugar significantly. Hormone therapies for breast cancer do not typically affect diabetes directly, but weight changes from treatment can affect diabetes management.',
    management: 'Coordinate closely between your oncologist and your diabetes care team. Monitor blood sugar more frequently during cancer treatment. Some diabetes medications may need adjustment. Maintain a healthy diet and stay physically active as much as possible during treatment.',
    evidenceGaps: 'The exact mechanism linking diabetes and breast cancer risk is not fully established. Most studies are observational, meaning they show association but cannot prove causation. More research is needed on how newer diabetes medications affect cancer risk and outcomes.',
    evidenceLevel: 'established',
    sourceName: 'American Diabetes Association / NCI',
    sourceUrl: 'https://www.cancer.gov/about-cancer/treatment/side-effects/blood-disorders/diabetes-pdq',
  },
  {
    conditionId: 'diabetes',
    conditionName: 'Diabetes',
    cancerId: 'colorectal',
    cancerRisk: 'Type 2 diabetes is associated with a 20-30% increased risk of colorectal cancer. This is thought to be due to shared factors (obesity, physical inactivity, diet) and possibly high insulin levels promoting cell growth.',
    prognosisImpact: 'People with diabetes and colorectal cancer may have somewhat worse outcomes. This may be partly due to later diagnosis, differences in treatment, or diabetes complications. Good diabetes management during cancer treatment may help.',
    treatmentInteractions: 'Some colorectal cancer treatments can affect blood sugar. Steroids given with chemotherapy can cause high blood sugar. Surgery for colorectal cancer may temporarily affect eating and medication absorption. Metformin (a common diabetes drug) does not usually need to be stopped, but dosing may need adjustment.',
    management: 'Your oncologist and diabetes team should communicate about your treatment plan. Blood sugar monitoring is important during chemotherapy. Nutritional changes after colorectal surgery may require diabetes medication adjustments.',
    evidenceGaps: 'Whether metformin has a protective effect against colorectal cancer is being studied but is not yet established. The interaction between newer diabetes drugs and cancer treatment needs more research.',
    evidenceLevel: 'established',
    sourceName: 'American Diabetes Association / NCI',
    sourceUrl: 'https://www.cancer.gov/about-cancer/treatment/side-effects/blood-disorders/diabetes-pdq',
  },
  {
    conditionId: 'diabetes',
    conditionName: 'Diabetes',
    cancerId: 'pancreatic',
    cancerRisk: 'Long-standing type 2 diabetes is a risk factor for pancreatic cancer. Conversely, new-onset diabetes in older adults can sometimes be an early sign of pancreatic cancer. The relationship is complex and bidirectional.',
    prognosisImpact: 'Diabetes can complicate pancreatic cancer treatment. It may affect surgical outcomes and treatment tolerance. Pancreatic cancer itself can worsen diabetes by damaging insulin-producing cells.',
    treatmentInteractions: 'Pancreatic surgery can significantly affect blood sugar control, sometimes causing diabetes or worsening existing diabetes. Some chemotherapy drugs can affect blood sugar. Managing both conditions together requires careful coordination.',
    management: 'If you have pancreatic cancer and diabetes, your care team should include both an oncologist and an endocrinologist. Blood sugar may be harder to control during treatment. Insulin adjustments are often needed, especially if pancreatic surgery is performed.',
    evidenceGaps: 'Whether improving diabetes control affects cancer outcomes is not well established. The relationship between new-onset diabetes and hidden pancreatic cancer is an active area of research.',
    evidenceLevel: 'established',
    sourceName: 'NCI / American Diabetes Association',
    sourceUrl: 'https://www.cancer.gov/types/pancreatic',
  },
  {
    conditionId: 'cardiovascular',
    conditionName: 'Cardiovascular disease',
    cancerId: 'breast',
    cancerRisk: 'There is no established direct link between cardiovascular disease and breast cancer risk. However, they share risk factors including age, obesity, and physical inactivity.',
    prognosisImpact: 'Heart disease can affect breast cancer treatment choices. Some chemotherapy drugs (anthracyclines like doxorubicin) and some targeted therapies (trastuzumab) can affect the heart. Pre-existing heart disease increases the risk of heart-related side effects from these treatments.',
    treatmentInteractions: 'Anthracycline chemotherapy can damage the heart muscle in some patients. Trastuzumab (Herceptin) can reduce heart pumping function. Radiation to the left breast can affect the heart. Your oncologist may adjust treatment or order heart monitoring (echocardiograms) during treatment if you have heart disease.',
    management: 'Tell your oncologist about any heart conditions. Heart function is usually monitored with echocardiograms before and during treatment with certain drugs. Blood pressure and cholesterol should be managed. A cardiologist may be part of your care team during cancer treatment.',
    evidenceGaps: 'Long-term heart effects of newer cancer treatments are still being studied. Individual risk of heart damage from chemotherapy is difficult to predict precisely.',
    evidenceLevel: 'established',
    sourceName: 'American Heart Association / NCI',
    sourceUrl: 'https://www.heart.org/en/health-topics/cancer-and-heart-disease',
  },
  {
    conditionId: 'cardiovascular',
    conditionName: 'Cardiovascular disease',
    cancerId: 'lung',
    cancerRisk: 'Both lung cancer and cardiovascular disease share smoking as a major risk factor. There is no direct causal link between heart disease and lung cancer beyond shared risk factors.',
    prognosisImpact: 'Heart disease can limit cancer treatment options. Some lung cancer treatments can affect the heart. Patients with both conditions may have more treatment complications.',
    treatmentInteractions: 'Some lung cancer targeted therapies can cause heart rhythm problems or high blood pressure. Radiation to the chest can affect the heart. Certain chemotherapy drugs can stress the heart. Your doctor will consider your heart health when choosing treatments.',
    management: 'Cardiac monitoring during treatment is important for patients with heart disease. Blood pressure and heart rhythm should be checked regularly. Report any new chest pain, shortness of breath, or palpitations immediately.',
    evidenceGaps: 'The interaction between newer targeted lung cancer therapies and cardiovascular disease needs more study.',
    evidenceLevel: 'established',
    sourceName: 'American Heart Association',
    sourceUrl: 'https://www.heart.org/en/health-topics/cancer-and-heart-disease',
  },
  {
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    cancerId: 'kidney',
    cancerRisk: 'High blood pressure is associated with an increased risk of kidney cancer, though the relationship is not fully understood. It may be partly due to shared causes or to the effect of long-standing high blood pressure on the kidneys.',
    prognosisImpact: 'High blood pressure can complicate kidney cancer treatment and surgery. It should be well-controlled before and after surgery.',
    treatmentInteractions: 'Some kidney cancer targeted therapies (like sunitinib and other tyrosine kinase inhibitors) can cause or worsen high blood pressure. Blood pressure medication may need adjustment during these treatments.',
    management: 'Monitor blood pressure regularly during kidney cancer treatment. Your doctor may adjust blood pressure medications. Report any severe headaches, vision changes, or very high blood pressure readings.',
    evidenceGaps: 'Whether treating high blood pressure reduces kidney cancer risk is not clearly established.',
    evidenceLevel: 'emerging',
    sourceName: 'NCI / American Heart Association',
    sourceUrl: 'https://www.cancer.gov/types/kidney',
  },
  {
    conditionId: 'kidney_disease',
    conditionName: 'Chronic kidney disease',
    cancerId: 'bladder',
    cancerRisk: 'Chronic kidney disease is not a direct cause of bladder cancer, but both can share causes including certain medication exposures. Kidney transplant recipients on immunosuppression have higher cancer risk overall.',
    prognosisImpact: 'Kidney disease can affect which cancer treatments can be used. Some chemotherapy drugs are cleared by the kidneys, so kidney function affects dosing. Severe kidney disease may limit treatment options.',
    treatmentInteractions: 'Some chemotherapy drugs need dose adjustment or cannot be used if kidney function is poor. Certain targeted therapies and immunotherapies may also be affected by kidney function.',
    management: 'Your kidney function will be tested before treatment starts. Doses may be adjusted based on kidney function. Your oncologist and kidney doctor (nephrologist) should coordinate your care.',
    evidenceGaps: 'Long-term kidney effects of newer cancer treatments need more study.',
    evidenceLevel: 'established',
    sourceName: 'National Kidney Foundation / NCI',
    sourceUrl: 'https://www.kidney.org/atoz/content/cancer',
  },
  {
    conditionId: 'liver_disease',
    conditionName: 'Liver disease',
    cancerId: 'liver',
    cancerRisk: 'Cirrhosis (advanced liver scarring) from any cause is the biggest risk factor for liver cancer. This includes cirrhosis from hepatitis B, hepatitis C, alcohol, and fatty liver disease.',
    prognosisImpact: 'Liver function directly affects treatment options. If the liver is badly damaged, surgery may not be possible. Liver function is a key factor in treatment decisions for liver cancer.',
    treatmentInteractions: 'Many cancer drugs are processed by the liver. If the liver is not working well, drug doses must be adjusted or some drugs cannot be used. The Barcelona Clinic Liver Cancer system uses liver function to guide treatment choices.',
    management: 'Treating the underlying liver condition (e.g., antiviral therapy for hepatitis) is important. Your hepatologist (liver specialist) and oncologist should work together. Regular monitoring of liver function tests is essential.',
    evidenceGaps: 'How to best treat liver cancer in patients with severe liver disease is an active area of research.',
    evidenceLevel: 'established',
    sourceName: 'American Liver Foundation / NCI',
    sourceUrl: 'https://www.cancer.gov/types/liver',
  },
  {
    conditionId: 'obesity',
    conditionName: 'Obesity / metabolic disorders',
    cancerId: 'endometrial',
    cancerRisk: 'Obesity is the strongest known risk factor for endometrial cancer. Fat tissue produces estrogen, which can stimulate the endometrium. Women who are obese have 2-4 times the risk of developing endometrial cancer.',
    prognosisImpact: 'Obesity may slightly worsen endometrial cancer outcomes, partly due to surgical complications and treatment difficulties. However, most endometrial cancer is found early, and outcomes are generally good regardless of weight.',
    treatmentInteractions: 'Obesity can make surgery more technically difficult and increase surgical risks (infection, blood clots). Some hormone therapies may be less effective in obese patients. Dosing of chemotherapy may need adjustment.',
    management: 'Weight management may help reduce risk of endometrial cancer recurrence, but weight loss should not be attempted during active treatment without medical guidance. Focus on maintaining strength and nutrition during treatment.',
    evidenceGaps: 'Whether weight loss after diagnosis improves outcomes is being studied but is not yet established.',
    evidenceLevel: 'established',
    sourceName: 'NCI / American Cancer Society',
    sourceUrl: 'https://www.cancer.gov/types/endometrial',
  },
  {
    conditionId: 'autoimmune',
    conditionName: 'Autoimmune conditions',
    cancerId: 'lung',
    cancerRisk: 'Some autoimmune diseases are associated with a slightly increased risk of lung cancer, particularly those causing lung inflammation (like rheumatoid arthritis with lung involvement). The risk is modest.',
    prognosisImpact: 'Autoimmune conditions can complicate cancer treatment because immunotherapy (a major lung cancer treatment) can worsen autoimmune diseases. This requires careful treatment planning.',
    treatmentInteractions: 'Immune checkpoint inhibitors (like pembrolizumab, nivolumab) can cause autoimmune side effects and may worsen existing autoimmune conditions. In some cases, immunotherapy may still be used with close monitoring. Autoimmune medications may need adjustment during cancer treatment.',
    management: 'Your oncologist and rheumatologist (or other autoimmune specialist) should coordinate care. Close monitoring for autoimmune flare-ups during immunotherapy is essential. Report any new symptoms like joint pain, rashes, or diarrhea.',
    evidenceGaps: 'The safety of immunotherapy in patients with severe autoimmune disease is still being studied. Each case needs individual assessment.',
    evidenceLevel: 'emerging',
    sourceName: 'American College of Rheumatology / NCI',
    sourceUrl: 'https://www.cancer.gov/about-cancer/treatment/types/immunotherapy',
  },
];

// ─── Cancer Awareness ───────────────────────────────────────────────────────

export const AWARENESS_PREVENTION: AwarenessItem[] = [
  {
    id: 'tobacco',
    title: 'Tobacco is the biggest preventable cancer cause',
    content:
      'Tobacco use causes about 22% of cancer deaths worldwide. Quitting smoking at any age reduces cancer risk. The risk of lung cancer drops by about half after 10-15 years of not smoking. Avoid secondhand smoke as well. Support for quitting includes nicotine replacement therapy, medications, and counseling.',
    sourceName: 'WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
  },
  {
    id: 'diet_weight',
    title: 'Healthy weight and diet',
    content:
      'Being overweight or obese is linked to at least 13 types of cancer, including breast (after menopause), colorectal, endometrial, kidney, and pancreatic cancer. Eating plenty of fruits, vegetables, and whole grains, limiting red and processed meats, and staying physically active can reduce risk. Aim for at least 150 minutes of moderate activity per week.',
    sourceName: 'WHO / World Cancer Research Fund',
    sourceUrl: 'https://www.wcrf.org/dietandcancer/',
  },
  {
    id: 'alcohol',
    title: 'Alcohol increases cancer risk',
    content:
      'Alcohol is a known cause of several cancers including mouth, throat, esophageal, liver, colorectal, and breast cancer. The risk increases with the amount of alcohol consumed. Reducing or avoiding alcohol lowers cancer risk. There is no "safe" level of alcohol consumption for cancer risk.',
    sourceName: 'WHO / IARC',
    sourceUrl: 'https://www.iarc.who.int/wp-content/uploads/2024/01/pr331_E.pdf',
  },
  {
    id: 'uv',
    title: 'Protect your skin from UV radiation',
    content:
      'Ultraviolet (UV) radiation from the sun and tanning beds causes most skin cancers, including melanoma. Protect yourself by seeking shade, wearing protective clothing, applying broad-spectrum sunscreen (SPF 30+), and avoiding tanning beds entirely. This is especially important for fair-skinned people, but everyone should protect their skin.',
    sourceName: 'WHO / American Cancer Society',
    sourceUrl: 'https://www.cancer.org/healthy/be-safe-in-sun.html',
  },
  {
    id: 'vaccines',
    title: 'Cancer-preventing vaccines',
    content:
      'Two vaccines can prevent cancer: HPV vaccine prevents cervical cancer and several other cancers caused by human papillomavirus. Hepatitis B vaccine prevents liver cancer caused by HBV infection. HPV vaccination is recommended for adolescents (ages 9-12) but can be given up to age 45 in some cases. Hepatitis B vaccination is recommended for all infants and at-risk adults.',
    sourceName: 'WHO / CDC',
    sourceUrl: 'https://www.who.int/health-topics/human-papillomavirus-vaccines',
  },
  {
    id: 'infections',
    title: 'Infections and cancer',
    content:
      'About 15-20% of cancers worldwide are caused by infections. Major cancer-causing infections include HPV (cervical and other cancers), hepatitis B and C (liver cancer), Helicobacter pylori (stomach cancer), and Epstein-Barr virus (some lymphomas). Vaccination, treatment of infections, and screening can reduce these risks.',
    sourceName: 'WHO / IARC',
    sourceUrl: 'https://www.iarc.who.int/wp-content/uploads/2024/01/pr331_E.pdf',
  },
];

export const AWARENESS_SCREENING: AwarenessItem[] = [
  {
    id: 'breast_screening',
    title: 'Breast cancer screening',
    content:
      'Mammography (X-ray of the breast) can find breast cancer early, before symptoms appear. Regular screening reduces breast cancer deaths. Guidelines vary by country — discuss with your doctor when to start and how often to have mammograms based on your age and risk factors.',
    sourceName: 'WHO / American Cancer Society',
    sourceUrl: 'https://www.cancer.org/healthy/find-cancer-early/cancer-screening-guidelines.html',
  },
  {
    id: 'cervical_screening',
    title: 'Cervical cancer screening',
    content:
      'Cervical cancer screening with Pap tests and HPV tests can find abnormal cells before they become cancer, making it one of the most effective cancer screening methods. Screening is recommended for women starting in their 20s. HPV vaccination does not replace screening.',
    sourceName: 'WHO',
    sourceUrl: 'https://www.who.int/health-topics/cervical-cancer',
  },
  {
    id: 'colorectal_screening',
    title: 'Colorectal cancer screening',
    content:
      'Colorectal cancer screening can find and remove polyps before they become cancer, making it both preventive and early-detecting. Screening is generally recommended starting at age 45 (or earlier if you have risk factors). Options include colonoscopy, stool tests, and sigmoidoscopy. Discuss with your doctor which test is right for you.',
    sourceName: 'American Cancer Society',
    sourceUrl: 'https://www.cancer.org/healthy/find-cancer-early/cancer-screening-guidelines.html',
  },
  {
    id: 'lung_screening',
    title: 'Lung cancer screening',
    content:
      'Low-dose CT scans can find lung cancer early in people at high risk (ages 50-80 who currently smoke or recently quit after smoking heavily for many years). If you are or were a heavy smoker, ask your doctor whether lung cancer screening is appropriate for you.',
    sourceName: 'American Cancer Society / USPSTF',
    sourceUrl: 'https://www.cancer.org/healthy/find-cancer-early/cancer-screening-guidelines.html',
  },
  {
    id: 'prostate_screening',
    title: 'Prostate cancer screening',
    content:
      'PSA blood tests can detect prostate cancer early, but the decision to screen should be individual. PSA testing can lead to finding cancers that would never have caused problems (overdiagnosis). Discuss the benefits and risks of prostate cancer screening with your doctor, especially if you are 50-69 or have higher risk.',
    sourceName: 'WHO / American Cancer Society',
    sourceUrl: 'https://www.cancer.org/healthy/find-cancer-early/cancer-screening-guidelines.html',
  },
];

export const AWARENESS_MYTHS: MythFact[] = [
  {
    myth: 'Cancer is always a death sentence.',
    fact:
      'Many cancers are now very treatable, especially when found early. Survival rates have improved dramatically over the past decades. For example, the 5-year survival for localized breast cancer is over 99%, and many cancers can be managed as chronic conditions even when not curable.',
  },
  {
    myth: 'Eating sugar makes cancer grow faster.',
    fact:
      'There is no strong evidence that eating sugar directly makes cancer grow faster. All cells, including cancer cells, use glucose for energy. However, a high-sugar diet can lead to obesity, which increases the risk of several cancers. A balanced diet is best for overall health during and after cancer treatment.',
  },
  {
    myth: 'Cancer is contagious.',
    fact:
      'Cancer itself is not contagious. You cannot catch cancer from someone who has it. However, some cancer-causing viruses (like HPV and hepatitis B/C) are transmissible, which is why vaccination and safe practices are important.',
  },
  {
    myth: 'Only people with a family history get cancer.',
    fact:
      'Only about 5-10% of cancers are caused by inherited gene mutations. Most cancers are caused by genetic changes that happen during a person\u2019s lifetime, due to aging, lifestyle factors, and environmental exposures. Anyone can develop cancer.',
  },
  {
    myth: 'Antiperspirants and deodorants cause breast cancer.',
    fact:
      'There is no scientific evidence that antiperspirants or deodorants cause breast cancer. This is a commonly shared myth, but studies have not found any link.',
  },
  {
    myth: 'Alternative medicine can cure cancer without conventional treatment.',
    fact:
      'No alternative therapy has been proven to cure cancer. Delaying or avoiding conventional cancer treatment (surgery, radiation, chemotherapy, targeted therapy, immunotherapy) in favor of alternative therapies can allow cancer to grow and spread, reducing survival chances. Some complementary approaches (like meditation, yoga, acupuncture) can help manage symptoms alongside conventional treatment.',
  },
  {
    myth: 'A biopsy or surgery can cause cancer to spread.',
    fact:
      'There is no evidence that biopsies cause cancer to spread. Biopsies are essential for accurate diagnosis. While there is a very small risk of cancer spreading along the needle track in rare cases, this is far outweighed by the benefit of getting an accurate diagnosis.',
  },
  {
    myth: 'Cancer treatment is worse than the cancer.',
    fact:
      'Cancer treatments can have significant side effects, but they are designed to destroy cancer cells and save lives. Modern treatments have fewer side effects than in the past, and supportive care (anti-nausea medication, pain management) has improved greatly. Your care team will help manage side effects.',
  },
];

export const AWARENESS_WHEN_TO_SEE_DOCTOR: string[] = [
  'Unexplained weight loss (losing weight without trying)',
  'A new lump or swelling anywhere on your body',
  'A sore that does not heal',
  'A mole that changes in size, shape, or color',
  'Blood in your stool, urine, or when coughing',
  'A cough that does not go away (especially with blood)',
  'Changes in bowel habits lasting more than a few weeks',
  'Difficulty swallowing that persists',
  'Unexplained bleeding or bruising',
  'Unexplained pain that does not go away',
  'A new or changing spot on your skin',
  'Persistent fatigue or night sweats',
  'Yellowing of skin or eyes (jaundice)',
  'Note: These symptoms do not necessarily mean you have cancer, but they should be checked by a doctor promptly.',
];

// ─── Appointment Checklist ──────────────────────────────────────────────────

export const APPOINTMENT_QUESTIONS: { category: string; questions: string[] }[] = [
  {
    category: 'About the diagnosis',
    questions: [
      'What type of cancer do I have?',
      'What stage is my cancer, and what does that mean?',
      'Has the cancer spread? If so, where?',
      'What is my specific cancer subtype, and does it affect treatment options?',
      'What gene or molecular tests have been or should be done?',
    ],
  },
  {
    category: 'About treatment',
    questions: [
      'What are my treatment options?',
      'What is the goal of treatment (cure, control, or comfort)?',
      'What treatment do you recommend, and why?',
      'What are the benefits of this treatment?',
      'What are the risks and side effects?',
      'Are there alternative treatments I should consider?',
      'How long will treatment take?',
      'Will I need to stay in the hospital, or can I be treated as an outpatient?',
    ],
  },
  {
    category: 'About daily life',
    questions: [
      'How will treatment affect my daily activities and work?',
      'Will I be able to care for myself, or will I need help?',
      'How will treatment affect my fertility (if relevant)?',
      'What should I eat or avoid during treatment?',
      'Can I exercise during treatment?',
      'Can I continue taking my current medications and supplements?',
      'How will we know if the treatment is working?',
    ],
  },
  {
    category: 'About support',
    questions: [
      'What support services are available (social work, counseling, nutrition)?',
      'Are there clinical trials I might be eligible for?',
      'How do I reach you or the team if I have questions or problems after hours?',
      'What symptoms should I call about immediately vs. wait until the next appointment?',
      'Can my family member or caregiver be present during appointments?',
      'What financial resources or assistance programs are available?',
    ],
  },
];

// ─── Urgent warning signs that require emergency care ───────────────────────

export const URGENT_KEYWORDS: string[] = [
  'chest pain', 'can\'t breathe', 'cannot breathe', 'difficulty breathing', 'trouble breathing',
  'suicidal', 'kill myself', 'want to die', 'end my life',
  'severe bleeding', 'won\'t stop bleeding', 'coughing up blood', 'vomiting blood',
  'passed out', 'fainted', 'unconscious', 'not responding',
  'stroke', 'face drooping', 'can\'t speak', 'slurred speech', 'weakness on one side',
  'severe pain', 'worst pain', 'unbearable pain',
  'seizure', 'convulsion',
];

export function isUrgentQuery(input: string): boolean {
  const lower = input.toLowerCase();
  return URGENT_KEYWORDS.some((keyword) => lower.includes(keyword));
}
