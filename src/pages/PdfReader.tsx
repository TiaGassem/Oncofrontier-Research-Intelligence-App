import { useState, useCallback, useRef } from 'react';
import { FileText, Loader2, Search, AlertTriangle, FileUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/States';
import { extractPdfText, findRelevantPassages } from '@/lib/pdf';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

interface PDFResult {
  fullText: string;
  pageCount: number;
  warnings: string[];
  fileName: string;
}

export function PdfReader() {
  const { language } = useApp();
  const t = getTranslation(language).pdf;
  const [pdf, setPdf] = useState<PDFResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [passages, setPassages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(t.errNotPdf);
      return;
    }
    setLoading(true);
    setError(null);
    setPdf(null);
    setPassages([]);
    try {
      const result = await extractPdfText(file);
      setPdf({
        fullText: result.fullText,
        pageCount: result.pageCount,
        warnings: result.warnings,
        fileName: file.name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errExtract);
    }
    setLoading(false);
  }, [t.errExtract, t.errNotPdf]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSearch = () => {
    if (!pdf || !query.trim()) return;
    const results = findRelevantPassages(pdf.fullText, query);
    setPassages(results);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={<FileText className="w-6 h-6" />}
        title={t.title}
        subtitle={t.subtitle}
        accent="navy"
      />

      <div className="bg-navy-50/30 border border-navy-100 rounded-xl p-3 mb-6">
        <p className="text-xs text-navy-500">
          {t.privacyNote}
        </p>
      </div>

      {/* Upload area */}
      {!pdf && !loading && (
        <label
          htmlFor="pdf-reader-upload"
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-teal-400 bg-teal-50/30' : 'border-navy-200 hover:border-teal-300'
          }`}
        >
          <FileUp className="w-12 h-12 text-navy-300 mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm font-medium text-navy-700">{t.dropTitle}</p>
          <p id="pdf-upload-hint" className="text-xs text-navy-400 mt-1">{t.dropHint}</p>
          <input
            ref={inputRef}
            id="pdf-reader-upload"
            type="file"
            accept=".pdf,application/pdf"
            aria-label={t.dropTitle}
            aria-describedby="pdf-upload-hint"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.currentTarget.value = '';
            }}
          />
        </label>
      )}

      {loading && (
        <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" aria-hidden="true" />
          <p className="text-sm text-navy-600">{t.extracting}</p>
        </div>
      )}

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {pdf && (
        <div className="space-y-4 animate-fade-in">
          {/* PDF info */}
          <div className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-900 truncate">{pdf.fileName}</p>
              <p className="text-xs text-navy-400">{pdf.pageCount} {t.pages.toLowerCase()}</p>
            </div>
            <button
              onClick={() => { setPdf(null); setPassages([]); setQuery(''); }}
              className="text-xs text-navy-500 hover:text-navy-700 font-medium"
            >
              {t.uploadAnother}
            </button>
          </div>

          {/* Warnings */}
          {pdf.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 space-y-0.5">
                  {pdf.warnings.map((w, i) => <p key={i}>• {w}</p>)}
                </div>
              </div>
            </div>
          )}

          {/* Q&A */}
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <h3 className="text-sm font-semibold text-navy-900 mb-3">{t.askAbout}</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t.askPlaceholder}
                aria-label={t.askPlaceholder}
                className="flex-1 px-3 py-2 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
              />
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 disabled:opacity-40 flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> {t.find}
              </button>
            </div>

            {passages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-navy-500 mb-2">{t.passages}</p>
                {passages.map((p, i) => (
                  <div key={i} className="bg-navy-50/50 rounded-lg p-3 text-sm text-navy-700 leading-relaxed border-l-2 border-teal-300">
                    {p}
                  </div>
                ))}
              </div>
            )}

            {query && passages.length === 0 && (
              <p className="text-sm text-navy-400">{t.noPassages}</p>
            )}
          </div>

          {/* Full text preview */}
          <details className="bg-white rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer text-sm font-medium text-navy-700">
              {t.showFullText} ({pdf.fullText.length.toLocaleString()})
            </summary>
            <div className="mt-3 max-h-96 overflow-y-auto text-xs text-navy-600 whitespace-pre-wrap font-mono bg-navy-50/30 p-3 rounded-lg">
              {pdf.fullText.slice(0, 10000)}
              {pdf.fullText.length > 10000 && `\n\n${t.truncated}`}
            </div>
          </details>
        </div>
      )}

      {!pdf && !loading && !error && (
        <div className="mt-6">
          <EmptyState
            title={t.noPdfTitle}
            message={t.noPdfMessage}
            icon={FileText}
          />
        </div>
      )}
    </div>
  );
}
