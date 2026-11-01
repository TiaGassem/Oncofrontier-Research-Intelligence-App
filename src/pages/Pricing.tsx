// Public pricing page — Free, Pro and Institutional with a full feature
// comparison, the pending-payment disclaimer, institutional enquiry form and
// terms/privacy/cancellation information.
import { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Building2, CheckCircle2, ArrowLeft, Link2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useBilling } from '@/context/BillingContext';
import { PLAN_ORDER, getPlanCatalog, formatPrice, type PlanId } from '@/lib/billing';
import { billingT } from '@/lib/billingTranslations';

function Notice({ tone, children }: { tone: 'info' | 'warn'; children: React.ReactNode }) {
  return (
    <p
      role="note"
      className={`rounded-lg px-4 py-3 text-sm ${
        tone === 'warn'
          ? 'border border-amber-200 bg-amber-50 text-amber-900'
          : 'border border-navy-200 bg-white text-navy-700'
      }`}
    >
      {children}
    </p>
  );
}

export function Pricing() {
  const { language, setCurrentView } = useApp();
  const { user } = useAuth();
  const { planId, requests, createUpgradeRequest, withdrawRequest, saveInstitutionalEnquiry, refresh } = useBilling();
  const t = billingT(language);
  const catalog = getPlanCatalog();
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [upgradeDone, setUpgradeDone] = useState<string | null>(null);
  const [formDone, setFormDone] = useState<string | null>(null);
  const [form, setForm] = useState({ organisation: '', contactName: '', email: '', role: '', users: '', message: '' });
  const [formError, setFormError] = useState('');

  const pendingProRequest = requests.some((r) => r.planId === 'pro' && r.status === 'pending_processing');

  const handleUpgrade = () => {
    setFormError('');
    if (!user) {
      // Requests are quota-only; ask for an email so the operator can reply.
      const email = window.prompt(t.email) ?? '';
      if (!email.includes('@')) return;
      createUpgradeRequest({ planId: 'pro', period, contactEmail: email });
      refresh();
      setUpgradeDone(email);
      return;
    }
    const email = user.email ?? 'account-holder';
    createUpgradeRequest({ planId: 'pro', period, contactEmail: email });
    refresh();
    setUpgradeDone(email);
  };

  const handleEnquiry = () => {
    setFormError('');
    if (!form.organisation.trim() || !form.email.includes('@') || !form.contactName.trim()) {
      setFormError(language.startsWith('fr')
        ? 'Complétez organisation, contact et e-mail valide.'
        : language.startsWith('ar')
          ? 'يرجى إكمال المؤسسة وجهة الاتصال وبريد إلكتروني صحيح.'
          : 'Fill in organisation, contact name and a valid email.');
      return;
    }
    const enquiry = saveInstitutionalEnquiry(form);
    refresh();
    setFormDone(enquiry.id);
  };

  const go = (view: 'terms' | 'privacy' | 'billing') => setCurrentView(view);

  const planPrice = (id: PlanId): string => {
    const def = catalog[id];
    if (id === 'institutional') return t.customPricing;
    return def.priceMonthly === 0 ? (language.startsWith('ar') ? 'مجانًا' : language.startsWith('fr') ? 'Gratuit' : 'Free') : formatPrice(period === 'annual' ? def.priceAnnual : def.priceMonthly, language);
  };

  return (
    <div className="space-y-8 pb-16">
      <button
        onClick={() => setCurrentView('home')}
        className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-navy-800"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden /> {language.startsWith('ar') ? 'الرجوع' : language.startsWith('fr') ? 'Retour' : 'Back'}
      </button>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-navy-900">{t.plansTitle}</h1>
        <p className="text-navy-600 max-w-3xl">{t.plansSubtitle}</p>
        <p className="text-sm font-medium text-navy-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden /> {t.upgradesAlwaysAvailable}
        </p>
        <Notice tone="info">{t.priceNote}</Notice>
        <p className="text-sm text-navy-700">{t.currentPlan}</p>
      </header>

      {/* Billing period */}
      <div className="flex gap-2" role="group" aria-label={t.plansTitle}>
        {(['monthly', 'annual'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={`rounded-full px-4 py-2 text-sm font-medium border ${
              period === p ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-navy-700 border-navy-200 hover:border-teal-400'
            }`}
          >
            {p === 'monthly' ? t.monthly : t.annual}
          </button>
        ))}
      </div>
      {period === 'annual' && (
        <Notice tone="info">{t.annualSave} · €{catalog.pro.priceAnnual?.toFixed(2)} / {t.annual.toLowerCase()}</Notice>
      )}

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const def = catalog[id];
          const isCurrent = planId === id;
          return (
            <section
              key={id}
              aria-label={t[`${id}Name` as keyof typeof t] as string}
              className={`rounded-2xl border bg-white p-6 flex flex-col gap-4 ${
                id === 'pro' ? 'border-teal-500 shadow-md' : 'border-navy-200'
              }`}
            >
              <div>
                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  {id === 'pro' && <Sparkles className="w-5 h-5 text-teal-600" aria-hidden />}
                  {id === 'institutional' && <Building2 className="w-5 h-5 text-navy-500" aria-hidden />}
                  {t[`${id}Name` as keyof typeof t] as string}
                </h2>
                <p className="text-sm text-navy-500 mt-1">{t[`${id}Audience` as keyof typeof t] as string}</p>
              </div>
              <p className="text-2xl font-extrabold text-navy-900">
                {planPrice(id)}
                {id === 'pro' && (
                  <span className="text-sm font-medium text-navy-500">
                    {' '}· {period === 'annual' ? t.annual : t.perMonth}
                  </span>
                )}
              </p>
              {id === 'pro' ? (
                isCurrent ? (
                  <span className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2 text-sm text-teal-800 text-center">
                    {language.startsWith('ar') ? 'خطتك الحالية' : language.startsWith('fr') ? 'Votre offre' : 'Your plan'}
                  </span>
                ) : pendingProRequest ? (
                  <button
                    onClick={() => {
                      const req = requests.find((r) => r.planId === 'pro' && r.status === 'pending_processing');
                      if (req) withdrawRequest(req.id);
                    }}
                    className="rounded-lg border border-navy-300 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50"
                  >
                    {t.withdraw}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    {t.upgradeRequest}
                  </button>
                )
              ) : id === 'institutional' ? (
                <a
                  href="#enquiry"
                  className="rounded-lg border border-navy-300 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 text-center"
                >
                  {t.enquiryTitle}
                </a>
              ) : (
                <span className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800 text-center">
                  {t.choosePlan}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">{t.features}</p>
                <ul className="space-y-2">
                  {def.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-navy-700">
                      <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      {pendingProRequest && (
        <Notice tone="warn">
          {t.requestPendingNotice}
          <button
            onClick={() => {
              const req = requests.find((r) => r.status === 'pending_processing');
              if (req) withdrawRequest(req.id);
            }}
            className="ms-2 underline font-medium"
          >
            {t.withdraw}
          </button>
        </Notice>
      )}
      {upgradeDone && !pendingProRequest && <Notice tone="info">{t.requestSent}</Notice>}
      {upgradeDone && pendingProRequest && <Notice tone="warn">{t.requestPendingNotice}</Notice>}

      {/* Institutional enquiry form */}
      <section id="enquiry" aria-labelledby="enquiry-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="enquiry-h" className="text-xl font-bold text-navy-900">{t.enquiryTitle}</h2>
        <p className="text-sm text-navy-600">{t.enquiryIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ['organisation', t.organisation, 'text'],
              ['contactName', t.contactName, 'text'],
              ['email', t.email, 'email'],
              ['role', t.role, 'text'],
              ['users', t.users, 'text'],
            ] as const
          ).map(([field, label, type]) => (
            <label key={field} className="block text-sm font-medium text-navy-700">
              {label}
              <input
                type={type}
                name={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-300 px-3 py-2 text-navy-900"
              />
            </label>
          ))}
        </div>
        <label className="block text-sm font-medium text-navy-700">
          {t.message}
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="mt-1 w-full rounded-lg border border-navy-300 px-3 py-2 text-navy-900"
          />
        </label>
        {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
        <button
          onClick={handleEnquiry}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          {t.send}
        </button>
        {formDone && (
          <p role="status" className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-teal-600" aria-hidden /> {t.enquiryDraftNote}
          </p>
        )}
      </section>

      {/* Legal + cancellation info */}
      <section aria-labelledby="legal-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="legal-h" className="text-xl font-bold text-navy-900">{t.cancellationTitle}</h2>
        <p className="text-sm text-navy-600">{t.cancellationBody}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#/terms" onClick={() => go('terms')} className="inline-flex items-center gap-2 text-teal-700 underline">
            <Link2 className="w-4 h-4" aria-hidden /> {t.termsInfo}
          </a>
          <a href="#/privacy" onClick={() => go('privacy')} className="inline-flex items-center gap-2 text-teal-700 underline">
            <Link2 className="w-4 h-4" aria-hidden /> {t.privacyInfo}
          </a>
          <a href="#/billing" onClick={() => go('billing')} className="inline-flex items-center gap-2 text-teal-700 underline">
            <Link2 className="w-4 h-4" aria-hidden /> {t.billingNav}
          </a>
        </div>
      </section>
    </div>
  );
}
