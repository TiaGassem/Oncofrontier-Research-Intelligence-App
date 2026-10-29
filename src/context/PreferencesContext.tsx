// Experience preferences: role, workspace density, and whether onboarding is
// complete. Persisted locally so choices survive reloads without an account.
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import {
  loadExperience, saveExperience, ROLE_MODULES, ROLE_START_VIEW,
  type ExperiencePrefs, type ExperienceRole, type WorkspaceDensity,
} from '@/lib/experience';
import type { ViewName } from '@/types';

interface PreferencesValue extends ExperiencePrefs {
  /** Modules this role should see first, in order. */
  primaryModules: ViewName[];
  /** Where this role lands after onboarding. */
  startView: ViewName;
  setRole: (role: ExperienceRole) => void;
  setDensity: (density: WorkspaceDensity) => void;
  complete: (next: { role: ExperienceRole; density: WorkspaceDensity }) => void;
  restart: () => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ExperiencePrefs>(loadExperience);

  useEffect(() => {
    saveExperience(prefs);
  }, [prefs]);

  // Density is applied as a document attribute so CSS can honour it without
  // every module knowing about preferences.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.density = prefs.density;
  }, [prefs.density]);

  const setRole = useCallback((role: ExperienceRole) => {
    setPrefs((p) => ({ ...p, role }));
  }, []);

  const setDensity = useCallback((density: WorkspaceDensity) => {
    setPrefs((p) => ({ ...p, density }));
  }, []);

  const complete = useCallback((next: { role: ExperienceRole; density: WorkspaceDensity }) => {
    setPrefs({ ...next, onboarded: true });
  }, []);

  const restart = useCallback(() => {
    setPrefs((p) => ({ ...p, onboarded: false }));
  }, []);

  const value = useMemo<PreferencesValue>(() => ({
    ...prefs,
    primaryModules: ROLE_MODULES[prefs.role],
    startView: ROLE_START_VIEW[prefs.role],
    setRole,
    setDensity,
    complete,
    restart,
  }), [prefs, setRole, setDensity, complete, restart]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
