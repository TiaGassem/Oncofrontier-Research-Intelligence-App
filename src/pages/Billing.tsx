// Account plan & billing page — subscription status, per-feature monthly
// usage meters, the pending-upgrade workflow, and billing history with the
// honest "no provider connected" state.
import { useState } from 'react';
import { CreditCard, Gauge, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useBilling } from '@/context/BillingContext';
import { getPlanCatalog, USAGE_FEATURES, type UsageFeature } from '@/lib/billing';
import { billingT } from '@/lib/billingTranslations';

const FEATURE_LABELS: Record<UsageFeature, string> = {
  aiSummaries: 'AI summaries',
  articleComparisons: 'Article comparisons',
  pdfSummaries: 'PDF summaries',
  assistantQueries: 'Assistant queries',
  automations: 'Automations',
};

const FEATURE_LABELS_FR: Record<UsageFeature, string> = {
  aiSummaries: 'Résumés IA',
  articleComparisons: 'Comparaisons d’articles',
  pdfSummaries: 'Résumés de PDF',
  assistantQueries: 'Requêtes à l’assistant',
  automations: 'Automatisations',
};

const FEATURE_LABELS_AR: Record<UsageFeature, string> = {
  aiSummaries: 'ملخصات الذكاء الاصطناعي',
  articleComparisons: 'مقارنات المقالات',
  pdfSummaries: 'ملخصات PDF',
  assistantQueries: 'استعلامات المساعد',
  automations: 'الأتمتة',
};

function featureLabel(f: UsageFeature, language: string): string {
  if (language.startsWith('fr')) return FEATURE_LABELS_FR[f];
  if (language.startsWith('ar')) return FEATURE_LABELS_AR[f];
  return FEATURE_LABELS[f];
}

export function Billing() {
  const { language, setCurrentView } = useApp();
  const { user } = useAuth();
  const t = billingT(language);
  const {
    planId,
    requests,
    usage,
    createUpgradeRequest,
    withdrawRequest,
    resetCounters,
  } = useBilling();
  const catalog = getPlanCatalog();
  const def = catalog[planId];
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const pending = requests.find((r) => r.status === 'pending_processing');

  const requestUpgrade = () => {
    createUpgradeRequest({
      planId: 'pro',
      period,
      contactEmail: user?.email ?? 'account-holder',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      <header className="space-y-3">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-navy-900">
          <CreditCard className="w-6 h-6 text-teal-600" aria-hidden /> {t.billingNav}
        </h1>
        <p className="flex items-center gap-2 text-navy-700">
          <ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden /> {t.upgradesAlwaysAvailable}
        </p>
      </header>

      <section aria-labelledby="status-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="status-h" className="text-xl font-bold text-navy-900">
          {t.currentPlan}
        </h2>
        {pending && (
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {t.pendingProcessing} · Pro ({pending.period === 'annual' ? t.annual : t.monthly}) ·{' '}
            <button onClick={() => withdrawRequest(pending.id)} className="underline font-medium">
              {t.withdraw}
            </button>
          </p>
        )}
        <p className="text-sm text-navy-600">{t.requestPendingNotice}</p>
        <div className="flex flex-wrap items-center gap-2">
          {(['monthly', 'annual'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                period === p ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-navy-700 border-navy-200'
              }`}
            >
              {p === 'monthly' ? t.monthly : t.annual}
            </button>
          ))}
          <button
            onClick={requestUpgrade}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {t.upgradeRequest} · €{(period === 'annual' ? catalog.pro.priceAnnual : catalog.pro.priceMonthly)?.toFixed(2)}
          </button>
          <button
            onClick={() => setCurrentView('pricing')}
            className="rounded-lg border border-navy-300 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
          >
            {t.limitReachedCta}
          </button>
        </div>
        <p className="text-sm text-navy-500">{t.syncNote}</p>
      </section>

      <section aria-labelledby="usage-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="usage-h" className="flex items-center gap-2 text-xl font-bold text-navy-900">
          <Gauge className="w-5 h-5 text-teal-600" aria-hidden /> {t.usage} · {usage.month}
        </h2>
        <ul className="space-y-3">
          {USAGE_FEATURES.map((f) => {
            const used = usage.counts[f] ?? 0;
            const limit = def.limits[f];
            const pct = limit === null ? 0 : Math.min(100, Math.round((used / limit) * 100));
            const reached = limit !== null && used >= limit;
            return (
              <li key={f} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-navy-800">{featureLabel(f, language)}</span>
                  <span className="text-navy-500">
                    {used} {limit === null ? `· ${t.unlimited}` : `${t.usageOf} ${limit} ${t.usedThisMonth}`}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={used}
                  aria-valuemin={0}
                  aria-valuemax={limit ?? used ?? 1}
                  aria-label={featureLabel(f, language)}
                  className="h-2 rounded-full bg-navy-100 overflow-hidden"
                >
                  <div
                    className={`h-full rounded-full ${reached ? 'bg-red-500' : 'bg-teal-500'}`}
                    style={{ width: `${limit === null ? (used > 0 ? 100 : 0) : pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-navy-600">{t.limitReachedNotice}</p>
        <button
          onClick={resetCounters}
          className="rounded-lg border border-navy-300 px-3 py-2 text-xs text-navy-700 hover:bg-navy-50"
        >
          {t.resetCounters}
        </button>
      </section>

      <section aria-labelledby="history-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="history-h" className="text-xl font-bold text-navy-900">{t.billingHistory}</h2>
        <p className="text-sm text-navy-600">{t.noInvoices}</p>
        {requests.length > 0 && (
          <ul className="divide-y divide-navy-100">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm text-navy-700">
                <span className="font-medium">
                  {r.planId === 'pro' ? t.proName : t.institutionalName} · {r.period === 'annual' ? t.annual : r.period === 'monthly' ? t.monthly : t.customPricing}
                </span>
                <span className="text-xs">
                  {new Date(r.requestedAt).toLocaleString()} ·{' '}
                  {r.status === 'pending_processing' ? t.pendingProcessing : t.withdrawn}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
