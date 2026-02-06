import type { PaymentIntentResponse } from '../types/booking';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function apiRequest<T>(
    endpoint: string,
    options: {
        method?: string;
        body?: unknown;
    } = {}
): Promise<T> {
    const { method = 'GET', body } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
            const errorBody = await response.text();
            try {
                const errorJson = JSON.parse(errorBody);
                errorMessage = errorJson.message || errorJson.error || errorBody;
            } catch {
                if (errorBody && errorBody.length < 500) {
                    errorMessage = errorBody;
                }
            }
        } catch {
            // Ignore body reading errors
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export const paymentService = {
    async createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
        return apiRequest<PaymentIntentResponse>(`/bookings/${bookingId}/payment/intent`, {
            method: 'POST',
        });
    },

    async getPaymentStatus(bookingId: string): Promise<{
        bookingStatus: string;
        paymentStatus: string;
        chargeTotal: number;
    }> {
        return apiRequest(`/bookings/${bookingId}/payment/status`);
    },

    async simulatePaymentSuccess(bookingId: string): Promise<void> {
        await apiRequest(`/bookings/${bookingId}/payment/simulate-success`, {
            method: 'POST',
        });
    },
};
