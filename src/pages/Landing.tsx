import { ArrowRight, BookOpen, CheckCircle2, Dna, FileText, Heart, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePreferences } from '@/context/PreferencesContext';
import { BrandMark } from '@/components/BrandMark';
import { getSurfaceStrings } from '@/lib/onboardingTranslations';
import { LANGUAGE_CHOICES } from '@/lib/experience';
import type { Language } from '@/types';

/**
 * Public homepage. Renders without authentication and without the workspace
 * shell, so a first-time visitor (or a search engine) sees a plain explanation
 * before any dashboard.
 */
export function Landing() {
  const { language, setLanguage, setCurrentView } = useApp();
  const { onboarded, startView } = usePreferences();
  const s = getSurfaceStrings(language).landing;
  const o = getSurfaceStrings(language).onboarding;

  const capabilityIcons = [Search, Dna, BookOpen, Heart];

  const start = () => setCurrentView(onboarded ? startView : 'welcome');

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900">
      <a
        href="#landing-main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-navy-900 focus:shadow-lg"
      >
        {o.home}
      </a>

      <header className="sticky top-0 z-30 bg-white border-b border-navy-100">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide">ONCOFRONTIER</span>
          </div>

          <nav className="ms-auto hidden items-center gap-6 text-sm text-navy-600 md:flex" aria-label={s.navAbout}>
            <a href="#capabilities" className="hover:text-navy-900">{s.capabilitiesTitle}</a>
            <a href="#how" className="hover:text-navy-900">{s.navHowItWorks}</a>
            <a href="#accessibility" className="hover:text-navy-900">{s.navAccessibility}</a>
          </nav>

          <label className="ms-auto md:ms-0 flex items-center gap-2 text-xs text-navy-500">
            <span className="sr-only">{s.languageLabel}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-xs text-navy-800"
              aria-label={s.languageLabel}
            >
              {LANGUAGE_CHOICES.map((choice, i) => (
                <option key={`${choice.code}-${i}`} value={choice.code}>
                  {choice.native}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={start}
            className="hidden rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 sm:block"
          >
            {s.openApp}
          </button>
        </div>
      </header>

      <main id="landing-main">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 md:px-8 md:pt-24 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-4 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold tracking-wide text-teal-700">
                {s.heroEyebrow}
              </p>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-navy-900 md:text-5xl">
                {s.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-600 md:text-lg">
                {s.heroLead}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500"
                >
                  {s.ctaStart}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-3 text-sm font-semibold text-navy-700 hover:border-navy-300"
                >
                  {s.ctaLearn}
                </a>
              </div>
              <p className="mt-4 text-xs text-navy-500">{s.trustNote}</p>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                {s.capabilitiesLead}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-navy-700">
                {['PubMed', 'Europe PMC', 'ClinicalTrials.gov', 'Open Targets', 'PubChem', 'Crossref', 'OpenAlex'].map((name) => (
                  <li key={name} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-teal-500" aria-hidden="true" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-500">
                {s.integrityNote}
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="border-t border-navy-100 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.capabilitiesTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-navy-600">{s.capabilitiesLead}</p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {s.capabilities.map((cap, i) => {
                const Icon = capabilityIcons[i] ?? Search;
                return (
                  <li key={cap.title} className="rounded-2xl border border-navy-100 bg-navy-50 p-6">
                    <Icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                    <h3 className="mt-3 text-base font-semibold text-navy-900">{cap.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{cap.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Steps */}
        <section id="how" className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.stepsTitle}</h2>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {s.steps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-navy-100 bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Two experiences */}
        <section className="border-t border-navy-100 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.twoWaysTitle}</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-navy-100 bg-navy-50 p-7">
                <FileText className="h-5 w-5 text-navy-600" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{s.researchTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.researchBody}</p>
              </article>
              <article className="rounded-2xl border border-navy-100 bg-navy-50 p-7">
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{s.patientTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.patientBody}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section id="accessibility" className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.accessTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-600">{s.accessBody}</p>
            <button
              onClick={start}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800"
            >
              {s.ctaStart}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-navy-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>{s.integrityNote}</p>
          <p>{s.footerDisclaimer}</p>
        </div>
      </footer>
    </div>
  );
}
