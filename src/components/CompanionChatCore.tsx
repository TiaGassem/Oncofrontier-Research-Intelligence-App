// Shared Companion chat engine: one conversation state shared by the full
// Companion page and the floating bubble, plus the message bubble UI.
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AlertTriangle, ExternalLink, Volume2, Mic, Square } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslation, type CompanionT } from '@/lib/i18n';
import { useAttachments } from '@/lib/attachments';
import { unifiedSearch } from '@/lib/search';
import { chatCompleteStream, speakText, type ProviderChatTurn } from '@/lib/aiProvider';
import { processAttachmentWithPrompt, type Attachment } from '@/lib/attachments';
import {
  detectInputLanguage, normalizeForRetrieval, getSpeechRecognitionCtor,
  speechInputSupported, speechOutputSupported, speechTagFor,
} from '@/lib/languageSupport';
import { isUrgentQuery } from '@/lib/companionData';
import { useA11ySpeech } from '@/lib/a11yPrefs';
import {
  listConversations, loadMessages, createConversation, renameConversation,
  setArchived, deleteConversation, appendMessages, titleFromText,
  chatStorageAvailable,
  type ConversationSummary, type SaveStatus,
} from '@/lib/chatHistory';
import type { ResearchRecord } from '@/types';

export interface PatientMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ResearchRecord[];
  isUrgent?: boolean;
  timestamp?: string;
  /** Optional pre-localized labels used by the read-only ChatBubble view. */
  urgentLabel?: string;
  sourcesLabel?: string;
  listenLabel?: string;
  stopLabel?: string;
}

export type AiNotice = 'auth' | 'signIn' | 'network' | 'quota' | 'error' | 'none';

type Recognition = InstanceType<NonNullable<ReturnType<typeof getSpeechRecognitionCtor>>>;

export interface MicState {
  status: 'idle' | 'listening' | 'error' | 'captured';
  message: string | null;
}

