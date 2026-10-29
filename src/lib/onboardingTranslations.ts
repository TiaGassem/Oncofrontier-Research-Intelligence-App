// Copy for the public landing page and the onboarding wizard.
// English, French and Arabic are complete. Any other locale falls back to
// English for these surfaces (the rest of the interface keeps its own merge).
//
// NOTE: the fr/ar strings for these new surfaces are model-written and have not
// been reviewed by a native speaker or a medical translator. Existing module
// translations in lib/i18n.ts are unchanged.

import type { Language } from '@/types';
import type { ExperienceRole, WorkspaceDensity } from '@/lib/experience';

export interface SurfaceStrings {
  landing: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    ctaStart: string;
    ctaLearn: string;
    trustNote: string;
    capabilitiesTitle: string;
    capabilitiesLead: string;
    capabilities: { title: string; body: string }[];
    stepsTitle: string;
    steps: { title: string; body: string }[];
    twoWaysTitle: string;
    researchTitle: string;
    researchBody: string;
    patientTitle: string;
    patientBody: string;
    accessTitle: string;
    accessBody: string;
    integrityNote: string;
    footerDisclaimer: string;
    navAbout: string;
    navAccessibility: string;
    navHowItWorks: string;
    openApp: string;
    languageLabel: string;
  };
  onboarding: {
    stepLabel: string;
    languageTitle: string;
    languageLead: string;
    languageComplete: string;
    languagePartial: string;
    roleTitle: string;
    roleLead: string;
    roles: Record<ExperienceRole, { label: string; body: string }>;
    a11yTitle: string;
    a11yLead: string;
    a11yOptions: { key: A11yOptionKey; label: string; body: string }[];
    a11yNote: string;
    densityTitle: string;
    densityLead: string;
    densities: Record<WorkspaceDensity, { label: string; body: string }>;
    summaryTitle: string;
    summaryLead: string;
    summaryLanguage: string;
    summaryRole: string;
    summaryA11y: string;
    summaryDensity: string;
    summaryA11yNone: string;
    summaryA11yCount: string;
    back: string;
    next: string;
    finish: string;
    skipAll: string;
    changeLater: string;
    home: string;
    allModules: string;
    changeExperience: string;
  };
}

export type A11yOptionKey =
  | 'largeText'
  | 'highContrast'
  | 'reducedMotion'
  | 'nightMode'
  | 'listeningMode'
  | 'largeTargets'
  | 'voiceGuide'
  | 'dyslexia'
  | 'oneHanded';

