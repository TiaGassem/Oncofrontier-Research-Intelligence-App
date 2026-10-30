import type { Language } from '@/types';
import { companionEn, companionFr, companionAr } from '@/lib/companionTranslations';
import { libraryEn, libraryFr, libraryAr, pdfEn, pdfFr, pdfAr, methodologyEn, methodologyFr, methodologyAr, dataSourceStatusEn, dataSourceStatusFr, dataSourceStatusAr } from '@/lib/extraTranslations';
import { coreTranslations } from '@/lib/coreTranslations';
import { eyeComfortTranslations } from '@/lib/eyeComfortTranslations';
import { chatUiTranslations, chatUiEn, type ChatUiStrings } from '@/lib/chatUiTranslations';

export interface Translation {
  direction: 'ltr' | 'rtl';
  nav: {
    dashboard: string;
    discovery: string;
    curemap: string;
    resistance: string;
    equity: string;
    burden: string;
    biomarkers: string;
    anatomy: string;
    companion: string;
    planner: string;
    assistant: string;
    pdf: string;
    library: string;
    methodology: string;
    account: string;
    modules: string;
  };
  common: {
    search: string;
    loading: string;
    loadingHint: string;
    errorTitle: string;
    errorMessage: string;
    retry: string;
    emptyTitle: string;
    emptyMessage: string;
    view: string;
    copied: string;
    copy: string;
    saved: string;
    download: string;
    clearAll: string;
    examples: string;
    filters: string;
    onePerLine: string;
    errorBoundaryMessage: string;
    reloadApp: string;
    backToDashboard: string;
    skipToContent: string;
  };
  dashboard: {
    badge: string;
    title: string;
    subtitle: string;
    askAssistant: string;
    sources: string;
    sourcesDesc: string;
    modules: string;
    tools: string;
    recordsInPlanner: string;
    dataSources: string;
    languages: string;
    disclaimer: string;
  };
  resistance: {
    title: string;
    subtitle: string;
    howItWorks: string;
    howItWorksBody: string;
    scenarios: string;
    exampleBreast: string;
    exampleLung: string;
    exampleGbm: string;
    exampleProstate: string;
    exampleMelanoma: string;
    exampleColorectal: string;
    cancerType: string;
    gene: string;
    therapy: string;
    searchPlaceholder: string;
    genePlaceholder: string;
    therapyPlaceholder: string;
    searchButton: string;
    searchHint: string;
    selectedFor: string;
    viewPlanner: string;
    emptyTitle: string;
    emptyMessage: string;
    noResultsTitle: string;
    noResultsMessage: string;
    someErrors: string;
    recordsFound: string;
  };
  curemap: {
    title: string;
    subtitle: string;
    placeholder: string;
    searchLabel: string;
    filterSourceLabel: string;
    filterTypeLabel: string;
    selectedFor: string;
    viewPlanner: string;
    emptyTitle: string;
    emptyMessage: string;
    recordsRetrieved: string;
    allSources: string;
    allTypes: string;
    publications: string;
    trials: string;
    publicationsLabel: string;
    trialsLabel: string;
    noMatchTitle: string;
    noMatchMessage: string;
    someErrors: string;
    noMatchMessage2: string;
    queryLabel: string;
    retrievedAt: string;
    sourcesSearched: string;
  };
  equity: {
    title: string;
    subtitle: string;
    howItWorks: string;
    howItWorksBody: string;
    cancerType: string;
    analyze: string;
    comparison: string;
    comparisonNote: string;
    generate: string;
    loadingCompare: string;
    loadingAnalyze: string;
    noCompareTitle: string;
    noCompareMessage: string;
    pubsChart: string;
    trialsChart: string;
    chartNote: string;
    pubsStat: string;
    trialsStat: string;
    totalFor: string;
    ctResultsFor: string;
    recentTrials: string;
    recentPubs: string;
    startTitle: string;
    startMessage: string;
    selectedFor: string;
    viewPlanner: string;
    queryLabel: string;
    retrievedAt: string;
    sourceNote: string;
  };
  discovery: {
    title: string;
    subtitle: string;
    disclaimer: string;
    cancerType: string;
    gene: string;
    drug: string;
    researchQuestion: string;
    cancerPlaceholder: string;
    genePlaceholder: string;
    drugPlaceholder: string;
    questionPlaceholder: string;
    smilesLabel: string;
    smilesPlaceholder: string;
    validate: string;
    smilesNote: string;
    investigate: string;
    investigating: string;
    loadingMessage: string;
    emptyTitle: string;
    emptyMessage: string;
    queryLabel: string;
    retrievedAt: string;
    targetSection: string;
    compoundSection: string;
    moleculeSection: string;
    moleculeInfo: string;
    moleculeHandoff: string;
    moleculeEmpty: string;
    moleculeWarning: string;
    resistanceSection: string;
    publications: string;
    trials: string;
    validationSection: string;
    copyMd: string;
    downloadBrief: string;
    selectedFor: string;
    viewPlanner: string;
    tractability: string;
    modalitySm: string;
    modalityAb: string;
    modalityPr: string;
    modalityOc: string;
    cancerAssoc: string;
    drugCandidates: string;
    safetyLiabilities: string;
    scoreNote: string;
    otherAssoc: string;
    stage: string;
    rationaleTitle: string;
    evidenceTitle: string;
    validationTitle: string;
    hypothesisTitle: string;
    missingTitle: string;
    controlsTitle: string;
    rationaleCancer: string;
    rationaleTarget: string;
    rationaleCompound: string;
    rationaleQuestion: string;
    rationaleEmpty: string;
  };
  planner: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyMessage: string;
    goToCuremap: string;
    goToResistance: string;
    selectedRecords: string;
    clearAll: string;
    briefDetails: string;
    researchQuestion: string;
    questionPlaceholder: string;
    cancerContext: string;
    autoDetected: string;
    contextPlaceholder: string;
    findings: string;
    findingsPlaceholder: string;
    limitations: string;
    limitationsPlaceholder: string;
    unanswered: string;
    unansweredPlaceholder: string;
    proposedNext: string;
    proposedPlaceholder: string;
    hypothesisNote: string;
    briefPreview: string;
    copyMd: string;
    download: string;
    copied: string;
    saved: string;
    recordsInBrief: string;
    generated: string;
    questionLabel: string;
    contextLabel: string;
    evidenceLabel: string;
    findingsLabel: string;
    limitationsLabel: string;
    unansweredLabel: string;
    proposedLabel: string;
    referencesLabel: string;
    more: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    transparencyBanner: string;
    explanationLevel: string;
    levelPublic: string;
    levelPublicDesc: string;
    levelStudent: string;
    levelStudentDesc: string;
    levelResearcher: string;
    levelResearcherDesc: string;
    levelClinical: string;
    levelClinicalDesc: string;
    inPlanner: string;
    emptyTitle: string;
    emptyMessage: string;
    searching: string;
    inputPlaceholder: string;
    send: string;
    sourcesCount: string;
    addToPlanner: string;
    view: string;
    moreSources: string;
  };
  auth: {
    subtitle: string;
    signIn: string;
    createAccount: string;
    email: string;
    password: string;
    passwordHint: string;
    pleaseWait: string;
    privacyNote: string;
    guest: string;
    guestNote: string;
    prototypeNote: string;
  };
  recordCard: {
    clinicalTrial: string;
    publication: string;
    open: string;
    free: string;
    restricted: string;
    conditions: string;
    interventions: string;
    enrollment: string;
    sites: string;
    moreSites: string;
    showAbstract: string;
    hideAbstract: string;
    viewOn: string;
    select: string;
    deselect: string;
    selectedTitle: string;
    addTitle: string;
  };
  states: {
    loadingDefault: string;
    loadingHint: string;
    errorTitle: string;
    errorMessage: string;
    retry: string;
    emptyTitle: string;
    emptyMessage: string;
  };
  displayOptions: {
    presetsTitle: string;
    presetParalysis: string;
    presetParalysisHint: string;
    presetBlindness: string;
    presetBlindnessHint: string;
    presetLowVision: string;
    presetLowVisionHint: string;
    presetDyslexia: string;
    presetDyslexiaHint: string;
    themeTitle: string;
    nightMode: string;
    nightModeHint: string;
    blueLightFilter: string;
    blueLightHint: string;
    visualTitle: string;
    largeText: string;
    largeTextHint: string;
    highContrast: string;
    highContrastHint: string;
    daltonism: string;
    daltonismHint: string;
    readingMode: string;
    readingModeHint: string;
    dyslexiaMode: string;
    dyslexiaModeHint: string;
    motorTitle: string;
    listeningMode: string;
    listeningModeHint: string;
    voiceGuide: string;
    voiceGuideHint: string;
    voiceGuideAnnouncement: string;
    largeTargets: string;
    largeTargetsHint: string;
    quickPhrases: string;
    quickPhrasesHint: string;
    oneHanded: string;
    oneHandedHint: string;
    reducedMotion: string;
    reducedMotionHint: string;
    chartNote: string;
    reset: string;
    menuLabel: string;
    // Eye Comfort & Display Protection
    followSystem: string;
    followSystemHint: string;
    warmIntensity: string;
    warmIntensityHint: string;
    warmSchedule: string;
    warmScheduleHint: string;
    warmFrom: string;
    warmTo: string;
    colorAccuracyWarning: string;
    breakTitle: string;
    breakReminders: string;
    breakRemindersHint: string;
    breakInterval: string;
    breakMessage: string;
    breakDismiss: string;
    uvTitle: string;
    uvIntro: string;
    uvVsBlueLight: string;
    uvGuidanceTitle: string;
    uvClothing: string;
    uvShade: string;
    uvSunglasses: string;
    uvSunscreen: string;
    uvFiltersNotProtection: string;
    uvScreensNotSun: string;
  };
  accessible: {
    languageTitle: string;
    interfaceLanguages: string;
    interfaceNote: string;
    moreLanguages: string;
    aiNote: string;
    limitedVoice: string;
  };
  sidebar: {
    home: string;
    allModules: string;
    changeExperience: string;
    openMenu: string;
    closeMenu: string;
    signIn: string;
    signOut: string;
    disclaimer: string;
  };
  biomarkers: {
    title: string;
    subtitle: string;
    allCategories: string;
    searchPlaceholder: string;
    noResults: string;
    disclaimer: string;
    biomarker: string;
    category: string;
    cancerType: string;
    gene: string;
    positivity: string;
    positivityRate: string;
    prognosis: string;
    testingMethod: string;
    assayType: string;
    clinicalSignificance: string;
    therapeuticRelevance: string;
    source: string;
    predictive: string;
    diagnostic: string;
    unknown: string;
    favorable: string;
    unfavorable: string;
  };
  anatomy: {
    title: string;
    subtitle: string;
    systems: string;
    organ: string;
    function: string;
    earlySigns: string;
    riskFactors: string;
    commonCancers: string;
    statistics: string;
    dataSource: string;
    disclaimer: string;
    whoRegionMostAffected: string;
    anatomy: string;
    systemLabels: Record<string, string>;
  };
  burden: {
    title: string;
    subtitle: string;
    globalOverview: string;
    newCases: string;
    totalCases: string;
    totalDeaths: string;
    fiveYearPrevalence: string;
    incidenceRate: string;
    mortalityRate: string;
    topCancers: string;
    cancerRanking: string;
    cancerType: string;
    cases: string;
    deaths: string;
    deaths2: string;
    rank: string;
    prevalence: string;
    regionComparison: string;
    byRegion: string;
    worldwide: string;
    africa: string;
    americas: string;
    europe: string;
    easternMed: string;
    southEastAsia: string;
    westernPacific: string;
    dataSource: string;
    disclaimer: string;
  };
  companion: Record<string, string>;
  pdf: Record<string, string>;
  library: Record<string, string>;
  methodology: Record<string, string>;
  dataSourceStatus: Record<string, string>;
  chatUi: ChatUiStrings;
}

