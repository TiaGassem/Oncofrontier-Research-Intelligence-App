// OncoFrontiers freemium business model — plan definitions, entitlements,
// monthly usage counters and the subscription request workflow.
//
// HONEST ARCHITECTURE STATUS (do not delete when wiring a real provider):
// - Payment processing IS NOT integrated. No payment provider is approved or
//   connected, so there is no way to charge anyone and this module never
//   grants a paid plan in the browser. "Upgrading" creates a pending request
//   for the operator and leaves the account on the Free plan.
// - Entitlement enforcement currently runs in this module on device. When the
//   payment provider and a backend are connected, `getResolvedPlan()` must be
//   replaced by a server-side lookup (signed session → plan + usage), so the
//   checks below become a server response rather than local data. Until then
//   free-tier limits are advisory, which is exactly why the UI says so.
// - Prices are the suggested list prices from the product brief and are NOT
//   validated market prices; the pricing page says so on the page itself.

import type { Language } from '@/types';
import { billingT } from '@/lib/billingTranslations';

export type PlanId = 'free' | 'pro' | 'institutional';

export type BillingPeriod = 'monthly' | 'annual';

/** Metered capabilities with a monthly allowance per plan. */
export type UsageFeature =
  | 'aiSummaries'
  | 'articleComparisons'
  | 'pdfSummaries'
  | 'assistantQueries'
  | 'automations';

/** null means unlimited (within fair use). */
export type PlanLimits = Record<UsageFeature, number | null>;

export interface PlanDefinition {
  id: PlanId;
  /** Suggested list prices in EUR. Institutional pricing is custom (null). */
  priceMonthly: number | null;
  priceAnnual: number | null;
  audience: string;
  features: string[];
  limits: PlanLimits;
}

export const USAGE_FEATURES: UsageFeature[] = [
  'aiSummaries',
  'articleComparisons',
  'pdfSummaries',
  'assistantQueries',
  'automations',
];

export const DEFAULT_PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    priceMonthly: 0,
    priceAnnual: 0,
    audience: 'Students, early-career researchers and individual users',
    features: [
      'Basic scientific literature search (PubMed/Europe PMC/ClinicalTrials.gov/Open Targets/Crossref)',
      '10 AI article summaries / month',
      '3 article comparisons / month',
      '3 PDF summaries / month',
      'Basic research assistant access (20 queries / month)',
      'Selected workspace templates',
      'Public Atlas Anatomy resources',
      'Save favourites, history and notes where an account is supported',
      'ALL accessibility features — always, on every plan (screen reader, keyboard, contrast, colour-vision, motor support)',
      'Full source citations on every result — never a premium feature',
    ],
    limits: {
      aiSummaries: 10,
      articleComparisons: 3,
      pdfSummaries: 3,
      assistantQueries: 20,
      automations: 2,
    },
  },
  pro: {
    id: 'pro',
    priceMonthly: 9.99,
    priceAnnual: 79.99,
    audience: 'Researchers, postgraduate students, academics and scientists',
    features: [
      'Higher monthly AI usage (300 summaries / month)',
      'Advanced PDF summarization and analysis (60 PDFs / month)',
      'Unlimited article comparisons',
      'Advanced literature review tools',
      'Research mapping and citation exploration',
      'Reference and bibliography management and exports',
      'Advanced research assistants (400 queries / month)',
      'Research data analysis',
      'Research workspaces and templates',
      'Automations and publication alerts (unlimited)',
      'Exportable reports and research documents',
      'Same accessibility guarantees as every plan',
    ],
    limits: {
      aiSummaries: 300,
      articleComparisons: null,
      pdfSummaries: 60,
      assistantQueries: 400,
      automations: null,
    },
  },
  institutional: {
    id: 'institutional',
    priceMonthly: null,
    priceAnnual: null,
    audience: 'Universities, laboratories, hospitals and academic libraries',
    features: [
      'Multi-user access under one institutional agreement',
      'Institutional account management',
      'Administrative dashboard for the institution',
      'Shared research workspaces',
      'Team collaboration',
      'Shared templates and research resources',
      'Usage and subscription management',
      'Institutional support',
      'Optional custom integrations (scoped, on request)',
      'Custom pricing via a quotation — no self-serve billing',
    ],
    limits: {
      aiSummaries: null,
      articleComparisons: null,
      pdfSummaries: null,
      assistantQueries: null,
      automations: null,
    },
  },
};

