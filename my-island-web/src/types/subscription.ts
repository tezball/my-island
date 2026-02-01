export type SubscriptionStatus = 'NONE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';

export interface SubscriptionDto {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasActiveSubscription: boolean;
  hasLapsedSubscription: boolean;
  needsSubscription: boolean;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
}

export interface CreatePortalSessionResponse {
  portalUrl: string;
}
