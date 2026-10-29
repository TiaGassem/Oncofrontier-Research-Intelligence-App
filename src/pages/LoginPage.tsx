import { useState } from 'react';
import { Mail, Lock, Loader2, LogIn, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/i18n';
import { LanguagePicker } from '@/components/AccessibilityMenu';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const { setCurrentView, language } = useApp();
  const t = getTranslation(language).auth;
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const fn = mode === 'signin' ? signIn : signUp;
    const result = await fn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-4">
      <div className="absolute top-4 end-4 w-44 z-10">
        <LanguagePicker />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <BrandMark className="w-7 h-7 text-teal-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">ONCOFRONTIER</h1>
          <p className="text-sm text-navy-300 mt-1">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex gap-2 mb-6 bg-navy-50 rounded-lg p-1">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signin' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'
              }`}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'
              }`}
            >
              {t.createAccount}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">{t.email}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full ps-9 pe-3 py-2.5 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-500 mb-1 block">{t.password}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-navy-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordHint}
                  className="w-full ps-9 pe-3 py-2.5 text-sm bg-navy-50/50 rounded-lg border border-navy-100 text-navy-900 placeholder-navy-300 outline-none focus:border-teal-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {loading ? t.pleaseWait : mode === 'signin' ? t.signIn : t.createAccount}
            </button>
          </form>

          <p className="text-xs text-navy-400 text-center mt-4">
            {t.privacyNote}
          </p>

          <div className="mt-4 pt-4 border-t border-navy-100 text-center">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1.5"
            >
              {t.guest} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-navy-400 mt-1.5">
              {t.guestNote}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-navy-400 mt-6">
          {t.prototypeNote}
        </p>
      </div>
    </div>
  );
}
