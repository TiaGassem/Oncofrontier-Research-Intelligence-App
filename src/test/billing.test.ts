import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkEntitlement,
  DEFAULT_PLANS,
  getPlanCatalog,
  loadPlanOverrides,
  loadSubscriptionState,
  loadUsage,
  recordUsage,
  resetUsage,
  savePlanOverrides,
  loadEnquiries,
  saveEnquiry,
  submitUpgradeRequest,
  withdrawUpgradeRequest,
  formatPrice,
} from '@/lib/billing';
import { billingT } from '@/lib/billingTranslations';

beforeEach(() => {
  localStorage.clear();
  resetUsage();
});

describe('plan catalogue', () => {
  it('keeps every accessibility and citation guarantee on the free plan', () => {
    const free = DEFAULT_PLANS.free;
    const text = free.features.join(' ').toLowerCase();
    expect(text).toContain('accessibility');
    expect(text).toContain('citations');
  });

  it('uses the suggested list prices from the brief', () => {
    expect(DEFAULT_PLANS.pro.priceMonthly).toBe(9.99);
    expect(DEFAULT_PLANS.pro.priceAnnual).toBe(79.99);
    expect(DEFAULT_PLANS.institutional.priceMonthly).toBeNull();
  });
});

describe('usage counters', () => {
  it('counts usage within a month and reports the limit hit', () => {
    for (let i = 0; i < 10; i += 1) recordUsage('aiSummaries');
    const check = checkEntitlement('aiSummaries', 'free', loadUsage());
    expect(check.allowed).toBe(false);
    expect(check.limitReached).toBe(true);
    expect(check.used).toBe(10);
    expect(check.limit).toBe(10);
  });

  it('stays allowed for unlimited features', () => {
    for (let i = 0; i < 500; i += 1) recordUsage('articleComparisons');
    const pro = checkEntitlement('articleComparisons', 'pro', loadUsage());
    expect(pro.allowed).toBe(true);
    expect(pro.limit).toBeNull();
  });

  it('resets when the month changes', () => {
    recordUsage('pdfSummaries');
    const usage = loadUsage();
    usage.month = '2000-01';
    localStorage.setItem('oncofrontier-usage', JSON.stringify(usage));
    expect(loadUsage().counts.pdfSummaries).toBeUndefined();
  });
});

describe('subscription workflow', () => {
  it('never grants a paid plan from local storage', () => {
    submitUpgradeRequest({ planId: 'pro', period: 'monthly', contactEmail: 'a@example.com' });
    expect(loadSubscriptionState().planId).toBe('free');
    expect(loadSubscriptionState().status).toBe('request_pending');
    expect(loadSubscriptionState().requests[0].status).toBe('pending_processing');
  });

  it('supports withdrawing a request', () => {
    const req = submitUpgradeRequest({ planId: 'pro', period: 'annual', contactEmail: 'a@example.com' });
    withdrawUpgradeRequest(req.id);
    expect(loadSubscriptionState().requests[0].status).toBe('withdrawn');
    expect(loadSubscriptionState().status).toBe('none');
  });
});

describe('institutional enquiries', () => {
  it('stores enquiries as drafts pending a backend', () => {
    saveEnquiry({
      organisation: 'Uni X', contactName: 'A', email: 'a@uni.edu', role: 'librarian',
      users: '200', message: 'quote please',
    });
    const all = loadEnquiries();
    expect(all).toHaveLength(1);
    expect(all[0].status).toBe('draft_pending_backend');
  });
});

describe('admin overrides', () => {
  it('changes prices and limits for this device only', () => {
    savePlanOverrides({ proPriceMonthly: 5.5, limits: { free: { aiSummaries: 1 } } });
    const catalog = getPlanCatalog();
    expect(catalog.pro.priceMonthly).toBe(5.5);
    const check = checkEntitlement('aiSummaries', 'free', loadUsage());
    expect(check.limit).toBe(1);
    recordUsage('aiSummaries');
    expect(checkEntitlement('aiSummaries', 'free', loadUsage()).limitReached).toBe(true);
    expect(loadPlanOverrides().proPriceMonthly).toBe(5.5);
  });
});

describe('localisation fallbacks', () => {
  it('falls back to English and localises fr/ar', () => {
    expect(billingT('fr').pricingNav).toBe('Tarifs');
    expect(billingT('ar').pricingNav).toBe('الأسعار');
    expect(billingT('de').pricingNav).toBe('Pricing');
    expect(formatPrice(9.99, 'en')).toContain('9.99');
  });

  it('keeps RTL-safe price formatting simple', () => {
    expect(formatPrice(null, 'en')).toBe('—');
  });
});
