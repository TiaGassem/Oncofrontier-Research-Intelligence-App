// Shared language handling: input detection, normalization for retrieval,
// and honest per-capability language support information.
//
// Principle: "no wrong way to access knowledge" — informal spelling, missing
// diacritics, missing apostrophes ("jai" for "j'ai"), mixed language, and
// transliteration must not break understanding.

export type DetectedLanguage =
  | 'en' | 'fr' | 'ar' | 'ar-TN'
  | 'zh' | 'ja' | 'ko' | 'th' | 'hi' | 'bn' | 'ur' | 'fa'
  | 'es' | 'de' | 'pt' | 'it' | 'tr' | 'id' | 'vi' | 'sw'
  | 'unknown';

export interface LanguageCapability {
  code: DetectedLanguage;
  label: string;
  interface: boolean;         // full UI translation available
  chatUnderstanding: boolean; // Companion chat interprets input in this language
  retrieval: boolean;         // evidence retrieval via English-indexed databases
}

// Only these three locales have complete interface resources; Tunisian Arabic
// reuses the full Arabic interface while extending Companion chat handling.
export const FULL_INTERFACE_LANGUAGES = ['en', 'fr', 'ar'] as const;
export const PARTIAL_INTERFACE_LANGUAGES = [
  'es', 'de', 'pt', 'it', 'tr', 'zh', 'ja', 'ko',
  'hi', 'ur', 'fa', 'bn', 'id', 'vi', 'th', 'sw',
] as const;

export const LANGUAGE_CAPABILITIES: LanguageCapability[] = [
  { code: 'en', label: 'English', interface: true, chatUnderstanding: true, retrieval: true },
  { code: 'fr', label: 'Français', interface: true, chatUnderstanding: true, retrieval: true },
  { code: 'ar', label: 'العربية', interface: true, chatUnderstanding: true, retrieval: true },
  { code: 'ar-TN', label: 'تونسي / Tunisien', interface: true, chatUnderstanding: true, retrieval: true },
];

/**
 * Extensible capability registry. Languages beyond the four with dedicated
 * handling are declared here with honest capability flags — a language is
 * listed ONLY for what it can actually do today. New languages are added by
 * appending an entry; nothing else needs to change.
 *
 * "aiInput" means the AI model can generally understand and reply in the
 * language (large models handle major languages, but quality varies and this
 * is not machine-verified per language — replies fall back to English when
 * the model cannot comply).
 */
export interface ExtendedLanguageInfo {
  code: string;           // BCP-47 base code, e.g. 'zh', 'tr'
  label: string;          // English name for display
  nativeLabel: string;    // name in the language itself
  aiInput: boolean;       // conversational model can handle this language
  retrieval: boolean;     // reliable literature retrieval (English-indexed DBs)
  speechRecognition: boolean; // browser speech input realistically available
  speechSynthesis: boolean;   // browser/device voices realistically available
  rtl: boolean;
  notes?: string;
}

export const EXTENDED_LANGUAGES: ExtendedLanguageInfo[] = [
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: true, notes: 'Right-to-left. AI replies work; evidence retrieval is English-only.' },
  { code: 'fa', label: 'Persian', nativeLabel: 'فارسی', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: true, notes: 'Right-to-left. AI replies work; evidence retrieval is English-only.' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'th', label: 'Thai', nativeLabel: 'ไทย', aiInput: true, retrieval: false, speechRecognition: true, speechSynthesis: true, rtl: false, notes: 'AI replies work but evidence retrieval is English-only; no interface translation yet.' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili', aiInput: true, retrieval: false, speechRecognition: false, speechSynthesis: false, rtl: false, notes: 'AI chat works; built-in device voices are rare but the AI voice fallback usually speaks. Evidence retrieval is English-only.' },
];

/** Honest summary of what a language can do across the app, at runtime. */
export function getExtendedLanguageInfo(code: string): ExtendedLanguageInfo | null {
  return EXTENDED_LANGUAGES.find((l) => l.code === code) ?? null;
}

