// Chat history persistence: conversations + messages stored per authenticated
// user in Supabase. Guest users get an in-memory session (not retained).
import { supabase } from '@/lib/supabase';
import type { ResearchRecord } from '@/types';
import type { PatientMsg } from '@/components/CompanionChatCore';

export interface ConversationSummary {
  id: string;
  title: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'guest' | 'temp' | 'error';

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  is_urgent?: boolean;
  sources?: ResearchRecord[] | null;
}

function toSummary(row: Record<string, unknown>): ConversationSummary {
  return {
    id: row.id as string,
    title: row.title as string,
    archived: row.archived as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function chatStorageAvailable(): boolean {
  return supabase !== null;
}

/** All conversations for the signed-in user, newest activity first. */
export async function listConversations(includeArchived = false): Promise<ConversationSummary[]> {
  if (!supabase) return [];
  let query = supabase
    .from('conversations')
    .select('id, title, archived, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (!includeArchived) query = query.eq('archived', false);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toSummary);
}

/** All messages of one conversation, oldest first. */
export async function loadMessages(conversationId: string): Promise<PatientMsg[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, is_urgent, sources, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    role: row.role as 'user' | 'assistant',
    content: row.content as string,
    isUrgent: (row.is_urgent as boolean) || undefined,
    sources: (row.sources as ResearchRecord[] | null) ?? undefined,
    timestamp: row.created_at as string,
  }));
}

export async function createConversation(title = 'New chat'): Promise<ConversationSummary> {
  if (!supabase) throw new Error('not configured');
  const { data, error } = await supabase
    .from('conversations')
    .insert({ title })
    .select('id, title, archived, created_at, updated_at')
    .single();
  if (error) throw new Error(error.message);
  return toSummary(data as Record<string, unknown>);
}

export async function renameConversation(id: string, title: string): Promise<void> {
  if (!supabase) throw new Error('not configured');
  const { error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function setArchived(id: string, archived: boolean): Promise<ConversationSummary[]> {
  if (!supabase) throw new Error('not configured');
  const { error } = await supabase
    .from('conversations')
    .update({ archived })
    .eq('id', id);
  if (error) throw new Error(error.message);
  return listConversations(!archived);
}

export async function deleteConversation(id: string): Promise<void> {
  if (!supabase) throw new Error('not configured');
  const { error } = await supabase.from('conversations').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Append messages to a conversation and bump its updated_at. */
export async function appendMessages(
  conversationId: string,
  msgs: StoredMessage[]
): Promise<void> {
  if (!supabase) throw new Error('not configured');
  if (msgs.length === 0) return;
  const rows = msgs.map((m) => ({
    conversation_id: conversationId,
    role: m.role,
    content: m.content,
    is_urgent: m.is_urgent ?? false,
    sources: m.sources ?? null,
  }));
  const { error } = await supabase.from('chat_messages').insert(rows);
  if (error) throw new Error(error.message);
  const { error: bumpError } = await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  if (bumpError) throw new Error(bumpError.message);
}

export function titleFromText(text: string): string {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > 48 ? `${t.slice(0, 45)}…` : t || 'New chat';
}
