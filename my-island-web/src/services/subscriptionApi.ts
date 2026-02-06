const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

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

// Owner subscription API
export const ownerSubscriptionApi = {
    async getSubscription(): Promise<SubscriptionStatus> {
        const response = await fetch(`${API_BASE}/owner/subscription`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch subscription');
        return response.json();
    },

    async createSetupIntent(): Promise<SetupIntentResponse> {
        const response = await fetch(`${API_BASE}/owner/subscription/setup-intent`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create setup intent');
        return response.json();
    },

    async confirmSubscription(paymentMethodId: string): Promise<SubscriptionStatus> {
        const response = await fetch(`${API_BASE}/owner/subscription/confirm`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ paymentMethodId }),
        });
        if (!response.ok) throw new Error('Failed to confirm subscription');
        return response.json();
    },

    async createCheckoutSession(): Promise<{ checkoutUrl: string }> {
        const response = await fetch(`${API_BASE}/owner/subscription/checkout`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create checkout session');
        return response.json();
    },

    async createPortalSession(): Promise<{ portalUrl: string }> {
        const response = await fetch(`${API_BASE}/owner/subscription/portal`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create portal session');
        return response.json();
    },

    // Connect API
    async getConnectStatus(): Promise<ConnectStatus> {
        const response = await fetch(`${API_BASE}/owner/connect/status`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch connect status');
        return response.json();
    },

    async startConnectOnboarding(returnUrl: string, refreshUrl: string): Promise<OnboardingLinkResponse> {
        const params = new URLSearchParams({ returnUrl, refreshUrl });
        const response = await fetch(`${API_BASE}/owner/connect/onboard?${params}`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to start connect onboarding');
        return response.json();
    },
};

// Supplier subscription API
export const supplierSubscriptionApi = {
    async getSubscription(): Promise<SubscriptionStatus> {
        const response = await fetch(`${API_BASE}/supplier/subscription`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch subscription');
        return response.json();
    },

    async createSetupIntent(): Promise<SetupIntentResponse> {
        const response = await fetch(`${API_BASE}/supplier/subscription/setup-intent`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create setup intent');
        return response.json();
    },

    async confirmSubscription(paymentMethodId: string): Promise<SubscriptionStatus> {
        const response = await fetch(`${API_BASE}/supplier/subscription/confirm`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ paymentMethodId }),
        });
        if (!response.ok) throw new Error('Failed to confirm subscription');
        return response.json();
    },

    async createCheckoutSession(): Promise<{ checkoutUrl: string }> {
        const response = await fetch(`${API_BASE}/supplier/subscription/checkout`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create checkout session');
        return response.json();
    },

    async createPortalSession(): Promise<{ portalUrl: string }> {
        const response = await fetch(`${API_BASE}/supplier/subscription/portal`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create portal session');
        return response.json();
    },

    // Connect API
    async getConnectStatus(): Promise<ConnectStatus> {
        const response = await fetch(`${API_BASE}/supplier/connect/status`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch connect status');
        return response.json();
    },

    async startConnectOnboarding(returnUrl: string, refreshUrl: string): Promise<OnboardingLinkResponse> {
        const params = new URLSearchParams({ returnUrl, refreshUrl });
        const response = await fetch(`${API_BASE}/supplier/connect/onboard?${params}`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to start connect onboarding');
        return response.json();
    },
};