// ─── Input language detection ────────────────────────────────────────────────

const FRENCH_MARKERS = [
  "j'ai", 'jai ', 'je ', 'mon ', 'ma ', 'mes ', 'le ', 'la ', 'les ', 'des ', 'une ',
  'cest', "c'est", 'cquoi', 'quoi', 'comment', 'pourquoi', 'avec', 'sans', 'pense',
  'suis', 'pere', 'mere', 'famille', 'douleur', 'fatigue', 'malade', 'soigner',
  'gerer', 'geree', 'traitement', 'tumeur', 'metastase', 'quels', 'quelle',
];

const ARABIZI_AR_MARKERS = [
  '3ndi', '3andi', 'andi ', 'famma', 'fama ', 'chnowa', 'chnoua', 'chnou', 'shnuwa', 'chnowa',
  'kifech', 'kifeh', 'kifach', 'chneya', 'chniya', 'barcha', 'beaucoup chwaya', 'chwaya',
  'bazda', 'yekhi', 'ya khoya', 'khoya', 'okhti', 'besmika', 'fi ', 'fil ', 'fel ',
  '3la', 'ala ', 'lawej', 'lawwej', 'tallem', 'fasserli', 'fassarli', 'fahemni',
  'chfi', 'wch', 'win ', 'wnow', 'howia', 'heyia', 'hedhi', 'hedha', 'hatha',
];

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;
const ARABIC_DIALECT_WORDS = new RegExp('(وش|شنوة|شنوا|فما|فمما|برشا|بزدة|كيفش|كيفاش|عندي|عنديا|توا|توها|باش|لازم|نحب|نحبو)');
const LATIN = /[a-z\u00C0-\u024F]/i;
// Function words that only exist in one Latin-script language. Word-boundary
// matched against the lowercased input; two hits out of three wins.
const LATIN_MARKERS: Record<string, string[]> = {
  es: [' que ', ' los ', ' las ', ' una ', ' para ', ' con ', ' por ', ' como ', ' pero ', ' más ', ' cual ', ' cuáles ', ' síntomas ', ' tratamiento ', ' médico ', ' duele ', ' síntoma '],
  de: [' und ', ' nicht ', ' ist ', ' ich ', ' mich ', ' die ', ' das ', ' der ', ' eine ', ' mit ', ' für ', ' aber ', ' wie ', ' was ', ' schmerzen ', ' behandlung ', ' arzt ', ' krankheit '],
  pt: [' que ', ' não ', ' uma ', ' para ', ' com ', ' como ', ' mas ', ' mais ', ' sintomas ', ' tratamento ', ' médico ', ' doença ', ' qual ', ' por favor '],
  it: [' che ', ' non ', ' sono ', ' una ', ' per ', ' con ', ' come ', ' ma ', ' più ', ' sintomi ', ' cura ', ' medico ', ' malattia ', ' quale ', ' dolore '],
  tr: [' ve ', ' bir ', ' değil ', ' için ', ' gibi ', ' ama ', ' nasıl ', ' ne ', ' hangi ', ' belirtileri ', ' tedavi ', ' doktor ', ' hastalık ', ' ağrı ', ' lütfen '],
  id: [' dan ', ' tidak ', ' yang ', ' untuk ', ' dengan ', ' apa ', ' bagaimana ', ' gejala ', ' pengobatan ', ' dokter ', ' penyakit ', ' silakan '],
  vi: [' và ', ' không ', ' của ', ' được ', ' là ', ' gì ', ' như thế nào ', ' triệu chứng ', ' điều trị ', ' bác sĩ ', ' bệnh '],
  sw: [' na ', ' ya ', ' kwa ', ' ni ', ' wa ', ' kwa nini ', ' vipindi ', ' matibabu ', ' daktari ', ' ugonjwa ', ' tafadhali '],
};