interface CompanionChatState {
  messages: PatientMsg[];
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  aiNotice: AiNotice;
  mic: MicState;
  listening: boolean;
  speakingMsgId: string | null;
  canListen: boolean;
  canSpeak: boolean;
  /** False when speechSynthesis exists but the device has zero voices. */
  voicesAvailable: boolean;
  dismissMicMessage: () => void;
  grantAudioConsent: () => void;
  needsAudioConsent: boolean;
  attachments: Attachment[];
  addFiles: (files: FileList | File[]) => { added: number; errors: string[] };
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  attachmentErrors: string[];
  dismissAttachmentErrors: () => void;
  send: (queryText?: string) => Promise<void>;
  speak: (msg: PatientMsg) => void;
  stopSpeaking: () => void;
  toggleListening: () => void;
  cancelActiveRecording: () => void;
  clear: () => void;
  conversations: ConversationSummary[];
  conversationsLoading: boolean;
  activeConversationId: string | null;
  saveStatus: SaveStatus;
  tempChat: boolean;
  setTempChat: (temp: boolean) => void;
  storageAvailable: boolean;
  startNewChat: () => void;
  openConversation: (id: string) => Promise<void>;
  renameActive: (title: string) => Promise<void>;
  archiveConversation: (id: string, archived: boolean) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const CompanionChatContext = createContext<CompanionChatState | null>(null);

function useCompanionChatState(tc: CompanionT, chatLanguage: string): CompanionChatState {
  const [messages, setMessages] = useState<PatientMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState<AiNotice>('none');
  const [mic, setMic] = useState<MicState>({ status: 'idle', message: null });
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [voicesAvailable, setVoicesAvailable] = useState(true);
  const [needsAudioConsent, setNeedsAudioConsent] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('guest');
  const [tempChat, setTempChatState] = useState(false);
  const activeConversationIdRef = useRef<string | null>(null);
  const tempChatRef = useRef(false);
  const refreshConversationsRef = useRef<() => Promise<void>>(async () => {});
  const recognitionRef = useRef<Recognition | null>(null);
  const micWatchdogRef = useRef<number | null>(null);
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const cancelRecordingRef = useRef<(() => void) | null>(null);
  const speakRef = useRef<(msg: PatientMsg) => void>(() => {});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const busyRef = useRef(false);
  const speakingIdRef = useRef<string | null>(null);
  const { autoSpeak } = useA11ySpeech();
  const autoSpeakRef = useRef(autoSpeak);
  autoSpeakRef.current = autoSpeak;
  const { user } = useAuth();

  const {
    attachments, addFiles, remove, clear: clearAttachments, setStatus,
  } = useAttachments();
  const [attachmentErrors, setAttachmentErrors] = useState<string[]>([]);

  // The body of send, split out so send can guarantee cleanup: a thrown
  // error or hung provider must never wedge the chat behind busyRef.
  // `persist` receives the final assistant content of each turn so the
  // caller can save the exchange; null means only the user message is saved.
  const runSend = useCallback(
    async (
      text: string,
      persist?: (content: string | null, sources?: ResearchRecord[], isUrgent?: boolean) => Promise<void>
    ) => {
      // Attachments take priority: process each one with its stated method.
      if (attachments.length > 0) {
        const parts: string[] = [];
        for (const att of attachments) {
          const result = await processAttachmentWithPrompt(att, text);
          if (result.ok) {
            const label =
              result.method === 'vision-model'
                ? `Analyzed "${att.file.name}" with a vision model:`
                : `Extracted text from "${att.file.name}" (${att.kind === 'pdf' ? 'local PDF parsing' : result.method}):`;
            const content = `${label}\n\n${result.text.slice(0, 4000)}${result.text.length > 4000 ? '\n\n[Truncated — first 4000 characters shown.]' : ''}${result.error ? `\n\nNote: ${result.error}` : ''}`;
            parts.push(content);
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-att-${att.id}`,
                role: 'assistant',
                content,
              },
            ]);
          } else {
            const content = `Could not process "${att.file.name}". ${result.error ?? 'Unknown error.'}`;
            parts.push(content);
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-att-${att.id}`,
                role: 'assistant',
                content,
              },
            ]);
          }
          setStatus(att.id, result.ok ? 'done' : 'error', result.error);
        }
        clearAttachments();
        await persist?.(parts.join('\n\n---\n\n'));
        return;
      }

      if (isUrgentQuery(text)) {
        const urgentMsg: PatientMsg = {
          id: `msg-${Date.now()}-urgent`,
          role: 'assistant',
          content: `${tc.urgentWarning}\n\n${tc.urgentCallEmergency}`,
          isUrgent: true,
          urgentLabel: tc.urgentBadge,
          sourcesLabel: tc.sourcesLabel,
          listenLabel: tc.listen,
          stopLabel: tc.stop,
        };
        setMessages((prev) => [...prev, urgentMsg]);
        await persist?.(urgentMsg.content, undefined, true);
        return;
      }

      // Interpret input: detect language and normalize medical terms for
      // retrieval. The user's own words are never altered in the conversation.
      const medicalTerms = normalizeForRetrieval(text);
      const understood = medicalTerms.length > 0;

