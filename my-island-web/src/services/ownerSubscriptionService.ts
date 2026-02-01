import type { SubscriptionDto, CreateCheckoutSessionResponse, CreatePortalSessionResponse } from '../types/subscription';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const ownerSubscriptionService = {
  async getSubscriptionStatus(): Promise<SubscriptionDto> {
    const response = await fetch(`${API_BASE}/owner/subscription`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch owner subscription status');
    }

    return response.json();
  },

  async createCheckoutSession(): Promise<CreateCheckoutSessionResponse> {
    const response = await fetch(`${API_BASE}/owner/subscription/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to create owner checkout session');
    }

    return response.json();
  },

  async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await fetch(`${API_BASE}/owner/subscription/portal`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to create owner portal session');
    }

    return response.json();
  },
};
