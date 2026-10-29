// Attachment handling for the Companion: validation, preview, removal, and
// processing routing. Images go to a real vision model (Puter multimodal
// chat); PDFs get local text extraction. Privacy: files are processed in the
// browser or sent only to the Puter AI API when the user sends a message.
import { useCallback, useState } from 'react';
import { analyzeImage, type ProviderResult } from '@/lib/aiProvider';
import { extractPdfText } from '@/lib/pdf';

export type AttachmentKind = 'image' | 'pdf';

export interface Attachment {
  id: string;
  file: File;
  kind: AttachmentKind;
  previewUrl: string | null; // object URL for image previews
  status: 'ready' | 'processing' | 'error' | 'done';
  error?: string;
  extractedText?: string; // pdf text
}

export const MAX_FILE_MB = 10;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const PDF_TYPE = 'application/pdf';

export function validateFile(file: File): { ok: boolean; error?: string } {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isPdf = file.type === PDF_TYPE;
  if (!isImage && !isPdf) {
    return { ok: false, error: 'Unsupported file type. Please attach a JPEG, PNG, WebP, GIF image, or a PDF document.' };
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return { ok: false, error: `File is too large (max ${MAX_FILE_MB} MB).` };
  }
  return { ok: true };
}

export function useAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const addFiles = useCallback((files: FileList | File[]): { added: number; errors: string[] } => {
    const errors: string[] = [];
    let added = 0;
    for (const file of Array.from(files)) {
      const v = validateFile(file);
      if (!v.ok) {
        errors.push(`${file.name}: ${v.error}`);
        continue;
      }
      const isImage = IMAGE_TYPES.includes(file.type);
      const att: Attachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        kind: isImage ? 'image' : 'pdf',
        previewUrl: isImage ? URL.createObjectURL(file) : null,
        status: 'ready',
      };
      setAttachments((prev) => [...prev, att]);
      added++;
    }
    return { added, errors };
  }, []);

  const remove = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachments((prev) => {
      prev.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl));
      return [];
    });
  }, []);

  const setStatus = useCallback((id: string, status: Attachment['status'], error?: string) => {
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, status, error } : a)));
  }, []);

  return { attachments, addFiles, remove, clear, setStatus };
}

const VISION_PROMPT = [
  'You are the OncoFrontiers Companion. The user attached an image (for example a medical document page, a chart, or a figure).',
  'Describe and explain what is shown in plain language. If it contains medical terms, explain them simply.',
  'State clearly when something is unclear or you are uncertain. NEVER diagnose cancer or any disease from the image,',
  'and never suggest the image confirms or rules out any condition. Reply in the language of the user message.',
].join(' ');

export async function processAttachmentWithPrompt(
  att: Attachment,
  userText: string
): Promise<{ ok: boolean; text: string; method: 'vision-model' | 'pdf-extraction' | 'failed'; error?: string }> {
  if (att.kind === 'image') {
    const prompt = userText.trim()
      ? `${userText}\n\n(An attached image is included for context.)`
      : VISION_PROMPT;
    const res: ProviderResult = await analyzeImage(prompt, att.file);
    if (res.ok && res.reply) {
      return { ok: true, text: res.reply, method: 'vision-model' };
    }
    return {
      ok: false,
      text: '',
      method: 'failed',
      error:
        res.unavailableReason === 'auth'
          ? 'The vision service needs you to sign in to Puter first. Please sign in and try again.'
          : res.unavailableReason === 'network'
            ? 'Could not reach the vision service. Check your connection and try again.'
            : 'Image analysis failed. You can retry, or ask your question as plain text.',
    };
  }

  // PDF: genuine local text extraction (no external service)
  try {
    const result = await extractPdfText(att.file);
    return {
      ok: true,
      text: result.fullText,
      method: 'pdf-extraction',
      error: result.warnings.length > 0 ? result.warnings.join(' ') : undefined,
    };
  } catch {
    return {
      ok: false,
      text: '',
      method: 'failed',
      error: 'Could not read this PDF. It may be corrupted or password-protected.',
    };
  }
}
