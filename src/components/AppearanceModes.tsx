import { useEffect, useRef, useState } from 'react';
import { Moon, Droplet, Eye, Palette, Zap, SlidersHorizontal } from 'lucide-react';
import { useA11yPrefsContext } from '@/context/A11yContext';
import { useApp } from '@/context/AppContext';
import { getSurfaceStrings } from '@/lib/onboardingTranslations';

type ModeKey = 'nightMode' | 'blueLight' | 'daltonism' | 'highContrast' | 'reducedMotion';

const MODES: { key: ModeKey; icon: typeof Moon }[] = [
  { key: 'nightMode', icon: Moon },
  { key: 'blueLight', icon: Droplet },
  { key: 'daltonism', icon: Palette },
  { key: 'highContrast', icon: Eye },
  { key: 'reducedMotion', icon: Zap },
];

/**
 * Compact appearance switcher: day/night, colour-blind palette, anti-UV warm
 * filter, high contrast and reduced motion. Writes into the same A11yContext
 * the sidebar menu uses, so choices persist and apply to <html> immediately —
 * one theme system, not two.
 */
export function AppearanceModes({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { prefs, toggle } = useA11yPrefsContext();
  const { language } = useApp();
  const modes = getSurfaceStrings(language).onboarding.modes;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const labelFor = (key: ModeKey): string => {
    switch (key) {
      case 'nightMode':
        return prefs.nightMode ? modes.day : modes.night;
      case 'blueLight':
        return modes.antiUv;
      case 'daltonism':
        return modes.daltonism;
      case 'highContrast':
        return modes.contrast;
      case 'reducedMotion':
        return modes.motion;
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  const triggerClass = tone === 'dark'
    ? 'bg-navy-800 text-navy-200 hover:bg-navy-700'
    : 'bg-white text-navy-700 border border-navy-200 hover:border-navy-300';

  const activeCount = MODES.filter((mode) => (prefs[mode.key] as boolean)).length;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={modes.title}
        title={modes.title}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${triggerClass}`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        {modes.title}
        {activeCount > 0 && (
          <span className="rounded-full bg-teal-500 px-1.5 text-[10px] font-bold text-white" aria-hidden="true">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={modes.title}
          className="absolute end-0 z-50 mt-2 w-64 rounded-2xl border border-navy-200 bg-white p-3 shadow-lg"
        >
          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
            {modes.title}
          </p>
          <ul className="space-y-0.5">
            {MODES.map(({ key, icon: Icon }) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-sm text-navy-800 hover:bg-navy-50">
                  <Icon className="h-4 w-4 flex-shrink-0 text-teal-600" aria-hidden="true" />
                  <span className="flex-1">{labelFor(key)}</span>
                  <input
                    type="checkbox"
                    checked={prefs[key] as boolean}
                    onChange={() => toggle(key)}
                    className="h-4 w-4 accent-teal-600"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
