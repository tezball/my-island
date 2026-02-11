import { apiRequest } from './apiClient';
import type { PaymentIntentResponse } from '../types/booking';

export const paymentService = {
    async createPaymentIntent(bookingId: string): Promise<PaymentIntentResponse> {
        return apiRequest<PaymentIntentResponse>(`/bookings/${bookingId}/payment/intent`, { method: 'POST' });
    },

    async getPaymentStatus(bookingId: string): Promise<{
        bookingStatus: string;
        paymentStatus: string;
        chargeTotal: number;
    }> {
        return apiRequest(`/bookings/${bookingId}/payment/status`);
    },

    async confirmAuthorization(bookingId: string): Promise<void> {
        await apiRequest(`/bookings/${bookingId}/payment/confirm-authorization`, { method: 'POST' });
    },

    async simulatePaymentSuccess(bookingId: string): Promise<void> {
        await apiRequest(`/bookings/${bookingId}/payment/simulate-success`, { method: 'POST' });
    },
};
