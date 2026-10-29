// Optional screen-break reminders. Shows a non-blocking banner every
// breakIntervalMin minutes while enabled; dismissible, never audio-only,
// and fully keyboard operable. No medical claims — a comfort feature only.
import { useEffect, useState } from 'react';
import { Timer, X } from 'lucide-react';
import { useA11yPrefsContext } from '@/context/A11yContext';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

export function BreakReminder() {
  const { prefs } = useA11yPrefsContext();
  const { language } = useApp();
  const t = getTranslation(language).displayOptions;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!prefs.breakReminders) {
      setShow(false);
      return;
    }
    const interval = Math.max(5, prefs.breakIntervalMin) * 60_000;
    const id = window.setInterval(() => setShow(true), interval);
    return () => window.clearInterval(id);
  }, [prefs.breakReminders, prefs.breakIntervalMin]);

  if (!prefs.breakReminders || !show) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 end-4 z-[10000] bg-white border border-teal-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs"
    >
      <Timer className="w-5 h-5 text-teal-600 flex-shrink-0" aria-hidden="true" />
      <p className="text-xs text-navy-700 leading-relaxed flex-1">{t.breakMessage}</p>
      <button
        onClick={() => setShow(false)}
        aria-label={t.breakDismiss}
        className="p-1.5 rounded-lg hover:bg-navy-50 flex-shrink-0"
      >
        <X className="w-4 h-4 text-navy-400" aria-hidden="true" />
      </button>
    </div>
  );
}
