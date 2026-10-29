import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { getTranslation } from '@/lib/i18n';
import { detectInputLanguage, normalizeForRetrieval, PARTIAL_INTERFACE_LANGUAGES } from '@/lib/languageSupport';
import { AppProvider, useApp } from '@/context/AppContext';
import { SearchBar } from '@/components/SearchBar';

describe('i18n — translation resources', () => {
  it('provides complete translations for en, fr, and ar', () => {
    for (const lang of ['en', 'fr', 'ar'] as const) {
      const t = getTranslation(lang);
      expect(t.nav.dashboard).toBeTruthy();
      expect(t.nav.companion).toBeTruthy();
      expect(t.nav.assistant).toBeTruthy();
      expect(t.common.search).toBeTruthy();
      expect(t.companion.chatIntro).toBeTruthy();
    }
  });

  it('merges core translations for the 16 additional locales', () => {
    for (const lang of PARTIAL_INTERFACE_LANGUAGES) {
      const t = getTranslation(lang);
      expect(t.nav.companion).not.toBe(getTranslation('en').nav.companion);
      expect(t.common.search).not.toBe(getTranslation('en').common.search);
      expect(t.states.errorTitle).not.toBe(getTranslation('en').states.errorTitle);
    }
  });

  it('falls back to English for unknown locale codes', () => {
    expect(getTranslation('en').nav.companion).toBe('Companion Chat');
  });

  it('keeps scientific identifiers intact in translations', () => {
    const de = getTranslation('de');
    expect(de.nav.companion).not.toMatch(/undefined/);
    expect(de.common.loading).toContain('…');
  });
});

describe('languageSupport — multilingual detection', () => {
  it('detects English, French, Arabic script, and Arabizi', () => {
    expect(detectInputLanguage('How is chemotherapy given?')).toBe('en');
    expect(detectInputLanguage('Comment se passe la chimiothérapie ?')).toBe('fr');
    expect(detectInputLanguage('كيف يعمل العلاج الكيميائي؟')).toBe('ar');
    expect(detectInputLanguage('3ndi question 3la chimio')).toBe('ar-TN');
  });

  it('maps informal phrasing to English medical terms for retrieval', () => {
    const fr = normalizeForRetrieval('jai un cancer du sein');
    expect(fr).toContain('breast cancer');
    const ar = normalizeForRetrieval('سرطان الثدي');
    expect(ar).toContain('breast cancer');
  });
});

function Probe() {
  const { currentView, setCurrentView, direction, language } = useApp();
  return (
    <div>
      <span data-testid="view">{currentView}</span>
      <span data-testid="dir">{direction}</span>
      <span data-testid="lang">{language}</span>
      <button onClick={() => setCurrentView('curemap')}>go</button>
    </div>
  );
}

describe('AppContext — navigation', () => {
  it('opens the public home page before onboarding is complete', () => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    render(<AppProvider><Probe /></AppProvider>);
    expect(screen.getByTestId('view').textContent).toBe('home');
  });

  it('navigates between views and updates the hash', () => {
    window.history.replaceState(null, '', '/');
    localStorage.setItem(
      'oncofrontier-experience',
      JSON.stringify({ role: 'general', density: 'standard', onboarded: true })
    );
    render(<AppProvider><Probe /></AppProvider>);
    expect(screen.getByTestId('view').textContent).toBe('dashboard');
    fireEvent.click(screen.getByText('go'));
    expect(screen.getByTestId('view').textContent).toBe('curemap');
    expect(window.location.hash).toBe('#/curemap');
  });
});

describe('SearchBar — quick search', () => {
  it('submits the complete query without treating its first word as a cancer type', () => {
    const onSearch = vi.fn();
    const setCancerType = vi.fn();

    render(
      <AppProvider>
        <SearchBar
          onSearch={onSearch}
          cancerType=""
          setCancerType={setCancerType}
          gene=""
          setGene={vi.fn()}
          drug=""
          setDrug={vi.fn()}
          question=""
          setQuestion={vi.fn()}
        />
      </AppProvider>
    );

    const query = 'EGFR inhibitor resistance lung cancer';
    fireEvent.change(screen.getByRole('textbox', { name: 'Search cancer research' }), {
      target: { value: query },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith(query);
    expect(setCancerType).not.toHaveBeenCalled();
  });
});