const en: SurfaceStrings = {
  landing: {
    heroEyebrow: 'Independent research technology',
    heroTitle: 'Cancer research, explained clearly.',
    heroLead:
      'Published literature, clinical trials, drug and target data, and plain-language cancer education in one calm workspace — grounded in real sources you can open yourself.',
    ctaStart: 'Get started',
    ctaLearn: 'See how it works',
    trustNote: 'No account needed to explore. Every record links to its original source.',
    capabilitiesTitle: 'What you can do',
    capabilitiesLead: 'Four things OncoFrontiers is built to do well. Nothing fabricated.',
    capabilities: [
      { title: 'Search real evidence', body: 'Query PubMed, Europe PMC, ClinicalTrials.gov, Crossref and OpenAlex together, with duplicates removed.' },
      { title: 'Explore drugs and targets', body: 'Target–disease evidence from Open Targets and compound data from PubChem, with clinical-stage context.' },
      { title: 'Learn cancer anatomy', body: 'Browse body systems and organs, the cancers that arise there, and the warning signs worth acting on.' },
      { title: 'Ask in plain language', body: 'A patient-focused companion that explains terminology without diagnosing or predicting outcomes.' },
    ],
    stepsTitle: 'Set up in four short steps',
    steps: [
      { title: 'Choose your language', body: 'English, French and Arabic are fully translated. More are on the way.' },
      { title: 'Choose how you will use it', body: 'Researcher, clinician, patient, caregiver, industry, or general visitor.' },
      { title: 'Adjust accessibility', body: 'Optional. Text size, contrast, motion, listening mode and more.' },
      { title: 'Start exploring', body: 'Your workspace opens on the modules that matter most to you.' },
    ],
    twoWaysTitle: 'Two experiences, one platform',
    researchTitle: 'For researchers and clinicians',
    researchBody:
      'Evidence search, resistance mechanisms, biomarker context, global burden data and a research planner with exportable briefs. Sources and identifiers stay attached to every claim.',
    patientTitle: 'For patients, survivors and caregivers',
    patientBody:
      'Plain-language explanations, honest framing of survival statistics, questions to bring to an appointment, and a companion that never replaces your care team.',
    accessTitle: 'Accessibility is part of the product',
    accessBody:
      'Keyboard navigation, visible focus, screen-reader semantics, right-to-left layouts, reduced motion, high contrast and larger targets. Preferences apply immediately and can be changed at any time.',
    integrityNote:
      'OncoFrontiers is a research and education platform, not a medical device. It does not diagnose, treat or predict an individual outcome.',
    footerDisclaimer: 'Data belongs to its original sources. Scientific identifiers are never translated.',
    navAbout: 'About',
    navAccessibility: 'Accessibility',
    navHowItWorks: 'How it works',
    openApp: 'Open the app',
    languageLabel: 'Language',
  },
  onboarding: {
    stepLabel: 'Step {n} of {total}',
    languageTitle: 'Choose your language',
    languageLead: 'This sets the whole interface, text direction, and the language of replies where supported.',
    languageComplete: 'Complete interface',
    languagePartial: 'Core labels only',
    roleTitle: 'How will you use OncoFrontiers?',
    roleLead: 'This only changes which tools appear first. Everything stays available.',
    roles: {
      researcher: { label: 'Researcher or student', body: 'Literature search, evidence comparison, targets, resistance and planning.' },
      clinician: { label: 'Clinician or health professional', body: 'Evidence, biomarkers and reference material, with clinical disclaimers.' },
      patient: { label: 'Patient or survivor', body: 'Plain-language education, anatomy and the companion chat.' },
      caregiver: { label: 'Caregiver or family member', body: 'Understanding the diagnosis and preparing for appointments.' },
      industry: { label: 'Pharma or biotech', body: 'Targets, compounds, publications and research discovery.' },
      general: { label: 'Just exploring', body: 'A little of everything, starting with the basics.' },
    },
    a11yTitle: 'Make it comfortable',
    a11yLead: 'Optional. Skip this if the defaults suit you — you can change it later in the sidebar.',
    a11yOptions: [
      { key: 'largeText', label: 'Larger text', body: 'Increases base text size across the interface.' },
      { key: 'highContrast', label: 'Higher contrast', body: 'Stronger contrast and underlined links.' },
      { key: 'reducedMotion', label: 'Reduce motion', body: 'Removes animation and smooth scrolling.' },
      { key: 'nightMode', label: 'Dark mode', body: 'Dark surfaces for low-light reading.' },
      { key: 'listeningMode', label: 'Listening mode', body: 'Reads new content aloud where the browser supports it.' },
      { key: 'largeTargets', label: 'Larger controls', body: 'Bigger buttons and inputs, easier to tap.' },
      { key: 'voiceGuide', label: 'Voice guide', body: 'Announces page changes by voice.' },
      { key: 'dyslexia', label: 'Dyslexia-friendly text', body: 'Wider spacing and a simpler typeface.' },
      { key: 'oneHanded', label: 'One-handed layout', body: 'Extra room around floating controls.' },
    ],
    a11yNote: 'These are preferences, not categories. Combine them however you like.',
    densityTitle: 'Choose your workspace style',
    densityLead: 'How much detail the workspace shows at once.',
    densities: {
      simple: { label: 'Simple', body: 'Narrower reading width and fewer secondary details.' },
      standard: { label: 'Standard', body: 'The balanced default.' },
      advanced: { label: 'Advanced', body: 'Wider layout with secondary detail visible.' },
    },
    summaryTitle: 'You are ready',
    summaryLead: 'Check your choices, then start. You can change any of them later.',
    summaryLanguage: 'Language',
    summaryRole: 'Experience',
    summaryA11y: 'Accessibility',
    summaryDensity: 'Workspace',
    summaryA11yNone: 'Defaults',
    summaryA11yCount: '{n} enabled',
    back: 'Back',
    next: 'Continue',
    finish: 'Enter OncoFrontiers',
    skipAll: 'Skip and use defaults',
    changeLater: 'You can change all of this later from the sidebar.',
    home: 'Home',
    allModules: 'All modules',
    changeExperience: 'Change experience',
  },
};

