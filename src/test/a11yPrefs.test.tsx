import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { A11yProvider, useA11yPrefsContext } from '@/context/A11yContext';
import { applyA11yPrefs, DEFAULT_PREFS, isWithinSchedule, useA11ySpeech, type A11yPrefs } from '@/lib/a11yPrefs';

function AccessibilityProbe() {
  const { prefs, applyPreset, setPrefValue, reset } = useA11yPrefsContext();
  const speech = useA11ySpeech();

  return (
    <div>
      <output data-testid="speech">{String(speech.autoSpeak)}</output>
      <output data-testid="voice-guide">{String(speech.voiceGuide)}</output>
      <output data-testid="phrases">{String(speech.quickPhrases)}</output>
      <output data-testid="snapshot">{JSON.stringify(prefs)}</output>
      <button onClick={() => applyPreset('paralysis')}>Assisted hands</button>
      <button onClick={() => applyPreset('blindness')}>Blindness support</button>
      <button onClick={() => applyPreset('lowVision')}>Low vision</button>
      <button onClick={() => applyPreset('dyslexia')}>Dyslexia friendly</button>
      <button onClick={() => setPrefValue('voiceGuide', true)}>Enable voice guide</button>
      <button onClick={() => setPrefValue('voiceGuide', false)}>Disable voice guide</button>
      <button onClick={() => setPrefValue('quickPhrases', true)}>Enable quick phrases</button>
      <button onClick={() => setPrefValue('warmIntensity', 80)}>Set tint strength</button>
      <button onClick={reset}>Reset settings</button>
    </div>
  );
}

describe('accessibility preferences', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('applies each complete mode and persists the selected preferences', async () => {
    render(<A11yProvider><AccessibilityProbe /></A11yProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Assisted hands' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('oncofrontier-a11y')!).oneHanded).toBe(true));
    expect(JSON.parse(localStorage.getItem('oncofrontier-a11y')!).quickPhrases).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Blindness support' }));
    await waitFor(() => expect(document.documentElement.classList.contains('a11y-large-text')).toBe(true));
    expect(JSON.parse(localStorage.getItem('oncofrontier-a11y')!).voiceGuide).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Low vision' }));
    await waitFor(() => expect(document.documentElement.classList.contains('a11y-high-contrast')).toBe(true));

    fireEvent.click(screen.getByRole('button', { name: 'Dyslexia friendly' }));
    await waitFor(() => expect(document.documentElement.classList.contains('a11y-dyslexia')).toBe(true));
    expect(document.documentElement.classList.contains('a11y-reading')).toBe(true);
    expect(document.documentElement.classList.contains('a11y-reduced-motion')).toBe(true);
  });

  it('updates Companion speech settings immediately and resets from the shared defaults', async () => {
    render(<A11yProvider><AccessibilityProbe /></A11yProvider>);
    expect(screen.getByTestId('speech').textContent).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Enable voice guide' }));
    await waitFor(() => expect(screen.getByTestId('speech').textContent).toBe('true'));
    expect(screen.getByTestId('voice-guide').textContent).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Enable quick phrases' }));
    await waitFor(() => expect(screen.getByTestId('phrases').textContent).toBe('true'));

    fireEvent.click(screen.getByRole('button', { name: 'Set tint strength' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('oncofrontier-a11y')!).warmIntensity).toBe(80));
    fireEvent.click(screen.getByRole('button', { name: 'Reset settings' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('oncofrontier-a11y') ?? 'null')).toEqual(DEFAULT_PREFS));
    expect(screen.getByTestId('speech').textContent).toBe('false');
    expect(screen.getByTestId('voice-guide').textContent).toBe('false');
    expect(screen.getByTestId('phrases').textContent).toBe('false');
  });

  it('applies all visual toggles and clamps warm-filter intensity', () => {
    const prefs: A11yPrefs = {
      ...DEFAULT_PREFS,
      largeText: true,
      highContrast: true,
      reducedMotion: true,
      nightMode: true,
      blueLight: true,
      daltonism: true,
      readingMode: true,
      dyslexia: true,
      largeTargets: true,
      oneHanded: true,
      warmIntensity: 150,
    };

    applyA11yPrefs(prefs);

    for (const name of [
      'a11y-large-text', 'a11y-high-contrast', 'a11y-reduced-motion', 'a11y-night',
      'a11y-blue-light', 'a11y-daltonism', 'a11y-reading', 'a11y-dyslexia',
      'a11y-large-targets', 'a11y-one-handed',
    ]) {
      expect(document.documentElement.classList.contains(name)).toBe(true);
    }
    expect(document.documentElement.style.getPropertyValue('--warm-alpha')).toBe('0.40');
  });

  it('handles warm-filter schedules that cross midnight', () => {
    expect(isWithinSchedule('21:00', '07:00', new Date(2026, 0, 1, 22, 0))).toBe(true);
    expect(isWithinSchedule('21:00', '07:00', new Date(2026, 0, 1, 6, 59))).toBe(true);
    expect(isWithinSchedule('21:00', '07:00', new Date(2026, 0, 1, 12, 0))).toBe(false);
    expect(isWithinSchedule('bad', '07:00', new Date(2026, 0, 1, 22, 0))).toBe(false);
  });
});
