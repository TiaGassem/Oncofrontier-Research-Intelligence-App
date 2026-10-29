import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '@/context/AppContext';
import { A11yProvider } from '@/context/A11yContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { Landing } from '@/pages/Landing';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import {
  loadExperience, orderModulesForRole, EXPERIENCE_STORAGE_KEY,
  LANGUAGE_CHOICES, ROLE_MODULES,
} from '@/lib/experience';
import { getSurfaceStrings } from '@/lib/onboardingTranslations';
import type { ViewName } from '@/types';

beforeEach(() => {
  localStorage.clear();
});

function ViewProbe() {
  const { currentView } = useApp();
  return <span data-testid="view">{currentView}</span>;
}

function renderWizard() {
  return render(
    <AppProvider>
      <A11yProvider>
        <PreferencesProvider>
          <OnboardingWizard />
          <ViewProbe />
        </PreferencesProvider>
      </A11yProvider>
    </AppProvider>
  );
}

describe('experience preferences', () => {
  it('defaults to general/standard and not onboarded', () => {
    const prefs = loadExperience();
    expect(prefs.role).toBe('general');
    expect(prefs.density).toBe('standard');
    expect(prefs.onboarded).toBe(false);
  });

  it('ignores malformed stored values instead of crashing', () => {
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, '{"role":"astronaut","density":7}');
    const prefs = loadExperience();
    expect(prefs.role).toBe('general');
    expect(prefs.density).toBe('standard');
  });

  it('puts the role modules first without dropping the others', () => {
    const modules: { id: ViewName }[] = [
      { id: 'methodology' }, { id: 'companion' }, { id: 'anatomy' }, { id: 'curemap' },
    ];
    const ordered = orderModulesForRole(modules, 'patient').map((m) => m.id);
    expect(ordered.slice(0, 2)).toEqual(['companion', 'anatomy']);
    expect(ordered).toHaveLength(4);
    expect(new Set(ordered)).toEqual(new Set(['methodology', 'companion', 'anatomy', 'curemap']));
  });

  it('keeps every module reachable for every role', () => {
    for (const mods of Object.values(ROLE_MODULES)) {
      expect(mods.length).toBeGreaterThan(0);
    }
  });
});

describe('surface translations', () => {
  it('translates landing and onboarding copy for en, fr and ar', () => {
    const en = getSurfaceStrings('en');
    const fr = getSurfaceStrings('fr');
    const ar = getSurfaceStrings('ar');
    expect(fr.landing.heroLine1).not.toBe(en.landing.heroLine1);
    expect(ar.landing.heroLine1).not.toBe(en.landing.heroLine1);
    expect(ar.onboarding.next).not.toBe(en.onboarding.next);
    expect(ar.onboarding.summaryLanguage).toBeTruthy();
  });

  it('falls back to English for locales without these surfaces', () => {
    expect(getSurfaceStrings('de').landing.heroLine1).toBe(getSurfaceStrings('en').landing.heroLine1);
  });

  it('does not claim a partial locale is complete', () => {
    const partial = LANGUAGE_CHOICES.filter((c) => !c.complete).map((c) => c.code);
    expect(partial).not.toContain('en');
    expect(partial).not.toContain('fr');
    expect(partial).not.toContain('ar');
  });
});

describe('public landing page', () => {
  it('renders the hero and both calls to action without an account', () => {
    render(
      <AppProvider>
        <A11yProvider>
          <PreferencesProvider>
            <Landing />
          </PreferencesProvider>
        </A11yProvider>
      </AppProvider>
    );
    const s = getSurfaceStrings('en').landing;
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain(s.heroLine1);
    expect(heading.textContent).toContain(s.heroLine2);
    expect(screen.getAllByRole('button', { name: s.ctaStart }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: s.ctaLearn })).toBeTruthy();
  });

  it('exposes the appearance modes switcher', () => {
    render(
      <AppProvider>
        <A11yProvider>
          <PreferencesProvider>
            <Landing />
          </PreferencesProvider>
        </A11yProvider>
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /Appearance/i })).toBeTruthy();
  });
});

describe('onboarding wizard', () => {
  it('persists the chosen role and opens that role starting module', () => {
    renderWizard();

    // Step 1 → role
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Patient or survivor/ }));
    // Step 2 → accessibility → Step 3 density → Step 4 summary
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Enter OncoFrontiers/ }));

    const saved = JSON.parse(localStorage.getItem(EXPERIENCE_STORAGE_KEY) ?? '{}');
    expect(saved.role).toBe('patient');
    expect(saved.onboarded).toBe(true);
    expect(screen.getByTestId('view').textContent).toBe('companion');
  });

  it('applies a visual template immediately and keeps it after finishing', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Eye comfort/ }));
    expect(document.documentElement.dataset.template).toBe('comfort');
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Enter OncoFrontiers/ }));
    const saved = JSON.parse(localStorage.getItem(EXPERIENCE_STORAGE_KEY) ?? '{}');
    expect(saved.template).toBe('comfort');
    expect(saved.onboarded).toBe(true);
  });

  it('marks onboarding complete when the visitor skips', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: /Skip and use defaults/ }));
    const saved = JSON.parse(localStorage.getItem(EXPERIENCE_STORAGE_KEY) ?? '{}');
    expect(saved.onboarded).toBe(true);
    expect(screen.getByTestId('view').textContent).toBe('dashboard');
  });

  it('applies an accessibility choice from the wizard to the document', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Larger text/ }));
    expect(document.documentElement.classList.contains('a11y-large-text')).toBe(true);
  });
});
