// Conversation manager UI shared by the full Companion page and the floating
// bubble: sidebar list, search, rename, archive, delete with confirmation, export.
import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Archive, ArchiveRestore, Trash2, Download, Check, X, Search } from 'lucide-react';
import { useCompanionChat } from '@/components/CompanionChatCore';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import type { ConversationSummary } from '@/lib/chatHistory';

export function ConversationManager({ compact = false }: { compact?: boolean }) {
  const chat = useCompanionChat();
  const { language } = useApp();
  const u = getTranslation(language).chatUi;
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const filtered = chat.conversations
    .filter((c) => (showArchived ? true : !c.archived))
    .filter((c) => (query.trim() ? c.title.toLowerCase().includes(query.trim().toLowerCase()) : true));

  const startEdit = (c: ConversationSummary) => {
    setEditingId(c.id);
    setEditValue(c.title);
  };

  const saveEdit = () => {
    if (editingId) {
      void chat.renameActive(editValue);
      setEditingId(null);
    }
  };

  // Export the conversation's full message list as a JSON file.
  const exportConversation = async (c: ConversationSummary) => {
    try {
      const { loadMessages } = await import('@/lib/chatHistory');
      const msgs = await loadMessages(c.id);
      const payload = {
        title: c.title,
        exportedAt: new Date().toISOString(),
        messages: msgs.map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp ?? null })),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${c.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'conversation'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Export failed:', err);
    }
  };

  if (!chat.storageAvailable) {
    return (
      <div className="px-3 py-2 text-[11px] text-navy-400">
        {u.storageUnavailable}
      </div>
    );
  }

  if (chat.saveStatus === 'guest') {
    return (
      <div className="px-3 py-3">
        <p className="text-[11px] text-navy-500 leading-relaxed">
          {u.guestPrompt}
        </p>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    saved: u.saved,
    saving: u.saving,
    unsaved: u.unsaved,
    temp: u.temp,
    error: u.saveError,
    guest: u.guestStatus,
  };

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-navy-300 absolute start-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={u.searchConversations}
            aria-label={u.searchAria}
            className="w-full ps-8 pe-2 py-1.5 text-xs bg-navy-50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
          />
        </div>
        <button
          onClick={() => { chat.startNewChat(); setConfirmDeleteId(null); }}
          aria-label={u.newChat}
          title={u.newChat}
          className="p-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="px-3 pb-2">
        <p className="text-[10px] font-medium text-navy-400" role="status">{statusLabel[chat.saveStatus] ?? ''}</p>
      </div>

      <div className={`overflow-y-auto min-h-0 ${compact ? 'max-h-48' : 'flex-1'}`}>
        {chat.conversationsLoading && chat.conversations.length === 0 ? (
          <p className="px-3 py-4 text-xs text-navy-400">{u.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="px-3 py-4 text-xs text-navy-400">
            {showArchived ? u.noArchived : u.noConversations}
          </p>
        ) : (
          <ul className="px-2 pb-2 space-y-0.5">
            {filtered.map((c) => {
              const active = c.id === chat.activeConversationId;
              const editing = editingId === c.id;
              return (
                <li key={c.id}>
                  {editing ? (
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditingId(null);
                          e.stopPropagation();
                        }}
                        className="flex-1 min-w-0 text-xs bg-white border border-teal-300 rounded px-2 py-1 outline-none"
                      />
                      <button onClick={saveEdit} aria-label={u.saveTitle} className="p-1 rounded hover:bg-navy-50">
                        <Check className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                        <span className="sr-only">{u.saveTitle}</span>
                      </button>
                      <button onClick={() => setEditingId(null)} aria-label={u.cancel} className="p-1 rounded hover:bg-navy-50">
                        <X className="w-3.5 h-3.5 text-navy-400" aria-hidden="true" />
                        <span className="sr-only">{u.cancel}</span>
                      </button>
                    </div>
                  ) : confirmDeleteId === c.id ? (
                    <div className="px-2 py-2 bg-red-50 rounded-lg">
                      <p className="text-[11px] text-red-800 leading-relaxed mb-1.5">
                        {u.deleteConfirm.replace('{title}', c.title)}
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { void chat.removeConversation(c.id); setConfirmDeleteId(null); }}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          {u.delete}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-white border border-navy-100 text-navy-600 hover:bg-navy-50"
                        >
                          {u.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
                        active ? 'bg-teal-50 border border-teal-200' : 'hover:bg-navy-50 border border-transparent'
                      }`}
                    >
                      <button
                        onClick={() => void chat.openConversation(c.id)}
                        className="flex-1 min-w-0 text-start"
                        aria-current={active ? 'true' : undefined}
                      >
                        <span className="block text-xs font-medium text-navy-800 truncate">{c.title}</span>
                        <span className="block text-[10px] text-navy-400">
                          {new Date(c.updatedAt).toLocaleDateString()}
                        </span>
                      </button>
                      <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                        <button onClick={() => startEdit(c)} aria-label={`${u.rename} ${c.title}`} className="p-1 rounded hover:bg-navy-100">
                          <Pencil className="w-3 h-3 text-navy-400" aria-hidden="true" />
                          <span className="sr-only">{u.rename}</span>
                        </button>
                        <button onClick={() => void exportConversation(c)} aria-label={`${u.exportLabel} ${c.title}`} className="p-1 rounded hover:bg-navy-100">
                          <Download className="w-3 h-3 text-navy-400" aria-hidden="true" />
                          <span className="sr-only">{u.exportLabel}</span>
                        </button>
                        <button
                          onClick={() => void chat.archiveConversation(c.id, !c.archived)}
                          aria-label={c.archived ? `${u.unarchive} ${c.title}` : `${u.archive} ${c.title}`}
                          className="p-1 rounded hover:bg-navy-100"
                        >
                          {c.archived
                            ? <ArchiveRestore className="w-3 h-3 text-navy-400" aria-hidden="true" />
                            : <Archive className="w-3 h-3 text-navy-400" aria-hidden="true" />}
                          <span className="sr-only">{c.archived ? u.unarchive : u.archive}</span>
                        </button>
                        <button onClick={() => setConfirmDeleteId(c.id)} aria-label={`${u.delete} ${c.title}`} className="p-1 rounded hover:bg-red-50">
                          <Trash2 className="w-3 h-3 text-red-400" aria-hidden="true" />
                          <span className="sr-only">{u.delete}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-3 py-2 border-t border-navy-100 flex items-center justify-between">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="text-[11px] text-navy-400 hover:text-navy-600 inline-flex items-center gap-1"
        >
          <Archive className="w-3 h-3" aria-hidden="true" />
          {showArchived ? u.hideArchived : u.showArchived}
        </button>
        <button
          onClick={() => chat.setTempChat(!chat.tempChat)}
          aria-pressed={chat.tempChat}
          className={`text-[11px] inline-flex items-center gap-1 rounded-full px-2 py-0.5 border transition-colors ${
            chat.tempChat
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'text-navy-400 border-navy-100 hover:text-navy-600'
          }`}
        >
          {chat.tempChat ? u.tempChatOn : u.tempChat}
        </button>
      </div>
    </div>
  );
}