const fr: SurfaceStrings = {
  landing: {
    heroEyebrow: 'Technologie de recherche indépendante',
    heroTitle: 'La recherche sur le cancer, expliquée clairement.',
    heroLead:
      'Littérature scientifique, essais cliniques, données sur les médicaments et les cibles, et éducation grand public en langage simple dans un espace de travail calme — appuyé sur de vraies sources que vous pouvez ouvrir vous-même.',
    ctaStart: 'Commencer',
    ctaLearn: 'Voir comment ça marche',
    trustNote: 'Aucun compte requis pour explorer. Chaque résultat renvoie à sa source originale.',
    capabilitiesTitle: 'Ce que vous pouvez faire',
    capabilitiesLead: 'Quatre choses que OncoFrontiers fait bien. Rien n’est inventé.',
    capabilities: [
      { title: 'Rechercher de vraies preuves', body: 'Interrogez PubMed, Europe PMC, ClinicalTrials.gov, Crossref et OpenAlex ensemble, sans doublons.' },
      { title: 'Explorer médicaments et cibles', body: 'Associations cible-maladie depuis Open Targets et données de composés depuis PubChem, avec le stade clinique.' },
      { title: 'Apprendre l’anatomie du cancer', body: 'Parcourez les systèmes et organes, les cancers qui y apparaissent et les signes d’alerte.' },
      { title: 'Poser une question simplement', body: 'Un compagnon pour les patients qui explique les termes sans diagnostiquer ni prédire.' },
    ],
    stepsTitle: 'Quatre étapes pour commencer',
    steps: [
      { title: 'Choisissez votre langue', body: 'Anglais, français et arabe sont entièrement traduits. D’autres arrivent.' },
      { title: 'Choisissez votre usage', body: 'Chercheur, clinicien, patient, proche, industrie ou visiteur.' },
      { title: 'Réglez l’accessibilité', body: 'Facultatif. Taille du texte, contraste, mouvement, mode écoute et plus.' },
      { title: 'Commencez à explorer', body: 'Votre espace s’ouvre sur les modules les plus utiles pour vous.' },
    ],
    twoWaysTitle: 'Deux expériences, une seule plateforme',
    researchTitle: 'Pour les chercheurs et cliniciens',
    researchBody:
      'Recherche de preuves, mécanismes de résistance, contexte des biomarqueurs, données mondiales et planificateur avec briefs exportables. Sources et identifiants restent attachés à chaque affirmation.',
    patientTitle: 'Pour les patients, survivants et proches',
    patientBody:
      'Explications en langage simple, statistiques de survie présentées honnêtement, questions à poser en consultation, et un compagnon qui ne remplace jamais votre équipe soignante.',
    accessTitle: 'L’accessibilité fait partie du produit',
    accessBody:
      'Navigation au clavier, focus visible, sémantique pour lecteurs d’écran, mise en page de droite à gauche, réduction des animations, contraste élevé et grandes cibles. Les préférences s’appliquent immédiatement.',
    integrityNote:
      'OncoFrontiers est une plateforme de recherche et d’éducation, pas un dispositif médical. Elle ne diagnostique, ne traite et ne prédit aucun résultat individuel.',
    footerDisclaimer: 'Les données appartiennent à leurs sources originales. Les identifiants scientifiques ne sont jamais traduits.',
    navAbout: 'À propos',
    navAccessibility: 'Accessibilité',
    navHowItWorks: 'Fonctionnement',
    openApp: 'Ouvrir l’application',
    languageLabel: 'Langue',
  },
  onboarding: {
    stepLabel: 'Étape {n} sur {total}',
    languageTitle: 'Choisissez votre langue',
    languageLead: 'Cela définit toute l’interface, le sens du texte et la langue des réponses lorsque c’est pris en charge.',
    languageComplete: 'Interface complète',
    languagePartial: 'Libellés principaux',
    roleTitle: 'Comment allez-vous utiliser OncoFrontiers ?',
    roleLead: 'Cela change seulement l’ordre des outils. Tout reste accessible.',
    roles: {
      researcher: { label: 'Chercheur ou étudiant', body: 'Recherche bibliographique, comparaison de preuves, cibles, résistance et planification.' },
      clinician: { label: 'Clinicien ou professionnel de santé', body: 'Preuves, biomarqueurs et références, avec les avertissements cliniques.' },
      patient: { label: 'Patient ou survivant', body: 'Éducation en langage simple, anatomie et chat compagnon.' },
      caregiver: { label: 'Proche ou famille', body: 'Comprendre le diagnostic et préparer les rendez-vous.' },
      industry: { label: 'Pharma ou biotech', body: 'Cibles, composés, publications et découverte de recherche.' },
      general: { label: 'Simple curiosité', body: 'Un peu de tout, en commençant par les bases.' },
    },
    a11yTitle: 'Rendez-le confortable',
    a11yLead: 'Facultatif. Ignorez cette étape si les réglages par défaut vous conviennent.',
    a11yOptions: [
      { key: 'largeText', label: 'Texte plus grand', body: 'Augmente la taille du texte dans toute l’interface.' },
      { key: 'highContrast', label: 'Contraste élevé', body: 'Contraste renforcé et liens soulignés.' },
      { key: 'reducedMotion', label: 'Réduire les animations', body: 'Supprime les animations et le défilement fluide.' },
      { key: 'nightMode', label: 'Mode sombre', body: 'Surfaces sombres pour lire dans la pénombre.' },
      { key: 'listeningMode', label: 'Mode écoute', body: 'Lit le contenu à voix haute si le navigateur le permet.' },
      { key: 'largeTargets', label: 'Contrôles plus grands', body: 'Boutons et champs plus faciles à toucher.' },
      { key: 'voiceGuide', label: 'Guide vocal', body: 'Annonce les changements de page à voix haute.' },
      { key: 'dyslexia', label: 'Texte adapté à la dyslexie', body: 'Espacement plus large et police simplifiée.' },
      { key: 'oneHanded', label: 'Mise en page à une main', body: 'Plus d’espace autour des contrôles flottants.' },
    ],
    a11yNote: 'Ce sont des préférences, pas des catégories. Combinez-les librement.',
    densityTitle: 'Choisissez le style de votre espace',
    densityLead: 'La quantité de détail affichée à la fois.',
    densities: {
      simple: { label: 'Simple', body: 'Largeur de lecture réduite et moins de détails secondaires.' },
      standard: { label: 'Standard', body: 'L’équilibre par défaut.' },
      advanced: { label: 'Avancé', body: 'Mise en page large avec les détails secondaires visibles.' },
    },
    summaryTitle: 'Tout est prêt',
    summaryLead: 'Vérifiez vos choix, puis commencez. Vous pourrez tout modifier plus tard.',
    summaryLanguage: 'Langue',
    summaryRole: 'Expérience',
    summaryA11y: 'Accessibilité',
    summaryDensity: 'Espace de travail',
    summaryA11yNone: 'Par défaut',
    summaryA11yCount: '{n} activées',
    back: 'Retour',
    next: 'Continuer',
    finish: 'Entrer dans OncoFrontiers',
    skipAll: 'Ignorer et utiliser les valeurs par défaut',
    changeLater: 'Vous pourrez modifier tout cela plus tard depuis la barre latérale.',
    home: 'Accueil',
    allModules: 'Tous les modules',
    changeExperience: 'Changer d’expérience',
  },
};

