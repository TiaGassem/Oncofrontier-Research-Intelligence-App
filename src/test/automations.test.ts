import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadLocalAutomations, createLocalAutomation, updateLocalAutomation,
  deleteLocalAutomation, recordLocalCheckResult,
} from '@/lib/automations';

beforeEach(() => {
  localStorage.clear();
});

describe('device-local automations', () => {
  it('starts empty and survives a reload', () => {
    expect(loadLocalAutomations()).toEqual([]);
    const created = createLocalAutomation('Osteosarcoma CAR-T', 'osteosarcoma CAR-T');
    const reloaded = loadLocalAutomations();
    expect(reloaded).toHaveLength(1);
    expect(reloaded[0]).toMatchObject({ id: created.id, name: 'Osteosarcoma CAR-T', paused: false });
    expect(reloaded[0].last_status).toBe('never');
  });

  it('pauses, renames and records a check', () => {
    const a = createLocalAutomation('First', 'query one');
    expect(updateLocalAutomation(a.id, { paused: true })).toBe(true);
    expect(loadLocalAutomations()[0].paused).toBe(true);

    expect(updateLocalAutomation(a.id, { name: 'Renamed', query: 'query two' })).toBe(true);
    expect(loadLocalAutomations()[0]).toMatchObject({ name: 'Renamed', query: 'query two' });

    recordLocalCheckResult(a.id, 'ok', 3);
    const after = loadLocalAutomations()[0];
    expect(after.last_status).toBe('ok');
    expect(after.last_new_results).toBe(3);
    expect(after.last_checked_at).not.toBeNull();
  });

  it('deletes only the requested automation and reports misses', () => {
    const a = createLocalAutomation('A', 'a');
    const b = createLocalAutomation('B', 'b');
    expect(deleteLocalAutomation(a.id)).toBe(true);
    expect(loadLocalAutomations().map((x) => x.id)).toEqual([b.id]);
    expect(deleteLocalAutomation('missing')).toBe(false);
  });

  it('ignores corrupt stored data instead of crashing', () => {
    localStorage.setItem('oncofrontier-automations', '{"not":"a list"}');
    expect(loadLocalAutomations()).toEqual([]);
    localStorage.setItem('oncofrontier-automations', 'not json at all');
    expect(loadLocalAutomations()).toEqual([]);
  });
});
