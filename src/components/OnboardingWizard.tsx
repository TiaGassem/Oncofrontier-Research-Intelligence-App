import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useA11yPrefsContext } from '@/context/A11yContext';
import { BrandMark } from '@/components/BrandMark';
import { ColorBlindPicker } from '@/components/ColorBlindPicker';
import { getSurfaceStrings, fillTemplate, type A11yOptionKey } from '@/lib/onboardingTranslations';
import { getTranslation } from '@/lib/i18n';
import {
  DENSITIES, LANGUAGE_CHOICES, ROLES, ROLE_START_VIEW, TEMPLATES,
  type ExperienceRole, type TemplateId, type WorkspaceDensity,
} from '@/lib/experience';
import type { Language } from '@/types';

const TOTAL_STEPS = 5;

/**
 * Five-step onboarding: language, role, accessibility, workspace density, and a
 * summary. Every choice is written to the real preference stores, so it changes
 * the interface rather than only decorating a screen.
 */
export function OnboardingWizard() {
  const { language, userLanguage, setLanguage, setCurrentView } = useApp();
  const { role, density, template, complete, setTemplate } = usePreferences();
  const { prefs: a11y, setPref, applyPreset } = useA11yPrefsContext();
  const s = getSurfaceStrings(language).onboarding;
  const presetLabels = getTranslation(language).displayOptions;

  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<ExperienceRole>(role);
  const [selectedDensity, setSelectedDensity] = useState<WorkspaceDensity>(density);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the step heading so keyboard and screen-reader users are not
  // left at the bottom of the previous step.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const enabledA11y = (Object.keys(a11y) as A11yOptionKey[])
    .filter((key) => a11y[key] === true);

  const finish = () => {
    complete({ role: selectedRole, density: selectedDensity });
    setCurrentView(ROLE_START_VIEW[selectedRole]);
  };

  const skipAll = () => {
    complete({ role: selectedRole, density: 'standard' });
    setCurrentView('dashboard');
  };

  const stepTitle = [
    s.languageTitle, s.roleTitle, s.a11yTitle, s.densityTitle, s.summaryTitle,
  ][step];
  const stepLead = [
    s.languageLead, s.roleLead, s.a11yLead, s.densityLead, s.summaryLead,
  ][step];

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900"
          >
            <BrandMark className="h-5 w-5" />
            ONCOFRONTIER
          </button>
          <p className="text-xs font-medium text-navy-500">
            {fillTemplate(s.stepLabel, { n: step + 1, total: TOTAL_STEPS })}
          </p>
        </div>

        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-navy-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-teal-500 transition-all"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 md:p-8">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-navy-900 outline-none md:text-2xl"
          >
            {stepTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">{stepLead}</p>

          <div className="mt-7">
            {step === 0 && (
              <fieldset>
                <legend className="sr-only">{s.languageTitle}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {LANGUAGE_CHOICES.map((choice, i) => {
                    const checked = userLanguage === choice.code && i === LANGUAGE_CHOICES.findIndex((c) => c.code === userLanguage);
                    return (
                      <label
                        key={`${choice.code}-${i}`}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm ${
                          checked ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="onboarding-language"
                            value={choice.code}
                            checked={checked}
                            onChange={() => setLanguage(choice.code as Language)}
                            className="h-4 w-4 accent-teal-600"
                          />
                          <span className="font-medium text-navy-800">{choice.native}</span>
                          <span className="text-xs text-navy-500">{choice.label}</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            choice.complete ? 'bg-teal-100 text-teal-800' : 'bg-navy-100 text-navy-600'
                          }`}
                        >
                          {choice.complete ? s.languageComplete : s.languagePartial}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="sr-only">{s.roleTitle}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ROLES.map((r) => (
                    <label
                      key={r}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
                        selectedRole === r ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="onboarding-role"
                        value={r}
                        checked={selectedRole === r}
                        onChange={() => setSelectedRole(r)}
                        className="mt-0.5 h-4 w-4 accent-teal-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-navy-900">{s.roles[r].label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-navy-600">{s.roles[r].body}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="sr-only">{s.a11yTitle}</legend>
                <div className="mb-4 flex flex-wrap gap-2">
                  {([
                    ['paralysis', presetLabels.presetParalysis],
                    ['blindness', presetLabels.presetBlindness],
                    ['lowVision', presetLabels.presetLowVision],
                  ] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => applyPreset(id)}
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800 hover:bg-teal-100"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {s.a11yOptions.map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
                        a11y[opt.key] ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={a11y[opt.key]}
                        onChange={() => setPref(opt.key, !a11y[opt.key])}
                        className="mt-0.5 h-4 w-4 accent-teal-600"
                      />
                      <span>
                        <span className="block text-sm font-medium text-navy-900">{opt.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-navy-600">{opt.body}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <ColorBlindPicker layout="cards" />
                <p className="mt-4 text-xs text-navy-500">{s.a11yNote}</p>
              </fieldset>
            )}

            {step === 3 && (
              <>
                <fieldset>
                  <legend className="sr-only">{s.templateLead}</legend>
                  <p className="mb-2 text-sm font-medium text-navy-700">{s.templateLead}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {TEMPLATES.map((tpl) => (
                      <label
                        key={tpl}
                        className={`flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 ${
                          template === tpl ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="onboarding-template"
                            value={tpl}
                            checked={template === tpl}
                            onChange={() => setTemplate(tpl as TemplateId)}
                            className="h-4 w-4 accent-teal-600"
                          />
                          <span className="text-sm font-semibold text-navy-900">{s.templates[tpl].label}</span>
                        </span>
                        <span className="text-xs leading-relaxed text-navy-600">{s.templates[tpl].body}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-7">
                  <legend className="sr-only">{s.densityTitle}</legend>
                  <p className="mb-2 text-sm font-medium text-navy-700">{s.densityTitle}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {DENSITIES.map((d) => (
                      <label
                        key={d}
                        className={`flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 ${
                          selectedDensity === d ? 'border-teal-400 bg-teal-50' : 'border-navy-100 hover:border-navy-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="onboarding-density"
                            value={d}
                            checked={selectedDensity === d}
                            onChange={() => setSelectedDensity(d)}
                            className="h-4 w-4 accent-teal-600"
                          />
                          <span className="text-sm font-semibold text-navy-900">{s.densities[d].label}</span>
                        </span>
                        <span className="text-xs leading-relaxed text-navy-600">{s.densities[d].body}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 4 && (
              <dl className="divide-y divide-navy-100 text-sm">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2 text-navy-500">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    {s.summaryLanguage}
                  </dt>
                  <dd className="font-medium text-navy-900">
                    {LANGUAGE_CHOICES.find((c) => c.code === userLanguage)?.native ?? userLanguage}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2 text-navy-500">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {s.summaryRole}
                  </dt>
                  <dd className="font-medium text-navy-900">{s.roles[selectedRole].label}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-navy-500">{s.summaryA11y}</dt>
                  <dd className="text-end font-medium text-navy-900">
                    {enabledA11y.length === 0
                      ? s.summaryA11yNone
                      : fillTemplate(s.summaryA11yCount, { n: enabledA11y.length })}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-navy-500">{s.summaryTemplate}</dt>
                  <dd className="font-medium text-navy-900">{s.templates[template].label}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-navy-500">{s.summaryDensity}</dt>
                  <dd className="font-medium text-navy-900">{s.densities[selectedDensity].label}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-navy-100 pt-5">
            {step > 0 && (
              <button
                onClick={() => setStep((n) => Math.max(0, n - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-300"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {s.back}
              </button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setStep((n) => Math.min(TOTAL_STEPS - 1, n + 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
              >
                {s.next}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {s.finish}
              </button>
            )}

            <button
              onClick={skipAll}
              className="ms-auto text-xs font-medium text-navy-500 underline underline-offset-2 hover:text-navy-800"
            >
              {s.skipAll}
            </button>
          </div>

          <p className="mt-3 text-xs text-navy-400">{s.changeLater}</p>
        </div>
      </div>
    </div>
  );
}
