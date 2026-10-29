// Experience model: who the visitor is, how dense the workspace should be, and
// whether onboarding has been completed. Persisted locally only — no health
// data, no diagnoses, nothing that identifies a person.

import type { Language, ViewName } from '@/types';

export type ExperienceRole =
  | 'researcher'
  | 'clinician'
  | 'patient'
  | 'caregiver'
  | 'industry'
  | 'general';

export type WorkspaceDensity = 'simple' | 'standard' | 'advanced';

export interface ExperiencePrefs {
  role: ExperienceRole;
  density: WorkspaceDensity;
  onboarded: boolean;
}

export const EXPERIENCE_STORAGE_KEY = 'oncofrontier-experience';

export const DEFAULT_EXPERIENCE: ExperiencePrefs = {
  role: 'general',
  density: 'standard',
  onboarded: false,
};

export const ROLES: ExperienceRole[] = [
  'researcher', 'clinician', 'patient', 'caregiver', 'industry', 'general',
];

export const DENSITIES: WorkspaceDensity[] = ['simple', 'standard', 'advanced'];

/**
 * Modules each role sees first. Order matters — it is also the dashboard order.
 * Every other module stays reachable through "All modules", so choosing a role
 * never removes functionality.
 */
export const ROLE_MODULES: Record<ExperienceRole, ViewName[]> = {
  researcher: ['curemap', 'discovery', 'resistance', 'equity', 'assistant', 'planner', 'library'],
  clinician: ['curemap', 'resistance', 'biomarkers', 'burden', 'anatomy', 'assistant', 'library'],
  patient: ['companion', 'anatomy', 'library'],
  caregiver: ['companion', 'anatomy', 'pdf', 'library'],
  industry: ['discovery', 'curemap', 'biomarkers', 'planner', 'library'],
  general: ['companion', 'curemap', 'anatomy'],
};

/** The module a role lands on after onboarding. */
export const ROLE_START_VIEW: Record<ExperienceRole, ViewName> = {
  researcher: 'dashboard',
  clinician: 'dashboard',
  patient: 'companion',
  caregiver: 'companion',
  industry: 'dashboard',
  general: 'dashboard',
};

export interface LanguageChoice {
  code: Language;
  label: string;
  native: string;
  /** True only when the whole interface is translated, not just core labels. */
  complete: boolean;
}

// The three complete interfaces come first; the rest are partial (core labels
// only) exactly as documented in the README, with English fallback elsewhere.
export const LANGUAGE_CHOICES: LanguageChoice[] = [
  { code: 'en', label: 'English', native: 'English', complete: true },
  { code: 'fr', label: 'French', native: 'Français', complete: true },
  { code: 'ar', label: 'Arabic', native: 'العربية', complete: true },
  { code: 'ar', label: 'Tunisian Arabic', native: 'تونسي', complete: true },
  { code: 'es', label: 'Spanish', native: 'Español', complete: false },
  { code: 'de', label: 'German', native: 'Deutsch', complete: false },
  { code: 'pt', label: 'Portuguese', native: 'Português', complete: false },
  { code: 'it', label: 'Italian', native: 'Italiano', complete: false },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', complete: false },
  { code: 'zh', label: 'Chinese', native: '中文', complete: false },
  { code: 'ja', label: 'Japanese', native: '日本語', complete: false },
  { code: 'ko', label: 'Korean', native: '한국어', complete: false },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', complete: false },
  { code: 'ur', label: 'Urdu', native: 'اردو', complete: false },
  { code: 'fa', label: 'Persian', native: 'فارسی', complete: false },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', complete: false },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', complete: false },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', complete: false },
  { code: 'th', label: 'Thai', native: 'ไทย', complete: false },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', complete: false },
];

export function loadExperience(): ExperiencePrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_EXPERIENCE };
  try {
    const raw = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_EXPERIENCE };
    const parsed = JSON.parse(raw) as Partial<ExperiencePrefs>;
    return {
      role: ROLES.includes(parsed.role as ExperienceRole) ? (parsed.role as ExperienceRole) : DEFAULT_EXPERIENCE.role,
      density: DENSITIES.includes(parsed.density as WorkspaceDensity)
        ? (parsed.density as WorkspaceDensity)
        : DEFAULT_EXPERIENCE.density,
      onboarded: parsed.onboarded === true,
    };
  } catch {
    return { ...DEFAULT_EXPERIENCE };
  }
}

export function saveExperience(prefs: ExperiencePrefs): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // private mode — the choice still applies for this session
  }
}

export function hasStoredExperience(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(EXPERIENCE_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Ordered module list for a role: its own modules first, then everything else. */
export function orderModulesForRole<T extends { id: ViewName }>(modules: T[], role: ExperienceRole): T[] {
  const preferred = ROLE_MODULES[role];
  const rank = (id: ViewName) => {
    const i = preferred.indexOf(id);
    return i === -1 ? preferred.length + modules.findIndex((m) => m.id === id) : i;
  };
  return [...modules].sort((a, b) => rank(a.id) - rank(b.id));
}
