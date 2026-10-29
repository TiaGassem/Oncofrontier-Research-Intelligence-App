import { useState, useEffect, useRef, useId } from 'react';
import {
  Accessibility, RotateCcw, Moon, Eye, Hand, Globe, AlertTriangle, Sun, Timer, Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useA11yPrefsContext } from '@/context/A11yContext';
import { getTranslation } from '@/lib/i18n';
import { EXTENDED_LANGUAGES, voiceLimitedFor } from '@/lib/languageSupport';
import type { A11yPrefs } from '@/lib/a11yPrefs';

type BooleanPrefKey = { [K in keyof A11yPrefs]: A11yPrefs[K] extends boolean ? K : never }[keyof A11yPrefs];
type ToggleRow = { key: BooleanPrefKey; label: string; hint: string };

function ToggleRow({ row, prefs, toggle }: { row: ToggleRow; prefs: A11yPrefs; toggle: (k: BooleanPrefKey) => void }) {
  return (
    <label
      className="flex items-start justify-between gap-3 text-sm text-navy-800 cursor-pointer py-1"
      title={row.hint}
    >
      <span>
        {row.label}
        <span className="block text-[10px] text-navy-400 font-normal">{row.hint}</span>
      </span>
      <input
        type="checkbox"
        checked={prefs[row.key]}
        onChange={() => toggle(row.key)}
        className="w-4 h-4 mt-1 accent-teal-500 cursor-pointer flex-shrink-0"
      />
    </label>
  );
}

