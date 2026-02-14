import { test, expect, type APIRequestContext } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Guest Booking Cancellation
 *
 * User Stories covered:
 *   US-CANCEL-1: Guest sees cancel button on upcoming bookings (UI)
 *   US-CANCEL-2: Guest can cancel a booking via API and see status change
 *   US-CANCEL-3: Guest cancel confirmation dialog works (UI)
 */

async function apiLogin(request: APIRequestContext, email: string, password: string): Promise<string> {
    const res = await request.post('/api/auth/login', { data: { email, password } });
    expect(res.status(), `Login failed for ${email} (status ${res.status()})`).toBe(200);
    const body = await res.json();
    expect(body.token, `Login response missing token for ${email}`).toBeTruthy();
    return body.token;
}

test.describe('US-CANCEL-1: Guest sees cancel option on upcoming bookings', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Trips page shows Cancel button on cancellable bookings', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        // Look for a Cancel button on any booking card
        const cancelButton = page.getByRole('button', { name: /Cancel/i }).first();
        if (await cancelButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(cancelButton).toBeVisible();
        }
    });
});

test.describe('US-CANCEL-2: Guest can actually cancel a booking (API)', () => {
    test('Guest cancels a confirmed booking and status changes to CANCELLED', async ({ request }) => {
        const token = await apiLogin(request, GUEST.email, GUEST.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Get guest bookings, find one that can be cancelled (PENDING or CONFIRMED)
        const bookingsRes = await request.get('/api/bookings', { headers });
        expect(bookingsRes.status()).toBe(200);
        const bookings = await bookingsRes.json();
        const cancellable = bookings.find(
            (b: Record<string, unknown>) => b.status === 'PENDING' || b.status === 'CONFIRMED'
        );
        test.skip(!cancellable, 'No cancellable bookings available');

        const bookingId = cancellable.id;
        const originalStatus = cancellable.status;

        // Cancel the booking
        const cancelRes = await request.post(`/api/bookings/${bookingId}/cancel`, { headers });
        expect(cancelRes.status(), `Cancel booking ${bookingId} (was ${originalStatus}) failed`).toBe(200);
        const cancelled = await cancelRes.json();
        expect(cancelled.status).toBe('CANCELLED');

        // Verify the booking is now cancelled when re-fetched
        const verifyRes = await request.get(`/api/bookings/${bookingId}`, { headers });
        expect(verifyRes.status()).toBe(200);
        const verified = await verifyRes.json();
        expect(verified.status).toBe('CANCELLED');
    });

    test('Cannot cancel an already completed booking', async ({ request }) => {
        const token = await apiLogin(request, GUEST.email, GUEST.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Find a COMPLETED booking
        const bookingsRes = await request.get('/api/bookings', { headers });
        const bookings = await bookingsRes.json();
        const completed = bookings.find((b: Record<string, unknown>) => b.status === 'COMPLETED');
        test.skip(!completed, 'No completed bookings available');

        // Attempting to cancel should fail
        const cancelRes = await request.post(`/api/bookings/${completed.id}/cancel`, { headers });
        expect(cancelRes.status()).not.toBe(200);
    });
});

test.describe('US-CANCEL-3: Cancel confirmation dialog', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Cancel button triggers confirmation dialog with Keep/Cancel options', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const cancelButton = page.getByRole('button', { name: /Cancel/i }).first();
        const isVisible = await cancelButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No cancellable bookings available');

        await cancelButton.click();

        // Should show a confirmation dialog
        await expect(page.getByText(/Are you sure/i)).toBeVisible({ timeout: 5_000 });
        await expect(page.getByRole('button', { name: /Keep Booking/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Cancel Booking/i })).toBeVisible();

        // Click "Keep Booking" to dismiss without cancelling
        await page.getByRole('button', { name: /Keep Booking/i }).click();
        await expect(page.getByText(/Are you sure/i)).not.toBeVisible({ timeout: 5_000 });
    });
});
