import { Palette } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useA11yPrefsContext } from '@/context/A11yContext';
import { getTranslation } from '@/lib/i18n';
import {
  COLOR_BLIND_MODES, COLOR_BLIND_SWATCHES, type ColorBlindMode,
} from '@/lib/a11yPrefs';

function labelFor(mode: ColorBlindMode, d: ReturnType<typeof getTranslation>['displayOptions']): string {
  switch (mode) {
    case 'none': return d.cbNone;
    case 'deuteranopia': return d.cbDeuteranopia;
    case 'protanopia': return d.cbProtanopia;
    case 'tritanopia': return d.cbTritanopia;
    case 'monochromacy': return d.cbMonochromacy;
  }
}

/**
 * Colour-blind palette chooser. Used by the accessibility menu, the compact
 * appearance switcher on the landing page, and the onboarding wizard, so all
 * three places write the same pref and show the same swatches.
 *
 * `layout="select"` is the compact form for popovers; `layout="cards"` is the
 * full form with a visible swatch strip for each palette.
 */
export function ColorBlindPicker({
  layout = 'select', showHint = true,
}: {
  layout?: 'select' | 'cards';
  showHint?: boolean;
}) {
  const { language } = useApp();
  const { prefs, setPrefValue } = useA11yPrefsContext();
  const d = getTranslation(language).displayOptions;
  const current: ColorBlindMode = prefs.colorBlind ?? 'none';

  if (layout === 'select') {
    return (
      <div className="py-1">
        <label className="block text-sm text-navy-800">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-navy-500" aria-hidden="true" />
            {d.colorBlindPalette}
          </span>
          {showHint && (
            <span className="block text-[10px] text-navy-400 font-normal">{d.colorBlindHint}</span>
          )}
          <select
            value={current}
            onChange={(e) => setPrefValue('colorBlind', e.target.value as ColorBlindMode)}
            className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-2 py-2 text-xs text-navy-800"
            aria-label={d.colorBlindPalette}
          >
            {COLOR_BLIND_MODES.map((mode) => (
              <option key={mode} value={mode}>{labelFor(mode, d)}</option>
            ))}
          </select>
        </label>
        <span className="mt-1.5 flex gap-1" aria-hidden="true">
          {COLOR_BLIND_SWATCHES[current].map((c) => (
            <span
              key={c}
              className="h-3 flex-1 rounded-sm ring-1 ring-black/10"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      </div>
    );
  }

  return (
    <fieldset className="mt-6">
      <legend className="mb-1 flex items-center gap-1.5 text-sm font-medium text-navy-700">
        <Palette className="h-4 w-4 text-teal-600" aria-hidden="true" />
        {d.colorBlindPalette}
      </legend>
      <p className="mb-2 text-xs text-navy-500">{d.colorBlindHint}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {COLOR_BLIND_MODES.map((mode) => (
          <label
            key={mode}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
              current === mode ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
            }`}
          >
            <input
              type="radio"
              name="color-blind-palette"
              value={mode}
              checked={current === mode}
              onChange={() => setPrefValue('colorBlind', mode)}
              className="mt-0.5 h-4 w-4 accent-teal-600"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-navy-900">{labelFor(mode, d)}</span>
              <span className="mt-1.5 flex gap-1" aria-hidden="true">
                {COLOR_BLIND_SWATCHES[mode].map((c, i) => (
                  <span
                    key={`${mode}-${i}`}
                    className="h-3 flex-1 rounded-sm ring-1 ring-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
