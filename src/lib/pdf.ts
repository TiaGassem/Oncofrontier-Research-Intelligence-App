// Client-side PDF text extraction using pdfjs-dist
// No external AI service — text is extracted locally in the browser

interface PDFPage {
  pageNumber: number;
  text: string;
}

interface PDFExtractionResult {
  pages: PDFPage[];
  fullText: string;
  pageCount: number;
  warnings: string[];
}

export async function extractPdfText(file: File): Promise<PDFExtractionResult> {
  const warnings: string[] = [];
  const arrayBuffer = await file.arrayBuffer();

  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages: PDFPage[] = [];
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str || '' : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!pageText) {
      warnings.push(`Page ${i} appears to be scanned or contains no extractable text.`);
    }

    pages.push({ pageNumber: i, text: pageText });
    textParts.push(pageText);
  }

  return {
    pages,
    fullText: textParts.join('\n\n--- Page Break ---\n\n'),
    pageCount: pdf.numPages,
    warnings,
  };
}

export function findRelevantPassages(fullText: string, query: string, maxPassages = 5): string[] {
  if (!query.trim() || !fullText) return [];
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);

  const sentences = fullText.split(/(?<=[.!?])\s+/);
  const scored = sentences.map((s, i) => {
    const lower = s.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      if (lower.includes(term)) score += 1;
    }
    return { sentence: s, score, index: i };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPassages)
    .map((s) => s.sentence.trim())
    .filter((s) => s.length > 20);
}