      // 1) Try the conversational model, streaming into the bubble.
      const history: ProviderChatTurn[] = [
        ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: text },
      ];

      const streamId = `msg-${Date.now()}-a`;
      setMessages((prev) => [
        ...prev,
        { id: streamId, role: 'assistant' as const, content: '' },
      ]);
      const appendDelta = (delta: string) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === streamId ? { ...m, content: m.content + delta } : m))
        );
      };

      const ai = await chatCompleteStream(history, appendDelta, chatLanguage);
      if (ai.ok && ai.reply) {
        if (autoSpeakRef.current) speakRef.current({ id: streamId, role: 'assistant', content: ai.reply });
        await persist?.(ai.reply);
        return;
      }

      // Provider unavailable — remove the empty bubble and explain why, then
      // fall back to genuine source-grounded retrieval.
      setMessages((prev) => prev.filter((m) => m.id !== streamId));
      if (ai.edgeNotConfigured) setAiNotice('auth');
      else if (ai.unavailableReason === 'auth') setAiNotice('signIn');
      else if (ai.unavailableReason === 'quota') setAiNotice('quota');
      else if (ai.unavailableReason === 'network') setAiNotice('network');
      else setAiNotice('error');

      let pubs: ResearchRecord[] = [];
      let searchFailed = false;
      if (understood) {
        try {
          const searchResult = await unifiedSearch({
            cancerType: undefined,
            question: medicalTerms,
            maxResults: 5,
            sources: ['pubmed', 'europepmc'],
          });
          pubs = searchResult.records.filter((r) => r.kind === 'publication').slice(0, 5);
        } catch {
          searchFailed = true;
        }
      }

      // A failed or empty search never dead-ends the conversation.
      const lines: string[] = [];
      lines.push(understood ? tc.chatFoundTopic : tc.chatNoTopic);
      if (understood) lines.push(medicalTerms);
      lines.push('');

      if (pubs.length > 0) {
        lines.push('Here is what I found from reliable medical sources:');
        lines.push('');
        pubs.forEach((pub, i) => {
          lines.push(`${i + 1}. ${pub.title}`);
          if (pub.journal) lines.push(`   Journal: ${pub.journal}`);
          if (pub.pubDate) lines.push(`   Published: ${pub.pubDate}`);
          lines.push('');
        });
      } else if (understood) {
        lines.push(searchFailed ? tc.chatSearchFailed : tc.chatNoResults);
        lines.push('');
      } else {
        lines.push(tc.chatRephrase);
        lines.push('');
      }

      lines.push(tc.chatDisclaimer);

      const assistantMsg: PatientMsg = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: lines.join('\n'),
        sources: pubs,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
      if (autoSpeakRef.current) speakRef.current(assistantMsg);
      await persist?.(assistantMsg.content, pubs);
    },
    [tc, messages, attachments, clearAttachments, setStatus, chatLanguage]
  );

  const send = useCallback(
    async (queryText?: string) => {
      const text = (queryText ?? input).trim();
      if (!text || busyRef.current) return;
      busyRef.current = true;

      const userMsg: PatientMsg = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      // Auto-save: create the stored conversation on the first message of an
      // unnamed chat, then append each exchange. Guests and temp chats skip it.
      const persist = async (
        assistantContent: string | null,
        sources?: ResearchRecord[],
        isUrgent = false
      ) => {
        if (!user || tempChatRef.current || !chatStorageAvailable()) return;
        try {
          if (!activeConversationIdRef.current) {
            const conv = await createConversation(titleFromText(text));
            activeConversationIdRef.current = conv.id;
            setActiveConversationId(conv.id);
          }
          const rows: Array<{ role: 'user' | 'assistant'; content: string; is_urgent?: boolean; sources: ResearchRecord[] | null }> = [
            { role: 'user', content: text, sources: null },
          ];
          if (assistantContent !== null) {
            rows.push({
              role: 'assistant',
              content: assistantContent,
              is_urgent: isUrgent,
              sources: sources ?? null,
            });
          }
          await appendMessages(activeConversationIdRef.current, rows);
          setSaveStatus('saved');
          void refreshConversationsRef.current();
        } catch (err) {
          console.warn('Chat save failed:', err);
          setSaveStatus('error');
        }
      };

      try {
        await runSend(text, persist);
      } catch (err) {
        console.error('send failed:', err);
        setAiNotice('error');
        setMessages((prev) => {
          const hasReply = prev.some(
            (m) => m.role === 'assistant' && m.content.trim().length > 0
          );
          return hasReply
            ? prev
            : [
                ...prev,
                {
                  id: `msg-${Date.now()}-err`,
                  role: 'assistant' as const,
                  content: `${tc.chatSearchFailed}\n\n${tc.chatDisclaimer}`,
                },
              ];
        });
      } finally {
        setLoading(false);
        busyRef.current = false;
      }
    },
    [input, tc, runSend, user]
  );

  const handleAddFiles = useCallback((files: FileList | File[]) => {
    const res = addFiles(files);
    if (res.errors.length > 0) setAttachmentErrors(res.errors);
    return res;
  }, [addFiles]);
  const dismissAttachmentErrors = useCallback(() => setAttachmentErrors([]), []);

  const setSpeaking = useCallback((id: string | null) => {
    speakingIdRef.current = id;
    setSpeakingMsgId(id);
  }, []);

  const speakViaProvider = useCallback((msg: PatientMsg) => {
    setSpeaking(msg.id);
    void speakText(msg.content, detectInputLanguage(msg.content)).then((audio) => {
      if (speakingIdRef.current !== msg.id) return;
      if (!audio) {
        audioRef.current = null;
        setSpeaking(null);
        setVoicesAvailable(false);
        setMic({ status: 'error', message: tc.noVoices });
        return;
      }
      audioRef.current = audio;
      audio.onended = () => { audioRef.current = null; setSpeaking(null); };
      audio.onerror = () => { audioRef.current = null; setSpeaking(null); };
      void audio.play().catch(() => {
        audioRef.current = null;
        setSpeaking(null);
        setMic({ status: 'error', message: tc.noVoices });
      });
    });
  }, [setSpeaking, tc.noVoices]);

  const stopSpeaking = useCallback(() => {
    if (speechOutputSupported()) window.speechSynthesis.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audioRef.current = null;
    }
    setSpeaking(null);
  }, [setSpeaking]);

  const speak = useCallback((msg: PatientMsg) => {
    if (speakingIdRef.current === msg.id) { stopSpeaking(); return; }
    stopSpeaking();

    // Path 1: the browser's own voices (best quality when installed).
    // Some browsers (Chrome, Edge) report zero voices until they finish
    // loading asynchronously but still speak with a default voice, so local
    // synthesis is always attempted first when the engine exists.
    if (speechOutputSupported()) {
      const utterance = new SpeechSynthesisUtterance(msg.content);
      utterance.lang = speechTagFor(detectInputLanguage(msg.content));
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang === utterance.lang)
        ?? voices.find((v) => v.lang.startsWith(utterance.lang.split('-')[0]));
      if (match) utterance.voice = match;
      let started = false;
      utterance.onstart = () => { started = true; };
      utterance.onend = () => setSpeaking(null);
      utterance.onerror = () => setSpeaking(null);
      setSpeaking(msg.id);
      window.speechSynthesis.speak(utterance);
      // Safari and locked-down browsers can silently fail without firing
      // onerror. If nothing is audibly playing shortly after, fall back to
      // the provider voice instead of leaving a stuck "Stop" button.
      window.setTimeout(() => {
        if (speakingIdRef.current !== msg.id) return;
        if (started || window.speechSynthesis.speaking) return;
        speakViaProvider(msg);
      }, 800);
      return;
    }

    // Path 2: no speech engine at all — have the AI provider speak instead,
    // so read-aloud works everywhere.
    speakViaProvider(msg);
  }, [stopSpeaking, setSpeaking, speakViaProvider]);
  speakRef.current = speak;

  const dismissMicMessage = useCallback(() => {
    setMic((m) => ({ ...m, message: null, status: m.status === 'error' || m.status === 'captured' ? 'idle' : m.status }));
  }, []);

  const grantAudioConsent = useCallback(() => {
    try {
      localStorage.setItem('oncofrontier-audio-consent', 'yes');
    } catch {
      // private mode — consent applies for this session only
      sessionStorage.setItem('oncofrontier-audio-consent', 'yes');
    }
    setNeedsAudioConsent(false);
  }, []);

  // Voice fallback: record with MediaRecorder, then transcribe. Used when
  // the browser's speech service is blocked (Brave Shields, ad blockers).
  //
  // Consent: transcription sends the raw audio to the transcription
  // provider, so the user must have accepted consent (once, persisted).
  // Cancellation stops the mic and discards the audio — nothing is sent.
  // Raw audio is held only in memory until transcription completes and is
  // never stored or logged.
  const startRecordingFallback = useCallback(async () => {
    const consented = localStorage.getItem('oncofrontier-audio-consent') === 'yes';
    if (!consented) {
      // Ask before any audio is recorded: recording itself only touches the
      // mic, but the transcript flow sends audio externally.
      setMic({ status: 'idle', message: null });
      setNeedsAudioConsent(true);
      return;
    }
    const cancelled = { current: false };
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMic({ status: 'error', message: tc.micPermissionDenied });
      return;
    }
    const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      recognitionRef.current = null;
      cancelRecordingRef.current = null;
      stopRecordingRef.current = null;
      if (cancelled.current) {
        chunks.length = 0;
        setMic({ status: 'idle', message: null });
        return;
      }
      if (chunks.length === 0 || chunks.every((c) => c.size === 0)) {
        setMic({ status: 'error', message: tc.micNoSpeech });
        return;
      }
      if (!consented) {
        chunks.length = 0;
        setMic({ status: 'error', message: tc.audioConsentRequired });
        return;
      }
      setMic({ status: 'captured', message: tc.micProcessing });
      const blob = new Blob(chunks, { type: mime || 'audio/webm' });
      chunks.length = 0;
      // Handing the locally recorded audio to the transcription provider.
      const { transcribeAudio } = await import('@/lib/transcription');
      const text = await transcribeAudio(blob, chatLanguage);
      if (text) {
        setInput((prev) => (prev ? `${prev} ${text}` : text));
        setMic({ status: 'captured', message: tc.micDone });
      } else {
        setMic({ status: 'error', message: tc.micUnavailable });
      }
    };
    const stop = () => {
      if (recorder.state !== 'inactive') recorder.stop();
    };
    stopRecordingRef.current = stop;
    cancelRecordingRef.current = () => {
      cancelled.current = true;
      stop();
    };
    recorder.start();
    setMic({ status: 'listening', message: null });
  }, [chatLanguage, tc]);

  const cancelActiveRecording = useCallback(() => {
    if (cancelRecordingRef.current) {
      cancelRecordingRef.current();
      return;
    }
    stopRecordingRef.current?.();
  }, []);

  const toggleListening = useCallback(() => {
    if (mic.status === 'listening') {
      // Either path may be active; stop whichever one is.
      if (recognitionRef.current) recognitionRef.current.stop();
      else cancelActiveRecording();
      return;
    }
    setMic({ status: 'listening', message: null });
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      void startRecordingFallback();
      return;
    }
    const rec = new Ctor();
    rec.lang = speechTagFor(chatLanguage);
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setMic({ status: 'captured', message: tc.micDone });
      } else {
        setMic({ status: 'error', message: tc.micNoSpeech });
      }
    };
    rec.onerror = (e) => {
      const code = (e as { error?: string })?.error;
      // Network / service blocks (Brave Shields, ad blockers) fall back to
      // recording + AI transcription instead of a dead end.
      if (code === 'network' || code === 'service-not-allowed') {
        recognitionRef.current = null;
        void startRecordingFallback();
        return;
      }
      const messages: Record<string, string> = {
        'not-allowed': tc.micPermissionDenied,
        network: tc.micNetwork,
        'no-speech': tc.micNoSpeech,
        aborted: tc.micAborted,
        'audio-capture': tc.micSoundNeeded,
      };
      setMic({ status: 'error', message: messages[code ?? ''] ?? tc.micUnavailable });
    };
    let finished = false;
    // Safety net: a blocked speech service can start recognition and then go
    // silent forever, leaving the banner stuck on "Listening…". If nothing
    // arrives within 15 s, stop and say so instead of hanging.
    if (micWatchdogRef.current) window.clearTimeout(micWatchdogRef.current);
    micWatchdogRef.current = window.setTimeout(() => {
      micWatchdogRef.current = null;
      if (finished) return;
      finished = true;
      try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
      recognitionRef.current = null;
      setMic((m) => (m.status === 'listening' ? { status: 'error', message: tc.micStalled } : m));
    }, 15_000);
    rec.onend = () => {
      if (micWatchdogRef.current) {
        window.clearTimeout(micWatchdogRef.current);
        micWatchdogRef.current = null;
      }
      recognitionRef.current = null;
      // A silent end with no result and no error usually means the mic
      // never actually opened (blocked permission, no audio device) —
      // tell the user instead of returning to idle invisibly.
      setMic((m) => {
        if (m.status === 'captured' || m.status === 'error') return m;
        return finished ? { status: 'idle', message: null } : { status: 'error', message: tc.micNoSpeech };
      });
    };
    const wrappedOnResult = rec.onresult;
    rec.onresult = (e) => {
      finished = true;
      wrappedOnResult(e);
    };
    const wrappedOnError = rec.onerror;
    rec.onerror = (e) => {
      finished = true;
      wrappedOnError(e);
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      // start() throws if recognition is already running — try the recorder.
      recognitionRef.current = null;
      void startRecordingFallback();
    }
  }, [mic.status, chatLanguage, tc, startRecordingFallback, cancelActiveRecording]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setAiNotice('none');
    setActiveConversationId(null);
    activeConversationIdRef.current = null;
    setSaveStatus(user ? (tempChatRef.current ? 'temp' : 'unsaved') : 'guest');
  }, [user]);

  const clear = useCallback(() => {
    setMessages([]);
    setAiNotice('none');
  }, []);

  // Load the conversation list when a user signs in (or out).
  const refreshConversations = useCallback(async () => {
    if (!user || !chatStorageAvailable()) {
      setConversations([]);
      return;
    }
    setConversationsLoading(true);
    try {
      setConversations(await listConversations(true));
    } catch (err) {
      console.warn('Could not load conversations:', err);
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);
  refreshConversationsRef.current = refreshConversations;

  // Signing in/out resets the in-memory view and save status.
  useEffect(() => {
    setActiveConversationId(null);
    activeConversationIdRef.current = null;
    if (!user) setSaveStatus('guest');
    else setSaveStatus(tempChatRef.current ? 'temp' : 'unsaved');
  }, [user]);

  const openConversation = useCallback(async (id: string) => {
    if (busyRef.current || loading) return;
    try {
      const msgs = await loadMessages(id);
      setMessages(msgs);
      setAiNotice('none');
      setActiveConversationId(id);
      activeConversationIdRef.current = id;
      setSaveStatus('saved');
    } catch (err) {
      console.warn('Could not open conversation:', err);
    }
  }, [loading]);

  const renameActive = useCallback(async (title: string) => {
    const id = activeConversationIdRef.current;
    if (!id || !title.trim()) return;
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    try {
      await renameConversation(id, title.trim());
    } catch (err) {
      console.warn('Rename failed:', err);
      void refreshConversations();
    }
  }, [refreshConversations]);

  const archiveConversation = useCallback(async (id: string, archived: boolean) => {
    try {
      await setArchived(id, archived);
      if (activeConversationIdRef.current === id && archived) startNewChat();
      await refreshConversations();
    } catch (err) {
      console.warn('Archive failed:', err);
    }
  }, [refreshConversations, startNewChat]);

  const removeConversation = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      if (activeConversationIdRef.current === id) startNewChat();
      await refreshConversations();
    } catch (err) {
      console.warn('Delete failed:', err);
    }
  }, [refreshConversations, startNewChat]);

  const setTempChat = useCallback((temp: boolean) => {
    tempChatRef.current = temp;
    setTempChatState(temp);
    if (user) setSaveStatus(temp ? 'temp' : (activeConversationIdRef.current ? 'saved' : 'unsaved'));
  }, [user]);

  return {
    messages, input, setInput, loading, aiNotice,
    mic, listening: mic.status === 'listening', speakingMsgId,
    canListen:
      speechInputSupported() ||
      (typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia),
    canSpeak: speechOutputSupported(),
    voicesAvailable,
    dismissMicMessage,
    grantAudioConsent,
    needsAudioConsent,
    attachments, addFiles: handleAddFiles, removeAttachment: remove,
    clearAttachments, attachmentErrors, dismissAttachmentErrors,
    send, speak, stopSpeaking, toggleListening, cancelActiveRecording, clear,
    conversations, conversationsLoading, activeConversationId, saveStatus,
    tempChat, setTempChat,
    storageAvailable: chatStorageAvailable(),
    startNewChat, openConversation, renameActive, archiveConversation,
    removeConversation, refreshConversations,
  };
}

