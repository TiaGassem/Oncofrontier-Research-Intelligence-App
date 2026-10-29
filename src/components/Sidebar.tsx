import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard,
  Search,
  ShieldAlert,
  BarChart3,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  FlaskConical,
  Globe2,
  Dna,
  FileText,
  Bookmark,
  LogOut,
  LogIn,
  User,
  Heart,
  ChevronDown,
  House,
  Sparkles,
} from 'lucide-react';
import type { ViewName } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/lib/i18n';
import { getSurfaceStrings } from '@/lib/onboardingTranslations';
import { AccessibilityMenu, LanguagePicker } from '@/components/AccessibilityMenu';
import { BrandMark } from '@/components/BrandMark';

interface NavItem {
  id: ViewName;
  labelKey: keyof ReturnType<typeof getTranslation>['nav'];
  icon: typeof LayoutDashboard;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard, description: '' },
  { id: 'discovery', labelKey: 'discovery', icon: FlaskConical, description: '' },
  { id: 'curemap', labelKey: 'curemap', icon: Search, description: '' },
  { id: 'resistance', labelKey: 'resistance', icon: ShieldAlert, description: '' },
  { id: 'equity', labelKey: 'equity', icon: BarChart3, description: '' },
  { id: 'burden', labelKey: 'burden', icon: Globe2, description: '' },
  { id: 'biomarkers', labelKey: 'biomarkers', icon: Dna, description: '' },
  { id: 'anatomy', labelKey: 'anatomy', icon: User, description: '' },
  { id: 'companion', labelKey: 'companion', icon: Heart, description: '' },
  { id: 'planner', labelKey: 'planner', icon: ClipboardList, description: '' },
  { id: 'assistant', labelKey: 'assistant', icon: MessageSquare, description: '' },
  { id: 'pdf', labelKey: 'pdf', icon: FileText, description: '' },
  { id: 'library', labelKey: 'library', icon: Bookmark, description: '' },
  { id: 'methodology', labelKey: 'methodology', icon: BookOpen, description: '' },
  { id: 'account', labelKey: 'account', icon: User, description: '' },
];

interface SidebarProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { language } = useApp();
  const { user, signOut } = useAuth();
  const { primaryModules, restart } = usePreferences();
  const t = getTranslation(language);
  const s = getSurfaceStrings(language).onboarding;

  // Dashboard stays pinned; the rest of the role's modules follow in role order.
  // Everything not in the role's set remains reachable under "All modules", so a
  // role never hides functionality.
  const primary = NAV_ITEMS.filter(
    (item) => item.id === 'dashboard' || primaryModules.includes(item.id)
  );
  const secondary = NAV_ITEMS.filter(
    (item) => item.id !== 'dashboard' && !primaryModules.includes(item.id)
  );

  const handleNavigate = useCallback(
    (view: ViewName) => {
      onNavigate(view);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Escape closes the mobile drawer and returns focus to the opener button.
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = currentView === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => handleNavigate(item.id)}
          aria-current={active ? 'page' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-start transition-all duration-200 ${
            active ? 'bg-teal-500/15 text-teal-300' : 'text-navy-200 hover:bg-navy-800 hover:text-white'
          }`}
        >
          <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-teal-400' : ''}`} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm leading-tight">{t.nav[item.labelKey]}</div>
            {item.description && (
              <div className={`text-xs leading-tight ${active ? 'text-teal-400/70' : 'text-navy-400'}`}>
                {item.description}
              </div>
            )}
          </div>
        </button>
      </li>
    );
  };

  return (
    <>
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-navy-900 text-white px-4 h-14 flex items-center justify-between shadow-lg">
        <button
          ref={menuBtnRef}
          onClick={() => setMobileOpen(true)}
          className="p-2 -ms-2 rounded-lg hover:bg-navy-800 transition-colors"
          aria-label={t.sidebar.openMenu}
          aria-expanded={mobileOpen}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <BrandMark className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-sm tracking-wide">ONCOFRONTIER</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -me-2 rounded-lg hover:bg-navy-800 transition-colors"
          aria-label={t.sidebar.openMenu}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-navy-950/60 z-30 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 start-0 z-40
          h-screen md:h-screen
          bg-navy-900 text-white
          w-72 flex-shrink-0
          flex flex-col
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full md:translate-x-0 md:rtl:translate-x-0'}
        `}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <BrandMark className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide leading-tight">ONCOFRONTIER</h1>
              <p className="text-xs text-navy-300 leading-tight">{t.dashboard.badge}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-navy-800"
            aria-label={t.sidebar.closeMenu}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4" aria-label={t.nav.modules}>
          <button
            onClick={() => handleNavigate('home')}
            className="w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-xl text-start text-navy-200 hover:bg-navy-800 hover:text-white transition-colors"
          >
            <House className="w-4.5 h-4.5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm">{s.home}</span>
          </button>

          <p className="px-3 mb-2 text-xs font-semibold text-navy-400 uppercase tracking-wider">
            {t.nav.modules}
          </p>
          <ul className="space-y-0.5">{primary.map(renderItem)}</ul>

          {secondary.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-400 hover:text-navy-200 rounded-lg transition-colors"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                {s.allModules}
              </button>
              {showAll && <ul className="space-y-0.5 mt-1">{secondary.map(renderItem)}</ul>}
            </div>
          )}
        </nav>

        <div className="px-4 py-3 border-t border-navy-800 space-y-2 flex-shrink-0">
          <button
            onClick={() => {
              restart();
              handleNavigate('welcome');
            }}
            className="w-full flex items-center gap-1.5 text-[11px] text-navy-400 hover:text-teal-300 transition-colors px-1"
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            {s.changeExperience}
          </button>
          <LanguagePicker />
          <AccessibilityMenu />
          {user ? (
            <div className="flex items-center gap-2 text-xs">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-navy-300 truncate flex-1">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="text-navy-400 hover:text-white flex items-center gap-1"
                title={t.sidebar.signOut}
                aria-label={t.sidebar.signOut}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-1">
              <button
                onClick={() => onNavigate('account')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t.sidebar.signIn}
              </button>
            </div>
          )}
          <details className="group">
            <summary className="text-[10px] text-navy-400 hover:text-navy-200 cursor-pointer list-none flex items-center gap-1 select-none">
              <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" aria-hidden="true" />
              {t.sidebar.disclaimer}
            </summary>
            <p className="text-[10px] text-navy-400 leading-relaxed mt-1 max-h-24 overflow-y-auto">
              {t.dashboard.disclaimer}
            </p>
          </details>
        </div>
      </aside>
    </>
  );
}
