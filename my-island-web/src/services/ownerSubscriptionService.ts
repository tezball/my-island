import { apiRequest } from './apiClient';
import type { SubscriptionDto, CreateCheckoutSessionResponse, CreatePortalSessionResponse } from '../types/subscription';

export const ownerSubscriptionService = {
    async getSubscriptionStatus(): Promise<SubscriptionDto> {
        return apiRequest<SubscriptionDto>('/owner/subscription');
    },

    async createCheckoutSession(): Promise<CreateCheckoutSessionResponse> {
        return apiRequest<CreateCheckoutSessionResponse>('/owner/subscription/checkout', { method: 'POST' });
    },

    async createPortalSession(): Promise<CreatePortalSessionResponse> {
        return apiRequest<CreatePortalSessionResponse>('/owner/subscription/portal', { method: 'POST' });
    },
};
