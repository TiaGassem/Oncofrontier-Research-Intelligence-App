import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useCallback } from 'react';
import {
  checkEntitlement,
  getPlanCatalog,
  getResolvedPlan,
  loadUsage,
  recordUsage as recordUsageRaw,
  resetUsage as resetUsageRaw,
  loadSubscriptionState,
  loadEnquiries,
  saveEnquiry,
  submitUpgradeRequest,
  withdrawUpgradeRequest,
  clearPlanOverrides,
  savePlanOverrides,
  type InstitutionalEnquiry,
  type PlanConfigOverrides,
  type PlanId,
  type SubscriptionRequest,
  type SubscriptionState,
  type UsageCounters,
  type UsageFeature,
} from '@/lib/billing';

interface BillingState {
  planId: PlanId;
  subscription: SubscriptionState;
  usage: UsageCounters;
  limitReached: Record<UsageFeature, boolean>;
  requests: SubscriptionRequest[];
  enquiries: InstitutionalEnquiry[];
  /**
   * May this feature be used right now? Call BEFORE spending provider quota.
   * Availability in the UI is advisory until the backend enforces it; that is
   * stated on the billing page, never hidden.
   */
  canUse: (feature: UsageFeature) => boolean;
  /** Record one usage event (only after a real action succeeded or started). */
  recordUse: (feature: UsageFeature, amount?: number) => void;
  refresh: () => void;
  resetCounters: () => void;
  createUpgradeRequest: (input: Parameters<typeof submitUpgradeRequest>[0]) => SubscriptionRequest;
  withdrawRequest: (id: string) => void;
  saveInstitutionalEnquiry: (input: Omit<InstitutionalEnquiry, 'id' | 'createdAt' | 'status'>) => InstitutionalEnquiry;
  applyAdminOverrides: (overrides: PlanConfigOverrides) => void;
  restoreAdminDefaults: () => void;
}

const BillingContext = createContext<BillingState | null>(null);

function computeLimitReached(planId: PlanId, usage: UsageCounters) {
  const features: UsageFeature[] = ['aiSummaries', 'articleComparisons', 'pdfSummaries', 'assistantQueries', 'automations'];
  const out = {} as Record<UsageFeature, boolean>;
  for (const f of features) out[f] = checkEntitlement(f, planId, usage).limitReached;
  return out;
}

export function BillingProvider({ children }: { children: ReactNode }) {
  const [planId, setPlanId] = useState<PlanId>(() => getResolvedPlan());
  const [subscription, setSubscription] = useState<SubscriptionState>(() => loadSubscriptionState());
  const [usage, setUsage] = useState<UsageCounters>(() => loadUsage());
  const [enquiries, setEnquiries] = useState<InstitutionalEnquiry[]>(() => loadEnquiries());

  const refresh = useCallback(() => {
    setPlanId(getResolvedPlan());
    setSubscription(loadSubscriptionState());
    setUsage(loadUsage());
    setEnquiries(loadEnquiries());
  }, []);

  // Reset-limit dated counters flip automatically when a billing month ends;
  // also refresh when the tab becomes visible again so counters stay honest
  // after the app sat open for days.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  const canUse = useCallback(
    (feature: UsageFeature) => checkEntitlement(feature, planId, usage).allowed,
    [planId, usage]
  );

  const recordUse = useCallback((feature: UsageFeature, amount = 1) => {
    recordUsageRaw(feature, amount);
    setUsage(loadUsage());
  }, []);

  const resetCounters = useCallback(() => {
    resetUsageRaw();
    setUsage(loadUsage());
  }, []);

  const createUpgradeRequest = useCallback((input: Parameters<typeof submitUpgradeRequest>[0]) => {
    const request = submitUpgradeRequest(input);
    refresh();
    return request;
  }, [refresh]);

  const withdrawRequest = useCallback((id: string) => {
    withdrawUpgradeRequest(id);
    refresh();
  }, [refresh]);

  const saveInstitutionalEnquiry = useCallback(
    (input: Omit<InstitutionalEnquiry, 'id' | 'createdAt' | 'status'>) => {
      let enquiry: InstitutionalEnquiry;
      setEnquiries((prev) => {
        enquiry = saveEnquiry(input);
        return [...prev, enquiry];
      });
      // saveEnquiry already wrote to storage; enquiries kept in state.
      return enquiry!;
    },
    []
  );

  const applyAdminOverrides = useCallback((overrides: PlanConfigOverrides) => {
    savePlanOverrides(overrides);
    // The active plan never changes locally; only limits/prices move.
    refresh();
  }, [refresh]);

  const restoreAdminDefaults = useCallback(() => {
    clearPlanOverrides();
    refresh();
  }, [refresh]);

  return (
    <BillingContext.Provider
      value={{
        planId,
        subscription,
        usage,
        limitReached: computeLimitReached(planId, usage),
        requests: subscription.requests,
        enquiries,
        canUse,
        recordUse,
        refresh,
        resetCounters,
        createUpgradeRequest,
        withdrawRequest,
        saveInstitutionalEnquiry,
        applyAdminOverrides,
        restoreAdminDefaults,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling(): BillingState {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error('useBilling must be used within BillingProvider');
  return ctx;
}

export { getPlanCatalog };
