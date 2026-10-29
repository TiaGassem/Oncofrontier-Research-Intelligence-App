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
