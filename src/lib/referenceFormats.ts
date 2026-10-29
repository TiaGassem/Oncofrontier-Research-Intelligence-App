// Reference manager: import/export in CSV, RIS, and BibTeX formats, plus
// metadata lookup by DOI/PMID. All formats handled here in one module so the
// Library page stays focused on UI.

export type ExportFormat = 'csv' | 'ris' | 'bibtex';

export interface BibData {
  title: string;
  authors: string[];
  journal?: string;
  pubDate?: string;
  doi?: string;
  pmid?: string;
  nctId?: string;
  publicationType?: string;
  trialStatus?: string;
  trialPhase?: string;
}

export interface ImportedEntry {
  title: string;
  authors: string[];
  journal?: string;
  year?: string;
  doi?: string;
  pmid?: string;
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function risEscape(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

function bibtexEscape(value: string): string {
  return value.replace(/([{}\\&%$#_~^])/g, '\\$1');
}

function yearOf(pubDate?: string): string {
  if (!pubDate) return '';
  const m = pubDate.match(/\d{4}/);
  return m ? m[0] : '';
}

function citationKey(d: BibData): string {
  const first = d.authors[0] ?? 'unknown';
  const surname = first.split(' ').pop() ?? 'unknown';
  return `${surname.toLowerCase().replace(/[^a-z]/g, '')}${yearOf(d.pubDate)}${(d.title.split(/\s+/)[0] ?? 'title').toLowerCase().replace(/[^a-z]/g, '')}`;
}

export function recordsToCsv(items: BibData[]): string {
  const headers = [
    'Title', 'Authors', 'Journal', 'Publication Year', 'DOI', 'PMID', 'NCT ID',
    'Type', 'Trial Status', 'Trial Phase', 'URL',
  ];
  const rows = items.map((d) =>
    [
      d.title,
      d.authors.join('; '),
      d.journal ?? '',
      yearOf(d.pubDate),
      d.doi ?? '',
      d.pmid ?? '',
      d.nctId ?? '',
      d.publicationType ?? (d.nctId ? 'Trial' : 'Publication'),
      d.trialStatus ?? '',
      d.trialPhase ?? '',
      d.nctId ? `https://clinicaltrials.gov/study/${d.nctId}` : d.doi ? `https://doi.org/${d.doi}` : '',
    ]
      .map(csvEscape)
      .join(',')
  );
  return [headers.map(csvEscape).join(','), ...rows].join('\n');
}

export function recordsToRis(items: BibData[]): string {
  return items
    .map((d) => {
      const lines: string[] = [
        'TY  - JOUR',
        `TI  - ${risEscape(d.title)}`,
        ...d.authors.map((a) => `AU  - ${risEscape(a)}`),
      ];
      if (d.journal) lines.push(`JO  - ${risEscape(d.journal)}`);
      if (yearOf(d.pubDate)) lines.push(`PY  - ${yearOf(d.pubDate)}`);
      if (d.doi) lines.push(`DO  - ${risEscape(d.doi)}`);
      if (d.pmid) lines.push(`AN  - ${risEscape(d.pmid)}`);
      lines.push(`UR  - ${d.nctId ? `https://clinicaltrials.gov/study/${d.nctId}` : d.doi ? `https://doi.org/${d.doi}` : ''}`);
      lines.push('ER  - ');
      return lines.join('\n');
    })
    .join('\n\n');
}

export function recordsToBibtex(items: BibData[]): string {
  return items
    .map((d) => {
      const key = citationKey(d);
      const fields: string[] = [
        `  title = {${bibtexEscape(d.title)}}`,
        d.authors.length > 0 && `  author = {${d.authors.map(bibtexEscape).join(' and ')}}`,
        d.journal && `  journal = {${bibtexEscape(d.journal)}}`,
        yearOf(d.pubDate) && `  year = {${yearOf(d.pubDate)}}`,
        d.doi && `  doi = {${bibtexEscape(d.doi)}}`,
        d.pmid && `  pmid = {${bibtexEscape(d.pmid)}}`,
        d.nctId && `  note = {Clinical trial ${bibtexEscape(d.nctId)}${d.trialStatus ? ` (${bibtexEscape(d.trialStatus)})` : ''}}`,
      ].filter(Boolean) as string[];
      return `@${d.nctId ? 'misc' : 'article'}{${key},\n${fields.join(',\n')}\n}`;
    })
    .join('\n\n');
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRecords(items: BibData[], format: ExportFormat): void {
  const stamp = new Date().toISOString().slice(0, 10);
  if (format === 'csv') {
    downloadFile(`oncofrontier-library-${stamp}.csv`, recordsToCsv(items), 'text/csv;charset=utf-8');
  } else if (format === 'ris') {
    downloadFile(`oncofrontier-library-${stamp}.ris`, recordsToRis(items), 'application/x-research-info-systems');
  } else {
    downloadFile(`oncofrontier-library-${stamp}.bib`, recordsToBibtex(items), 'application/x-bibtex');
  }
}

// --- Import: BibTeX and RIS parsing ---

function parseBibtexEntries(text: string): ImportedEntry[] {
  const entries: ImportedEntry[] = [];
  const re = /@(\w+)\s*\{\s*([^,]*),\s*((?:[^{}]|\{[^{}]*\})*)\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const body = match[3];
    const field = (name: string): string | undefined => {
      const fm = body.match(new RegExp(`^\\s*${name}\\s*=\\s*["{](.*)["}]\\s*,?\\s*$`, 'mi'));
      return fm ? fm[1].replace(/[{}]/g, '').trim() : undefined;
    };
    const title = field('title');
    if (!title) continue;
    entries.push({
      title,
      authors: (field('author') ?? '')
        .split(/\s+and\s+/)
        .map((a) => a.trim())
        .filter(Boolean),
      journal: field('journal'),
      year: field('year'),
      doi: field('doi'),
      pmid: field('pmid'),
    });
  }
  return entries;
}

function parseRisEntries(text: string): ImportedEntry[] {
  const entries: ImportedEntry[] = [];
  const groups: Record<string, string[]>[] = [];
  let current: Record<string, string[]> | null = null;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9]{2})\s+-\s?(.*)$/);
    if (!m) continue;
    const tag = m[1];
    const value = m[2];
    if (tag === 'TY') {
      current = {};
      groups.push(current);
    }
    if (!current) continue;
    (current[tag] ??= []).push(value);
  }
  for (const g of groups) {
    const title = g['TI']?.[0] ?? g['TT']?.[0];
    if (!title) continue;
    entries.push({
      title,
      authors: g['AU'] ?? [],
      journal: g['JO']?.[0] ?? g['JF']?.[0],
      year: g['PY']?.[0],
      doi: g['DO']?.[0],
      pmid: g['AN']?.[0],
    });
  }
  return entries;
}

export function parseImportText(text: string): ImportedEntry[] {
  const trimmed = text.trim();
  if (trimmed.startsWith('@')) return parseBibtexEntries(trimmed);
  if (/(^|\n)TY\s+-\s/.test(trimmed)) return parseRisEntries(trimmed);
  return [];
}

// --- Metadata lookup by DOI / PMID via Crossref / PubMed ---

export async function fetchByDoi(doi: string): Promise<ImportedEntry | null> {
  try {
    const resp = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!resp.ok) return null;
    const json = await resp.json();
    const msg = json?.message ?? {};
    const title: string | undefined = msg.title?.[0];
    if (!title) return null;
    return {
      title,
      authors: (msg.author ?? []).map((a: { given?: string; family?: string }) =>
        [a.given, a.family].filter(Boolean).join(' ')
      ),
      journal: msg['container-title']?.[0],
      year:
        msg.issued?.['date-parts']?.[0]?.[0] != null
          ? String(msg.issued['date-parts'][0][0])
          : undefined,
      doi: msg.DOI,
    };
  } catch {
    return null;
  }
}

interface PubMedSummaryDoc {
  title?: string;
  fulljournalname?: string;
  pubdate?: string;
  authors?: { name?: string }[];
  articleids?: { idtype: string; value: string }[];
}

export async function fetchByPmid(pmid: string): Promise<ImportedEntry | null> {
  try {
    const resp = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`
    );
    if (!resp.ok) return null;
    const json = await resp.json();
    const doc = json?.result?.[pmid] as PubMedSummaryDoc | undefined;
    if (!doc || !doc.title) return null;
    return {
      title: doc.title,
      authors: (doc.authors ?? []).map((a) => a.name ?? '').filter(Boolean),
      journal: doc.fulljournalname,
      year: doc.pubdate?.match(/\d{4}/)?.[0],
      pmid,
      doi: doc.articleids?.find((a) => a.idtype === 'doi')?.value,
    };
  } catch {
    return null;
  }
}