export function AccessibilityMenu() {
  const { prefs, toggle, setPrefValue, applyPreset, reset } = useA11yPrefsContext();
  const [open, setOpen] = useState(false);
  const { language } = useApp();
  const t = getTranslation(language);
  const d = t.displayOptions;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const selector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(selector) ?? []);
    getFocusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          e.preventDefault();
        } else if (e.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !panel?.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const visualRows: ToggleRow[] = [
    { key: 'largeText', label: d.largeText, hint: d.largeTextHint },
    { key: 'highContrast', label: d.highContrast, hint: d.highContrastHint },
    { key: 'daltonism', label: d.daltonism, hint: d.daltonismHint },
    { key: 'readingMode', label: d.readingMode, hint: d.readingModeHint },
    { key: 'dyslexia', label: d.dyslexiaMode, hint: d.dyslexiaModeHint },
  ];
  const motorRows: ToggleRow[] = [
    { key: 'listeningMode', label: d.listeningMode, hint: d.listeningModeHint },
    { key: 'voiceGuide', label: d.voiceGuide, hint: d.voiceGuideHint },
    { key: 'largeTargets', label: d.largeTargets, hint: d.largeTargetsHint },
    { key: 'quickPhrases', label: d.quickPhrases, hint: d.quickPhrasesHint },
    { key: 'oneHanded', label: d.oneHanded, hint: d.oneHandedHint },
    { key: 'reducedMotion', label: d.reducedMotion, hint: d.reducedMotionHint },
  ];

  const presets: { id: 'paralysis' | 'blindness' | 'lowVision' | 'dyslexia'; label: string; hint: string }[] = [
    { id: 'paralysis', label: d.presetParalysis, hint: d.presetParalysisHint },
    { id: 'blindness', label: d.presetBlindness, hint: d.presetBlindnessHint },
    { id: 'lowVision', label: d.presetLowVision, hint: d.presetLowVisionHint },
    { id: 'dyslexia', label: d.presetDyslexia, hint: d.presetDyslexiaHint },
  ];

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-label={d.menuLabel}
        title={d.menuLabel}
        className="flex items-center gap-1.5 w-full bg-navy-800 text-navy-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-navy-700 transition-colors"
      >
        <Accessibility className="w-3.5 h-3.5" />
        {d.menuLabel}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={d.menuLabel}
            className="absolute bottom-full mb-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-navy-100 p-3 z-50 max-h-[70vh] overflow-y-auto space-y-3"
          >
            <div>
              <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1">
                {d.presetsTitle}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    title={p.hint}
                    className="text-start px-2 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 hover:bg-teal-100 transition-colors"
                  >
                    <span className="block text-[11px] font-medium leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-navy-100 pt-2">
              <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Moon className="w-3 h-3" /> {d.themeTitle}
              </p>
              <ToggleRow row={{ key: 'nightMode', label: d.nightMode, hint: d.nightModeHint }} prefs={prefs} toggle={toggle} />
              <ToggleRow row={{ key: 'followSystemTheme', label: d.followSystem, hint: d.followSystemHint }} prefs={prefs} toggle={toggle} />
              <ToggleRow row={{ key: 'blueLight', label: d.blueLightFilter, hint: d.blueLightHint }} prefs={prefs} toggle={toggle} />

              {/* Warm filter intensity */}
              <label className="block py-1 text-sm text-navy-800">
                <span className="block">{d.warmIntensity}</span>
                <span className="block text-[10px] text-navy-400 font-normal mb-1">{d.warmIntensityHint}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={prefs.warmIntensity}
                  onChange={(e) => setPrefValue('warmIntensity', Number(e.target.value))}
                  className="w-full accent-teal-500"
                  aria-valuetext={`${prefs.warmIntensity}%`}
                />
              </label>

              {/* Scheduled activation */}
              <ToggleRow row={{ key: 'warmSchedule', label: d.warmSchedule, hint: d.warmScheduleHint }} prefs={prefs} toggle={toggle} />
              {prefs.warmSchedule && (
                <div className="flex gap-2 items-center py-1 text-xs text-navy-700">
                  <label className="flex items-center gap-1">
                    <span>{d.warmFrom}</span>
                    <input
                      type="time"
                      value={prefs.warmStart}
                      onChange={(e) => setPrefValue('warmStart', e.target.value)}
                      className="border border-navy-100 rounded px-1.5 py-1 text-xs"
                      aria-label={d.warmFrom}
                    />
                  </label>
                  <label className="flex items-center gap-1">
                    <span>{d.warmTo}</span>
                    <input
                      type="time"
                      value={prefs.warmEnd}
                      onChange={(e) => setPrefValue('warmEnd', e.target.value)}
                      className="border border-navy-100 rounded px-1.5 py-1 text-xs"
                      aria-label={d.warmTo}
                    />
                  </label>
                </div>
              )}

              {/* Color-accuracy warning for scientific content */}
              <p className="flex items-start gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1.5 mt-1 leading-relaxed">
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {d.colorAccuracyWarning}
              </p>
            </div>

            {/* Break reminders */}
            <div className="border-t border-navy-100 pt-2">
              <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Timer className="w-3 h-3" /> {d.breakTitle}
              </p>
              <ToggleRow row={{ key: 'breakReminders', label: d.breakReminders, hint: d.breakRemindersHint }} prefs={prefs} toggle={toggle} />
              {prefs.breakReminders && (
                <label className="block py-1 text-sm text-navy-800">
                  <span className="block">{d.breakInterval}</span>
                  <select
                    value={prefs.breakIntervalMin}
                    onChange={(e) => setPrefValue('breakIntervalMin', Number(e.target.value))}
                    className="border border-navy-100 rounded px-2 py-1 text-xs mt-1"
                    aria-label={d.breakInterval}
                  >
                    {[10, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>{m} min</option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {/* UV Safety — clearly separated educational section */}
            <details className="border-t border-navy-100 pt-2 group/uv">
              <summary className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider cursor-pointer list-none flex items-center gap-1 select-none">
                <Sun className="w-3 h-3" /> {d.uvTitle}
                <Info className="w-3 h-3 text-navy-300 group-open/uv:hidden" aria-hidden="true" />
              </summary>
              <div className="text-[11px] text-navy-600 leading-relaxed mt-2 space-y-2">
                <p>{d.uvIntro}</p>
                <p>{d.uvVsBlueLight}</p>
                <p className="font-medium text-navy-800">{d.uvGuidanceTitle}</p>
                <ul className="list-disc ps-4 space-y-0.5">
                  <li>{d.uvClothing}</li>
                  <li>{d.uvShade}</li>
                  <li>{d.uvSunglasses}</li>
                  <li>{d.uvSunscreen}</li>
                </ul>
                <p className="bg-amber-50 border border-amber-100 rounded px-2 py-1.5 text-amber-800">
                  {d.uvFiltersNotProtection}
                </p>
                <p className="text-navy-400">{d.uvScreensNotSun}</p>
              </div>
            </details>

            <div className="border-t border-navy-100 pt-2">
              <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {d.visualTitle}
              </p>
              {visualRows.map((row) => (
                <ToggleRow key={row.key} row={row} prefs={prefs} toggle={toggle} />
              ))}
            </div>

            <div className="border-t border-navy-100 pt-2">
              <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Hand className="w-3 h-3" /> {d.motorTitle}
              </p>
              {motorRows.map((row) => (
                <ToggleRow key={row.key} row={row} prefs={prefs} toggle={toggle} />
              ))}
            </div>

            <p className="text-[10px] text-navy-400 leading-relaxed border-t border-navy-100 pt-2">
              {d.chartNote}
            </p>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-navy-500 hover:text-navy-800 py-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {d.reset}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function LanguagePicker() {
  const [open, setOpen] = useState(false);
  const { language, userLanguage, setLanguage } = useApp();
  const t = getTranslation(language);
  const a = t.accessible;
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const fullList = [
    ...EXTENDED_LANGUAGES,
    ...(['ar-TN'] as const).map((code) => ({
      code, label: 'Tunisian Arabic', nativeLabel: 'تونسي',
      aiInput: true, retrieval: true, speechRecognition: true, speechSynthesis: true,
      rtl: true, notes: 'Chat understands Tunisian Arabic and Arabizi; replies are usually in Arabic.',
    })),
  ];

  const current = fullList.find((l) => l.code === userLanguage);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 w-full bg-navy-800 text-navy-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-navy-700 transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="truncate">{current?.nativeLabel ?? a.languageTitle}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div
            role="group"
            aria-label={a.languageTitle}
            className="absolute bottom-full mb-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-navy-100 p-3 z-50 max-h-[70vh] overflow-y-auto space-y-2"
          >
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">{a.interfaceLanguages}</p>
            {(['en', 'fr', 'ar'] as const).map((code) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setOpen(false); }}
                className={`w-full text-start px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  userLanguage === code ? 'bg-teal-50 text-teal-700 font-medium' : 'text-navy-700 hover:bg-navy-50'
                }`}
              >
                {code === 'en' ? 'English' : code === 'fr' ? 'Français' : 'العربية'}
                <span className="block text-[10px] text-navy-400 font-normal">{a.interfaceNote}</span>
              </button>
            ))}
            <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider border-t border-navy-100 pt-2">{a.moreLanguages}</p>
            {fullList
              .filter((l) => !(['en', 'fr', 'ar'] as string[]).includes(l.code))
              .map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code as typeof userLanguage); setOpen(false); }}
                  className={`w-full text-start px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    userLanguage === l.code ? 'bg-teal-50 text-teal-700 font-medium' : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{l.nativeLabel}</span>
                    <span className="text-[10px] text-navy-400">({l.label})</span>
                    {l.rtl && <span className="text-[10px] text-navy-400">RTL</span>}
                  </span>
                  <span className="block text-[10px] text-navy-400 font-normal leading-snug">
                    {a.aiNote}
                    {voiceLimitedFor(l.code) && (
                      <span className="flex items-start gap-1 text-amber-600 mt-0.5">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {a.limitedVoice}
                      </span>
                    )}
                  </span>
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
