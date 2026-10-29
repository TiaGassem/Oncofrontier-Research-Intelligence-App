import { useState, useEffect, useCallback } from 'react';
import {
  Bookmark, History, FolderOpen, Trash2, ExternalLink, FileText, FlaskConical, Search,
  BellRing, Plus, Play, Pause, Pencil, RefreshCw, X, Download, Upload,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/States';
import { useAuth } from '@/context/AuthContext';
import { fetchFavorites, removeFavorite, addFavorite, fetchSearchHistory, deleteSearchHistory, type FavoriteEntry, type SearchHistoryEntry } from '@/lib/persistence';
import {
  exportRecords, parseImportText, fetchByDoi, fetchByPmid,
  type ExportFormat, type BibData, type ImportedEntry,
} from '@/lib/referenceFormats';
import {
  fetchAutomations, createAutomation, updateAutomation, deleteAutomation, recordCheckResult,
  type SavedSearchAutomation,
} from '@/lib/automations';
import { unifiedSearch } from '@/lib/search';
import {
  fetchProjects, createProject, deleteProject, fetchProjectItems, addProjectItem, removeProjectItem,
  type ProjectEntry, type ProjectItemEntry,
} from '@/lib/projects';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import type { ResearchRecord } from '@/types';

type Tab = 'favorites' | 'history' | 'projects' | 'automations';

export function Library() {
  const { user } = useAuth();
  const { language } = useApp();
  const t = getTranslation(language).library;
  const [tab, setTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [importing, setImporting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [favs, hist] = await Promise.all([fetchFavorites(), fetchSearchHistory()]);
    setFavorites(favs);
    setHistory(hist);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const handleRemoveFav = async (id: string) => {
    await removeFavorite(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteSearchHistory(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const favToBib = (fav: FavoriteEntry): BibData => {
    const meta = fav.metadata as {
      authors?: string[]; journal?: string; pubDate?: string;
      publicationType?: string; trialStatus?: string; trialPhase?: string;
    };
    return {
      title: fav.title,
      authors: meta.authors ?? [],
      journal: meta.journal,
      pubDate: meta.pubDate,
      doi: fav.doi ?? undefined,
      pmid: fav.pmid ?? undefined,
      nctId: fav.nct_id ?? undefined,
      publicationType: meta.publicationType,
      trialStatus: meta.trialStatus,
      trialPhase: meta.trialPhase,
    };
  };

  const handleExport = (format: ExportFormat) => {
    exportRecords(favorites.map(favToBib), format);
  };

  const entryToRecord = (entry: ImportedEntry): ResearchRecord => ({
    id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: 'publication',
    provider: entry.pmid ? 'pubmed' : 'crossref',
    title: entry.title,
    authors: entry.authors,
    journal: entry.journal,
    pubDate: entry.year,
    pmid: entry.pmid,
    doi: entry.doi,
    sourceUrl: entry.doi
      ? `https://doi.org/${entry.doi}`
      : `https://pubmed.ncbi.nlm.nih.gov/${entry.pmid ?? ''}/`,
    retrievedAt: new Date().toISOString(),
    cancerTerms: [],
    targetTerms: [],
    treatmentTerms: [],
    accessStatus: 'unknown',
  });

  const handleImport = async () => {
    setImportStatus(null);
    const pasted = importText.trim();
    if (!pasted) return;
    setImporting(true);
    try {
      const entries: ImportedEntry[] = parseImportText(pasted);
      // Bare DOI or PMID lines are looked up for real metadata.
      if (entries.length === 0) {
        const lines = pasted.split(/\s+/).filter(Boolean).slice(0, 25);
        for (const raw of lines) {
          const doiMatch = raw.match(/^(?:https?:\/\/doi\.org\/)?(10\.\S+)$/);
          const pmidMatch = raw.match(/^(?:PMID:?\s*)?(\d{6,9})$/i);
          if (doiMatch) {
            const fetched = await fetchByDoi(doiMatch[1]);
            if (fetched) entries.push(fetched);
          } else if (pmidMatch) {
            const fetched = await fetchByPmid(pmidMatch[1]);
            if (fetched) entries.push(fetched);
          }
        }
      }
      if (entries.length === 0) {
        setImportStatus({ ok: false, message: t.importNothingFound });
        return;
      }
      // Skip entries already in the library (same DOI or PMID).
      const existingKeys = new Set(
        favorites.flatMap((f) => [f.doi ? `doi:${f.doi}` : '', f.pmid ? `pmid:${f.pmid}` : ''])
      );
      const seen = new Set<string>();
      let added = 0;
      let duplicates = 0;
      for (const entry of entries) {
        const key = entry.doi ? `doi:${entry.doi}` : entry.pmid ? `pmid:${entry.pmid}` : '';
        if (!key || existingKeys.has(key) || seen.has(key)) {
          duplicates += 1;
          continue;
        }
        seen.add(key);
        const created = await addFavorite(entryToRecord(entry));
        if (created) added += 1;
      }
      if (added > 0) await loadData();
      setImportStatus({
        ok: true,
        message: `${t.importAdded} ${added}` + (duplicates > 0 ? ` · ${t.importDuplicates} ${duplicates}` : ''),
      });
      setImportText('');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<Bookmark className="w-6 h-6" />}
        title={t.title}
        subtitle={t.subtitle}
        accent="navy"
      />

      <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl border border-navy-100 p-1">
        <TabButton active={tab === 'favorites'} onClick={() => setTab('favorites')} icon={Bookmark} label={`${t.favorites} (${favorites.length})`} />
        <TabButton active={tab === 'history'} onClick={() => setTab('history')} icon={History} label={`${t.history} (${history.length})`} />
        <TabButton active={tab === 'projects'} onClick={() => setTab('projects')} icon={FolderOpen} label={t.projects} />
        <TabButton active={tab === 'automations'} onClick={() => setTab('automations')} icon={BellRing} label={t.automations} />
      </div>

      {loading && <p className="text-sm text-navy-500">{t.loading}</p>}

      {!loading && tab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <EmptyState title={t.noFavoritesTitle} message={t.noFavoritesMessage} icon={Bookmark} />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <button onClick={() => handleExport('csv')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-navy-100 text-navy-700 rounded-lg hover:border-teal-300 hover:text-teal-700 transition-colors">
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <button onClick={() => handleExport('ris')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-navy-100 text-navy-700 rounded-lg hover:border-teal-300 hover:text-teal-700 transition-colors">
                  <Download className="w-3.5 h-3.5" /> RIS
                </button>
                <button onClick={() => handleExport('bibtex')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-navy-100 text-navy-700 rounded-lg hover:border-teal-300 hover:text-teal-700 transition-colors">
                  <Download className="w-3.5 h-3.5" /> BibTeX
                </button>
                <button onClick={() => { setShowImport((s) => !s); setImportStatus(null); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-navy-100 text-navy-700 rounded-lg hover:border-teal-300 hover:text-teal-700 transition-colors ml-auto">
                  {showImport ? <X className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  {showImport ? t.cancel : t.importTitle}
                </button>
              </div>
              {showImport && (
                <div className="bg-white rounded-xl border border-navy-100 p-4 mb-3 space-y-3">
                  <p className="text-xs text-navy-500 leading-relaxed">{t.importHint}</p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={6}
                    aria-label={t.importTitle}
                    className="w-full px-3 py-2 text-xs bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400 font-mono"
                  />
                  {importStatus && (
                    <p className={`text-xs ${importStatus.ok ? 'text-teal-700' : 'text-red-600'}`} role="alert">{importStatus.message}</p>
                  )}
                  <button
                    onClick={() => void handleImport()}
                    disabled={importing || !importText.trim()}
                    className="px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40"
                  >
                    {importing ? t.importing : t.importButton}
                  </button>
                </div>
              )}
              <div className="space-y-2">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-white rounded-xl border border-navy-100 p-4 flex items-start gap-3">
                  {fav.record_kind === 'trial' ? (
                    <FlaskConical className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FileText className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-navy-900 line-clamp-2">{fav.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-navy-400">
                      <span className="capitalize">{fav.provider}</span>
                      {fav.pmid && <span>PMID: {fav.pmid}</span>}
                      {fav.doi && <span>DOI: {fav.doi}</span>}
                      {fav.nct_id && <span>NCT: {fav.nct_id}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {fav.source_url && (
                      <a href={fav.source_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => handleRemoveFav(fav.id)} className="p-1.5 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </>
      )}

      {!loading && tab === 'history' && (
        <>
          {history.length === 0 ? (
            <EmptyState title={t.noHistoryTitle} message={t.noHistoryMessage} icon={History} />
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="bg-white rounded-xl border border-navy-100 p-3 flex items-center gap-3">
                  <Search className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy-800 truncate">{h.query}</p>
                    <p className="text-xs text-navy-400">
                      {h.result_count} {t.results} · {new Date(h.created_at).toLocaleDateString()}
                      {h.sources.length > 0 && ` · ${h.sources.join(', ')}`}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteHistory(h.id)} className="p-1.5 text-navy-300 hover:text-red-500 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && tab === 'projects' && <Projects signedIn={!!user} favorites={favorites} />}

      {!loading && tab === 'automations' && <Automations signedIn={!!user} />}
    </div>
  );
}

function Projects({ signedIn, favorites }: { signedIn: boolean; favorites: FavoriteEntry[] }) {
  const { language } = useApp();
  const t = getTranslation(language).library;
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<ProjectItemEntry[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (signedIn) load();
    else setLoading(false);
  }, [signedIn, load]);

  const openProject = useCallback(async (id: string) => {
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id);
    setItemsLoading(true);
    const rows = await fetchProjectItems(id);
    setItems(rows);
    setItemsLoading(false);
  }, [openId]);

  const handleCreate = async () => {
    setFormError('');
    if (!name.trim()) {
      setFormError(t.errNameQuery);
      return;
    }
    const created = await createProject(name.trim(), description.trim());
    if (!created) {
      setFormError(t.errSaveFailed);
      return;
    }
    setProjects((prev) => [created, ...prev]);
    setName('');
    setDescription('');
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProject(id);
    if (ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (openId === id) setOpenId(null);
    }
  };

  const handleAddItem = async (favoriteId: string) => {
    if (!openId) return;
    if (items.some((it) => it.favorite_id === favoriteId)) return;
    const created = await addProjectItem(openId, favoriteId);
    if (created) setItems((prev) => [...prev, created]);
  };

  const handleRemoveItem = async (id: string) => {
    const ok = await removeProjectItem(id);
    if (ok) setItems((prev) => prev.filter((it) => it.id !== id));
  };

  if (!signedIn) {
    return (
      <EmptyState
        title={t.signInAutomations}
        message={t.signInAutomationsMessage}
        icon={FolderOpen}
      />
    )
  }

  const available = favorites.filter(
    (f) => !items.some((it) => it.favorite_id === f.id)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-navy-900">{t.projects} ({projects.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? t.cancel : t.newAutomation}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-navy-100 p-4 mb-4 space-y-3">
          <div>
            <label htmlFor="proj-name" className="text-xs font-medium text-navy-700 block mb-1">{t.name}</label>
            <input
              id="proj-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.projNamePlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label htmlFor="proj-desc" className="text-xs font-medium text-navy-700 block mb-1">{t.description}</label>
            <input
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.projDescPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
            />
          </div>
          {formError && <p className="text-xs text-red-600" role="alert">{formError}</p>}
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            {t.save}
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-navy-500">{t.loading}</p>}

      {!loading && projects.length === 0 && (
        <EmptyState title={t.projEmptyTitle} message={t.projEmptyMessage} icon={FolderOpen} />
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-navy-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => void openProject(project.id)} className="min-w-0 text-start flex-1">
                  <h3 className="text-sm font-bold text-navy-900">{project.name}</h3>
                  {project.description && <p className="text-xs text-navy-500 mt-0.5 line-clamp-2">{project.description}</p>}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  aria-label={`${t.delete}: ${project.name}`}
                  className="p-2 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {openId === project.id && (
                <div className="mt-3 border-t border-navy-100 pt-3 space-y-3">
                  {itemsLoading ? (
                    <p className="text-xs text-navy-400">{t.loading}</p>
                  ) : (
                    <>
                      {items.length > 0 && (
                        <div className="space-y-1.5">
                          {items.map((it) => {
                            const fav = favorites.find((f) => f.id === it.favorite_id);
                            return (
                              <div key={it.id} className="flex items-start gap-2 bg-navy-50 rounded-lg p-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-navy-800 truncate">{fav?.title ?? it.favorite_id}</p>
                                  {it.note && <p className="text-xs text-navy-500 mt-0.5">{it.note}</p>}
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(it.id)}
                                  aria-label={t.remove}
                                  className="p-1 text-navy-300 hover:text-red-500 rounded flex-shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {available.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {available.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => void handleAddItem(f.id)}
                              className="px-2.5 py-1.5 text-xs rounded-full bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors max-w-full truncate"
                            >
                              <Plus className="w-3 h-3 inline me-1" />
                              {f.title.slice(0, 60)}
                              {f.title.length > 60 ? '…' : ''}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-navy-400">{t.projNoAvailable}</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
</div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Bookmark; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
        active ? 'bg-navy-50 text-navy-900' : 'text-navy-500 hover:text-navy-700'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function Automations({ signedIn }: { signedIn: boolean }) {
  const { language } = useApp();
  const t = getTranslation(language).library;
  const [items, setItems] = useState<SavedSearchAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuery, setEditQuery] = useState('');
  const [lastResults, setLastResults] = useState<Record<string, ResearchRecord[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchAutomations();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (signedIn) load();
    else setLoading(false);
  }, [signedIn, load]);

  const handleCreate = async () => {
    setFormError('');
    if (!name.trim() || !query.trim()) {
      setFormError(t.errNameQuery);
      return;
    }
    const created = await createAutomation(name.trim(), query.trim());
    if (!created) {
      setFormError(t.errSaveFailed);
      return;
    }
    setItems((prev) => [created, ...prev]);
    setName('');
    setQuery('');
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteAutomation(id);
    if (ok) setItems((prev) => prev.filter((a) => a.id !== id));
  };

  const handleTogglePause = async (item: SavedSearchAutomation) => {
    const paused = !item.paused;
    const ok = await updateAutomation(item.id, { paused });
    if (ok) setItems((prev) => prev.map((a) => (a.id === item.id ? { ...a, paused } : a)));
  };

  const startEdit = (item: SavedSearchAutomation) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuery(item.query);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!editName.trim() || !editQuery.trim()) return;
    const ok = await updateAutomation(editingId, { name: editName.trim(), query: editQuery.trim() });
    if (ok) {
      setItems((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, name: editName.trim(), query: editQuery.trim() } : a))
      );
      setEditingId(null);
    }
  };

  const handleCheck = async (item: SavedSearchAutomation) => {
    setCheckingId(item.id);
    try {
      const result = await unifiedSearch({
        cancerType: undefined,
        question: item.query,
        maxResults: 10,
        sources: ['pubmed', 'europepmc'],
      });
      const pubs = result.records.filter((r) => r.kind === 'publication');
      // "New" = published strictly after the previous check. The very first
      // check establishes the baseline and reports 0 new.
      const since = item.last_checked_at;
      const newPubs = since
        ? pubs.filter((p) => {
            if (!p.pubDate) return false;
            const pub = new Date(p.pubDate).getTime();
            const sinceT = new Date(since).getTime();
            return Number.isFinite(pub) && Number.isFinite(sinceT) && pub > sinceT;
          })
        : [];
      setLastResults((prev) => ({ ...prev, [item.id]: newPubs.length > 0 ? newPubs : pubs.slice(0, 5) }));
      await recordCheckResult(item.id, 'ok', newPubs.length);
      setItems((prev) =>
        prev.map((a) =>
          a.id === item.id
            ? {
                ...a,
                last_checked_at: new Date().toISOString(),
                last_new_results: newPubs.length,
                last_status: 'ok',
                last_error: null,
              }
            : a
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : t.searchFailed;
      await recordCheckResult(item.id, 'error', 0, message);
      setItems((prev) =>
        prev.map((a) =>
          a.id === item.id
            ? { ...a, last_checked_at: new Date().toISOString(), last_new_results: 0, last_status: 'error', last_error: message }
            : a
        )
      );
    } finally {
      setCheckingId(null);
    }
  };

  if (!signedIn) {
    return (
      <EmptyState
        title={t.signInAutomations}
        message={t.signInAutomationsMessage}
        icon={BellRing}
      />
    );
  }

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          {t.automationsNote}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-navy-900">{t.savedSearches} ({items.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? t.cancel : t.newAutomation}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-navy-100 p-4 mb-4 space-y-3">
          <div>
            <label htmlFor="aut-name" className="text-xs font-medium text-navy-700 block mb-1">{t.name}</label>
            <input
              id="aut-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label htmlFor="aut-query" className="text-xs font-medium text-navy-700 block mb-1">{t.queryLabel}</label>
            <input
              id="aut-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.queryPlaceholder}
              className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
            />
          </div>
          {formError && <p className="text-xs text-red-600" role="alert">{formError}</p>}
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            {t.saveAutomation}
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-navy-500">{t.loading}</p>}

      {!loading && items.length === 0 && (
        <EmptyState
          title={t.noAutomationsTitle}
          message={t.noAutomationsMessage}
          icon={BellRing}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-navy-100 p-4">
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    aria-label={t.automationName}
                    className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
                  />
                  <input
                    value={editQuery}
                    onChange={(e) => setEditQuery(e.target.value)}
                    aria-label={t.automationQuery}
                    className="w-full px-3 py-2 text-sm bg-navy-50 rounded-lg border border-navy-100 text-navy-900 outline-none focus:border-teal-400"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                      {t.save}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100">
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                        {item.name}
                        {item.paused && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-100 text-navy-600 border border-navy-200">
                            {t.paused}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-navy-500 mt-0.5 truncate">{t.queryPrefix} {item.query}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleCheck(item)}
                        disabled={checkingId === item.id || item.paused}
                        aria-label={`${t.checkNow}: ${item.name}`}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg disabled:opacity-40"
                        title={item.paused ? t.pausedHint : t.checkNow}
                      >
                        <RefreshCw className={`w-4 h-4 ${checkingId === item.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleTogglePause(item)}
                        aria-label={item.paused ? `${t.resume} ${item.name}` : `${t.pause} ${item.name}`}
                        className="p-2 text-navy-500 hover:bg-navy-50 rounded-lg"
                      >
                        {item.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(item)}
                        aria-label={`${t.edit} ${item.name}`}
                        className="p-2 text-navy-500 hover:bg-navy-50 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`${t.delete} ${item.name}`}
                        className="p-2 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="text-navy-500">
                      {t.lastCheck}{' '}
                      {item.last_checked_at
                        ? new Date(item.last_checked_at).toLocaleString()
                        : t.never}
                    </span>
                    <span className="text-navy-500">
                      {t.newPapers}{' '}
                      <strong className={item.last_new_results > 0 ? 'text-teal-700' : 'text-navy-700'}>
                        {item.last_new_results}
                      </strong>
                    </span>
                    {item.last_status === 'error' && item.last_error && (
                      <span className="text-red-600" role="alert">{t.error} {item.last_error}</span>
                    )}
                  </div>

                  {lastResults[item.id] && lastResults[item.id].length > 0 && (
                    <div className="mt-3 border-t border-navy-100 pt-3 space-y-1.5">
                      <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
                        {item.last_new_results > 0 ? t.newPublications : t.latestPublications}
                      </p>
                      {lastResults[item.id].map((pub) => (
                        <a
                          key={pub.id}
                          href={pub.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-teal-700 hover:text-teal-800 truncate"
                        >
                          <ExternalLink className="w-3 h-3 inline me-1" />
                          {pub.title}
                          {pub.pubDate && <span className="text-navy-400 ms-1">({pub.pubDate})</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
