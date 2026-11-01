import { lazy, Suspense, useEffect, useRef } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { A11yProvider } from '@/context/A11yContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { BillingProvider } from '@/context/BillingContext';
import { BreakReminder } from '@/components/BreakReminder';
import { Sidebar } from '@/components/Sidebar';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { CompanionChatProvider } from '@/components/CompanionChatCore';
import { Dashboard } from '@/pages/Dashboard';
import { Library } from '@/pages/Library';
import { LoginPage } from '@/pages/LoginPage';
import { Landing } from '@/pages/Landing';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { LegalPage } from '@/pages/Legal';

// Heavy, less-frequently-used views are lazy-loaded so the initial bundle
// stays small. Dashboard renders immediately.
const CureMap = lazy(() => import('@/pages/CureMap').then((m) => ({ default: m.CureMap })));
const ResistanceAtlas = lazy(() => import('@/pages/ResistanceAtlas').then((m) => ({ default: m.ResistanceAtlas })));
const EquityRadar = lazy(() => import('@/pages/EquityRadar').then((m) => ({ default: m.EquityRadar })));
const GlobalBurdenAtlas = lazy(() => import('@/pages/GlobalBurdenAtlas').then((m) => ({ default: m.GlobalBurdenAtlas })));
const BiomarkerAtlas = lazy(() => import('@/pages/BiomarkerAtlas').then((m) => ({ default: m.BiomarkerAtlas })));
const CancerAnatomy = lazy(() => import('@/pages/CancerAnatomy').then((m) => ({ default: m.CancerAnatomy })));
const Companion = lazy(() => import('@/pages/Companion').then((m) => ({ default: m.Companion })));
const ActionPlanner = lazy(() => import('@/pages/ActionPlanner').then((m) => ({ default: m.ActionPlanner })));
const ResearchAssistant = lazy(() => import('@/pages/ResearchAssistant').then((m) => ({ default: m.ResearchAssistant })));
const Methodology = lazy(() => import('@/pages/Methodology').then((m) => ({ default: m.Methodology })));
const DiscoveryBridge = lazy(() => import('@/pages/DiscoveryBridge').then((m) => ({ default: m.DiscoveryBridge })));
const Pricing = lazy(() => import('@/pages/Pricing').then((m) => ({ default: m.Pricing })));
const Billing = lazy(() => import('@/pages/Billing').then((m) => ({ default: m.Billing })));
const AdminPlans = lazy(() => import('@/pages/AdminPlans').then((m) => ({ default: m.AdminPlans })));
const PdfReader = lazy(() => import('@/pages/PdfReader').then((m) => ({ default: m.PdfReader })));
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { Loader2 } from 'lucide-react';
import { useA11ySpeech } from '@/lib/a11yPrefs';
import { getTranslation } from '@/lib/i18n';
import type { ViewName } from '@/types';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentView, setCurrentView, direction, userLanguage, language } = useApp();
  const { voiceGuide } = useA11ySpeech();
  const previousView = useRef(currentView);
  const mainRef = useRef<HTMLElement>(null);

  // Screen-reader and keyboard users need to land on the new page, not stay on
  // the sidebar link they just pressed. Move focus to <main> after a view
  // change and keep the document title in step with it.
  useEffect(() => {
    const extraTitles: Partial<Record<ViewName, Record<string, string>>> = {
      pricing: { en: 'Pricing', fr: 'Tarifs', ar: 'الأسعار' },
      billing: { en: 'Plan & billing', fr: 'Abonnement & facturation', ar: 'الخطة والفوترة' },
      admin: { en: 'Plan administration', fr: 'Administration des offres', ar: 'إدارة الخطط' },
    };
    const lang = language.startsWith('ar') ? 'ar' : language.startsWith('fr') ? 'fr' : 'en';
    const page =
      (getTranslation(language).nav as Record<string, string>)[currentView] ??
      extraTitles[currentView]?.[lang] ??
      currentView;
    document.title = `${page} · OncoFrontiers`;
    if (previousView.current === currentView) return;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentView, language]);

  useEffect(() => {
    const changedView = previousView.current !== currentView;
    previousView.current = currentView;
    if (
      !changedView || !voiceGuide || typeof window === 'undefined' ||
      !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined'
    ) return;

    const t = getTranslation(language);
    // Public and onboarding views have no nav entry; fall back to their key.
    const page = (t.nav as Record<string, string>)[currentView] ?? currentView;
    const message = t.displayOptions.voiceGuideAnnouncement.replace('{page}', page);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [currentView, language, voiceGuide]);

  if (typeof document !== 'undefined') {
    document.documentElement.dir = direction;
    document.documentElement.lang = userLanguage;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  // Public site and onboarding render outside the workspace shell: no sidebar,
  // no floating companion, nothing that assumes the visitor is a researcher.
  if (currentView === 'home') return <Landing />;
  if (currentView === 'welcome') return <OnboardingWizard />;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'discovery':
        return <DiscoveryBridge />;
      case 'curemap':
        return <CureMap />;
      case 'resistance':
        return <ResistanceAtlas />;
      case 'equity':
        return <EquityRadar />;
      case 'burden':
        return <GlobalBurdenAtlas />;
      case 'biomarkers':
        return <BiomarkerAtlas />;
      case 'anatomy':
        return <CancerAnatomy />;
      case 'companion':
        return <Companion />;
      case 'planner':
        return <ActionPlanner />;
      case 'assistant':
        return <ResearchAssistant />;
      case 'methodology':
        return <Methodology />;
      case 'privacy':
        return <LegalPage kind="privacy" />;
      case 'terms':
        return <LegalPage kind="terms" />;
      case 'contact':
        return <LegalPage kind="contact" />;
      case 'pdf':
        return <PdfReader />;
      case 'library':
        return <Library />;
      case 'account':
        return user ? <Library /> : <LoginPage />;
      case 'pricing':
        return <Pricing />;
      case 'billing':
        return <Billing />;
      case 'admin':
        return <AdminPlans />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-50/30" dir={direction}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[10001] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-navy-900 focus:shadow-lg"
      >
        {getTranslation(language).common.skipToContent}
      </a>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main ref={mainRef} id="main-content" tabIndex={-1} className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pt-20 md:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" aria-hidden="true" />
            </div>
          }>
            {renderView()}
          </Suspense>
        </div>
      </main>
      <FloatingCompanion hidden={currentView === 'companion'} />
      <BreakReminder />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <PreferencesProvider>
            <A11yProvider>
              <CompanionChatProvider>
                <BillingProvider>
                  <AppContent />
                </BillingProvider>
              </CompanionChatProvider>
            </A11yProvider>
          </PreferencesProvider>
        </AppProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}
