import { apiRequest } from './apiClient';
import type { SubscriptionDto, CreateCheckoutSessionResponse, CreatePortalSessionResponse } from '../types/subscription';

export const subscriptionService = {
    async getSubscriptionStatus(): Promise<SubscriptionDto> {
        return apiRequest<SubscriptionDto>('/supplier/subscription');
    },

    async createCheckoutSession(): Promise<CreateCheckoutSessionResponse> {
        return apiRequest<CreateCheckoutSessionResponse>('/supplier/subscription/checkout', { method: 'POST' });
    },

    async createPortalSession(): Promise<CreatePortalSessionResponse> {
        return apiRequest<CreatePortalSessionResponse>('/supplier/subscription/portal', { method: 'POST' });
    },
};
