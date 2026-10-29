// Voice transcription via Puter's speech-to-text. Used as the voice-input
// fallback when the browser's own SpeechRecognition service is blocked
// (Brave Shields, ad blockers, some extensions).
//
// PRIVACY: this sends the raw recorded audio to the transcription provider
// (external processing). The chat UI asks for one-time consent before the
// first transcription; raw audio is held only in memory and never stored.
// Returns null when the provider or model is unavailable.

export async function transcribeAudio(file: Blob, language: string): Promise<string | null> {
  try {
    const { puter } = await import('@heyputer/puter.js');
    const p = puter as unknown as {
      ai: {
        speech2txt?: (options: { file: Blob; language?: string }) => Promise<{ text?: string }>;
      };
    };
    if (typeof p?.ai?.speech2txt !== 'function') return null;
    const result = await Promise.race([
      p.ai.speech2txt({ file, language: language.split('-')[0] }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 30_000)),
    ]);
    const text = result?.text?.trim();
    return text ? text : null;
  } catch {
    return null;
  }
}
