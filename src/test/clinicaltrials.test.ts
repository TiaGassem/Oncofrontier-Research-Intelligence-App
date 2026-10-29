import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchClinicalTrials } from '@/lib/clinicaltrials';

describe('searchClinicalTrials', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a free-text question to the trial registry instead of requesting the newest studies', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ studies: [], totalCount: 0 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await searchClinicalTrials({ question: 'EGFR resistance lung cancer' });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get('query.term')).toBe('EGFR resistance lung cancer');
    expect(requestUrl.searchParams.has('query.cond')).toBe(false);
    expect(requestUrl.searchParams.has('query.intr')).toBe(false);
  });

  it('maps condition, intervention, gene, and question to their search fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ studies: [], totalCount: 0 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await searchClinicalTrials({
      cancerType: 'lung cancer',
      gene: 'EGFR',
      drug: 'osimertinib',
      treatment: 'osimertinib',
      question: 'resistance',
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get('query.cond')).toBe('lung cancer');
    expect(requestUrl.searchParams.get('query.intr')).toBe('osimertinib');
    expect(requestUrl.searchParams.get('query.term')).toBe('EGFR AND resistance');
  });
});
