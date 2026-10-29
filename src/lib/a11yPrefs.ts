// Accessibility preference model, persistence, and display application.
// Shared by the accessibility menu, A11yContext, and Companion voice hooks.

import { useEffect, useState } from 'react';

export interface A11yPrefs {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  nightMode: boolean;
  blueLight: boolean;
  daltonism: boolean;
  readingMode: boolean;
  dyslexia: boolean;
  listeningMode: boolean;
  largeTargets: boolean;
  voiceGuide: boolean;
  quickPhrases: boolean;
  oneHanded: boolean;
  // Eye Comfort & Display Protection
  warmIntensity: number;      // 0–100, maps to overlay alpha 0–0.40
  warmSchedule: boolean;      // apply warm filter only inside the window
  warmStart: string;          // "HH:MM"
  warmEnd: string;            // "HH:MM"
  followSystemTheme: boolean; // dark mode follows prefers-color-scheme
  breakReminders: boolean;
  breakIntervalMin: number;
}

export const STORAGE_KEY = 'oncofrontier-a11y';

export const DEFAULT_PREFS: A11yPrefs = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  nightMode: false,
  blueLight: false,
  daltonism: false,
  readingMode: false,
  dyslexia: false,
  listeningMode: false,
  largeTargets: false,
  voiceGuide: false,
  quickPhrases: false,
  oneHanded: false,
  warmIntensity: 35,
  warmSchedule: false,
  warmStart: '21:00',
  warmEnd: '07:00',
  followSystemTheme: false,
  breakReminders: false,
  breakIntervalMin: 20,
};

export function isWithinSchedule(start: string, end: string, now = new Date()): boolean {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  return s <= e ? mins >= s && mins < e : mins >= s || mins < e;
}

/** Warm filter is on when toggled manually, or inside the scheduled window. */
export function warmActive(prefs: A11yPrefs, now = new Date()): boolean {
  if (prefs.warmSchedule) return isWithinSchedule(prefs.warmStart, prefs.warmEnd, now);
  return prefs.blueLight;
}

export function loadA11yPrefs(): A11yPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<A11yPrefs> & { dayMode?: boolean };
    delete parsed.dayMode; // obsolete flag that used to gate night mode
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function applyA11yPrefs(prefs: A11yPrefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('a11y-large-text', prefs.largeText);
  root.classList.toggle('a11y-high-contrast', prefs.highContrast);
  root.classList.toggle('a11y-reduced-motion', prefs.reducedMotion);
  root.classList.toggle('a11y-blue-light', warmActive(prefs));
  root.classList.toggle('a11y-daltonism', prefs.daltonism);
  root.classList.toggle('a11y-reading', prefs.readingMode);
  root.classList.toggle('a11y-dyslexia', prefs.dyslexia);
  root.classList.toggle('a11y-large-targets', prefs.largeTargets);
  root.classList.toggle('a11y-one-handed', prefs.oneHanded);
  // Warm overlay strength from the intensity slider (0–0.40 alpha).
  const alpha = Math.max(0, Math.min(100, prefs.warmIntensity)) / 100 * 0.4;
  root.style.setProperty('--warm-alpha', alpha.toFixed(2));
  // Night mode: manual toggle, or follow the OS light/dark preference.
  const prefersDark =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  root.classList.toggle('a11y-night', prefs.nightMode || (prefs.followSystemTheme && prefersDark));
}

export function useA11ySpeech() {
  const [mode, setMode] = useState(() => {
    const p = loadA11yPrefs();
    return { autoSpeak: p.listeningMode || p.voiceGuide, quickPhrases: p.quickPhrases, voiceGuide: p.voiceGuide };
  });

  useEffect(() => {
    const update = (event: Event) => {
      const p = (event as CustomEvent<A11yPrefs>).detail ?? loadA11yPrefs();
      setMode({ autoSpeak: p.listeningMode || p.voiceGuide, quickPhrases: p.quickPhrases, voiceGuide: p.voiceGuide });
    };
    window.addEventListener('oncofrontier-a11y-changed', update);
    return () => window.removeEventListener('oncofrontier-a11y-changed', update);
  }, []);

  return mode;
}
