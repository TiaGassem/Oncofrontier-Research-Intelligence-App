import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ResearchRecord, ViewName, Language } from '@/types';
import { hasStoredExperience } from '@/lib/experience';

const LANGUAGE_KEY = 'oncofrontier-language';

// Languages with a complete interface translation. Regional variants (ar-TN,
// fr-CA, …) fall back to their parent language; anything else falls back to
// English for menus while the chat and voice features still honor the pick.
const TRANSLATED_LANGUAGES = ['en', 'fr', 'ar'];

function resolveInterfaceLanguage(code: Language): Language {
  if ((TRANSLATED_LANGUAGES as string[]).includes(code)) return code;
  if (code.startsWith('ar')) return 'ar';
  if (code.startsWith('fr')) return 'fr';
  return 'en';
}

const RTL_LANGUAGES = ['ar', 'ur', 'fa', 'he'];

function resolveDirection(code: Language): 'ltr' | 'rtl' {
  if (RTL_LANGUAGES.some((r) => code === r || code.startsWith(`${r}-`))) return 'rtl';
  return 'ltr';
}

interface AppState {
  selectedRecords: ResearchRecord[];
  toggleRecord: (record: ResearchRecord) => void;
  removeRecord: (record: ResearchRecord) => void;
  clearRecords: () => void;
  isRecordSelected: (record: ResearchRecord) => boolean;
  currentView: ViewName;
  setCurrentView: (view: ViewName) => void;
  language: Language;
  /** The language the user picked — may not have a full UI translation. */
  userLanguage: Language;
  /** Text direction of the user's picked language (RTL for Arabic script). */
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppState | null>(null);

const VALID_VIEWS: ViewName[] = [
  'home', 'welcome',
  'dashboard', 'curemap', 'resistance', 'equity', 'planner', 'assistant',
  'methodology', 'discovery', 'pdf', 'library', 'account', 'burden',
  'biomarkers', 'anatomy', 'companion',
  'privacy', 'terms', 'contact',
];

function viewFromHash(): ViewName {
  if (typeof window === 'undefined') return 'dashboard';
  const h = window.location.hash.replace(/^#\/?/, '');
  // First visit with no hash and no saved preferences opens the public site,
  // not the research dashboard.
  const fallback: ViewName = hasStoredExperience() ? 'dashboard' : 'home';
  if (!h) return fallback;
  // An unknown hash (a plain in-page anchor, a stale link) must never yank the
  // visitor to another page; keep the default view for that situation.
  return (VALID_VIEWS as string[]).includes(h) ? (h as ViewName) : fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedRecords, setSelectedRecords] = useState<ResearchRecord[]>([]);
  const [currentView, setCurrentView] = useState<ViewName>(viewFromHash);

  // Keep the URL hash in sync with the view: back/forward work and any
  // view can be deep-linked as /#/curemap, /#/library, etc.
  useEffect(() => {
    const applyHash = () => setCurrentView(viewFromHash());
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    const expected = `#/${currentView}`;
    if (window.location.hash !== expected) {
      window.history.replaceState(null, '', expected);
    }
  }, [currentView]);

  const navigate = useCallback((view: ViewName) => {
    setCurrentView(view);
    if (window.location.hash !== `#/${view}`) {
      window.history.pushState(null, '', `#/${view}`);
    }
  }, []);

  const [userLanguage, setUserLanguage] = useState<Language>(() => {
    if (typeof localStorage === 'undefined') return 'en';
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      return saved ?? 'en';
    } catch {
      return 'en';
    }
  });
  const language = resolveInterfaceLanguage(userLanguage);
  const direction = resolveDirection(userLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, userLanguage);
    } catch {
      // storage unavailable — preference still applies for this session
    }
  }, [userLanguage]);

  const toggleRecord = useCallback((record: ResearchRecord) => {
    setSelectedRecords((prev) => {
      const existing = prev.find(
        (r) =>
          (r.pmid && r.pmid === record.pmid) ||
          (r.doi && r.doi === record.doi) ||
          (r.nctId && r.nctId === record.nctId) ||
          r.id === record.id
      );
      if (existing) {
        return prev.filter(
          (r) =>
            !(
              (r.pmid && r.pmid === record.pmid) ||
              (r.doi && r.doi === record.doi) ||
              (r.nctId && r.nctId === record.nctId) ||
              r.id === record.id
            )
        );
      }
      return [...prev, record];
    });
  }, []);

  const removeRecord = useCallback((record: ResearchRecord) => {
    setSelectedRecords((prev) =>
      prev.filter(
        (r) =>
          !(
            (r.pmid && r.pmid === record.pmid) ||
            (r.doi && r.doi === record.doi) ||
            (r.nctId && r.nctId === record.nctId) ||
            r.id === record.id
          )
      )
    );
  }, []);

  const clearRecords = useCallback(() => setSelectedRecords([]), []);

  const isRecordSelected = useCallback(
    (record: ResearchRecord) =>
      selectedRecords.some(
        (r) =>
          (r.pmid && r.pmid === record.pmid) ||
          (r.doi && r.doi === record.doi) ||
          (r.nctId && r.nctId === record.nctId) ||
          r.id === record.id
      ),
    [selectedRecords]
  );

  return (
    <AppContext.Provider
      value={{
        selectedRecords,
        toggleRecord,
        removeRecord,
        clearRecords,
        isRecordSelected,
        currentView,
        setCurrentView: navigate,
        language,
        userLanguage,
        direction,
        setLanguage: setUserLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
