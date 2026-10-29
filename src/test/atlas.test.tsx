import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { CancerAnatomy } from '@/pages/CancerAnatomy';

/**
 * Atlas anatomy was reported missing. It is present and routed; this test makes
 * sure it actually renders organ content instead of an empty shell.
 */
describe('Atlas anatomy module', () => {
  it('renders organ systems with real anatomical content', () => {
    const { container } = render(
      <AppProvider>
        <CancerAnatomy />
      </AppProvider>
    );
    const text = container.textContent ?? '';
    expect(text.length).toBeGreaterThan(1000);
    expect(text).toMatch(/Colon|Stomach|Liver/i);
    expect(text).toMatch(/risk factor/i);
  });
});
