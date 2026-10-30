import { ArrowRight, BookOpen, Dna, FileText, Heart, Search, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePreferences } from '@/context/PreferencesContext';
import { BrandMark } from '@/components/BrandMark';
import { AppearanceModes } from '@/components/AppearanceModes';
import { getSurfaceStrings } from '@/lib/onboardingTranslations';
import { LANGUAGE_CHOICES } from '@/lib/experience';
import type { Language } from '@/types';

/**
 * Public homepage. Renders without authentication and without the workspace
 * shell, so a first-time visitor (or a search engine) sees a plain explanation
 * before any dashboard.
 *
 * Layout follows a calm, generous pattern: pill badge → two-tone headline →
 * short lead → two pill CTAs → a numbered four-step row.
 */
export function Landing() {
  const { language, userLanguage, setLanguage, setCurrentView } = useApp();
  const { onboarded, startView } = usePreferences();
  const s = getSurfaceStrings(language).landing;
  const o = getSurfaceStrings(language).onboarding;
  // Below the fully translated languages, menus and controls are translated
  // but the long-form research copy is not. Say which part is in English
  // instead of letting the pick look broken.
  const partialChoice = LANGUAGE_CHOICES.find(
    (choice) => choice.code === userLanguage && !choice.complete
  );

  const capabilityIcons = [Search, Dna, BookOpen, Heart];
  const start = () => setCurrentView(onboarded ? startView : 'welcome');

  // In-page navigation must NOT write to location.hash: the app is hash-routed,
  // so a plain "#how" anchor is read as an unknown view and throws the visitor
  // into the dashboard. Scroll explicitly instead.
  const scrollToSection = (id: string) => () => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduce = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return (
    <div className="landing-shell min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40 text-navy-900">
      <a
        href="#landing-main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('landing-main');
          if (!main) return;
          main.setAttribute('tabindex', '-1');
          main.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-navy-900 focus:shadow-lg"
      >
        {o.home}
      </a>

      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-8">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2">
            <BrandMark className="h-6 w-6" />
            <span className="text-sm font-bold tracking-wide">ONCOFRONTIER</span>
          </button>

          <nav className="ms-auto hidden items-center gap-6 text-sm text-navy-600 md:flex" aria-label={s.navAbout}>
            <button type="button" onClick={scrollToSection('capabilities')} className="hover:text-navy-900">
              {s.capabilitiesTitle}
            </button>
            <button type="button" onClick={scrollToSection('how')} className="hover:text-navy-900">
              {s.navHowItWorks}
            </button>
            <button type="button" onClick={scrollToSection('accessibility')} className="hover:text-navy-900">
              {s.navAccessibility}
            </button>
          </nav>

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <label className="flex items-center">
              <span className="sr-only">{s.languageLabel}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-full border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700"
                aria-label={s.languageLabel}
              >
                {LANGUAGE_CHOICES.map((choice, i) => (
                  <option key={`${choice.code}-${i}`} value={choice.code}>
                    {choice.native}
                  </option>
                ))}
              </select>
            </label>

            <AppearanceModes />

            <button
              onClick={start}
              className="hidden rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 sm:block"
            >
              {s.openApp}
            </button>
          </div>
        </div>
      </header>

      {partialChoice && (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-navy-700" role="status">
          Menus, buttons and messages are in <strong>{partialChoice.native}</strong>. Longer
          research explanations and the legal pages are still in English — chat, search and
          voice use{' '}
          <strong>{partialChoice.native}</strong> throughout.
        </p>
      )}

      <main id="landing-main">
        {/* Hero — pill badge, two-tone headline, two pill CTAs */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 text-center md:px-8 md:pt-24 md:pb-24">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-300 bg-teal-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {s.heroEyebrow}
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-navy-900 md:text-6xl">
            {s.heroLine1}
            <span className="block text-teal-600">{s.heroLine2}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-navy-600 md:text-lg">
            {s.heroLead}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white hover:bg-teal-500"
            >
              {s.ctaStart}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollToSection('how')}
              className="inline-flex items-center gap-2 rounded-full border border-navy-300 bg-white px-7 py-3 text-sm font-semibold text-navy-800 hover:border-navy-400"
            >
              {s.ctaLearn}
            </button>
          </div>

          <p className="mt-5 text-xs text-navy-500">{s.trustNote}</p>
        </section>

        {/* Four numbered steps */}
        <section id="how" className="scroll-mt-24 border-t border-navy-100 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.stepsTitle}</h2>
            </div>
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {s.steps.map((step, i) => (
                <li key={step.title} className="text-center">
                  <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-base font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" className="scroll-mt-24 bg-white pb-16 md:pb-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.capabilitiesTitle}</h2>
            <p className="mt-2 max-w-xl text-sm text-navy-600">{s.capabilitiesLead}</p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
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

        {/* Two experiences */}
        <section className="border-t border-navy-100 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.twoWaysTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-navy-100 bg-white p-7">
                <FileText className="h-5 w-5 text-navy-600" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{s.researchTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.researchBody}</p>
              </article>
              <article className="rounded-2xl border border-navy-100 bg-white p-7">
                <Heart className="h-5 w-5 text-teal-600" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{s.patientTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.patientBody}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Accessibility commitment */}
        <section id="accessibility" className="scroll-mt-24 py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">{s.accessTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-600">{s.accessBody}</p>
            <ul className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
              {(LANGUAGE_CHOICES.slice(0, 3).map((c) => c.label)).map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-navy-200 bg-white px-3 py-1 text-xs font-medium text-navy-600"
                >
                  {label}
                </li>
              ))}
            </ul>
            <button
              onClick={start}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3 text-sm font-semibold text-white hover:bg-navy-800"
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