/** Best-effort detection of the language a user typed in. */
export function detectInputLanguage(text: string): DetectedLanguage {
  const t = text.trim();
  if (!t) return 'unknown';

  // Distinct scripts first — these cannot collide with each other.
  if (/[\u3040-\u30FF\u31F0-\u31FF]/.test(t)) return 'ja';
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(t)) return 'ko';
  if (/[\u4E00-\u9FFF\u3400-\u4DBF]/.test(t)) {
    // Kana presence already returned above; pure han means Chinese.
    return 'zh';
  }
  if (/[\u0E00-\u0E7F]/.test(t)) return 'th';
  if (/[\u0900-\u097F]/.test(t)) return 'hi';
  if (/[\u0980-\u09FF]/.test(t)) return 'bn';

  if (ARABIC_SCRIPT.test(t)) {
    if (ARABIC_DIALECT_WORDS.test(t)) return 'ar-TN';
    // Persian and Urdu use the Arabic script plus their own letters.
    if (/[\u0679\u0688\u0691\u06BA\u06BE\u06C1\u06C3\u06D2]/.test(t)) return 'ur';
    if (/[\u067E\u0686\u0698\u06AF\u06A9\u06CC]/.test(t)) return 'fa';
    return 'ar';
  }
  if (!LATIN.test(t)) return 'unknown';

  const lower = ' ' + t.toLowerCase().replace(/[\u2019\u2018]/g, "'") + ' ';

  // Tunisian Arabizi: dialect words, often mixed with digit-letters (3, 7, 9).
  const isArabizi = ARABIZI_AR_MARKERS.some((m) => lower.includes(m));

  let frScore = 0;
  for (const m of FRENCH_MARKERS) {
    if (lower.includes(' ' + m) || lower.includes(m + ' ')) frScore++;
  }
  if (/[\u00E8\u00E9\u00EA\u00E0\u00E7\u00F9]/.test(lower)) frScore += 2;
  if (/\b(je|tu|elle|nous|vous|pas|plus|tr\u00E8s)\b/.test(lower)) frScore += 2;

  if (isArabizi) return frScore >= 4 ? 'fr' : 'ar-TN';

  // Other Latin-script languages: most marker hits wins; tie goes to French,
  // then English.
  let bestLang: DetectedLanguage = frScore >= 2 ? 'fr' : 'en';
  let bestScore = frScore;
  for (const [lang, markers] of Object.entries(LATIN_MARKERS)) {
    let score = 0;
    for (const m of markers) {
      if (lower.includes(m)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang as DetectedLanguage;
    }
  }
  return bestLang;
}

// ─── Medical-term normalization for retrieval ────────────────────────────────

/**
 * Map informal/multilingual phrasing to English medical terms that PubMed /
 * Europe PMC are actually indexed on. This is translation-for-retrieval only:
 * the user's own words are never altered in the conversation.
 */
