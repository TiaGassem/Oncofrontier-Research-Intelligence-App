// AI provider adapter for the Companion.
//
// Single path: the companion-chat Supabase Edge Function. The LLM key lives
// in Supabase secrets — nothing in the browser, no user-facing sign-in, no
// "user pays" dialogs. Returns not_configured (501) until an LLM_API_KEY
// secret is added to the Supabase project; callers surface that as a clear
// "service requires configuration" state.
//
// There is intentionally NO client-side fallback to a user-paid provider
// (Puter): companion chat must never silently shift API charges onto the
// user's own account. Uploaded-image analysis and PDF reading still use
// Puter directly — those are separate, explicitly user-initiated features.
//
// Conversations are NOT stored by the provider — messages go only to the
// LLM endpoint to generate a reply. Chat history is stored in the user's
// own Supabase tables (owner-scoped RLS), never on the provider.

import { supabase } from './supabase';

export interface ProviderChatTurn {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderResult {
  ok: boolean;
  reply?: string;
  /** True when the provider itself is unavailable (no auth, network, quota). */
  providerUnavailable?: boolean;
  /** Human-readable reason shown to the user when unavailable. */
  unavailableReason?: 'auth' | 'network' | 'quota' | 'error';
  /** Set when the edge function exists but no LLM secret is configured. */
  edgeNotConfigured?: boolean;
}

export const COMPANION_MODEL = 'gpt-4o-mini';

// SAFETY_SYSTEM_PROMPT is retained as the single source of truth for the
// companion's safety rules and is documented here so future providers pick
// it up from one place; the edge function owns its own copy of the prompt.

/**
 * Ask the companion-chat edge function (the only chat path). Returns
 * ok=false with edgeNotConfigured when the function is deployed but no LLM
 * secret exists — callers show a "requires configuration" state, not a
 * silent fallback to a user-paid provider.
 */
export async function chatViaEdge(turns: ProviderChatTurn[], language: string): Promise<ProviderResult> {
  if (!supabase) return { ok: false, providerUnavailable: true, unavailableReason: 'network' };
  try {
    const { data, error } = await supabase.functions.invoke('companion-chat', {
      body: { messages: turns, language },
    });
    if (error) {
      const status = (error as { context?: { status?: number } })?.context?.status;
      if (status === 501) {
        // Edge function deployed but no LLM secret configured.
        return { ok: false, providerUnavailable: true, edgeNotConfigured: true, unavailableReason: 'auth' };
      }
      if (status === 401 || status === 403) {
        return { ok: false, providerUnavailable: true, unavailableReason: 'auth' };
      }
      if (status === 429) {
        return { ok: false, providerUnavailable: true, unavailableReason: 'quota' };
      }
      // Network/other failures are surfaced and followed by public retrieval.
      return { ok: false, providerUnavailable: true, unavailableReason: 'network' };
    }
    const reply = (data as { reply?: string })?.reply;
    if (!reply?.trim()) return { ok: false, providerUnavailable: true, unavailableReason: 'error' };
    return { ok: true, reply };
  } catch {
    return { ok: false, providerUnavailable: true, unavailableReason: 'network' };
  }
}

/**
 * Non-streaming chat completion via the secure edge function.
 */
export async function chatComplete(turns: ProviderChatTurn[], language: string): Promise<ProviderResult> {
  return chatViaEdge(turns, language);
}

/**
 * Streaming chat completion. The edge function returns the full reply at
 * once, which is fed as a single delta.
 */
export async function chatCompleteStream(
  turns: ProviderChatTurn[],
  onDelta: (text: string) => void,
  language: string
): Promise<ProviderResult> {
  const result = await chatViaEdge(turns, language);
  if (result.ok && result.reply) onDelta(result.reply);
  return result;
}

/**
 * Text-to-speech fallback for read-aloud when the browser has no speech
 * engine. Returns a paused HTMLAudioElement the caller controls, or null when
 * the provider is unavailable. Like vision, this is an explicit user-initiated
 * feature, not a silent chat fallback.
 */
export async function speakText(text: string, language: string): Promise<HTMLAudioElement | null> {
  try {
    type PuterModule = typeof import('@heyputer/puter.js');
    const puter = (await import('@heyputer/puter.js')).puter as PuterModule['puter'];
    if (typeof puter?.ai?.txt2speech !== 'function') return null;
    const audio = await (puter.ai.txt2speech as unknown as (
      t: string,
      options?: { language?: string }
    ) => Promise<HTMLAudioElement>)(text.slice(0, 3000), { language });
    return audio ?? null;
  } catch (err) {
    console.warn('Text-to-speech unavailable:', err);
    return null;
  }
}

/**
 * Vision: analyze an image with a real multimodal model via Puter
 * (puter.ai.chat(prompt, media) accepts a File or a data URL).
 * The model genuinely sees the image — no OCR is performed and no analysis is
 * invented if the call fails; failures return providerUnavailable so callers
 * can show an honest error. Puter is used directly here because vision is an
 * explicit, user-initiated feature — never a silent fallback for chat.
 */
export async function analyzeImage(prompt: string, file: File): Promise<ProviderResult> {
  type PuterModule = typeof import('@heyputer/puter.js');
  const puter = (await import('@heyputer/puter.js')).puter as PuterModule['puter'];
  const response = await (puter.ai.chat as unknown as (
    p: string,
    media: File | string,
    options?: { model?: string }
  ) => Promise<{ message?: { content?: unknown } }>)(prompt, file, {
    model: COMPANION_MODEL,
  });

  const content = response?.message?.content;
  let reply = '';
  if (typeof content === 'string') {
    reply = content;
  } else if (Array.isArray(content)) {
    reply = content
      .map((part: { text?: string }) => (typeof part?.text === 'string' ? part.text : ''))
      .join('');
  }
  if (!reply.trim()) {
    return { ok: false, providerUnavailable: true, unavailableReason: 'error' };
  }
  return { ok: true, reply };
}
