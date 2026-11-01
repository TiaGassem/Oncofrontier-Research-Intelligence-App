// Saved research searches ("automations") backed by the
// saved_search_automations table. Honest scheduling note: there is no
// background scheduler here — checks run when the signed-in user clicks
// "Check now" or when the app opens. Nothing runs while the browser is closed.
import type { ResearchRecord } from '@/types';
import { supabase } from './supabase';

export interface SavedSearchAutomation {
  id: string;
  user_id: string;
  name: string;
  query: string;
  paused: boolean;
  last_checked_at: string | null;
  last_new_results: number;
  last_status: 'ok' | 'error' | 'never';
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchAutomations(): Promise<SavedSearchAutomation[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('saved_search_automations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch automations:', error.message);
    return [];
  }
  return (data ?? []) as SavedSearchAutomation[];
}

export async function createAutomation(name: string, query: string): Promise<SavedSearchAutomation | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('saved_search_automations')
    .insert({ name, query })
    .select()
    .maybeSingle();
  if (error) {
    console.error('Failed to create automation:', error.message);
    return null;
  }
  return data as SavedSearchAutomation;
}

export async function updateAutomation(
  id: string,
  updates: Partial<Pick<SavedSearchAutomation, 'name' | 'query' | 'paused'>>
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('saved_search_automations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('Failed to update automation:', error.message);
    return false;
  }
  return true;
}

export async function deleteAutomation(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('saved_search_automations').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete automation:', error.message);
    return false;
  }
  return true;
}

export async function recordCheckResult(
  id: string,
  status: 'ok' | 'error',
  newResults: number,
  error?: string
): Promise<void> {
  if (!supabase) return;
  const { error: updateError } = await supabase
    .from('saved_search_automations')
    .update({
      last_checked_at: new Date().toISOString(),
      last_new_results: newResults,
      last_status: status,
      last_error: error ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (updateError) console.error('Failed to record check result:', updateError.message);
}

// Deterministic ID for a record so we can tell "new" from "seen before" using
// only the last-check timestamp: a publication counts as new when its publish
// date is strictly after the previous check time. We use pubDate comparison
// rather than seen-ID storage to keep the schema minimal; results older than
// the last check are never counted as new.
export function isPublishedAfter(record: ResearchRecord, sinceIso: string | null): boolean {
  if (!sinceIso) return false; // first check establishes the baseline
  if (!record.pubDate) return false;
  const pub = new Date(record.pubDate).getTime();
  const since = new Date(sinceIso).getTime();
  return Number.isFinite(pub) && Number.isFinite(since) && pub > since;
}

// ─── Device-local automations ────────────────────────────────────────────────
// Without an account (or when the Supabase keys are not configured) there is
// nothing to write to on the server, so automations are stored in this browser
// instead. They are real: the query, the pause state and the last check are
// kept, and "Check now" runs the same PubMed/Europe PMC search. The only
// difference is where the list lives, and the UI says so.

const LOCAL_KEY = 'oncofrontier-automations';

export function loadLocalAutomations(): SavedSearchAutomation[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is SavedSearchAutomation =>
        !!a && typeof a.id === 'string' && typeof a.name === 'string' && typeof a.query === 'string'
    );
  } catch {
    return [];
  }
}

function writeLocal(list: SavedSearchAutomation[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // storage full or private mode — the list still works for this session
  }
}

export function createLocalAutomation(name: string, query: string): SavedSearchAutomation {
  const now = new Date().toISOString();
  const item: SavedSearchAutomation = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: 'local',
    name,
    query,
    paused: false,
    last_checked_at: null,
    last_new_results: 0,
    last_status: 'never',
    last_error: null,
    created_at: now,
    updated_at: now,
  };
  writeLocal([item, ...loadLocalAutomations()]);
  return item;
}

export function updateLocalAutomation(
  id: string,
  updates: Partial<Pick<SavedSearchAutomation, 'name' | 'query' | 'paused'>>
): boolean {
  const list = loadLocalAutomations();
  const next = list.map((a) =>
    a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
  );
  writeLocal(next);
  return next.some((a) => a.id === id);
}

export function deleteLocalAutomation(id: string): boolean {
  const list = loadLocalAutomations();
  if (!list.some((a) => a.id === id)) return false;
  writeLocal(list.filter((a) => a.id !== id));
  return true;
}

export function recordLocalCheckResult(
  id: string,
  status: 'ok' | 'error',
  newResults: number,
  error?: string
): void {
  const list = loadLocalAutomations();
  const now = new Date().toISOString();
  writeLocal(
    list.map((a) =>
      a.id === id
        ? {
            ...a,
            last_checked_at: now,
            last_new_results: newResults,
            last_status: status,
            last_error: error ?? null,
            updated_at: now,
          }
        : a
    )
  );
}