export function normalizeForRetrieval(text: string): string {
  const lower = text.toLowerCase().replace(/[\u2019\u2018]/g, "'");
  const terms = new Set<string>();

  // Cancers (EN + FR + AR names and everyday variants)
  const cancerTerms: Array<[RegExp, string]> = [
    [/\b(bone|os|des os|osteo|ost\u00E9o|sarcome|sarcoma|osteosarcome|osteosarcoma|ewings?|3tham|3azam|adhm|athem)\b|\u0639\u0638\u0627\u0645|\u0639\u0636\u0627\u0645/, 'bone cancer'],
    [/\b(breast|sein|du sein|mammaire)\b|الثدي|ثدي/, 'breast cancer'],
    [/(?:سرطان|كانسر|السرطان)/, 'cancer'],
    [/\b(cancer|kanker|cancerous)\b/, 'cancer'],
    [/\b(lung|poumon|poumons|pulmonaire)\b|رئة|رئوي/, 'lung cancer'],
    [/\b(colorectal|colon|rectum|c\u00F4lon|intestin)\b|القولون|المستقيم/, 'colorectal cancer'],
    [/\b(liver|foie|hépatique|h\u00E9patique)\b|كبد/, 'liver cancer'],
    [/\bpancrea|pancr\u00E9a|بنكرياس/, 'pancreatic cancer'],
    [/prostate|بروستات/, 'prostate cancer'],
    [/\b(leukemia|leuc\u00E9mie|leucemie)\b|سرطان الدم/, 'leukemia'],
    [/\b(lymphoma|lymphome)\b|لمفوما/, 'lymphoma'],
    [/\b(melanoma|m\u00E9lanome)\b|ميلانوما/, 'melanoma'],
    [/\b(ovar|ovaire|ovaires)\b|المبيض/, 'ovarian cancer'],
    [/\bcervic|col de l'ut\u00E9rus|عنق الرحم/, 'cervical cancer'],
    [/\b(stomach|estomac)\b|معدة/, 'gastric cancer'],
    [/\b(brain|cerveau|c\u00E9r\u00E9bral)\b|الدماغ|المخ/, 'brain tumor'],
    [/\b(kidney|rein|reins|renal)\b|الكلى|كلوي/, 'kidney cancer'],
    [/\b(bladder|vessie)\b|المثانة/, 'bladder cancer'],
    [/thyroid|thyro\u00EFde|الغدة الدرقية/, 'thyroid cancer'],
    [/\b(skin|peau)\b|الجلد/, 'skin cancer'],
  ];

  // Other medical concepts
  const conceptTerms: Array<[RegExp, string]> = [
    [/\b(metasta|m\u00E9tasta)\b|انتشار|نقائل/, 'metastasis'],
    [/\b(chimio|chemo)\b|العلاج الكيميائي/, 'chemotherapy'],
    [/\bradioth|radioth\u00E9rapie|radiation|العلاج الإشعاعي/, 'radiotherapy'],
    [/immunother|immunoth\u00E9rapie|العلاج المناعي/, 'immunotherapy'],
    [/\b(diabete|diab\u00E8te|diabetic)\b|السكري|السكر/, 'diabetes'],
    [/\b(pronosti|survie|survival)\b|إنذار|بقاء/, 'survival'],
    [/\b(stade|stage)\b|مرحلة/, 'cancer stage'],
  ];

  for (const [re, term] of [...cancerTerms, ...conceptTerms]) {
    if (re.test(lower)) terms.add(term);
  }

  return Array.from(terms).join(' ');
}

// ─── Browser speech capabilities (checked at runtime) ───────────────────────

type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as SpeechRecognitionCtor | null;
}

export function speechInputSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export function speechOutputSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Best BCP-47 tag for speech input/output for a picked language. */
export function speechTagFor(code: string): string {
  const map: Record<string, string> = {
    en: 'en-US', fr: 'fr-FR', ar: 'ar-SA',
    es: 'es-ES', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', tr: 'tr-TR',
    zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', hi: 'hi-IN',
    ur: 'ur-PK', fa: 'fa-IR', bn: 'bn-BD', id: 'id-ID',
    vi: 'vi-VN', th: 'th-TH', sw: 'sw-KE',
  };
  return map[code] ?? `${code}-${code.toUpperCase()}`;
}

/** Human-readable name for a picked language, used in capability notes. */
export function languageDisplayName(code: string): string {
  const all = [...LANGUAGE_CAPABILITIES.map((c) => ({ code: c.code, label: c.label })), ...EXTENDED_LANGUAGES.map((l) => ({ code: l.code, label: l.label }))];
  return all.find((l) => l.code === code)?.label ?? code;
}

/** True when the picked language has honest voice caveats (e.g. Swahili). */
export function voiceLimitedFor(code: string): boolean {
  const info = EXTENDED_LANGUAGES.find((l) => l.code === code);
  return info ? !info.speechRecognition || !info.speechSynthesis : false;
}
