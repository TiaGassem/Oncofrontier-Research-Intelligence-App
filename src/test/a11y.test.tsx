import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import { AppProvider, useApp } from '@/context/AppContext';
import { A11yProvider } from '@/context/A11yContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { Landing } from '@/pages/Landing';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { LegalPage } from '@/pages/Legal';

// Automated WCAG A/AA rule checks. jsdom has no layout engine, so rules that
// need geometry (notably colour-contrast) are skipped by axe itself — this
// catches missing labels, landmark/heading structure and ARIA misuse, not
// visual contrast. A real screen-reader pass is still required.
async function seriousViolations(container: HTMLElement) {
  document.documentElement.lang = 'en'; // index.html sets this in the real page
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  });
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.nodes.length})`);
}

describe('automated accessibility rules', () => {
  it('public landing page has no serious or critical violations', async () => {
    const { container } = render(
      <AppProvider>
        <PreferencesProvider>
          <Landing />
        </PreferencesProvider>
      </AppProvider>
    );
    expect(await seriousViolations(container)).toEqual([]);
  });

  it('onboarding wizard has no serious or critical violations', async () => {
    const { container } = render(
      <AppProvider>
        <A11yProvider>
          <PreferencesProvider>
            <OnboardingWizard />
          </PreferencesProvider>
        </A11yProvider>
      </AppProvider>
    );
    expect(await seriousViolations(container)).toEqual([]);
  });

  it('legal pages have no serious or critical violations', async () => {
    const { container } = render(
      <AppProvider>
        <LegalPage kind="privacy" />
      </AppProvider>
    );
    expect(await seriousViolations(container)).toEqual([]);
  });
});

function DirProbe() {
  const { direction, setLanguage } = useApp();
  return (
    <div>
      <span data-testid="dir">{direction}</span>
      <button onClick={() => setLanguage('ar')}>to-ar</button>
      <button onClick={() => setLanguage('en')}>to-en</button>
    </div>
  );
}

describe('text direction', () => {
  it('switches to rtl for Arabic and back to ltr for English', () => {
    render(
      <AppProvider>
        <DirProbe />
      </AppProvider>
    );
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
    fireEvent.click(screen.getByText('to-ar'));
    expect(screen.getByTestId('dir').textContent).toBe('rtl');
    fireEvent.click(screen.getByText('to-en'));
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
  });
});
