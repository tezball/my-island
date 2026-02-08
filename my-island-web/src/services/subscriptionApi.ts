import { apiRequest } from './apiClient';

export interface SetupIntentResponse {
    clientSecret: string;
    customerId: string;
    publishableKey: string;
    devMode: boolean;
}

export interface SubscriptionStatus {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    hasActiveSubscription: boolean;
    hasLapsedSubscription: boolean;
    needsSubscription: boolean;
}

export interface ConnectStatus {
    hasConnectAccount: boolean;
    onboardingComplete: boolean;
    payoutsEnabled: boolean;
    accountId: string | null;
}

export interface OnboardingLinkResponse {
    url: string;
    devMode: boolean;
}

export const ownerSubscriptionApi = {
    async getSubscription(): Promise<SubscriptionStatus> {
        return apiRequest<SubscriptionStatus>('/owner/subscription');
    },

    async createSetupIntent(): Promise<SetupIntentResponse> {
        return apiRequest<SetupIntentResponse>('/owner/subscription/setup-intent', { method: 'POST' });
    },

    async confirmSubscription(paymentMethodId: string): Promise<SubscriptionStatus> {
        return apiRequest<SubscriptionStatus>('/owner/subscription/confirm', {
            method: 'POST', body: { paymentMethodId },
        });
    },

    async createCheckoutSession(): Promise<{ checkoutUrl: string }> {
        return apiRequest<{ checkoutUrl: string }>('/owner/subscription/checkout', { method: 'POST' });
    },

    async createPortalSession(): Promise<{ portalUrl: string }> {
        return apiRequest<{ portalUrl: string }>('/owner/subscription/portal', { method: 'POST' });
    },

    async getConnectStatus(): Promise<ConnectStatus> {
        return apiRequest<ConnectStatus>('/owner/connect/status');
    },

    async startConnectOnboarding(returnUrl: string, refreshUrl: string): Promise<OnboardingLinkResponse> {
        const params = new URLSearchParams({ returnUrl, refreshUrl });
        return apiRequest<OnboardingLinkResponse>(`/owner/connect/onboard?${params}`, { method: 'POST' });
    },
};

export const supplierSubscriptionApi = {
    async getSubscription(): Promise<SubscriptionStatus> {
        return apiRequest<SubscriptionStatus>('/supplier/subscription');
    },

    async createSetupIntent(): Promise<SetupIntentResponse> {
        return apiRequest<SetupIntentResponse>('/supplier/subscription/setup-intent', { method: 'POST' });
    },

    async confirmSubscription(paymentMethodId: string): Promise<SubscriptionStatus> {
        return apiRequest<SubscriptionStatus>('/supplier/subscription/confirm', {
            method: 'POST', body: { paymentMethodId },
        });
    },

    async createCheckoutSession(): Promise<{ checkoutUrl: string }> {
        return apiRequest<{ checkoutUrl: string }>('/supplier/subscription/checkout', { method: 'POST' });
    },

    async createPortalSession(): Promise<{ portalUrl: string }> {
        return apiRequest<{ portalUrl: string }>('/supplier/subscription/portal', { method: 'POST' });
    },

    async getConnectStatus(): Promise<ConnectStatus> {
        return apiRequest<ConnectStatus>('/supplier/connect/status');
    },

    async startConnectOnboarding(returnUrl: string, refreshUrl: string): Promise<OnboardingLinkResponse> {
        const params = new URLSearchParams({ returnUrl, refreshUrl });
        return apiRequest<OnboardingLinkResponse>(`/supplier/connect/onboard?${params}`, { method: 'POST' });
    },
};