export const translations: Record<'en' | 'fr' | 'ar', Translation> = {
  en: {
    direction: 'ltr',
    nav: {
      dashboard: 'Dashboard',
      discovery: 'Drug Discovery',
      curemap: 'Evidence Search',
      resistance: 'Treatment Resistance',
      equity: 'Cancer Equity',
      burden: 'Cancer Statistics',
      biomarkers: 'Biomarkers',
      anatomy: 'Cancer Types & Biology',
      companion: 'Companion Chat',
      planner: 'Research Planner',
      assistant: 'AI Research Assistant',
      pdf: 'PDF Reader',
      library: 'Saved Articles & Notes',
      methodology: 'Research Methods',
      account: 'Account',
      modules: 'Research Modules',
    },
    common: {
      search: 'Search',
      loading: 'Searching real research databases…',
      loadingHint: 'This may take a few seconds',
      errorTitle: 'Something went wrong',
      errorMessage: 'An error occurred while fetching data. Please try again.',
      retry: 'Try Again',
      emptyTitle: 'No results yet',
      emptyMessage: 'Enter search terms above to retrieve real research records.',
      view: 'View',
      copied: 'Copied!',
      copy: 'Copy',
      saved: 'Saved!',
      download: 'Download',
      clearAll: 'Clear all',
      examples: 'Examples:',
      filters: 'Filters',
      onePerLine: '(one per line)',
      errorBoundaryMessage: 'The page hit an unexpected error. Your saved data is safe. You can reload, or return to the dashboard.',
      reloadApp: 'Reload the app',
      backToDashboard: 'Back to dashboard',
      skipToContent: 'Skip to main content',
    },
    dashboard: {
      badge: 'Pan-Cancer Research Intelligence',
      title: 'Explore credible cancer research, understand evidence, and formulate better questions.',
      subtitle:
        'ONCOFRONTIER retrieves real publications and clinical trials from PubMed, Europe PMC, and ClinicalTrials.gov. No fabricated data, no invented citations — every result traces back to a verifiable source.',
      askAssistant: 'Ask the Research Assistant',
      sources: 'Connected Data Sources',
      sourcesDesc: 'Live APIs maintained by NCBI, EMBL-EBI, and the U.S. National Library of Medicine',
      modules: 'Research Modules',
      tools: 'Productivity Tools',
      recordsInPlanner: 'Records in planner',
      dataSources: 'Data source',
      languages: 'Full interface translations',
      disclaimer:
        'Disclaimer: ONCOFRONTIER is a research discovery prototype. It retrieves and displays real records from public research databases. It is not a clinical decision-support product, does not provide medical advice, and has not discovered a cancer cure. Always consult qualified healthcare professionals for medical decisions.',
    },
    resistance: {
      title: 'Resistance Atlas — Treatment Resistance',
      subtitle: 'Explore reported treatment-resistance mechanisms with supporting publications',
      howItWorks: 'How this module works',
      howItWorksBody:
        'Select a cancer type, target gene, and therapy to retrieve publications about treatment-resistance mechanisms. Results come from real PubMed and Europe PMC searches filtered for resistance-related terms. ONCOFRONTIER does not invent mechanisms or recommend unvalidated treatment combinations.',
      scenarios: 'Common resistance scenarios:',
      exampleBreast: 'Breast cancer CDK4/6 resistance',
      exampleLung: 'Lung cancer EGFR T790M resistance',
      exampleGbm: 'Glioblastoma temozolomide resistance',
      exampleProstate: 'Prostate cancer enzalutamide resistance',
      exampleMelanoma: 'Melanoma BRAF inhibitor resistance',
      exampleColorectal: 'Colorectal cancer cetuximab resistance',
      cancerType: 'Cancer Type',
      gene: 'Target Gene',
      therapy: 'Therapy / Drug',
      searchPlaceholder: 'e.g. Breast cancer',
      genePlaceholder: 'e.g. EGFR, CDK4',
      therapyPlaceholder: 'e.g. temozolomide',
      searchButton: 'Search Resistance Literature',
      searchHint: 'Searching resistance literature…',
      selectedFor: 'record(s) selected for Action Planner',
      viewPlanner: 'View Planner →',
      emptyTitle: 'Explore treatment resistance mechanisms',
      emptyMessage:
        'Select a common resistance scenario above or enter your own cancer type, gene, and therapy to retrieve relevant publications.',
      noResultsTitle: 'No resistance publications found',
      noResultsMessage: 'Try different search terms or a different cancer type.',
      someErrors: 'Some sources returned errors:',
      recordsFound: 'records about treatment resistance',
    },
    curemap: {
      title: 'CUREMAP — Evidence Explorer',
      subtitle:
        'Search real publications and clinical trials across PubMed, Europe PMC, and ClinicalTrials.gov',
      placeholder: 'e.g. Breast cancer CDK4/6 inhibitor resistance',
      searchLabel: 'Search cancer research',
      filterSourceLabel: 'Filter by source',
      filterTypeLabel: 'Filter by record type',
      selectedFor: 'record(s) selected for Action Planner',
      viewPlanner: 'View Planner →',
      emptyTitle: 'Search for cancer research evidence',
      emptyMessage:
        'Enter a cancer type, gene, drug, or research question above. Results are retrieved in real time from PubMed, Europe PMC, and ClinicalTrials.gov.',
      recordsRetrieved: 'records retrieved',
      allSources: 'All sources',
      allTypes: 'All types',
      publications: 'Publications',
      trials: 'Trials',
      publicationsLabel: 'publications,',
      trialsLabel: 'trials',
      noMatchTitle: 'No records match your filters',
      noMatchMessage: 'Try adjusting the source or type filters above.',
      someErrors: 'Some sources returned errors:',
      noMatchMessage2: 'Results from other sources are shown below.',
      queryLabel: 'Query:',
      retrievedAt: 'Retrieved at',
      sourcesSearched: 'Sources searched:',
    },
    equity: {
      title: 'Cancer Equity Radar — Research Gaps',
      subtitle: 'Compare publication and trial activity across cancer types from real API counts',
      howItWorks: 'What this module shows',
      howItWorksBody:
        'This radar retrieves real publication counts from PubMed and registered trial counts from ClinicalTrials.gov for different cancer types. It does not fabricate statistics, and it does not claim that low result counts prove a cancer is neglected — counts reflect search API results, not the full research landscape.',
      cancerType: 'Cancer Type',
      analyze: 'Analyze',
      comparison: 'Cross-Cancer Comparison',
      comparisonNote: 'Real PubMed publication counts and ClinicalTrials.gov trial counts',
      generate: 'Generate Comparison',
      loadingCompare: 'Querying PubMed and ClinicalTrials.gov for 10 cancer types…',
      loadingAnalyze: 'Analyzing',
      noCompareTitle: 'No comparison data yet',
      noCompareMessage:
        "Click 'Generate Comparison' to retrieve real publication and trial counts for 10 common cancer types.",
      pubsChart: 'PubMed Publications',
      trialsChart: 'Registered Clinical Trials',
      chartNote:
        'Counts reflect PubMed and ClinicalTrials.gov API search results at query time. These are not comprehensive research investment figures and should not be interpreted as proof of neglect or prioritization.',
      pubsStat: 'PubMed Publications',
      trialsStat: 'Registered Trials',
      totalFor: 'Total results for',
      ctResultsFor: 'ClinicalTrials.gov results for',
      recentTrials: 'Recent Registered Trials',
      recentPubs: 'Recent Publications',
      startTitle: 'Start exploring research activity',
      startMessage:
        'Search for a specific cancer type above or generate a cross-cancer comparison to see real publication and trial counts.',
      selectedFor: 'record(s) selected for Action Planner',
      viewPlanner: 'View Planner →',
      queryLabel: 'Query:',
      retrievedAt: 'Retrieved at',
      sourceNote: 'Source: PubMed E-utilities + ClinicalTrials.gov API v2',
    },
    discovery: {
      title: 'Discovery Bridge — Cancer Drug Discovery',
      subtitle: 'Evidence-backed target assessment, compound lookup, and translational validation planning',
      disclaimer:
        'A compound appearing in a database does not establish that it is effective or safe as a cancer treatment. Open Targets scores are database annotations, not probabilities of drug success, proof of causality, or clinical validation. Molecular generation is marked "Not connected yet" — structure lookup and handoff are functional.',
      cancerType: 'Cancer Type or Subtype',
      gene: 'Gene / Protein / Target',
      drug: 'Known Drug or Compound',
      researchQuestion: 'Research Question',
      cancerPlaceholder: 'e.g. Breast cancer, Glioblastoma',
      genePlaceholder: 'e.g. EGFR, CDK4, BRAF',
      drugPlaceholder: 'e.g. temozolomide, gefitinib',
      questionPlaceholder: 'e.g. resistance mechanisms',
      smilesLabel: 'Molecular Structure (SMILES) — optional',
      smilesPlaceholder: 'e.g. CN1C(=O)N=C2C(=N1)N(C)C=N2',
      validate: 'Validate',
      smilesNote:
        'Database absence does not prove novelty. A valid SMILES does not establish drug-likeness, safety, or efficacy.',
      investigate: 'Investigate',
      investigating: 'Investigating…',
      loadingMessage: 'Querying Open Targets, PubChem, PubMed, and ClinicalTrials.gov…',
      emptyTitle: 'Start a discovery investigation',
      emptyMessage:
        'Enter a cancer type, gene target, drug/compound, or SMILES above. Results come from Open Targets Platform, PubChem, PubMed, Europe PMC, and ClinicalTrials.gov.',
      queryLabel: 'Query:',
      retrievedAt: 'Retrieved at',
      targetSection: 'Target Assessment (Open Targets Platform)',
      compoundSection: 'Compound Information (PubChem)',
      moleculeSection: 'Molecule Explorer',
      moleculeInfo:
        'Structure lookup from PubChem is functional. De novo molecular generation, docking, molecular dynamics, and ADMET prediction are not connected yet.',
      moleculeHandoff: 'A structured handoff for computational chemistry tools would include:',
      moleculeEmpty: 'Enter a SMILES or compound name above to retrieve structural data.',
      moleculeWarning:
        'A valid SMILES does not establish drug-likeness, synthesis feasibility, selectivity, biological activity, safety, or therapeutic efficacy.',
      resistanceSection: 'Resistance Context',
      publications: 'Publications',
      trials: 'Clinical Trials',
      validationSection: 'Translational Validation Planner',
      copyMd: 'Copy MD',
      downloadBrief: 'Download Brief',
      selectedFor: 'record(s) selected for Action Planner',
      viewPlanner: 'View Planner →',
      tractability: 'Tractability',
      modalitySm: 'Small Molecule',
      modalityAb: 'Antibody',
      modalityPr: 'Proteolysis-targeting chimera (PROTAC)',
      modalityOc: 'Other Modalities',
      cancerAssoc: 'Cancer Associations',
      drugCandidates: 'Drug & Clinical Candidates',
      safetyLiabilities: 'Safety Liabilities',
      scoreNote:
        'Scores are Open Targets database annotations representing evidence strength across data types. They are not probabilities of drug success, proof of causality, or clinical validation.',
      otherAssoc: 'non-cancer disease associations',
      stage: 'Stage',
      rationaleTitle: 'Biological Rationale',
      evidenceTitle: 'Evidence Level & Limitations',
      validationTitle: 'Proposed Validation Stages',
      hypothesisTitle: 'HYPOTHESIS — Not a reported result',
      missingTitle: 'Missing Information',
      controlsTitle: 'Essential Controls & Confounders',
      rationaleCancer: 'Cancer type',
      rationaleTarget: 'Molecular target',
      rationaleCompound: 'Compound',
      rationaleQuestion: 'Research question',
      rationaleEmpty: 'No search parameters provided.',
    },
    planner: {
      title: 'Research Action Planner',
      subtitle: 'Build a structured research brief from selected records',
      emptyTitle: 'No records selected yet',
      emptyMessage:
        'Use CUREMAP, Resistance Atlas, or the Equity Radar to search for research records. Click the + button on any result to add it here.',
      goToCuremap: 'Go to CUREMAP',
      goToResistance: 'Go to Resistance Atlas',
      selectedRecords: 'Selected Records',
      clearAll: 'Clear all',
      briefDetails: 'Brief Details',
      researchQuestion: 'Research Question',
      questionPlaceholder:
        'e.g. What mechanisms drive CDK4/6 inhibitor resistance in breast cancer?',
      cancerContext: 'Cancer Context',
      autoDetected: '(auto-detected)',
      contextPlaceholder: 'Cancer type, targets, therapies...',
      findings: 'Source-Supported Findings',
      findingsPlaceholder: "Findings you've identified from the selected records...",
      limitations: 'Evidence Limitations',
      limitationsPlaceholder: 'e.g. Most studies are preclinical\nSmall sample sizes...',
      unanswered: 'Unanswered Questions',
      unansweredPlaceholder: 'Questions that remain open...',
      proposedNext: 'Proposed Next Steps — HYPOTHESIS',
      proposedPlaceholder: 'Proposed experiments or validation studies...',
      hypothesisNote:
        'These are hypotheses, not validated findings. Label clearly in any derivative work.',
      briefPreview: 'Brief Preview',
      copyMd: 'Copy MD',
      download: 'Download',
      copied: 'Copied!',
      saved: 'Saved!',
      recordsInBrief: 'Records in Brief',
      generated: 'Generated:',
      questionLabel: 'Question:',
      contextLabel: 'Context:',
      evidenceLabel: 'Evidence:',
      findingsLabel: 'Findings:',
      limitationsLabel: 'Limitations:',
      unansweredLabel: 'Unanswered:',
      proposedLabel: 'Proposed Next Steps (HYPOTHESIS):',
      referencesLabel: 'References',
      more: 'more',
    },
    assistant: {
      title: 'ONCOFRONTIER Research Assistant',
      subtitle:
        'Source-grounded research Q&A — retrieves real records, cites sources, states uncertainty',
      transparencyBanner:
        'This assistant retrieves real records from PubMed, Europe PMC, and ClinicalTrials.gov before responding. It does not use a language model and cannot generate novel claims. Every factual statement traces to a retrieved source. It is not a medical advice tool.',
      explanationLevel: 'Explanation level:',
      levelPublic: 'Public',
      levelPublicDesc: 'Plain language, no jargon',
      levelStudent: 'Student',
      levelStudentDesc: 'Educational with key terms explained',
      levelResearcher: 'Researcher',
      levelResearcherDesc: 'Technical, detailed evidence',
      levelClinical: 'Clinical/Industry',
      levelClinicalDesc: 'Evidence level, limitations, provenance',
      inPlanner: 'in planner',
      emptyTitle: 'Ask a research question',
      emptyMessage:
        "I'll search real databases and give you a source-grounded summary with clickable references.",
      searching: 'Searching PubMed, Europe PMC, and ClinicalTrials.gov…',
      inputPlaceholder: 'Ask about cancer research, genes, treatments, or trials…',
      send: 'Send',
      sourcesCount: 'Sources',
      addToPlanner: 'Add to Planner',
      view: 'View',
      moreSources: 'more sources',
    },
    auth: {
      subtitle: 'Pan-Cancer Research Intelligence',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      email: 'Email',
      password: 'Password',
      passwordHint: 'Minimum 6 characters',
      pleaseWait: 'Please wait…',
      privacyNote: 'Your searches, favorites, and projects are private to your account.',
      guest: 'Continue as guest',
      guestNote: 'Browse research without an account. Sign up to save favorites and history.',
      prototypeNote:
        'Research discovery prototype. Not a clinical decision-support product.',
    },
    recordCard: {
      clinicalTrial: 'Clinical Trial',
      publication: 'Publication',
      open: 'Open',
      free: 'Free',
      restricted: 'Restricted',
      conditions: 'Conditions: ',
      interventions: 'Interventions: ',
      enrollment: 'Enrollment: ',
      sites: 'Sites: ',
      moreSites: 'more',
      showAbstract: 'Show abstract',
      hideAbstract: 'Hide abstract',
      viewOn: 'View on',
      select: 'Select record for planner',
      deselect: 'Deselect record',
      selectedTitle: 'Selected for Action Planner',
      addTitle: 'Add to Action Planner',
    },
    states: {
      loadingDefault: 'Searching real research databases…',
      loadingHint: 'This may take a few seconds',
      errorTitle: 'Something went wrong',
      errorMessage: 'An error occurred while fetching data. Please try again.',
      retry: 'Try Again',
      emptyTitle: 'No results yet',
      emptyMessage: 'Enter search terms above to retrieve real research records.',
    },
    displayOptions: {
      presetsTitle: 'COMPLETE MODES',
      presetParalysis: 'Assisted hands',
      presetParalysisHint: 'Large targets, quick phrases, voice guide, listening mode, one-handed',
      presetBlindness: 'Blindness support',
      presetBlindnessHint: 'Voice guide, listening mode, large text, large targets',
      presetLowVision: 'Low vision',
      presetLowVisionHint: 'High contrast, large text, large targets',
      presetDyslexia: 'Dyslexia friendly',
      presetDyslexiaHint: 'Reading mode, reduced motion, large text',
      themeTitle: 'DAY & NIGHT',
      nightMode: 'Night mode',
      nightModeHint: 'Dark background with soft text — comfortable in the dark',
      blueLightFilter: 'Anti blue-light',
      blueLightHint: 'Warm amber tint to reduce blue light in the evening',
      visualTitle: 'VISION',
      largeText: 'Larger text',
      largeTextHint: 'Increases the size of all text in the app',
      highContrast: 'High contrast',
      highContrastHint: 'Stronger outlines and text contrast',
      daltonism: 'Color-vision safe',
      daltonismHint: 'Palette safe for red-green color blindness',
      readingMode: 'Reading mode',
      readingModeHint: 'Wider spacing and shorter line lengths for easier reading',
      dyslexiaMode: 'Dyslexia friendly',
      dyslexiaModeHint: 'Readable font, wider letter spacing, and natural text direction',
      motorTitle: 'MOTOR & HANDS-FREE',
      listeningMode: 'Listening mode',
      listeningModeHint: 'Speak with the microphone button; replies are read aloud. The microphone never starts automatically.',
      voiceGuide: 'Voice guide',
      voiceGuideHint: 'Read Companion replies aloud and announce page changes when supported.',
      voiceGuideAnnouncement: 'Opened {page}. Use the page heading and controls to continue.',
      largeTargets: 'Larger touch targets',
      largeTargetsHint: 'Bigger buttons and easier targets',
      quickPhrases: 'Quick phrases',
      quickPhrasesHint: 'One-tap common phrases',
      oneHanded: 'One-handed mode',
      oneHandedHint: 'Controls within thumb reach',
      reducedMotion: 'Reduce motion',
      reducedMotionHint: 'Minimize animations and transitions',
      chartNote:
        'Charts use a color-vision-safe palette and always pair color with labels or shapes, in every theme.',
      reset: 'Reset display options',
      menuLabel: 'Display & accessibility',
      followSystem: 'Follow system theme',
      followSystemHint: 'Dark mode follows your device\u2019s light/dark setting',
      warmIntensity: 'Warm filter intensity',
      warmIntensityHint: 'How strong the warm tint is, from subtle to strong',
      warmSchedule: 'Schedule the warm filter',
      warmScheduleHint: 'Turn the warm tint on and off automatically at set times',
      warmFrom: 'From',
      warmTo: 'Until',
      colorAccuracyWarning:
        'Charts, images, and color-coded data are excluded from the warm tint so scientific colors stay accurate. Night mode and high contrast change how everything looks, including figures — switch them off when judging colors in an image or chart.',
      breakTitle: 'Screen breaks',
      breakReminders: 'Remind me to take breaks',
      breakRemindersHint: 'Shows a quiet on-screen reminder at a fixed interval',
      breakInterval: 'Remind me every',
      breakMessage: 'Time for a short break — look away from the screen and stretch if you can.',
      breakDismiss: 'Dismiss reminder',
      uvTitle: 'UV safety (sun exposure)',
      uvIntro:
        'Ultraviolet (UV) radiation comes mainly from the sun and artificial UV sources such as tanning beds or welding equipment. UV exposure is an environmental and skin-health concern, not a screen problem.',
      uvVsBlueLight:
        'Displays emit visible blue light, which is not UV. The warm filter and blue-light settings on this page change screen colors for comfort only.',
      uvGuidanceTitle: 'Evidence-based UV protection:',
      uvClothing: 'Wear protective clothing, a wide-brimmed hat, and UV-blocking sunglasses labeled \u201cUV400\u201d or \u201c99\u2013100% UVA/UVB\u201d.',
      uvShade: 'Seek shade when the sun is strongest, especially around midday.',
      uvSunglasses: 'Sunglasses should state they block 99\u2013100% of UVA and UVB rays.',
      uvSunscreen: 'Use broad-spectrum sunscreen on exposed skin where appropriate for your activity and sun strength.',
      uvFiltersNotProtection:
        'Screen warm filters and blue-light settings do NOT provide UV protection and are not substitutes for sunglasses, sunscreen, or other UV precautions.',
      uvScreensNotSun:
        'Computer and phone screens do not emit UV at levels comparable to direct sunlight. Warm filters are not proven to prevent eye disease or retinal damage; they are comfort features only. For UV Index information, use a trusted weather service for your location.',
    },
    accessible: {
      languageTitle: 'Language',
      interfaceLanguages: 'Interface languages',
      interfaceNote: 'Translates the entire interface',
      moreLanguages: 'More languages (chat & voice)',
      aiNote: 'Chat and voice work in this language; evidence retrieval is indexed in English.',
      limitedVoice: 'Voice input/output is limited for this language on most devices.',
    },
    sidebar: {
      home: 'Home',
      allModules: 'All modules',
      changeExperience: 'Change experience',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      signIn: 'Sign in / Create account',
      signOut: 'Sign out',
      disclaimer: 'Disclaimer',
    },
    biomarkers: {
      title: 'Biomarker Atlas',
      subtitle: 'Explore clinically used cancer biomarkers with evidence and testing context',
      allCategories: 'All categories',
      searchPlaceholder: 'Search biomarkers, genes, cancer types…',
      noResults: 'No biomarkers match your search.',
      disclaimer:
        'Biomarker information is educational and summarized from public sources. Testing decisions belong with qualified oncologists.',
      biomarker: 'Biomarker',
      category: 'Category',
      cancerType: 'Cancer Type',
      gene: 'Gene',
      positivity: 'Positivity',
      positivityRate: 'Positivity rate',
      prognosis: 'Prognosis',
      testingMethod: 'Testing Method',
      assayType: 'Assay Type',
      clinicalSignificance: 'Clinical Significance',
      therapeuticRelevance: 'Therapeutic Relevance',
      source: 'Source',
      predictive: 'Predictive',
      diagnostic: 'Diagnostic',
      unknown: 'Unknown',
      favorable: 'Favorable',
      unfavorable: 'Unfavorable',
    },
    anatomy: {
      title: 'Cancer Anatomy',
      subtitle: 'Understand where cancers start, what they do, and early warning signs',
      systems: 'Body Systems & Organs',
      organ: 'Organ',
      function: 'Function',
      earlySigns: 'Early Signs',
      riskFactors: 'Risk Factors',
      commonCancers: 'Common Cancers',
      statistics: 'Statistics',
      dataSource: 'Data source',
      disclaimer:
        'Educational anatomy information. It does not replace medical evaluation of symptoms.',
            anatomy: 'Anatomy & Function',
      systemLabels: {
        digestive: 'Digestive System',
        respiratory: 'Respiratory System',
        reproductive: 'Reproductive System',
        endocrine: 'Endocrine System',
        hematologic: 'Blood & Lymphatic',
        urinary: 'Urinary System',
        breast: 'Breast',
        skin: 'Skin',
        headNeck: 'Head & Neck',
        nervous: 'Nervous System',
      },
      whoRegionMostAffected: 'Most affected WHO region',
    },
    burden: {
      title: 'Global Burden Atlas',
      subtitle: 'WHO GLOBOCAN cancer statistics by region and cancer type',
      globalOverview: 'Global Overview',
      newCases: 'New cases',
      totalCases: 'Total cases',
      totalDeaths: 'Total deaths',
      fiveYearPrevalence: '5-year prevalence',
      incidenceRate: 'Incidence rate',
      mortalityRate: 'Mortality rate',
      topCancers: 'Top Cancers Worldwide',
      cancerRanking: 'Cancer Ranking',
      cancerType: 'Cancer Type',
      cases: 'Cases',
      deaths: 'Deaths',
      deaths2: 'deaths',
      rank: 'Rank',
      prevalence: 'Prevalence',
      regionComparison: 'Regional Comparison',
      byRegion: 'By region',
      worldwide: 'Worldwide',
      africa: 'Africa',
      americas: 'Americas',
      europe: 'Europe',
      easternMed: 'Eastern Mediterranean',
      southEastAsia: 'South-East Asia',
      westernPacific: 'Western Pacific',
      dataSource: 'Data source',
      disclaimer:
        'Statistics from WHO GLOBOCAN estimates. Estimates, not exact counts — see the WHO source for methodology.',
    },
    companion: companionEn,
    pdf: pdfEn,
    library: libraryEn,
    methodology: methodologyEn,
    dataSourceStatus: dataSourceStatusEn,
    chatUi: chatUiEn,
  },
  fr: {
    direction: 'ltr',
    nav: {
      dashboard: 'Tableau de bord',
      discovery: 'Découverte de Médicaments',
      curemap: 'Recherche de Littérature',
      resistance: 'Résistance aux Traitements',
      equity: 'Équité dans le Cancer',
      burden: 'Statistiques du Cancer',
      biomarkers: 'Biomarqueurs',
      anatomy: 'Types et Biologie du Cancer',
      companion: 'Chat Accompagnant',
      planner: 'Planificateur de Recherche',
      assistant: 'Assistant de Recherche IA',
      pdf: 'Lecteur PDF',
      library: 'Articles et Notes Enregistrés',
      methodology: 'Méthodes de Recherche',
      account: 'Compte',
      modules: 'Modules de Recherche',
    },
    common: {
      search: 'Rechercher',
      loading: 'Recherche dans de vraies bases de données…',
      loadingHint: 'Cela peut prendre quelques secondes',
      errorTitle: 'Une erreur est survenue',
      errorMessage:
        'Une erreur s’est produite lors de la récupération des données. Veuillez réessayer.',
      retry: 'Réessayer',
      emptyTitle: 'Aucun résultat',
      emptyMessage: 'Saisissez des termes de recherche pour récupérer de vrais documents de recherche.',
      view: 'Voir',
      copied: 'Copié !',
      copy: 'Copier',
      saved: 'Enregistré !',
      download: 'Télécharger',
      clearAll: 'Tout effacer',
      examples: 'Exemples :',
      filters: 'Filtres',
      onePerLine: '(une par ligne)',
      errorBoundaryMessage: 'La page a rencontré une erreur inattendue. Vos données sauvegardées sont en sécurité. Vous pouvez recharger ou revenir au tableau de bord.',
      reloadApp: 'Recharger l’application',
      backToDashboard: 'Retour au tableau de bord',
      skipToContent: 'Aller au contenu principal',
    },
    dashboard: {
      badge: 'Intelligence de Recherche Pan-Cancer',
      title: 'Explorez la recherche sur le cancer crédible, comprenez les preuves et formulez de meilleures questions.',
      subtitle:
        'ONCOFRONTIER récupère de vraies publications et de vrais essais cliniques de PubMed, Europe PMC et ClinicalTrials.gov. Aucune donnée fabriquée, aucune citation inventée — chaque résultat remonte à une source vérifiable.',
      askAssistant: 'Demander à l’Assistant de Recherche',
      sources: 'Sources de Données Connectées',
      sourcesDesc: 'API en direct maintenues par NCBI, EMBL-EBI et la National Library of Medicine',
      modules: 'Modules de Recherche',
      tools: 'Outils de Productivité',
      recordsInPlanner: 'Documents dans le planificateur',
      dataSources: 'Source de données',
      languages: 'Traductions complètes de l’interface',
      disclaimer:
        'Avertissement : ONCOFRONTIER est un prototype de découverte de recherche. Il récupère et affiche de vrais documents provenant de bases de données publiques. Ce n’est pas un produit d’aide à la décision clinique, ne fournit pas de conseils médicaux et n’a pas découvert de remède contre le cancer. Consultez toujours des professionnels de santé qualifiés pour les décisions médicales.',
    },
    resistance: {
      title: 'Atlas des Résistances — Résistance au Traitement',
      subtitle: 'Explorez les mécanismes de résistance rapportés avec leurs publications',
      howItWorks: 'Comment fonctionne ce module',
      howItWorksBody:
        'Sélectionnez un type de cancer, un gène cible et un traitement pour récupérer des publications sur les mécanismes de résistance. Les résultats proviennent de vraies recherches PubMed et Europe PMC filtrées pour les termes de résistance. ONCOFRONTIER n’invente pas de mécanismes et ne recommande pas de combinaisons non validées.',
      scenarios: 'Scénarios de résistance courants :',
      exampleBreast: 'Résistance CDK4/6 — cancer du sein',
      exampleLung: 'Résistance EGFR T790M — cancer du poumon',
      exampleGbm: 'Résistance au témozolomide — glioblastome',
      exampleProstate: 'Résistance à l’enzalutamide — cancer de la prostate',
      exampleMelanoma: 'Résistance aux inhibiteurs BRAF — mélanome',
      exampleColorectal: 'Résistance au cétuximab — cancer colorectal',
      cancerType: 'Type de Cancer',
      gene: 'Gène Cible',
      therapy: 'Traitement / Médicament',
      searchPlaceholder: 'ex. Cancer du sein',
      genePlaceholder: 'ex. EGFR, CDK4',
      therapyPlaceholder: 'ex. témozolomide',
      searchButton: 'Rechercher la Littérature sur les Résistances',
      searchHint: 'Recherche de la littérature sur les résistances…',
      selectedFor: 'document(s) sélectionné(s) pour le Planificateur',
      viewPlanner: 'Voir le Planificateur →',
      emptyTitle: 'Explorez les mécanismes de résistance',
      emptyMessage:
        'Sélectionnez un scénario courant ci-dessus ou saisissez votre propre type de cancer, gène et traitement pour récupérer les publications pertinentes.',
      noResultsTitle: 'Aucune publication sur la résistance trouvée',
      noResultsMessage: 'Essayez d’autres termes ou un autre type de cancer.',
      someErrors: 'Certaines sources ont renvoyé des erreurs :',
      recordsFound: 'documents sur la résistance au traitement',
    },
    curemap: {
      title: 'CUREMAP — Explorateur de Preuves',
      subtitle:
        'Recherchez de vraies publications et de vrais essais cliniques dans PubMed, Europe PMC et ClinicalTrials.gov',
      placeholder: 'ex. Résistance aux inhibiteurs CDK4/6 dans le cancer du sein',
      searchLabel: 'Rechercher des travaux sur le cancer',
      filterSourceLabel: 'Filtrer par source',
      filterTypeLabel: 'Filtrer par type de document',
      selectedFor: 'document(s) sélectionné(s) pour le Planificateur',
      viewPlanner: 'Voir le Planificateur →',
      emptyTitle: 'Recherchez des preuves sur le cancer',
      emptyMessage:
        'Saisissez un type de cancer, un gène, un médicament ou une question de recherche ci-dessus. Les résultats sont récupérés en temps réel depuis PubMed, Europe PMC et ClinicalTrials.gov.',
      recordsRetrieved: 'documents récupérés',
      allSources: 'Toutes les sources',
      allTypes: 'Tous les types',
      publications: 'Publications',
      trials: 'Essais',
      publicationsLabel: 'publications,',
      trialsLabel: 'essais',
      noMatchTitle: 'Aucun document ne correspond à vos filtres',
      noMatchMessage: 'Essayez d’ajuster les filtres de source ou de type ci-dessus.',
      someErrors: 'Certaines sources ont renvoyé des erreurs :',
      noMatchMessage2: 'Les résultats d’autres sources sont affichés ci-dessous.',
      queryLabel: 'Requête :',
      retrievedAt: 'Récupéré à',
      sourcesSearched: 'Sources recherchées :',
    },
    equity: {
      title: 'Radar d’Équité — Lacunes de Recherche',
      subtitle: 'Comparez l’activité des publications et des essais entre les types de cancer',
      howItWorks: 'Ce que ce module montre',
      howItWorksBody:
        'Ce radar récupère les vrais comptes de publications de PubMed et les comptes d’essais enregistrés de ClinicalTrials.gov pour différents types de cancer. Il ne fabrique pas de statistiques et ne prétend pas qu’un faible nombre de résultats prouve qu’un cancer est négligé — les comptes reflètent les résultats de l’API de recherche, pas l’ensemble du paysage de recherche.',
      cancerType: 'Type de Cancer',
      analyze: 'Analyser',
      comparison: 'Comparaison Entre Cancers',
      comparisonNote: 'Vrais comptes de publications PubMed et d’essais ClinicalTrials.gov',
      generate: 'Générer la Comparaison',
      loadingCompare: 'Interrogation de PubMed et ClinicalTrials.gov pour 10 types de cancer…',
      loadingAnalyze: 'Analyse de',
      noCompareTitle: 'Pas encore de données de comparaison',
      noCompareMessage:
        'Cliquez sur « Générer la Comparaison » pour récupérer les vrais comptes de publications et d’essais pour 10 types de cancer courants.',
      pubsChart: 'Publications PubMed',
      trialsChart: 'Essais Cliniques Enregistrés',
      chartNote:
        'Les comptes reflètent les résultats de l’API de recherche PubMed et ClinicalTrials.gov au moment de la requête. Ce ne sont pas des chiffres complets d’investissement de recherche et ne doivent pas être interprétés comme preuve de négligence ou de priorisation.',
      pubsStat: 'Publications PubMed',
      trialsStat: 'Essais Enregistrés',
      totalFor: 'Total des résultats pour',
      ctResultsFor: 'Résultats ClinicalTrials.gov pour',
      recentTrials: 'Essais Enregistrés Récents',
      recentPubs: 'Publications Récentes',
      startTitle: 'Commencez à explorer l’activité de recherche',
      startMessage:
        'Recherchez un type de cancer spécifique ci-dessus ou générez une comparaison pour voir les vrais comptes de publications et d’essais.',
      selectedFor: 'document(s) sélectionné(s) pour le Planificateur',
      viewPlanner: 'Voir le Planificateur →',
      queryLabel: 'Requête :',
      retrievedAt: 'Récupéré à',
      sourceNote: 'Source : PubMed E-utilities + API ClinicalTrials.gov v2',
    },
    discovery: {
      title: 'Pont de Découverte — Découverte de Médicaments',
      subtitle: 'Évaluation de cibles, recherche de composés et planification de validation translationnelle',
      disclaimer:
        'La présence d’un composé dans une base de données n’établit pas son efficacité ou sa sécurité comme traitement du cancer. Les scores Open Targets sont des annotations de base de données, pas des probabilités de succès, des preuves de causalité ou une validation clinique. La génération moléculaire est marquée « Pas encore connecté » — la recherche de structure et le transfert sont fonctionnels.',
      cancerType: 'Type de Cancer ou Sous-type',
      gene: 'Gène / Protéine / Cible',
      drug: 'Médicament ou Composé Connu',
      researchQuestion: 'Question de Recherche',
      cancerPlaceholder: 'ex. Cancer du sein, Glioblastome',
      genePlaceholder: 'ex. EGFR, CDK4, BRAF',
      drugPlaceholder: 'ex. témozolomide, géfitinib',
      questionPlaceholder: 'ex. mécanismes de résistance',
      smilesLabel: 'Structure Moléculaire (SMILES) — optionnel',
      smilesPlaceholder: 'ex. CN1C(=O)N=C2C(=N1)N(C)C=N2',
      validate: 'Valider',
      smilesNote:
        'L’absence dans une base de données ne prouve pas la nouveauté. Un SMILES valide n’établit pas la médicabilité, la sécurité ou l’efficacité.',
      investigate: 'Investiguer',
      investigating: 'Investigation…',
      loadingMessage: 'Interrogation d’Open Targets, PubChem, PubMed et ClinicalTrials.gov…',
      emptyTitle: 'Commencez une investigation',
      emptyMessage:
        'Saisissez un type de cancer, une cible, un médicament/composé ou un SMILES ci-dessus. Les résultats proviennent d’Open Targets, PubChem, PubMed, Europe PMC et ClinicalTrials.gov.',
      queryLabel: 'Requête :',
      retrievedAt: 'Récupéré à',
      targetSection: 'Évaluation de la Cible (Open Targets)',
      compoundSection: 'Informations sur le Composé (PubChem)',
      moleculeSection: 'Explorateur de Molécules',
      moleculeInfo:
        'La recherche de structure depuis PubChem est fonctionnelle. La génération moléculaire de novo, l’amarrage, la dynamique moléculaire et la prédiction ADMET ne sont pas encore connectés.',
      moleculeHandoff: 'Un transfert structuré vers les outils de chimie computationnelle inclurait :',
      moleculeEmpty: 'Saisissez un SMILES ou un nom de composé ci-dessus pour récupérer des données structurales.',
      moleculeWarning:
        'Un SMILES valide n’établit pas la médicabilité, la faisabilité de synthèse, la sélectivité, l’activité biologique, la sécurité ou l’efficacité thérapeutique.',
      resistanceSection: 'Contexte de Résistance',
      publications: 'Publications',
      trials: 'Essais Cliniques',
      validationSection: 'Planificateur de Validation Translationnelle',
      copyMd: 'Copier MD',
      downloadBrief: 'Télécharger le Brief',
      selectedFor: 'document(s) sélectionné(s) pour le Planificateur',
      viewPlanner: 'Voir le Planificateur →',
      tractability: 'Tractabilité',
      modalitySm: 'Petite Molécule',
      modalityAb: 'Anticorps',
      modalityPr: 'Chimère de dégradation protéique (PROTAC)',
      modalityOc: 'Autres Modalités',
      cancerAssoc: 'Associations au Cancer',
      drugCandidates: 'Médicaments & Candidats Cliniques',
      safetyLiabilities: 'Risques de Sécurité',
      scoreNote:
        'Les scores sont des annotations de la base Open Targets représentant la force des preuves selon le type de données. Ce ne sont pas des probabilités de succès, des preuves de causalité ou une validation clinique.',
      otherAssoc: 'associations à des maladies non cancéreuses',
      stage: 'Stade',
      rationaleTitle: 'Justification Biologique',
      evidenceTitle: 'Niveau de Preuve & Limites',
      validationTitle: 'Étapes de Validation Proposées',
      hypothesisTitle: 'HYPOTHÈSE — Pas un résultat rapporté',
      missingTitle: 'Informations Manquantes',
      controlsTitle: 'Contrôles Essentiels & Facteurs de Confusion',
      rationaleCancer: 'Type de cancer',
      rationaleTarget: 'Cible moléculaire',
      rationaleCompound: 'Composé',
      rationaleQuestion: 'Question de recherche',
      rationaleEmpty: 'Aucun paramètre de recherche fourni.',
    },
    planner: {
      title: 'Planificateur d’Actions de Recherche',
      subtitle: 'Construisez un brief de recherche structuré à partir des documents sélectionnés',
      emptyTitle: 'Aucun document sélectionné',
      emptyMessage:
        'Utilisez CUREMAP, l’Atlas des Résistances ou le Radar d’Équité pour rechercher des documents. Cliquez sur le bouton + pour les ajouter ici.',
      goToCuremap: 'Aller à CUREMAP',
      goToResistance: 'Aller à l’Atlas des Résistances',
      selectedRecords: 'Documents Sélectionnés',
      clearAll: 'Tout effacer',
      briefDetails: 'Détails du Brief',
      researchQuestion: 'Question de Recherche',
      questionPlaceholder:
        'ex. Quels mécanismes expliquent la résistance aux inhibiteurs CDK4/6 dans le cancer du sein ?',
      cancerContext: 'Contexte du Cancer',
      autoDetected: '(détection auto)',
      contextPlaceholder: 'Type de cancer, cibles, traitements...',
      findings: 'Constatations Étayées par les Sources',
      findingsPlaceholder: 'Constatations identifiées à partir des documents sélectionnés...',
      limitations: 'Limites des Preuves',
      limitationsPlaceholder: 'ex. La plupart des études sont précliniques\nPetits échantillons...',
      unanswered: 'Questions Sans Réponse',
      unansweredPlaceholder: 'Questions qui restent ouvertes...',
      proposedNext: 'Prochaines Étapes Proposées — HYPOTHÈSE',
      proposedPlaceholder: 'Expériences ou études de validation proposées...',
      hypothesisNote:
        'Ce sont des hypothèses, pas des constatations validées. Étiquetez clairement dans tout travail dérivé.',
      briefPreview: 'Aperçu du Brief',
      copyMd: 'Copier MD',
      download: 'Télécharger',
      copied: 'Copié !',
      saved: 'Enregistré !',
      recordsInBrief: 'Documents du Brief',
      generated: 'Généré :',
      questionLabel: 'Question :',
      contextLabel: 'Contexte :',
      evidenceLabel: 'Preuves :',
      findingsLabel: 'Constatations :',
      limitationsLabel: 'Limites :',
      unansweredLabel: 'Sans réponse :',
      proposedLabel: 'Prochaines Étapes Proposées (HYPOTHÈSE) :',
      referencesLabel: 'Références',
      more: 'de plus',
    },
    assistant: {
      title: 'Assistant de Recherche ONCOFRONTIER',
      subtitle:
        'Q&A de recherche ancré dans les sources — récupère de vrais documents, cite les sources, exprime l’incertitude',
      transparencyBanner:
        'Cet assistant récupère de vrais documents de PubMed, Europe PMC et ClinicalTrials.gov avant de répondre. Il n’utilise pas de modèle de langage et ne peut pas générer de nouvelles affirmations. Chaque affirmation factuelle remonte à une source récupérée. Ce n’est pas un outil de conseils médicaux.',
      explanationLevel: 'Niveau d’explication :',
      levelPublic: 'Grand public',
      levelPublicDesc: 'Langage simple, sans jargon',
      levelStudent: 'Étudiant',
      levelStudentDesc: 'Éducatif avec les termes clés expliqués',
      levelResearcher: 'Chercheur',
      levelResearcherDesc: 'Technique, preuves détaillées',
      levelClinical: 'Clinique/Industrie',
      levelClinicalDesc: 'Niveau de preuve, limites, provenance',
      inPlanner: 'dans le planificateur',
      emptyTitle: 'Posez une question de recherche',
      emptyMessage:
        'Je rechercherai dans de vraies bases de données et vous donnerai un résumé sourcé avec des références cliquables.',
      searching: 'Recherche dans PubMed, Europe PMC et ClinicalTrials.gov…',
      inputPlaceholder: 'Posez une question sur le cancer, les gènes, les traitements ou les essais…',
      send: 'Envoyer',
      sourcesCount: 'Sources',
      addToPlanner: 'Ajouter au Planificateur',
      view: 'Voir',
      moreSources: 'sources de plus',
    },
    auth: {
      subtitle: 'Intelligence de Recherche Pan-Cancer',
      signIn: 'Se Connecter',
      createAccount: 'Créer un Compte',
      email: 'E-mail',
      password: 'Mot de Passe',
      passwordHint: 'Minimum 6 caractères',
      pleaseWait: 'Veuillez patienter…',
      privacyNote: 'Vos recherches, favoris et projets sont privés et liés à votre compte.',
      guest: 'Continuer en tant qu’invité',
      guestNote:
        'Parcourez la recherche sans compte. Inscrivez-vous pour enregistrer favoris et historique.',
      prototypeNote: 'Prototype de découverte de recherche. Pas un produit d’aide à la décision clinique.',
    },
    recordCard: {
      clinicalTrial: 'Essai Clinique',
      publication: 'Publication',
      open: 'Libre',
      free: 'Gratuit',
      restricted: 'Restreint',
      conditions: 'Affections : ',
      interventions: 'Interventions : ',
      enrollment: 'Effectif : ',
      sites: 'Sites : ',
      moreSites: 'de plus',
      showAbstract: 'Afficher le résumé',
      hideAbstract: 'Masquer le résumé',
      viewOn: 'Voir sur',
      select: 'Sélectionner pour le planificateur',
      deselect: 'Désélectionner',
      selectedTitle: 'Sélectionné pour le Planificateur',
      addTitle: 'Ajouter au Planificateur',
    },
    states: {
      loadingDefault: 'Recherche dans de vraies bases de données…',
      loadingHint: 'Cela peut prendre quelques secondes',
      errorTitle: 'Une erreur est survenue',
      errorMessage: 'Une erreur s’est produite lors de la récupération des données. Veuillez réessayer.',
      retry: 'Réessayer',
      emptyTitle: 'Aucun résultat',
      emptyMessage: 'Saisissez des termes de recherche pour récupérer de vrais documents.',
    },
    displayOptions: {
      presetsTitle: 'MODES COMPLETS',
      presetParalysis: 'Mains assistées',
      presetParalysisHint: 'Grandes cibles, phrases rapides, guide vocal, mode écoute, une main',
      presetBlindness: 'Support cécité',
      presetBlindnessHint: 'Guide vocal, mode écoute, texte agrandi, grandes cibles',
      presetLowVision: 'Basse vision',
      presetLowVisionHint: 'Contraste élevé, texte agrandi, grandes cibles',
      presetDyslexia: 'Adapté à la dyslexie',
      presetDyslexiaHint: 'Mode lecture, mouvement réduit, texte agrandi',
      themeTitle: 'JOUR & NUIT',
      nightMode: 'Mode nuit',
      nightModeHint: 'Fond sombre avec texte doux — confortable dans l’obscurité',
      blueLightFilter: 'Anti lumière bleue',
      blueLightHint: 'Teinte ambrée chaude pour réduire la lumière bleue le soir',
      visualTitle: 'VISION',
      largeText: 'Texte plus grand',
      largeTextHint: 'Augmente la taille de tout le texte de l’application',
      highContrast: 'Contraste élevé',
      highContrastHint: 'Contours et contraste de texte renforcés',
      daltonism: 'Sécurisé daltonisme',
      daltonismHint: 'Palette sûre pour le daltonisme rouge-vert',
      readingMode: 'Mode lecture',
      readingModeHint: 'Espacement plus large et lignes plus courtes pour une lecture facile',
      dyslexiaMode: 'Adapté à la dyslexie',
      dyslexiaModeHint: 'Police lisible, espacement élargi et sens naturel du texte',
      motorTitle: 'MOTRICITÉ & SANS MAINS',
      listeningMode: 'Mode écoute',
      listeningModeHint: 'Parlez avec le bouton du micro ; les réponses sont lues à voix haute. Le micro ne démarre jamais seul.',
      voiceGuide: 'Guide vocal',
      voiceGuideHint: 'Lire les réponses et annoncer les changements de page si votre appareil le permet.',
      voiceGuideAnnouncement: 'Page ouverte : {page}. Utilisez le titre et les commandes de la page pour continuer.',
      largeTargets: 'Grandes cibles tactiles',
      largeTargetsHint: 'Boutons plus grands et plus faciles à atteindre',
      quickPhrases: 'Phrases rapides',
      quickPhrasesHint: 'Phrases courantes en un clic',
      oneHanded: 'Mode une main',
      oneHandedHint: 'Commandes à portée du pouce',
      reducedMotion: 'Réduire le mouvement',
      reducedMotionHint: 'Minimise les animations et transitions',
      chartNote:
        'Les graphiques utilisent une palette sûre pour la vision des couleurs et associent toujours couleur et étiquettes ou formes, dans chaque thème.',
      reset: 'Réinitialiser les options d’affichage',
      menuLabel: 'Affichage & accessibilité',
      followSystem: 'Suivre le thème du système',
      followSystemHint: 'Le mode sombre suit le réglage clair/sombre de votre appareil',
      warmIntensity: 'Intensité du filtre chaud',
      warmIntensityHint: 'Force de la teinte chaude, de subtile à forte',
      warmSchedule: 'Programmer le filtre chaud',
      warmScheduleHint: 'Active et désactive automatiquement la teinte chaude aux heures choisies',
      warmFrom: 'De',
      warmTo: 'Jusqu’à',
      colorAccuracyWarning:
        'Les graphiques, images et données colorées sont exclus de la teinte chaude afin que les couleurs scientifiques restent fidèles. Le mode nuit et le contraste élevé modifient l’apparence de tout, y compris les figures — désactivez-les pour juger les couleurs d’une image ou d’un graphique.',
      breakTitle: 'Pauses écran',
      breakReminders: 'Me rappeler de faire des pauses',
      breakRemindersHint: 'Affiche un rappel discret à l’écran à intervalle fixe',
      breakInterval: 'Me rappeler toutes les',
      breakMessage: 'Pause courte — détournez le regard de l’écran et étirez-vous si possible.',
      breakDismiss: 'Fermer le rappel',
      uvTitle: 'Sécurité UV (exposition solaire)',
      uvIntro:
        'Le rayonnement ultraviolet (UV) provient principalement du soleil et de sources artificielles (cabines de bronzage, soudure). L’exposition aux UV est une question de santé cutanée et environnementale, pas un problème d’écran.',
      uvVsBlueLight:
        'Les écrans émettent de la lumière bleue visible, qui n’est pas de l’UV. Le filtre chaud et les réglages de lumière bleue de cette page changent seulement les couleurs de l’écran pour le confort.',
      uvGuidanceTitle: 'Protection UV fondée sur des preuves :',
      uvClothing: 'Portez des vêtements protecteurs, un chapeau à large bord et des lunettes de soleil étiquetées « UV400 » ou « 99–100 % UVA/UVB ».',
      uvShade: 'Cherchez l’ombre quand le soleil est le plus fort, surtout vers midi.',
      uvSunglasses: 'Les lunettes de soleil doivent indiquer qu’elles bloquent 99–100 % des UVA et UVB.',
      uvSunscreen: 'Utilisez une crème solaire à large spectre sur la peau exposée, selon votre activité et l’intensité du soleil.',
      uvFiltersNotProtection:
        'Les filtres chauds et les réglages de lumière bleue ne fournissent AUCUNE protection UV et ne remplacent pas les lunettes de soleil, la crème solaire ou autres précautions UV.',
      uvScreensNotSun:
        'Les écrans d’ordinateur et de téléphone n’émettent pas d’UV à des niveaux comparables à la lumière directe du soleil. Les filtres chauds ne sont pas prouvés pour prévenir les maladies oculaires ; ce sont des fonctions de confort. Pour l’indice UV, utilisez un service météo fiable pour votre localisation.',
    },
    accessible: {
      languageTitle: 'Langue',
      interfaceLanguages: 'Langues d’interface',
      interfaceNote: 'Traduit toute l’interface',
      moreLanguages: 'Plus de langues (chat & voix)',
      aiNote: 'Le chat et la voix fonctionnent dans cette langue ; la recherche de preuves est indexée en anglais.',
      limitedVoice: 'La saisie/sortie vocale est limitée pour cette langue sur la plupart des appareils.',
    },
    sidebar: {
      home: 'Accueil',
      allModules: 'Tous les modules',
      changeExperience: 'Changer d’expérience',
      openMenu: 'Ouvrir le menu de navigation',
      closeMenu: 'Fermer le menu de navigation',
      signIn: 'Se connecter / Créer un compte',
      signOut: 'Se déconnecter',
      disclaimer: 'Avertissement',
    },
    biomarkers: {
      title: 'Atlas des Biomarqueurs',
      subtitle: 'Explorez les biomarqueurs du cancer utilisés en clinique avec leur contexte',
      allCategories: 'Toutes les catégories',
      searchPlaceholder: 'Rechercher biomarqueurs, gènes, types de cancer…',
      noResults: 'Aucun biomarqueur ne correspond à votre recherche.',
      disclaimer:
        'Les informations sur les biomarqueurs sont éducatives et résumées de sources publiques. Les décisions de test appartiennent aux oncologues qualifiés.',
      biomarker: 'Biomarqueur',
      category: 'Catégorie',
      cancerType: 'Type de Cancer',
      gene: 'Gène',
      positivity: 'Positivité',
      positivityRate: 'Taux de positivité',
      prognosis: 'Pronostic',
      testingMethod: 'Méthode de Test',
      assayType: 'Type de Dosage',
      clinicalSignificance: 'Signification Clinique',
      therapeuticRelevance: 'Pertinence Thérapeutique',
      source: 'Source',
      predictive: 'Prédictif',
      diagnostic: 'Diagnostique',
      unknown: 'Inconnu',
      favorable: 'Favorable',
      unfavorable: 'Défavorable',
    },
    anatomy: {
      title: 'Anatomie du Cancer',
      subtitle: 'Comprenez où les cancers commencent, ce qu’ils font et les signes précoces',
      systems: 'Systèmes du Corps & Organes',
      organ: 'Organe',
      function: 'Fonction',
      earlySigns: 'Signes Précoces',
      riskFactors: 'Facteurs de Risque',
      commonCancers: 'Cancers Courants',
      statistics: 'Statistiques',
      dataSource: 'Source de données',
      disclaimer:
        'Informations anatomiques éducatives. Ne remplacent pas une évaluation médicale des symptômes.',
            anatomy: 'Anatomie & Fonction',
      systemLabels: {
        digestive: 'Système Digestif',
        respiratory: 'Système Respiratoire',
        reproductive: 'Système Reproductif',
        endocrine: 'Système Endocrinien',
        hematologic: 'Sang & Lymphatique',
        urinary: 'Système Urinaire',
        breast: 'Sein',
        skin: 'Peau',
        headNeck: 'Tête & Cou',
        nervous: 'Système Nerveux',
      },
      whoRegionMostAffected: 'Région OMS la plus touchée',
    },
    burden: {
      title: 'Atlas de la Charge Mondiale',
      subtitle: 'Statistiques du cancer GLOBOCAN de l’OMS par région et type',
      globalOverview: 'Aperçu Mondial',
      newCases: 'Nouveaux cas',
      totalCases: 'Cas totaux',
      totalDeaths: 'Décès totaux',
      fiveYearPrevalence: 'Prévalence à 5 ans',
      incidenceRate: 'Taux d’incidence',
      mortalityRate: 'Taux de mortalité',
      topCancers: 'Principaux Cancers dans le Monde',
      cancerRanking: 'Classement des Cancers',
      cancerType: 'Type de Cancer',
      cases: 'Cas',
      deaths: 'Décès',
      deaths2: 'décès',
      rank: 'Rang',
      prevalence: 'Prévalence',
      regionComparison: 'Comparaison Régionale',
      byRegion: 'Par région',
      worldwide: 'Mondial',
      africa: 'Afrique',
      americas: 'Amériques',
      europe: 'Europe',
      easternMed: 'Méditerranée orientale',
      southEastAsia: 'Asie du Sud-Est',
      westernPacific: 'Pacifique occidental',
      dataSource: 'Source de données',
      disclaimer:
        'Statistiques des estimations GLOBOCAN de l’OMS. Ce sont des estimations, pas des comptes exacts — voir la source OMS pour la méthodologie.',
    },
    companion: companionFr,
    pdf: pdfFr,
    library: libraryFr,
    methodology: methodologyFr,
    dataSourceStatus: dataSourceStatusFr,
    chatUi: chatUiTranslations.fr as ChatUiStrings,
  },
  ar: {
    direction: 'rtl',
    nav: {
      dashboard: 'لوحة التحكم',
      discovery: 'اكتشاف الأدوية',
      curemap: 'البحث في الأدبيات',
      resistance: 'مقاومة العلاج',
      equity: 'الإنصاف في السرطان',
      burden: 'إحصائيات السرطان',
      biomarkers: 'المؤشرات الحيوية',
      anatomy: 'أنواع السرطان وبيولوجياها',
      companion: 'دردشة الرفيق',
      planner: 'مخطط البحث',
      assistant: 'مساعد البحث الذكي',
      pdf: 'قارئ PDF',
      library: 'المقالات والملاحظات المحفوظة',
      methodology: 'منهجية البحث',
      account: 'الحساب',
      modules: 'وحدات البحث',
    },
    common: {
      search: 'بحث',
      loading: 'جارٍ البحث في قواعد بيانات بحثية حقيقية…',
      loadingHint: 'قد يستغرق ذلك بضع ثوانٍ',
      errorTitle: 'حدث خطأ ما',
      errorMessage: 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.',
      retry: 'إعادة المحاولة',
      emptyTitle: 'لا نتائج بعد',
      emptyMessage: 'أدخل مصطلحات البحث أعلاه لجلب سجلات بحثية حقيقية.',
      view: 'عرض',
      copied: 'تم النسخ!',
      copy: 'نسخ',
      saved: 'تم الحفظ!',
      download: 'تنزيل',
      clearAll: 'مسح الكل',
      examples: 'أمثلة:',
      filters: 'عوامل التصفية',
      onePerLine: '(واحد في كل سطر)',
      errorBoundaryMessage: 'واجهت الصفحة خطأ غير متوقع. بياناتك المحفوظة آمنة. يمكنك إعادة التحميل أو العودة إلى لوحة التحكم.',
      reloadApp: 'إعادة تحميل التطبيق',
      backToDashboard: 'العودة إلى لوحة التحكم',
      skipToContent: 'تخطي إلى المحتوى الرئيسي',
    },
    dashboard: {
      badge: 'ذكاء الأبحاث لجميع أنواع السرطان',
      title: 'استكشف أبحاث السرطان الموثوقة، افهم الأدلة، واطرح أسئلة أفضل.',
      subtitle:
        'يسترجع ONCOFRONTIER منشورات وتجارب سريرية حقيقية من PubMed وEurope PMC وClinicalTrials.gov. لا بيانات مُختلقة، لا اقتباسات مُختلقة — كل نتيجة تعود إلى مصدر قابل للتحقق.',
      askAssistant: 'اسأل مساعد البحث',
      sources: 'مصادر البيانات المتصلة',
      sourcesDesc: 'واجهات برمجية مباشرة تديرها NCBI وEMBL-EBI والمكتبة الوطنية الأمريكية للطب',
      modules: 'وحدات البحث',
      tools: 'أدوات الإنتاجية',
      recordsInPlanner: 'سجلات في المخطط',
      dataSources: 'مصدر البيانات',
      languages: 'ترجمات كاملة للواجهة',
      disclaimer:
        'تنبيه: ONCOFRONTIER نموذج أولي للاكتشاف البحثي. يسترجع ويعرض سجلات حقيقية من قواعد بيانات بحثية عامة. ليس منتجًا لدعم القرار السريري، ولا يقدم نصائح طبية، ولم يكتشف علاجًا للسرطان. استشر دائمًا مقدمي رعاية صحية مؤهلين للقرارات الطبية.',
    },
    resistance: {
      title: 'أطلس المقاومة — مقاومة العلاج',
      subtitle: 'استكشف آليات مقاومة العلاج المُبلّغ عنها مع منشورات داعمة',
      howItWorks: 'كيف يعمل هذا القسم',
      howItWorksBody:
        'اختر نوع السرطان والجين الهدف والعلاج لاسترجاع منشورات عن آليات مقاومة العلاج. النتائج تأتي من بحث حقيقي في PubMed وEurope PMC مُفلتر لمصطلحات المقاومة. ONCOFRONTIER لا يخترع آليات ولا يوصي بمجموعات علاجية غير مُتحقق منها.',
      scenarios: 'سيناريوهات مقاومة شائعة:',
      exampleBreast: 'مقاومة CDK4/6 — سرطان الثدي',
      exampleLung: 'مقاومة EGFR T790M — سرطان الرئة',
      exampleGbm: 'مقاومة تيموزولوميد — الجليوبيلاستوما',
      exampleProstate: 'مقاومة إنزالوتاميد — سرطان البروستاتا',
      exampleMelanoma: 'مقاومة مثبطات BRAF — الميلانوما',
      exampleColorectal: 'مقاومة سيتوكسيماب — سرطان القولون والمستقيم',
      cancerType: 'نوع السرطان',
      gene: 'الجين الهدف',
      therapy: 'العلاج / الدواء',
      searchPlaceholder: 'مثال: سرطان الثدي',
      genePlaceholder: 'مثال: EGFR، CDK4',
      therapyPlaceholder: 'مثال: تيموزولوميد',
      searchButton: 'البحث في أدبيات المقاومة',
      searchHint: 'جارٍ البحث في أدبيات المقاومة…',
      selectedFor: 'سجل (سجلات) محدد للمخطط',
      viewPlanner: 'عرض المخطط ←',
      emptyTitle: 'استكشف آليات مقاومة العلاج',
      emptyMessage:
        'اختر سيناريو مقاومة شائعًا أعلاه أو أدخل نوع السرطان والجين والعلاج لاسترجاع المنشورات ذات الصلة.',
      noResultsTitle: 'لا توجد منشورات عن المقاومة',
      noResultsMessage: 'جرّب مصطلحات بحث مختلفة أو نوع سرطان آخر.',
      someErrors: 'بعض المصادر أرجعت أخطاء:',
      recordsFound: 'سجلًا عن مقاومة العلاج',
    },
    curemap: {
      title: 'سيورماب — مستكشف الأدلة',
      subtitle: 'ابحث في منشورات وتجارب سريرية حقيقية عبر PubMed وEurope PMC وClinicalTrials.gov',
      placeholder: 'مثال: مقاومة مثبطات CDK4/6 في سرطان الثدي',
      searchLabel: 'ابحث في أبحاث السرطان',
      filterSourceLabel: 'تصفية حسب المصدر',
      filterTypeLabel: 'تصفية حسب نوع السجل',
      selectedFor: 'سجل (سجلات) محدد للمخطط',
      viewPlanner: 'عرض المخطط ←',
      emptyTitle: 'ابحث عن أدلة أبحاث السرطان',
      emptyMessage:
        'أدخل نوع سرطان أو جينًا أو دواءً أو سؤالًا بحثيًا أعلاه. تُسترجع النتائج في الوقت الفعلي من PubMed وEurope PMC وClinicalTrials.gov.',
      recordsRetrieved: 'سجلًا مسترجعًا',
      allSources: 'كل المصادر',
      allTypes: 'كل الأنواع',
      publications: 'منشورات',
      trials: 'تجارب',
      publicationsLabel: 'منشورات،',
      trialsLabel: 'تجارب',
      noMatchTitle: 'لا سجلات تطابق المرشحات',
      noMatchMessage: 'جرّب تعديل مرشحات المصدر أو النوع أعلاه.',
      someErrors: 'بعض المصادر أرجعت أخطاء:',
      noMatchMessage2: 'نتائج المصادر الأخرى معروضة أدناه.',
      queryLabel: 'الاستعلام:',
      retrievedAt: 'وقت الاسترجاع',
      sourcesSearched: 'المصادر المتفق عليها:',
    },
    equity: {
      title: 'رادار الإنصاف — فجوات البحث',
      subtitle: 'قارن نشاط المنشورات والتجارب عبر أنواع السرطان من أعداد حقيقية',
      howItWorks: 'ما يعرضه هذا القسم',
      howItWorksBody:
        'يجلب هذا الرادار أعداد منشورات حقيقية من PubMed وأعداد تجارب مسجلة من ClinicalTrials.gov لأنواع مختلفة من السرطان. لا يختلق إحصائيات، ولا يدعي أن قلة النتائج تثبت إهمال سرطان ما — الأعداد تعكس نتائج واجهة البحث، وليس المشهد البحثي الكامل.',
      cancerType: 'نوع السرطان',
      analyze: 'تحليل',
      comparison: 'مقارنة بين أنواع السرطان',
      comparisonNote: 'أعداد منشورات PubMed حقيقية وأعداد تجارب ClinicalTrials.gov',
      generate: 'إنشاء المقارنة',
      loadingCompare: 'الاستعلام من PubMed وClinicalTrials.gov لعشرة أنواع سرطان…',
      loadingAnalyze: 'جارٍ تحليل',
      noCompareTitle: 'لا بيانات مقارنة بعد',
      noCompareMessage: 'انقر «إنشاء المقارنة» لجلب أعداد حقيقية للمنشورات والتجارب لعشرة أنواع سرطان شائعة.',
      pubsChart: 'منشورات PubMed',
      trialsChart: 'التجارب السريرية المسجلة',
      chartNote:
        'تعكس الأعداد نتائج بحث PubMed وClinicalTrials.gov عند وقت الاستعلام. ليست أرقامًا شاملة للاستثمار البحثي، ولا ينبغي تفسيرها كإثبات إهمال أو أولوية.',
      pubsStat: 'منشورات PubMed',
      trialsStat: 'تجارب مسجلة',
      totalFor: 'إجمالي النتائج لـ',
      ctResultsFor: 'نتائج ClinicalTrials.gov لـ',
      recentTrials: 'تجارب مسجلة حديثة',
      recentPubs: 'منشورات حديثة',
      startTitle: 'ابدأ استكشاف النشاط البحثي',
      startMessage: 'ابحث عن نوع سرطان محدد أعلاه أو أنشئ مقارنة لرؤية الأعداد الحقيقية للمنشورات والتجارب.',
      selectedFor: 'سجل (سجلات) محدد للمخطط',
      viewPlanner: 'عرض المخطط ←',
      queryLabel: 'الاستعلام:',
      retrievedAt: 'وقت الاسترجاع',
      sourceNote: 'المصدر: PubMed E-utilities + واجهة ClinicalTrials.gov v2',
    },
    discovery: {
      title: 'جسر الاكتشاف — اكتشاف أدوية السرطان',
      subtitle: 'تقييم أهداف مدعوم بالأدلة، بحث عن مركبات، وتخطيط التحقق الترجمي',
      disclaimer:
        'ظهور مركب في قاعدة بيانات لا يثبت فعاليته أو أمانه كعلاج للسرطان. درجات Open Targets هي تعليقات قاعدة بيانات، وليست احتمالات نجاح دوائي أو إثبات سببية أو تحققًا سريريًا. توليد الجزيئات مُعلَّم «غير متصل بعد» — البحث عن البنية والتسليم يعملان.',
      cancerType: 'نوع السرطان أو النوع الفرعي',
      gene: 'الجين / البروتين / الهدف',
      drug: 'دواء أو مركب معروف',
      researchQuestion: 'السؤال البحثي',
      cancerPlaceholder: 'مثال: سرطان الثدي، الجليوبيلاستوما',
      genePlaceholder: 'مثال: EGFR، CDK4، BRAF',
      drugPlaceholder: 'مثال: تيموزولوميد، جيفيتينيب',
      questionPlaceholder: 'مثال: آليات المقاومة',
      smilesLabel: 'البنية الجزيئية (SMILES) — اختياري',
      smilesPlaceholder: 'مثال: CN1C(=O)N=C2C(=N1)N(C)C=N2',
      validate: 'تحقق',
      smilesNote: 'الغياب في قاعدة البيانات لا يثبت الجدة. صلاحية SMILES لا تثبت الدوائية أو الأمان أو الفعالية.',
      investigate: 'استقصاء',
      investigating: 'جارٍ الاستقصاء…',
      loadingMessage: 'الاستعلام من Open Targets وPubChem وPubMed وClinicalTrials.gov…',
      emptyTitle: 'ابدأ استقصاء اكتشاف',
      emptyMessage:
        'أدخل نوع سرطان أو هدفًا جينيًا أو دواءً/مركبًا أو SMILES أعلاه. النتائج من Open Targets وPubChem وPubMed وEurope PMC وClinicalTrials.gov.',
      queryLabel: 'الاستعلام:',
      retrievedAt: 'وقت الاسترجاع',
      targetSection: 'تقييم الهدف (منصة Open Targets)',
      compoundSection: 'معلومات المركب (PubChem)',
      moleculeSection: 'مستكشف الجزيئات',
      moleculeInfo:
        'البحث عن البنية من PubChem يعمل. التوليد الجزيئي دي نوفو والرسو والديناميكا الجزيئية والتنبؤ ADMET غير متصلة بعد.',
      moleculeHandoff: 'التسليم المهيكل لأدوات الكيمياء الحاسوبية سيشمل:',
      moleculeEmpty: 'أدخل SMILES أو اسم مركب أعلاه لجلب البيانات التركيبية.',
      moleculeWarning:
        'صلاحية SMILES لا تثبت الدوائية أو جدوى التخليق أو الانتقائية أو النشاط البيولوجي أو الأمان أو الفعالية العلاجية.',
      resistanceSection: 'سياق المقاومة',
      publications: 'منشورات',
      trials: 'تجارب سريرية',
      validationSection: 'مخطط التحقق الترجمي',
      copyMd: 'نسخ MD',
      downloadBrief: 'تنزيل الملخص',
      selectedFor: 'سجل (سجلات) محدد للمخطط',
      viewPlanner: 'عرض المخطط ←',
      tractability: 'قابلية الاستهداف',
      modalitySm: 'جزيء صغير',
      modalityAb: 'جسم مضاد',
      modalityPr: 'كيميرا تدهور بروتيني (PROTAC)',
      modalityOc: 'أنماط أخرى',
      cancerAssoc: 'ارتباطات السرطان',
      drugCandidates: 'مرشحون دوائيون وسريريون',
      safetyLiabilities: 'مخاطر السلامة',
      scoreNote:
        'الدرجات تعليقات من قاعدة Open Targets تمثل قوة الأدلة عبر أنواع البيانات. ليست احتمالات نجاح دوائي أو إثبات سببية أو تحققًا سريريًا.',
      otherAssoc: 'ارتباطات بأمراض غير سرطانية',
      stage: 'المرحلة',
      rationaleTitle: 'المبرر البيولوجي',
      evidenceTitle: 'مستوى الدليل والحدود',
      validationTitle: 'مراحل التحقق المقترحة',
      hypothesisTitle: 'فرضية — ليست نتيجة مُبلّغ عنها',
      missingTitle: 'معلومات مفقودة',
      controlsTitle: 'الضوابط الأساسية والمتشكلات',
      rationaleCancer: 'نوع السرطان',
      rationaleTarget: 'الهدف الجزيئي',
      rationaleCompound: 'المركب',
      rationaleQuestion: 'السؤال البحثي',
      rationaleEmpty: 'لا معلمات بحث مُقدمة.',
    },
    planner: {
      title: 'مخطط إجراءات البحث',
      subtitle: 'ابنِ ملخصًا بحثيًا منظمًا من السجلات المحددة',
      emptyTitle: 'لا سجلات محددة بعد',
      emptyMessage:
        'استخدم CUREMAP أو أطلس المقاومة أو رادار الإنصاف للبحث عن سجلات. انقر زر + لإضافتها هنا.',
      goToCuremap: 'انتقل إلى CUREMAP',
      goToResistance: 'انتقل إلى أطلس المقاومة',
      selectedRecords: 'السجلات المحددة',
      clearAll: 'مسح الكل',
      briefDetails: 'تفاصيل الملخص',
      researchQuestion: 'السؤال البحثي',
      questionPlaceholder: 'مثال: ما الآليات التي تدفع مقاومة مثبطات CDK4/6 في سرطان الثدي؟',
      cancerContext: 'سياق السرطان',
      autoDetected: '(كشف تلقائي)',
      contextPlaceholder: 'نوع السرطان، الأهداف، العلاجات...',
      findings: 'النتائج المدعومة بالمصادر',
      findingsPlaceholder: 'نتائج حددتها من السجلات المحددة...',
      limitations: 'حدود الأدلة',
      limitationsPlaceholder: 'مثال: معظم الدراسات قبل سريرية\nعيّنات صغيرة...',
      unanswered: 'أسئلة بلا إجابة',
      unansweredPlaceholder: 'أسئلة ما تزال مفتوحة...',
      proposedNext: 'الخطوات التالية المقترحة — فرضية',
      proposedPlaceholder: 'تجارب أو دراسات تحقق مقترحة...',
      hypothesisNote: 'هذه فرضيات، ليست نتائج مُتحقق منها. ضع علامة واضحة في أي عمل مشتق.',
      briefPreview: 'معاينة الملخص',
      copyMd: 'نسخ MD',
      download: 'تنزيل',
      copied: 'تم النسخ!',
      saved: 'تم الحفظ!',
      recordsInBrief: 'سجلات الملخص',
      generated: 'تم التوليد:',
      questionLabel: 'السؤال:',
      contextLabel: 'السياق:',
      evidenceLabel: 'الأدلة:',
      findingsLabel: 'النتائج:',
      limitationsLabel: 'الحدود:',
      unansweredLabel: 'بلا إجابة:',
      proposedLabel: 'الخطوات التالية المقترحة (فرضية):',
      referencesLabel: 'المراجع',
      more: 'المزيد',
    },
    assistant: {
      title: 'مساعد البحث ONCOFRONTIER',
      subtitle: 'أسئلة وأجوبة بحثية مُسنَدة للمصادر — يسترجع سجلات حقيقية ويستشهد بالمصادر ويصرّح بعدم اليقين',
      transparencyBanner:
        'يجلب هذا المساعد سجلات حقيقية من PubMed وEurope PMC وClinicalTrials.gov قبل الإجابة. لا يستخدم نموذج لغوي ولا يمكنه توليد ادعاءات جديدة. كل عبارة واقعية تعود إلى مصدر مسترجع. ليست أداة نصيحة طبية.',
      explanationLevel: 'مستوى الشرح:',
      levelPublic: 'عام',
      levelPublicDesc: 'لغة بسيطة، بلا مصطلحات',
      levelStudent: 'طالب',
      levelStudentDesc: 'تعليمي مع شرح المصطلحات الأساسية',
      levelResearcher: 'باحث',
      levelResearcherDesc: 'تقني، أدلة مفصلة',
      levelClinical: 'سريري/صناعي',
      levelClinicalDesc: 'مستوى الدليل، الحدود، المصدر',
      inPlanner: 'في المخطط',
      emptyTitle: 'اطرح سؤالًا بحثيًا',
      emptyMessage: 'سأبحث في قواعد بيانات حقيقية وأعطيك ملخصًا مسندًا للمصادر بمراجع قابلة للنقر.',
      searching: 'جارٍ البحث في PubMed وEurope PMC وClinicalTrials.gov…',
      inputPlaceholder: 'اسأل عن أبحاث السرطان أو الجينات أو العلاجات أو التجارب…',
      send: 'إرسال',
      sourcesCount: 'المصادر',
      addToPlanner: 'أضف إلى المخطط',
      view: 'عرض',
      moreSources: 'مصادر إضافية',
    },
    auth: {
      subtitle: 'ذكاء الأبحاث لجميع أنواع السرطان',
      signIn: 'تسجيل الدخول',
      createAccount: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      passwordHint: '6 أحرف على الأقل',
      pleaseWait: 'يرجى الانتظار…',
      privacyNote: 'بحثك ومفضلتك ومشاريعك خاصة بحسابك.',
      guest: 'المتابعة كزائر',
      guestNote: 'تصفح الأبحاث دون حساب. سجّل لحفظ المفضلة والسجل.',
      prototypeNote: 'نموذج أولي لاكتشاف الأبحاث. ليس منتجًا لدعم القرار السريري.',
    },
    recordCard: {
      clinicalTrial: 'تجربة سريرية',
      publication: 'منشور',
      open: 'مفتوح',
      free: 'مجاني',
      restricted: 'مقيد',
      conditions: 'الحالات: ',
      interventions: 'التدخلات: ',
      enrollment: 'الالتحاق: ',
      sites: 'المواقع: ',
      moreSites: 'المزيد',
      showAbstract: 'عرض الملخص',
      hideAbstract: 'إخفاء الملخص',
      viewOn: 'عرض على',
      select: 'تحديد السجل للمخطط',
      deselect: 'إلغاء التحديد',
      selectedTitle: 'محدد للمخطط',
      addTitle: 'أضف إلى المخطط',
    },
    states: {
      loadingDefault: 'جارٍ البحث في قواعد بيانات بحثية حقيقية…',
      loadingHint: 'قد يستغرق ذلك بضع ثوانٍ',
      errorTitle: 'حدث خطأ ما',
      errorMessage: 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.',
      retry: 'إعادة المحاولة',
      emptyTitle: 'لا نتائج بعد',
      emptyMessage: 'أدخل مصطلحات البحث لجلب سجلات بحثية حقيقية.',
    },
    displayOptions: {
      presetsTitle: 'أنماط كاملة',
      presetParalysis: 'مساعدة اليدين',
      presetParalysisHint: 'أهداف كبيرة، عبارات سريعة، دليل صوتي، وضع استماع، يد واحدة',
      presetBlindness: 'دعم العمى',
      presetBlindnessHint: 'دليل صوتي، وضع استماع، نص كبير، أهداف كبيرة',
      presetLowVision: 'ضعف البصر',
      presetLowVisionHint: 'تباين عالٍ، نص كبير، أهداف كبيرة',
      presetDyslexia: 'مناسب لعسر القراءة',
      presetDyslexiaHint: 'وضع القراءة، حركة مخفضة، نص كبير',
      themeTitle: 'الليل والنهار',
      nightMode: 'الوضع الليلي',
      nightModeHint: 'خلفية داكنة بنص ناعم — مريح في الظلام',
      blueLightFilter: 'مضاد الضوء الأزرق',
      blueLightHint: 'صبغة كهرمانية دافئة لتقليل الضوء الأزرق في المساء',
      visualTitle: 'الرؤية',
      largeText: 'نص أكبر',
      largeTextHint: 'يزيد حجم كل النصوص في التطبيق',
      highContrast: 'تباين عالٍ',
      highContrastHint: 'خطوط وألوان أقوى للنص',
      daltonism: 'آمن لعمى الألوان',
      daltonismHint: 'لوحة آمنة لعمى الأحمر والأخضر',
      readingMode: 'وضع القراءة',
      readingModeHint: 'تباعد أوسع وأسطر أقصر لقراءة أسهل',
      dyslexiaMode: 'مناسب لعسر القراءة',
      dyslexiaModeHint: 'خط مقروء وتباعد أوسع مع الحفاظ على اتجاه النص الطبيعي',
      motorTitle: 'الحركة وبدون يدين',
      listeningMode: 'وضع الاستماع',
      listeningModeHint: 'تحدّث عبر زر الميكروفون؛ تُقرأ الردود صوتيًا. لا يعمل الميكروفون تلقائيًا.',
      voiceGuide: 'الدليل الصوتي',
      voiceGuideHint: 'قراءة ردود الرفيق وإعلان تغييرات الصفحات إذا كان الجهاز يدعم ذلك.',
      voiceGuideAnnouncement: 'تم فتح {page}. استخدم عنوان الصفحة وأدواتها للمتابعة.',
      largeTargets: 'أهداف لمس أكبر',
      largeTargetsHint: 'أزرار أكبر وأسهل للنقر',
      quickPhrases: 'عبارات سريعة',
      quickPhrasesHint: 'عبارات شائعة بنقرة واحدة',
      oneHanded: 'وضع اليد الواحدة',
      oneHandedHint: 'أزرار في نطاق الإبهام',
      reducedMotion: 'تقليل الحركة',
      reducedMotionHint: 'تقليل الرسوم المتحركة والانتقالات',
      chartNote: 'الرسوم البيانية تستخدم لوحة آمنة لعمى الألوان وتقرن دائمًا اللون بعلامات أو أشكال، في كل الأنماط.',
      reset: 'إعادة تعيين خيارات العرض',
      menuLabel: 'العرض وإمكانية الوصول',
      followSystem: 'اتباع سمة النظام',
      followSystemHint: 'يتبع الوضع الداكن إعداد الفاتح/الداكن في جهازك',
      warmIntensity: 'شدة الفلتر الدافئ',
      warmIntensityHint: 'قوة اللون الدافئ، من خفيف إلى قوي',
      warmSchedule: 'جدولة الفلتر الدافئ',
      warmScheduleHint: 'تشغيل وإيقاف اللون الدافئ تلقائيًا في أوقات محددة',
      warmFrom: 'من',
      warmTo: 'إلى',
      colorAccuracyWarning:
        'الرسوم البيانية والصور والبيانات الملوّنة مستثناة من اللون الدافئ لتبقى الألوان العلمية دقيقة. الوضع الليلي والتباين العالي يغيّران مظهر كل شيء بما فيه الأشكال — أوقفهما عند الحكم على الألوان في صورة أو رسم بياني.',
      breakTitle: 'استراحات الشاشة',
      breakReminders: 'ذكّرني بأخذ استراحات',
      breakRemindersHint: 'يعرض تذكيرًا هادئًا على الشاشة بفواصل زمنية ثابتة',
      breakInterval: 'ذكّرني كل',
      breakMessage: 'وقت استراحة قصيرة — أبعِد نظرك عن الشاشة وتَمَطَّ إن أمكن.',
      breakDismiss: 'إغلاق التذكير',
      uvTitle: 'السلامة من الأشعة فوق البنفسجية (التعرض للشمس)',
      uvIntro:
        'يأتي الإشعاع فوق البنفسجي (UV) أساسًا من الشمس ومصادر اصطناعية مثل أسِرّة التسمير ومعدات اللحام. التعرض للأشعة فوق البنفسجية مسألة صحة الجلد والبيئة، وليست مشكلة شاشات.',
      uvVsBlueLight:
        'تُصدر الشاشات ضوءًا أزرق مرئيًا وهو ليس فوق بنفسجيًا. الفلتر الدافئ وإعدادات الضوء الأزرق في هذه الصفحة تغيّر ألوان الشاشة للراحة فقط.',
      uvGuidanceTitle: 'حماية مبنية على الأدلة من الأشعة فوق البنفسجية:',
      uvClothing: 'ارتدِ ملابس واقية وقبعة عريضة الحواف ونظارات شمسية تحمل ملصق «UV400» أو «99–100% UVA/UVB».',
      uvShade: 'ابحث عن الظل عندما تكون الشمس أقوى، خاصة حوالي الظهر.',
      uvSunglasses: 'يجب أن تذكر النظارات الشمسية أنها تحجب 99–100% من UVA وUVB.',
      uvSunscreen: 'استخدم واقيًا شمسيًا واسع الطيف على الجلد المكشوف حسب نشاطك وقوة الشمس.',
      uvFiltersNotProtection:
        'فلاتر الشاشة الدافئة وإعدادات الضوء الأزرق لا توفر أي حماية من الأشعة فوق البنفسجية ولا تغني عن النظارات الشمسية أو الواقي الشمسي أو غيرها من الاحتياطات.',
      uvScreensNotSun:
        'لا تُصدر شاشات الحاسوب والهواتف أشعة فوق بنفسجية بمستويات تقارب ضوء الشمس المباشر. الفلاتر الدافئة غير مثبتة في منع أمراض العين؛ إنها ميزات راحة فقط. للحصول على مؤشر الأشعة فوق البنفسجية استخدم خدمة أرصاد جوية موثوقة في موقعك.',
    },
    accessible: {
      languageTitle: 'اللغة',
      interfaceLanguages: 'لغات الواجهة',
      interfaceNote: 'ترجم الواجهة بأكملها',
      moreLanguages: 'لغات أخرى (الدردشة والصوت)',
      aiNote: 'الدردشة والصوت يعملان بهذه اللغة؛ استرجاع الأدلة مفهرس بالإنجليزية.',
      limitedVoice: 'الإدخال/الإخراج الصوتي محدود لهذه اللغة على معظم الأجهزة.',
    },
    sidebar: {
      home: 'الرئيسية',
      allModules: 'كل الوحدات',
      changeExperience: 'تغيير التجربة',
      openMenu: 'فتح قائمة التنقل',
      closeMenu: 'إغلاق قائمة التنقل',
      signIn: 'تسجيل الدخول / إنشاء حساب',
      signOut: 'تسجيل الخروج',
      disclaimer: 'تنبيه',
    },
    biomarkers: {
      title: 'أطلس المؤشرات الحيوية',
      subtitle: 'استكشف مؤشرات السرطان المستخدمة سريريًا مع سياق الأدلة والاختبار',
      allCategories: 'كل الفئات',
      searchPlaceholder: 'ابحث في المؤشرات الحيوية والجينات وأنواع السرطان…',
      noResults: 'لا مؤشرات حيوية تطابق بحثك.',
      disclaimer:
        'معلومات المؤشرات الحيوية تعليمية ومُلخصة من مصادر عامة. قرارات الاختبار تعود لأطباء الأورام المؤهلين.',
      biomarker: 'مؤشر حيوي',
      category: 'الفئة',
      cancerType: 'نوع السرطان',
      gene: 'الجين',
      positivity: 'الإيجابية',
      positivityRate: 'معدل الإيجابية',
      prognosis: 'الإنذار',
      testingMethod: 'طريقة الاختبار',
      assayType: 'نوع الفحص',
      clinicalSignificance: 'الأهمية السريرية',
      therapeuticRelevance: 'الأهمية العلاجية',
      source: 'المصدر',
      predictive: 'تنبؤي',
      diagnostic: 'تشخيصي',
      unknown: 'غير معروف',
      favorable: 'مؤاتٍ',
      unfavorable: 'غير مؤاتٍ',
    },
    anatomy: {
      title: 'تشريح السرطان',
      subtitle: 'افهم أين تبدأ أنواع السرطان وماذا تفعل وما علاماتها المبكرة',
      systems: 'أنظمة الجسم والأعضاء',
      organ: 'العضو',
      function: 'الوظيفة',
      earlySigns: 'العلامات المبكرة',
      riskFactors: 'عوامل الخطر',
      commonCancers: 'أنواع السرطان الشائعة',
      statistics: 'الإحصائيات',
      dataSource: 'مصدر البيانات',
      disclaimer: 'معلومات تشريحية تعليمية. لا تُغني عن التقييم الطبي للأعراض.',
            anatomy: 'التشريح والوظيفة',
      systemLabels: {
        digestive: 'الجهاز الهضمي',
        respiratory: 'الجهاز التنفسي',
        reproductive: 'الجهاز التناسلي',
        endocrine: 'الجهاز الصماء',
        hematologic: 'الدم والليمفاوي',
        urinary: 'الجهاز البولي',
        breast: 'الثدي',
        skin: 'الجلد',
        headNeck: 'الرأس والرقبة',
        nervous: 'الجهاز العصبي',
      },
      whoRegionMostAffected: 'منطقة منظمة الصحة العالمية الأكثر تأثرًا',
    },
    burden: {
      title: 'أطلس العبء العالمي',
      subtitle: 'إحصائيات سرطان GLOBOCAN من منظمة الصحة العالمية حسب المنطقة والنوع',
      globalOverview: 'نظرة عامة عالمية',
      newCases: 'حالات جديدة',
      totalCases: 'إجمالي الحالات',
      totalDeaths: 'إجمالي الوفيات',
      fiveYearPrevalence: 'الانتشار خلال 5 سنوات',
      incidenceRate: 'معدل الحدوث',
      mortalityRate: 'معدل الوفيات',
      topCancers: 'أبرز أنواع السرطان عالميًا',
      cancerRanking: 'ترتيب السرطانات',
      cancerType: 'نوع السرطان',
      cases: 'الحالات',
      deaths: 'الوفيات',
      deaths2: 'وفيات',
      rank: 'الترتيب',
      prevalence: 'الانتشار',
      regionComparison: 'مقارنة إقليمية',
      byRegion: 'حسب المنطقة',
      worldwide: 'عالمي',
      africa: 'أفريقيا',
      americas: 'الأمريكتان',
      europe: 'أوروبا',
      easternMed: 'شرق المتوسط',
      southEastAsia: 'جنوب شرق آسيا',
      westernPacific: 'غرب المحيط الهادئ',
      dataSource: 'مصدر البيانات',
      disclaimer: 'إحصائيات من تقديرات GLOBOCAN لمنظمة الصحة العالمية. تقديرات، وليست أعدادًا دقيقة — انظر مصدر WHO للمنهجية.',
    },
    companion: companionAr,
    pdf: pdfAr,
    library: libraryAr,
    methodology: methodologyAr,
    dataSourceStatus: dataSourceStatusAr,
    chatUi: chatUiTranslations.ar as ChatUiStrings,
  },
};

function deepMerge<T>(base: T, patch: Record<string, unknown> | undefined): T {
  if (!patch) return base;
  const out = { ...(base as Record<string, unknown>) } as Record<string, unknown>;
  for (const key of Object.keys(patch)) {
    const p = patch[key];
    if (!p) continue;
    out[key] = { ...(out[key] as Record<string, string>), ...p };
  }
  return out as T;
}

export function getTranslation(lang: Language): Translation {
  if (lang === 'fr') return translations.fr;
  if (lang === 'ar') return translations.ar;
  if (lang !== 'en') {
    const partial = { ...(coreTranslations[lang] as Record<string, unknown>), ...(eyeComfortTranslations[lang] ?? {}) };
    const merged = deepMerge(translations.en, partial as Partial<Translation>);
    merged.chatUi = chatUiTranslations[lang] ?? chatUiEn;
    return merged;
  }
  return translations.en;
}

export type CompanionT = Translation['companion'];
