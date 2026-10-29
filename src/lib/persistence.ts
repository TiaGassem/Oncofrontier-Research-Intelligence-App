import type { ResearchRecord } from '@/types';
import { supabase } from './supabase';

export interface SearchHistoryEntry {
  id: string;
  query: string;
  filters: Record<string, unknown>;
  result_count: number;
  sources: string[];
  created_at: string;
}

export interface FavoriteEntry {
  id: string;
  record_id: string;
  record_kind: string;
  title: string;
  source_url: string;
  pmid: string | null;
  doi: string | null;
  nct_id: string | null;
  provider: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function saveSearchHistory(
  query: string,
  filters: Record<string, unknown>,
  resultCount: number,
  sources: string[]
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('search_history').insert({
    query,
    filters,
    result_count: resultCount,
    sources,
  });
  if (error) console.error('Failed to save search history:', error.message);
}

export async function fetchSearchHistory(): Promise<SearchHistoryEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Failed to fetch search history:', error.message);
    return [];
  }
  return (data ?? []) as SearchHistoryEntry[];
}

export async function deleteSearchHistory(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('search_history').delete().eq('id', id);
  if (error) console.error('Failed to delete search history entry:', error.message);
}

export async function addFavorite(record: ResearchRecord): Promise<FavoriteEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      record_id: record.id,
      record_kind: record.kind,
      title: record.title,
      source_url: record.sourceUrl,
      pmid: record.pmid || null,
      doi: record.doi || null,
      nct_id: record.nctId || null,
      provider: record.provider,
      metadata: {
        authors: record.authors,
        journal: record.journal,
        pubDate: record.pubDate,
        abstract: record.abstract,
        trialStatus: record.trialStatus,
        trialPhase: record.trialPhase,
      },
    })
    .select()
    .maybeSingle();
  if (error) {
    console.error('Failed to add favorite:', error.message);
    return null;
  }
  return data as FavoriteEntry;
}

export async function removeFavorite(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('favorites').delete().eq('id', id);
  if (error) console.error('Failed to remove favorite:', error.message);
}

export async function fetchFavorites(): Promise<FavoriteEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('Failed to fetch favorites:', error.message);
    return [];
  }
  return (data ?? []) as FavoriteEntry[];
}

export async function isFavorited(recordId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('record_id', recordId)
    .maybeSingle();
  if (error) return false;
  return !!data;
}
