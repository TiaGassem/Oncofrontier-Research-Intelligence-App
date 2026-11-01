// Accessibility preference model, persistence, and display application.
// Shared by the accessibility menu, A11yContext, and Companion voice hooks.

import { useEffect, useState } from 'react';

/** Colour-vision palettes. 'none' keeps the default teal/navy scheme. */
export type ColorBlindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochromacy';

export const COLOR_BLIND_MODES: ColorBlindMode[] = [
  'none', 'deuteranopia', 'protanopia', 'tritanopia', 'monochromacy',
];

/**
 * Swatches shown in the picker. These are the colours the interface actually
 * uses in that palette (accent, accent-dark, alert, warning, success, chart).
 */
export const COLOR_BLIND_SWATCHES: Record<ColorBlindMode, string[]> = {
  none: ['#0d9488', '#0f766e', '#dc2626', '#d97706', '#16a34a', '#3b82f6'],
  deuteranopia: ['#0072b2', '#005a8e', '#d55e00', '#e69f00', '#56b4e9', '#009e73'],
  protanopia: ['#0072b2', '#00527f', '#cc79a7', '#e69f00', '#56b4e9', '#f0e442'],
  tritanopia: ['#c2410c', '#9a3412', '#0072b2', '#b45309', '#0f766e', '#7c3aed'],
  monochromacy: ['#1f2937', '#111827', '#4b5563', '#6b7280', '#9ca3af', '#374151'],
};

export interface A11yPrefs {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  nightMode: boolean;
  blueLight: boolean;
  colorBlind: ColorBlindMode;
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
  colorBlind: 'none',
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
    const parsed = JSON.parse(raw) as Partial<A11yPrefs> & { dayMode?: boolean; daltonism?: boolean };
    delete parsed.dayMode; // obsolete flag that used to gate night mode
    // The old single checkbox becomes the deuteranopia palette, which is the
    // most common deficiency and was the intent of that toggle.
    if (parsed.daltonism === true && parsed.colorBlind === undefined) {
      parsed.colorBlind = 'deuteranopia';
    }
    delete parsed.daltonism;
    if (!COLOR_BLIND_MODES.includes(parsed.colorBlind as ColorBlindMode)) {
      parsed.colorBlind = DEFAULT_PREFS.colorBlind;
    }
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
  const colorBlind = COLOR_BLIND_MODES.includes(prefs.colorBlind) ? prefs.colorBlind : 'none';
  root.classList.toggle('a11y-daltonism', colorBlind !== 'none');
  if (colorBlind === 'none') delete root.dataset.cb;
  else root.dataset.cb = colorBlind;
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
