import { Loader2, AlertTriangle, FileSearch } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';

export function LoadingState({ message }: { message?: string }) {
  const { language } = useApp();
  const t = getTranslation(language);
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <Loader2 aria-hidden="true" className="w-10 h-10 text-teal-500 animate-spin mb-4" />
      <p className="text-navy-600 font-medium text-sm">{message ?? t.states.loadingDefault}</p>
      <p className="text-navy-400 text-xs mt-1">{t.states.loadingHint}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  const { language } = useApp();
  const t = getTranslation(language);
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle aria-hidden="true" className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="font-semibold text-navy-900 text-base mb-1">{title ?? t.states.errorTitle}</h3>
      <p className="text-navy-500 text-sm text-center max-w-md mb-4">
        {message ?? t.states.errorMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-600 transition-colors"
        >
          {t.states.retry}
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No results yet',
  message,
  icon: Icon = FileSearch,
}: {
  title?: string;
  message?: string;
  icon?: typeof FileSearch;
}) {
  const { language } = useApp();
  const t = getTranslation(language);
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-navy-50 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-navy-300" />
      </div>
      <h3 className="font-semibold text-navy-800 text-base mb-1">{title ?? t.states.emptyTitle}</h3>
      <p className="text-navy-400 text-sm text-center max-w-md">
        {message ?? t.states.emptyMessage}
      </p>
    </div>
  );
}
