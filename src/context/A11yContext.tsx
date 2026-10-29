// Central accessibility preferences provider: one instance at the app root
// applies prefs to <html>, persists them, and broadcasts changes so any
// component (chat auto-speak, focus, themes) reads live values.
import {
  createContext, useContext, useEffect, useState, useCallback,
  useMemo, type ReactNode,
} from 'react';
import {
  loadA11yPrefs, applyA11yPrefs, warmActive, type A11yPrefs,
  DEFAULT_PREFS,
} from '@/lib/a11yPrefs';

interface A11yContextValue {
  prefs: A11yPrefs;
  toggle: (key: keyof A11yPrefs) => void;
  setPref: (key: keyof A11yPrefs, value: boolean) => void;
  setPrefValue: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  applyPreset: (preset: 'paralysis' | 'blindness' | 'lowVision' | 'dyslexia') => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(loadA11yPrefs);

  // Apply to the document and persist on every change. This is the single
  // place prefs touch the DOM — no per-component copies.
  useEffect(() => {
    try {
      localStorage.setItem('oncofrontier-a11y', JSON.stringify(prefs));
    } catch {
      // private mode — prefs still apply for this session
    }
    applyA11yPrefs(prefs);
    window.dispatchEvent(new CustomEvent('oncofrontier-a11y-changed', { detail: prefs }));
  }, [prefs]);

  // Scheduled warm filter: re-check the window every minute so the filter
  // turns itself on/off without a user interaction.
  useEffect(() => {
    if (!prefs.warmSchedule) return;
    const tick = () => {
      const active = warmActive(prefs);
      document.documentElement.classList.toggle('a11y-blue-light', active);
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [prefs]);

  // Follow the OS light/dark preference live when enabled.
  useEffect(() => {
    if (!prefs.followSystemTheme || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyA11yPrefs(prefs);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [prefs]);

  const toggle = useCallback((key: keyof A11yPrefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const setPref = useCallback((key: keyof A11yPrefs, value: boolean) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const setPrefValue = useCallback(<K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const applyPreset = useCallback((preset: 'paralysis' | 'blindness' | 'lowVision' | 'dyslexia') => {
    setPrefs((p) => {
      const base = { ...p };
      if (preset === 'paralysis') {
        return { ...base, largeTargets: true, quickPhrases: true, voiceGuide: true, listeningMode: true, oneHanded: true };
      }
      if (preset === 'blindness') {
        return { ...base, voiceGuide: true, listeningMode: true, largeText: true, largeTargets: true };
      }
      if (preset === 'lowVision') {
        return { ...base, highContrast: true, largeText: true, largeTargets: true };
      }
      return { ...base, dyslexia: true, readingMode: true, reducedMotion: true, largeText: true };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setPrefs({ ...DEFAULT_PREFS });
  }, []);

  const value = useMemo(
    () => ({ prefs, toggle, setPref, setPrefValue, applyPreset, reset: resetToDefaults }),
    [prefs, toggle, setPref, setPrefValue, applyPreset, resetToDefaults]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11yPrefsContext(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11yPrefsContext requires A11yProvider');
  return ctx;
}
