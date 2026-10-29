import { Component, type ErrorInfo, type ReactNode } from 'react';
import { getTranslation } from '@/lib/i18n';

function readLanguage(): 'en' | 'fr' | 'ar' {
  try {
    const saved = localStorage.getItem('oncofrontier-language');
    if (saved === 'fr' || saved === 'ar') return saved;
  } catch {
    // ignore storage failures
  }
  return 'en';
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/** Catches unexpected runtime crashes so a single failure never blanks the app. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, message: '' });
    try {
      localStorage.removeItem('oncofrontier-view');
    } catch {
      // ignore storage failures
    }
    window.location.hash = '';
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const t = getTranslation(readLanguage()).common;
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-navy-100 p-8 text-center">
          <h1 className="text-lg font-bold text-navy-900 mb-2">{t.errorTitle}</h1>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            {t.errorBoundaryMessage}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-xl hover:bg-teal-600 transition-colors"
            >
              {t.reloadApp}
            </button>
            <button
              onClick={this.handleHome}
              className="px-5 py-2.5 bg-navy-50 text-navy-700 text-sm font-medium rounded-xl hover:bg-navy-100 transition-colors"
            >
              {t.backToDashboard}
            </button>
          </div>
          {this.state.message && (
            <p className="mt-6 text-xs text-navy-400 break-words">{this.state.message}</p>
          )}
        </div>
      </div>
    );
  }
}
