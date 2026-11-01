// Plan administration dashboard.
//
// HONEST LIMITATION: there is no backend in this deployment, so this page can
// only edit the device-local plan configuration (prices shown on the pricing
// page and per-feature monthly limits). It cannot grant plans, and no payment
// provider is connected. When the backend exists, this UI must read/write
// server-side plan configuration and all entitlement checks must run there.
import { useState } from 'react';
import { Settings2, AlertTriangle, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useBilling, getPlanCatalog } from '@/context/BillingContext';
import { USAGE_FEATURES, loadPlanOverrides, type PlanId, type PlanConfigOverrides, type PlanLimits } from '@/lib/billing';
import { billingT } from '@/lib/billingTranslations';

const PLAN_LIMIT_KEYS: { id: PlanId; label: string }[] = [
  { id: 'free', label: 'Free' },
  { id: 'pro', label: 'Pro' },
  { id: 'institutional', label: 'Institutional' },
];

export function AdminPlans() {
  const { language, setCurrentView } = useApp();
  const t = billingT(language);
  const { applyAdminOverrides, restoreAdminDefaults, requests, enquiries } = useBilling();
  const catalog = getPlanCatalog();
  const existing = loadPlanOverrides();

  const [proMonthly, setProMonthly] = useState<string>(catalog.pro.priceMonthly?.toFixed(2) ?? '');
  const [proAnnual, setProAnnual] = useState<string>(catalog.pro.priceAnnual?.toFixed(2) ?? '');
  const [limits, setLimits] = useState<Record<string, Record<string, string>>>(() => {
    const out: Record<string, Record<string, string>> = {};
    for (const p of PLAN_LIMIT_KEYS) {
      out[p.id] = {};
      for (const f of USAGE_FEATURES) {
        const v = existing.limits?.[p.id]?.[f as keyof PlanLimits] ?? catalog[p.id].limits[f];
        out[p.id][f] = v === null ? '' : String(v);
      }
    }
    return out;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const overrides: PlanConfigOverrides = {};
    if (proMonthly.trim()) overrides.proPriceMonthly = Number(proMonthly);
    if (proAnnual.trim()) overrides.proPriceAnnual = Number(proAnnual);
    const limitPatch: PlanConfigOverrides['limits'] = {};
    for (const p of PLAN_LIMIT_KEYS) {
      for (const f of USAGE_FEATURES) {
        const raw = limits[p.id]?.[f];
        if (raw === undefined) continue;
        const value = raw.trim() === '' ? null : Number(raw);
        if (value === null || Number.isFinite(value)) {
          limitPatch[p.id] = limitPatch[p.id] ?? {};
          (limitPatch[p.id] as Record<string, number | null>)[f] = value;
        }
      }
    }
    if (limitPatch && Object.keys(limitPatch).length > 0) overrides.limits = limitPatch;
    applyAdminOverrides(overrides);
    setSaved(true);
  };

  return (
    <div className="space-y-8 pb-16">
      <header className="space-y-3">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-navy-900">
          <Settings2 className="w-6 h-6 text-teal-600" aria-hidden /> {t.adminTitle}
        </h1>
        <p role="note" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          {t.adminWarning}
        </p>
      </header>

      <section aria-labelledby="price-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="price-h" className="text-xl font-bold text-navy-900">{t.adminOverrides}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-navy-700">
            {t.proPriceMonthly}
            <input
              value={proMonthly}
              onChange={(e) => setProMonthly(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-navy-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-navy-700">
            {t.proPriceAnnual}
            <input
              value={proAnnual}
              onChange={(e) => setProAnnual(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-lg border border-navy-300 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section aria-labelledby="limits-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-4">
        <h2 id="limits-h" className="text-xl font-bold text-navy-900">{t.feature} / {t.limit}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{t.limit}</caption>
            <thead>
              <tr className="text-start text-navy-600">
                <th scope="col" className="p-2">{t.feature}</th>
                {PLAN_LIMIT_KEYS.map((p) => (
                  <th scope="col" key={p.id} className="p-2 text-start">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {USAGE_FEATURES.map((f) => (
                <tr key={f}>
                  <th scope="row" className="p-2 text-start font-medium text-navy-800">{f}</th>
                  {PLAN_LIMIT_KEYS.map((p) => (
                    <td key={p.id} className="p-2">
                      <label className="sr-only">{`${p.label} ${f}`}</label>
                      <input
                        value={limits[p.id]?.[f] ?? ''}
                        onChange={(e) =>
                          setLimits({ ...limits, [p.id]: { ...limits[p.id], [f]: e.target.value } })
                        }
                        inputMode="numeric"
                        placeholder={t.limit}
                        className="w-28 rounded border border-navy-300 px-2 py-1"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleSave} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            {t.save}
          </button>
          <button
            onClick={() => {
              restoreAdminDefaults();
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-300 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
          >
            <RotateCcw className="w-4 h-4" aria-hidden /> {t.reset}
          </button>
          <button
            onClick={() => setCurrentView('pricing')}
            className="rounded-lg border border-navy-300 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
          >
            {t.limitReachedCta}
          </button>
        </div>
        {saved && (
          <p role="status" className="text-sm text-teal-700">
            {t.savedNote} {t.syncNote}
          </p>
        )}
      </section>

      <section aria-labelledby="req-h" className="rounded-2xl border border-navy-200 bg-white p-6 space-y-3">
        <h2 id="req-h" className="text-xl font-bold text-navy-900">{t.billingHistory}</h2>
        <ul className="space-y-2 text-sm text-navy-700">
          {requests.map((r) => (
            <li key={r.id}>
              <span className="font-medium">{r.contactEmail}</span> · {r.planId} · {r.period} · {r.status} ·{' '}
              {new Date(r.requestedAt).toLocaleString()}
            </li>
          ))}
          {enquiries.map((e) => (
            <li key={e.id}>
              <span className="font-medium">{e.organisation}</span> · {e.email} · {e.users} users ·{' '}
              {e.status} · {new Date(e.createdAt).toLocaleString()}
            </li>
          ))}
          {requests.length === 0 && enquiries.length === 0 && <li>—</li>}
        </ul>
      </section>
    </div>
  );
}
