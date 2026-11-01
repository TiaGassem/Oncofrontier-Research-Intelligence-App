// Floating Companion bubble: persistent launcher available on every route.
// Conversation state lives in CompanionChatProvider, so it survives navigation.
import { useEffect, useRef, useState } from 'react';
import { Heart, X, Send, Mic, RotateCcw, Paperclip, FileText, History } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { billingT } from '@/lib/billingTranslations';
import {
  useCompanionChat, ChatBubble, MicStatusBanner, QuickPrompts,
} from '@/components/CompanionChatCore';
import { ConversationManager } from '@/components/ConversationManager';
import { useA11ySpeech } from '@/lib/a11yPrefs';

export function FloatingCompanion({ hidden }: { hidden?: boolean }) {
  const { language, direction, setCurrentView } = useApp();
  const t = getTranslation(language);
  const bt = billingT(language);
  const tc = t.companion;
  const a11y = useA11ySpeech();
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages, input, setInput, loading, aiNotice,
    mic, dismissMicMessage, stopSpeaking,
    listening, speakingMsgId, send, speak, toggleListening, canListen, canSpeak,
    startNewChat,
    attachments, addFiles, removeAttachment, attachmentErrors, dismissAttachmentErrors,
    needsAudioConsent, grantAudioConsent,
  } = useCompanionChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPrompt = (text: string) => {
    if (text === tc.qpReadAloud) {
      const last = [...messages].reverse().find((m) => m.role === 'assistant' && m.content.trim());
      if (last) speak(last);
      return;
    }
    void send(text);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  if (hidden) return null;

  const safeBottom = 'bottom-[max(1rem,env(safe-area-inset-bottom))]';
  const safeRight = 'right-[max(1rem,env(safe-area-inset-right))]';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={tc.chat}
        title={tc.chat}
        data-one-handed-control
        className={`fixed z-50 ${safeBottom} ${safeRight} w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 focus-visible:ring-2 focus-visible:ring-teal-300 transition-colors flex items-center justify-center ${
          open ? 'hidden' : 'flex'
        }`}
      >
        <Heart className="w-6 h-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={tc.chat}
          dir={direction}
          data-one-handed-control
          className={`fixed z-50 ${safeBottom} ${safeRight} w-[min(26rem,calc(100vw-1rem))] h-[min(44rem,calc(100vh-1rem))] bg-white rounded-2xl shadow-2xl border border-navy-100 flex flex-col overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-navy-900 text-white flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="w-4 h-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-bold truncate">{tc.chat}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHistory(!showHistory)}
                aria-expanded={showHistory}
                aria-label={tc.chatHistory}
                title={tc.chatHistory}
                className="p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              >
                <History className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={startNewChat}
                aria-label={tc.newConversation}
                title={tc.newConversation}
                className="p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label={tc.closeChat}
                title={tc.closeChat}
                className="p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {aiNotice !== 'none' && (
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex-shrink-0" role="status">
              <p className="text-[11px] text-blue-800 leading-relaxed">
                {aiNotice === 'auth' && tc.aiProviderAuth}
                {aiNotice === 'signIn' && tc.aiSignInRequired}
                {aiNotice === 'network' && tc.aiProviderNetwork}
                {aiNotice === 'quota' && tc.aiProviderQuota}
                {aiNotice === 'limit' && (
                  <>
                    {bt.limitReachedNotice}{' '}
                    <button
                      onClick={() => setCurrentView('pricing')}
                      className="underline font-medium"
                      aria-label={bt.limitReachedCta}
                    >
                      {bt.limitReachedCta}
                    </button>
                  </>
                )}
                {aiNotice === 'error' && tc.aiProviderError}
              </p>
            </div>
          )}

          <MicStatusBanner
            mic={mic}
            onDismiss={dismissMicMessage}
            input={input}
            send={() => void send()}
            needsAudioConsent={needsAudioConsent}
            onGrantConsent={grantAudioConsent}
          />

          <p role="note" className="px-3 py-2 text-[10px] leading-relaxed text-amber-800 bg-amber-50 border-b border-amber-100">
            {tc.privacyNotice}
          </p>

          {showHistory && (
            <div className="border-b border-navy-100 max-h-56 overflow-hidden flex flex-col flex-shrink-0">
              <ConversationManager compact />
            </div>
          )}

          {attachmentErrors.length > 0 && (
            <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex-shrink-0" role="alert">
              {attachmentErrors.map((e, i) => (
                <p key={i} className="text-[11px] text-red-800 leading-relaxed">{e}</p>
              ))}
              <button
                onClick={dismissAttachmentErrors}
                className="text-[11px] text-red-700 underline mt-1"
              >
                {tc.dismissMessage}
              </button>
            </div>
          )}

          <div
            className="flex-1 min-h-[9rem] basis-0 overflow-y-auto overscroll-contain p-3 space-y-3"
            role="log"
            aria-live="polite"
            aria-label={tc.chat}
          >
            {messages.length === 0 && !loading && (
              <div className="text-center py-6 px-4">
                <Heart className="w-10 h-10 text-navy-100 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-navy-500 leading-relaxed">{tc.chatIntro}</p>
                <p className="mt-2 text-[11px] text-navy-400 leading-relaxed">{tc.typeInsteadHint}</p>
              </div>
            )}

            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                canSpeak={canSpeak}
                speaking={speakingMsgId === msg.id}
                onSpeak={() => speak(msg)}
              />
            ))}

            {loading && (
              <div className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <p className="text-xs text-navy-500">{t.common.loading}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-navy-100 p-2 flex-shrink-0">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {attachments.map((att) => (
                  <span key={att.id} className="inline-flex items-center gap-1 bg-navy-50 rounded-lg ps-2 pe-1 py-1 max-w-full">
                    {att.kind === 'image' && att.previewUrl ? (
                      <img src={att.previewUrl} alt={att.file.name} className="w-5 h-5 rounded object-cover" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="text-[10px] text-navy-700 truncate max-w-[8rem]">{att.file.name}</span>
                    <button
                      onClick={() => removeAttachment(att.id)}
                      aria-label={`${tc.removeFile} ${att.file.name}`}
                      className="p-0.5 rounded hover:bg-navy-100"
                    >
                      <X className="w-3 h-3 text-navy-500" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label={tc.attachFile}
                title={tc.attachFileMax}
                className="p-2 rounded-lg bg-navy-50 text-navy-500 hover:bg-navy-100 flex-shrink-0 transition-colors"
              >
                <Paperclip className="w-4 h-4" aria-hidden="true" />
              </button>
              <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={tc.chatPlaceholder}
              aria-label={tc.chatPlaceholder}
              dir={/[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(input) ? 'rtl' : 'ltr'}
              className="flex-1 min-w-0 resize-none max-h-28 bg-transparent text-sm leading-relaxed text-navy-900 placeholder-navy-300 outline-none px-2 py-1.5"
              style={{ height: `${Math.min(7, Math.max(1, input.split('\n').length)) * 1.5 + 0.75}rem` }}
            />
            {canListen && (
              <button
                onClick={toggleListening}
                aria-pressed={listening}
                aria-label={listening ? tc.stopVoiceInput : tc.voiceInput}
                className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                  listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                }`}
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label={tc.sendToChat}
              className="px-3 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40 flex items-center gap-1 flex-shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-navy-100">
            <button
              type="button"
              onClick={() => setShowPrompts((v) => !v)}
              aria-expanded={showPrompts}
              className="w-full px-3 py-2 text-start text-[11px] font-semibold text-navy-500 hover:text-navy-800"
            >
              {showPrompts ? tc.hideQuickPrompts : tc.showQuickPrompts}
            </button>
            {showPrompts && (
              <div className="max-h-32 overflow-y-auto">
                <QuickPrompts
                  tc={tc}
                  onPrompt={onPrompt}
                  canSpeak={canSpeak}
                  speaking={speakingMsgId !== null}
                  onStopSpeaking={stopSpeaking}
                  quickPhrases={a11y.quickPhrases}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