const ar: SurfaceStrings = {
  landing: {
    heroEyebrow: 'تقنية بحثية مستقلة',
    heroTitle: 'أبحاث السرطان، بشرح واضح.',
    heroLead:
      'المنشورات العلمية والتجارب السريرية وبيانات الأدوية والأهداف والتثقيف الصحي بلغة مبسطة في مساحة عمل هادئة واحدة — مبنية على مصادر حقيقية يمكنك فتحها بنفسك.',
    ctaStart: 'ابدأ الآن',
    ctaLearn: 'كيف يعمل',
    trustNote: 'لا حاجة إلى حساب للاستكشاف. كل نتيجة مرتبطة بمصدرها الأصلي.',
    capabilitiesTitle: 'ما يمكنك فعله',
    capabilitiesLead: 'أربعة أشياء يتقنها OncoFrontiers. لا شيء مُختلق.',
    capabilities: [
      { title: 'ابحث في أدلة حقيقية', body: 'ابحث معًا في PubMed وEurope PMC وClinicalTrials.gov وCrossref وOpenAlex دون تكرار.' },
      { title: 'استكشف الأدوية والأهداف', body: 'ارتباطات الهدف بالمرض من Open Targets وبيانات المركبات من PubChem مع المرحلة السريرية.' },
      { title: 'تعلّم تشريح السرطان', body: 'تصفح الأجهزة والأعضاء والسرطانات التي تنشأ فيها وعلامات الإنذار المهمة.' },
      { title: 'اسأل بلغة بسيطة', body: 'رفيق للمرضى يشرح المصطلحات دون تشخيص أو تنبؤ بالنتائج.' },
    ],
    stepsTitle: 'أربع خطوات قصيرة للبدء',
    steps: [
      { title: 'اختر لغتك', body: 'الإنجليزية والفرنسية والعربية مترجمة بالكامل. والمزيد قادم.' },
      { title: 'اختر طريقة استخدامك', body: 'باحث، طبيب، مريض، مرافق، قطاع صناعي، أو زائر عام.' },
      { title: 'اضبط إمكانية الوصول', body: 'اختياري. حجم النص والتباين والحركة ووضع الاستماع والمزيد.' },
      { title: 'ابدأ الاستكشاف', body: 'تُفتح مساحة عملك على الوحدات الأهم بالنسبة لك.' },
    ],
    twoWaysTitle: 'تجربتان في منصة واحدة',
    researchTitle: 'للباحثين والأطباء',
    researchBody:
      'البحث في الأدلة وآليات المقاومة وسياق الواسمات الحيوية وبيانات العبء العالمي ومخطط بحثي بمخلصات قابلة للتصدير. تبقى المصادر والمعرّفات مرتبطة بكل عبارة.',
    patientTitle: 'للمرضى والناجين والمرافقين',
    patientBody:
      'شروحات بلغة بسيطة وعرض أمين لإحصائيات البقاء وأسئلة تُطرح في الموعد الطبي ورفيق لا يحل أبدًا محل فريق رعايتك.',
    accessTitle: 'إمكانية الوصول جزء من المنتج',
    accessBody:
      'التنقل بلوحة المفاتيح وتركيز مرئي ودلالات لقارئات الشاشة وتخطيط من اليمين إلى اليسار وتقليل الحركة وتباين عالٍ وأهداف أكبر. تُطبَّق التفضيلات فورًا.',
    integrityNote:
      'OncoFrontiers منصة بحث وتعليم وليست جهازًا طبيًا. لا تشخّص ولا تعالج ولا تتنبأ بنتيجة فردية.',
    footerDisclaimer: 'البيانات ملك لمصادرها الأصلية. لا تُترجم المعرّفات العلمية أبدًا.',
    navAbout: 'حول',
    navAccessibility: 'إمكانية الوصول',
    navHowItWorks: 'كيف يعمل',
    openApp: 'افتح التطبيق',
    languageLabel: 'اللغة',
  },
  onboarding: {
    stepLabel: 'الخطوة {n} من {total}',
    languageTitle: 'اختر لغتك',
    languageLead: 'يحدد هذا الواجهة كاملة واتجاه النص ولغة الردود حيثما كان مدعومًا.',
    languageComplete: 'واجهة كاملة',
    languagePartial: 'التسميات الأساسية فقط',
    roleTitle: 'كيف ستستخدم OncoFrontiers؟',
    roleLead: 'يغيّر هذا ترتيب الأدوات فقط. يبقى كل شيء متاحًا.',
    roles: {
      researcher: { label: 'باحث أو طالب', body: 'البحث في المنشورات ومقارنة الأدلة والأهداف والمقاومة والتخطيط.' },
      clinician: { label: 'طبيب أو مختص صحي', body: 'الأدلة والواسمات الحيوية والمراجع مع التنبيهات السريرية.' },
      patient: { label: 'مريض أو ناجٍ', body: 'تثقيف بلغة بسيطة والتشريح ومحادثة الرفيق.' },
      caregiver: { label: 'مرافق أو أحد أفراد الأسرة', body: 'فهم التشخيص والاستعداد للمواعيد.' },
      industry: { label: 'الصناعة الدوائية أو التقنية الحيوية', body: 'الأهداف والمركبات والمنشورات واكتشاف البحث.' },
      general: { label: 'للاستكشاف فقط', body: 'قليل من كل شيء، بدءًا بالأساسيات.' },
    },
    a11yTitle: 'اجعلها مريحة',
    a11yLead: 'اختياري. تخطَّ هذه الخطوة إذا كانت الإعدادات الافتراضية مناسبة.',
    a11yOptions: [
      { key: 'largeText', label: 'نص أكبر', body: 'يزيد حجم النص في الواجهة كاملة.' },
      { key: 'highContrast', label: 'تباين أعلى', body: 'تباين أقوى وروابط مسطّرة.' },
      { key: 'reducedMotion', label: 'تقليل الحركة', body: 'يزيل الحركات والتمرير السلس.' },
      { key: 'nightMode', label: 'الوضع الداكن', body: 'أسطح داكنة للقراءة في الإضاءة المنخفضة.' },
      { key: 'listeningMode', label: 'وضع الاستماع', body: 'يقرأ المحتوى بصوت عالٍ إذا كان المتصفح يدعم ذلك.' },
      { key: 'largeTargets', label: 'عناصر تحكم أكبر', body: 'أزرار وحقول أكبر وأسهل في اللمس.' },
      { key: 'voiceGuide', label: 'دليل صوتي', body: 'يعلن تغيّر الصفحات بالصوت.' },
      { key: 'dyslexia', label: 'نص مناسب لعسر القراءة', body: 'تباعد أوسع وخط أبسط.' },
      { key: 'oneHanded', label: 'تخطيط بيد واحدة', body: 'مساحة إضافية حول العناصر العائمة.' },
    ],
    a11yNote: 'هذه تفضيلات وليست تصنيفات. اجمعها كما تريد.',
    densityTitle: 'اختر نمط مساحة عملك',
    densityLead: 'مقدار التفاصيل المعروضة في وقت واحد.',
    densities: {
      simple: { label: 'بسيط', body: 'عرض قراءة أضيق وتفاصيل ثانوية أقل.' },
      standard: { label: 'قياسي', body: 'التوازن الافتراضي.' },
      advanced: { label: 'متقدم', body: 'تخطيط أوسع مع إظهار التفاصيل الثانوية.' },
    },
    summaryTitle: 'كل شيء جاهز',
    summaryLead: 'راجع اختياراتك ثم ابدأ. يمكنك تغيير أي منها لاحقًا.',
    summaryLanguage: 'اللغة',
    summaryRole: 'التجربة',
    summaryA11y: 'إمكانية الوصول',
    summaryDensity: 'مساحة العمل',
    summaryA11yNone: 'الإعدادات الافتراضية',
    summaryA11yCount: '{n} مُفعّلة',
    back: 'رجوع',
    next: 'متابعة',
    finish: 'ادخل إلى OncoFrontiers',
    skipAll: 'تخطَّ واستخدم الإعدادات الافتراضية',
    changeLater: 'يمكنك تغيير كل هذا لاحقًا من الشريط الجانبي.',
    home: 'الرئيسية',
    allModules: 'كل الوحدات',
    changeExperience: 'تغيير التجربة',
  },
};

const SURFACES: Partial<Record<Language, SurfaceStrings>> = { en, fr, ar };

export function getSurfaceStrings(language: Language): SurfaceStrings {
  return SURFACES[language] ?? en;
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  );
}