export function CompanionChatProvider({ children }: { children: ReactNode }) {
  const { language, userLanguage } = useApp();
  const t = getTranslation(language);
  const value = useCompanionChatState(t.companion, userLanguage);
  return <CompanionChatContext.Provider value={value}>{children}</CompanionChatContext.Provider>;
}

export function useCompanionChat(): CompanionChatState {
  const ctx = useContext(CompanionChatContext);
  if (!ctx) throw new Error('useCompanionChat requires CompanionChatProvider');
  return ctx;
}

export function MicStatusBanner({
  mic, onDismiss, input, send, needsAudioConsent, onGrantConsent, micStop,
}: {
  mic: MicState;
  onDismiss: () => void;
  input: string;
  send: () => void;
  needsAudioConsent?: boolean;
  onGrantConsent?: () => void;
  micStop?: () => void;
}) {
  const { language } = useApp();
  const tc = getTranslation(language).companion;
  const listening = mic.status === 'listening';
  const showEditHint = mic.status === 'captured' && input.trim().length > 0;
  if (needsAudioConsent) {
    return (
      <div className="px-3 py-2 bg-amber-50 border-b border-amber-200 flex items-start gap-2 flex-shrink-0" role="alert">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            {tc.audioConsentRequired}
          </p>
          <button
            onClick={onGrantConsent}
            className="mt-1.5 px-3 py-1.5 text-[11px] font-medium rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors"
          >
            {tc.allowAudioConsent}
          </button>
        </div>
      </div>
    );
  }
  if (mic.status === 'idle' || (!mic.message && !listening && !showEditHint)) return null;
  const isError = mic.status === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`px-3 py-2 flex items-start gap-2 flex-shrink-0 ${
        isError ? 'bg-red-50 border-b border-red-100' : 'bg-teal-50 border-b border-teal-100'
      }`}
    >
      {listening ? (
        <Mic className="w-4 h-4 text-red-600 animate-pulse flex-shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isError ? 'text-red-600' : 'text-teal-600'}`} aria-hidden="true" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] leading-relaxed ${isError ? 'text-red-800' : 'text-teal-800'}`}>
          {listening ? tc.listeningHint
            : mic.message}
        </p>
        {listening && micStop && (
          <button
            onClick={micStop}
            className="mt-1 px-2 py-1 text-[11px] font-medium rounded bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            {tc.micStopAndInsert}
          </button>
        )}
        {showEditHint && (
          <button
            onClick={send}
            className="mt-1 px-2 py-1 text-[11px] font-medium rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors"
          >
            {tc.sendNow}
          </button>
        )}
      </div>
      {!listening && (
        <button
          onClick={onDismiss}
          aria-label={tc.dismissMessage}
          className="p-0.5 rounded hover:bg-black/5 flex-shrink-0"
        >
          <span aria-hidden="true" className="text-xs px-1">✕</span>
        </button>
      )}
    </div>
  );
}