export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'institutional'];

// ---------------------------------------------------------------------------
// Admin configuration (device-local until backend enforcement is wired)
// ---------------------------------------------------------------------------

export interface PlanConfigOverrides {
  proPriceMonthly?: number;
  proPriceAnnual?: number;
  limits?: Partial<Record<PlanId, Partial<PlanLimits>>>;
}

const ADMIN_OVERRIDES_KEY = 'oncofrontier-plan-config';

export function loadPlanOverrides(): PlanConfigOverrides {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ADMIN_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as PlanConfigOverrides) : {};
  } catch {
    return {};
  }
}

export function savePlanOverrides(overrides: PlanConfigOverrides): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // storage unavailable — admin edits remain session-local
  }
}

export function clearPlanOverrides(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_OVERRIDES_KEY);
  } catch {
    // ignore
  }
}

/** Effective plan catalogue: defaults with admin overrides applied. */
export function getPlanCatalog(): Record<PlanId, PlanDefinition> {
  const overrides = loadPlanOverrides();
  const out: Record<PlanId, PlanDefinition> = JSON.parse(JSON.stringify(DEFAULT_PLANS));
  if (overrides.proPriceMonthly !== undefined) out.pro.priceMonthly = overrides.proPriceMonthly;
  if (overrides.proPriceAnnual !== undefined) out.pro.priceAnnual = overrides.proPriceAnnual;
  if (overrides.limits) {
    (Object.keys(overrides.limits) as PlanId[]).forEach((planId) => {
      const patch = overrides.limits?.[planId];
      if (!patch) return;
      (Object.keys(patch) as UsageFeature[]).forEach((f) => {
        out[planId].limits[f] = patch[f] ?? null;
      });
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Subscription state + requests (device-local until a payment provider exists)
// ---------------------------------------------------------------------------

export type SubscriptionStatus = 'none' | 'request_pending' | 'active' | 'canceled' | 'past_due';

export interface SubscriptionRequest {
  id: string;
  planId: Exclude<PlanId, 'free'>;
  period: BillingPeriod | 'custom';
  contactEmail: string;
  organisation?: string;
  seats?: number;
  note?: string;
  requestedAt: string;
  status: 'pending_processing' | 'withdrawn';
}

export interface SubscriptionState {
  /** The plan that actually applies right now. 'free' until a real provider activates something. */
  planId: PlanId;
  status: SubscriptionStatus;
  requests: SubscriptionRequest[];
}

const SUBSCRIPTION_KEY = 'oncofrontier-subscription';

export function loadSubscriptionState(): SubscriptionState {
  const empty: SubscriptionState = { planId: 'free', status: 'none', requests: [] };
  if (typeof localStorage === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<SubscriptionState> & { requests?: SubscriptionRequest[] };
    return {
      // NEVER trust a locally stored paid planId: grants must come from the
      // payment provider / backend verification, not from local storage.
      planId: 'free',
      status: typeof parsed.status === 'string' ? parsed.status : 'none',
      requests: Array.isArray(parsed.requests)
        ? parsed.requests.filter((r) => r && typeof r.id === 'string')
        : [],
    };
  } catch {
    return empty;
  }
}

export function saveSubscriptionState(state: SubscriptionState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function submitUpgradeRequest(
  input: {
    planId: Exclude<PlanId, 'free'>;
    period: BillingPeriod | 'custom';
    contactEmail: string;
    organisation?: string;
    seats?: number;
    note?: string;
  }
): SubscriptionRequest {
  const request: SubscriptionRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    requestedAt: new Date().toISOString(),
    status: 'pending_processing',
  };
  const state = loadSubscriptionState();
  state.requests.push(request);
  state.status = 'request_pending';
  saveSubscriptionState(state);
  return request;
}

export function withdrawUpgradeRequest(id: string): void {
  const state = loadSubscriptionState();
  state.requests = state.requests.map((r) =>
    r.id === id ? { ...r, status: 'withdrawn' as const } : r
  );
  state.status = state.requests.some((r) => r.status === 'pending_processing')
    ? 'request_pending'
    : 'none';
  saveSubscriptionState(state);
}

/** Downgrade: the user always stays on what the provider actually granted. */
export function resolveToPlan(planId: PlanId): void {
  const state = loadSubscriptionState();
  state.planId = 'free'; // see loadSubscriptionState — cannot be granted locally
  state.status = planId === 'free' ? 'none' : state.status;
  saveSubscriptionState(state);
}

// ---------------------------------------------------------------------------
// Institutional enquiries (stored as a draft until a backend accepts them)
// ---------------------------------------------------------------------------

export interface InstitutionalEnquiry {
  id: string;
  organisation: string;
  contactName: string;
  email: string;
  role: string;
  users: string;
  message: string;
  createdAt: string;
  status: 'draft_pending_backend';
}

const ENQUIRIES_KEY = 'oncofrontier-institutional-enquiries';

export function loadEnquiries(): InstitutionalEnquiry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    return raw ? (JSON.parse(raw) as InstitutionalEnquiry[]) : [];
  } catch {
    return [];
  }
}

export function saveEnquiry(input: Omit<InstitutionalEnquiry, 'id' | 'createdAt' | 'status'>): InstitutionalEnquiry {
  const enquiry: InstitutionalEnquiry = {
    ...input,
    id: `enf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'draft_pending_backend',
  };
  if (typeof localStorage !== 'undefined') {
    try {
      const all = loadEnquiries();
      all.push(enquiry);
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(all));
    } catch {
      // draft not persisted — the receipt still shows on screen
    }
  }
  return enquiry;
}

// ---------------------------------------------------------------------------
// Entitlements + usage counters
// ---------------------------------------------------------------------------

const USAGE_KEY = 'oncofrontier-usage';

export interface UsageCounters {
  /** 'YYYY-MM' billing month in UTC. */
  month: string;
  counts: Partial<Record<UsageFeature, number>>;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function loadUsage(): UsageCounters {
  const month = currentMonth();
  if (typeof localStorage === 'undefined') return { month, counts: {} };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    const parsed: UsageCounters = raw ? JSON.parse(raw) : { month, counts: {} };
    if (parsed.month !== month) {
      // New billing month: counters reset. A backend should reset them on the
      // subscription anniversary instead.
      return { month, counts: {} };
    }
    return { month, counts: parsed.counts ?? {} };
  } catch {
    return { month, counts: {} };
  }
}

export function recordUsage(feature: UsageFeature, amount = 1): void {
  if (typeof localStorage === 'undefined') return;
  const usage = loadUsage();
  usage.counts[feature] = (usage.counts[feature] ?? 0) + amount;
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore
  }
}

export function resetUsage(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(USAGE_KEY);
  } catch {
    // ignore
  }
}

export interface EntitlementCheck {
  allowed: boolean;
  /** Set when the monthly allowance is exhausted. */
  limitReached: boolean;
  used: number;
  limit: number | null;
}

/**
 * Resolve the plan that applies. Replace the body with a server lookup when
 * the backend exists — see the architecture note at the top of this file.
 */
export function getResolvedPlan(): PlanId {
  return loadSubscriptionState().planId;
}

export function getPlanLimits(planId: PlanId): PlanLimits {
  return getPlanCatalog()[planId].limits;
}

export function checkEntitlement(
  feature: UsageFeature,
  planId: PlanId = getResolvedPlan(),
  usage: UsageCounters = loadUsage()
): EntitlementCheck {
  const limit = getPlanLimits(planId)[feature];
  const used = usage.counts[feature] ?? 0;
  return {
    allowed: limit === null || used < limit,
    limitReached: limit !== null && used >= limit,
    used,
    limit,
  };
}

/** Human label for a limit value, localised via billingTranslations. */
export function describeLimit(value: number | null, language: Language): string {
  return value === null ? billingT(language).unlimited : String(value);
}

export function formatPrice(value: number | null | undefined, language: Language): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat(language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
