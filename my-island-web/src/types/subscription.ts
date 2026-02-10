export type SubscriptionStatus = 'NONE' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';

export interface SubscriptionDto {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasActiveSubscription: boolean;
  hasLapsedSubscription: boolean;
  needsSubscription: boolean;
  isTrialing: boolean;
  trialDaysRemaining: number | null;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
}

export interface CreatePortalSessionResponse {
  portalUrl: string | null;
  devMode?: boolean;
}