export function QuickPrompts({
  tc, onPrompt, canSpeak, speaking, onStopSpeaking, quickPhrases,
}: {
  tc: CompanionT;
  onPrompt: (text: string) => void;
  canSpeak: boolean;
  speaking: boolean;
  onStopSpeaking: () => void;
  quickPhrases?: boolean;
}) {
  const prompts: { label: string; text: string }[] = [
    { label: tc.qpExplainSimply, text: tc.qpExplainSimply },
    { label: tc.qpWhatToDo, text: tc.qpWhatToDo },
    { label: tc.qpSideEffects, text: tc.qpSideEffects },
  ];
  const phrases: string[] = quickPhrases
    ? [tc.whatToDo, tc.checklist, tc.printChecklist].filter((p): p is string => Boolean(p))
    : [];
  return (
    <div className="px-3 py-2 border-t border-navy-100 flex-shrink-0">
      <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1.5">{tc.quickPrompts}</p>
      <div className="flex flex-wrap gap-1.5">
        {phrases.map((p) => (
          <button
            key={`phrase-${p}`}
            onClick={() => onPrompt(p)}
            className="px-2.5 py-1.5 text-xs rounded-full bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors min-h-[2.25rem]"
          >
            {p}
          </button>
        ))}
        {prompts.map((p) => (
          <button
            key={p.label}
            onClick={() => onPrompt(p.text)}
            className="px-2.5 py-1.5 text-xs rounded-full bg-navy-50 text-navy-700 hover:bg-teal-50 hover:text-teal-700 border border-navy-100 transition-colors min-h-[2.25rem]"
          >
            {p.label}
          </button>
        ))}
        {canSpeak && (
          <button
            onClick={speaking ? onStopSpeaking : () => onPrompt(tc.qpReadAloud)}
            className={`px-2.5 py-1.5 text-xs rounded-full border transition-colors inline-flex items-center gap-1 min-h-[2.25rem] ${
              speaking
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-navy-50 text-navy-700 border-navy-100 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            {speaking ? (
              <><Square className="w-3 h-3" aria-hidden="true" />{tc.qpStop}</>
            ) : (
              <><Volume2 className="w-3 h-3" aria-hidden="true" />{tc.qpReadAloud}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function ChatBubble({
  message, canSpeak, speaking, onSpeak,
}: {
  message: PatientMsg;
  canSpeak: boolean;
  speaking: boolean;
  onSpeak: () => void;
}) {
  const isUser = message.role === 'user';
  const RTL_SCRIPT = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/;
  const msgDir = RTL_SCRIPT.test(message.content) ? 'rtl' : 'ltr';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-teal-500 text-white rounded-2xl rounded-tr-md px-4 py-2.5">
          <p className="text-sm leading-relaxed" dir={msgDir}>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className={`max-w-[90%] w-full rounded-2xl rounded-tl-md px-4 py-3 border ${
        message.isUrgent
          ? 'bg-red-50 border-red-200'
          : 'bg-navy-50/50 border-navy-100'
      }`}>
        {message.isUrgent && (
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">{message.urgentLabel ?? 'Urgent'}</span>
          </div>
        )}
        <div className="text-sm text-navy-800 whitespace-pre-wrap leading-relaxed" dir={msgDir}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={line.startsWith('   ') ? 'ps-3 text-xs' : 'text-xs sm:text-sm'}>
              {line}
            </p>
          ))}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-semibold text-navy-700">{message.sourcesLabel ?? 'Sources:'}</p>
            {message.sources.map((src, i) => (
              <a
                key={i}
                href={src.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-teal-600 hover:text-teal-700 truncate"
              >
                <ExternalLink className="w-3 h-3 inline me-1" />
                {src.title}
              </a>
            ))}
          </div>
        )}
        {canSpeak && (
          <button
            onClick={onSpeak}
            className="mt-2 text-xs text-navy-500 hover:text-teal-600 inline-flex items-center gap-1 transition-colors"
            aria-pressed={speaking}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {speaking ? (message.stopLabel ?? 'Stop') : (message.listenLabel ?? 'Listen')}
          </button>
        )}
      </div>
    </div>
  );
}
