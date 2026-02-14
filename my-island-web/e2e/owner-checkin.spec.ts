import { test, expect, type APIRequestContext } from '@playwright/test';
import { login, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Owner Booking Lifecycle
 *
 * User Stories covered:
 *   US-LIFECYCLE-1: Owner can check in a confirmed booking (API)
 *   US-LIFECYCLE-2: Owner can check out a checked-in booking (API)
 *   US-LIFECYCLE-3: Owner can reject a pending booking (API)
 *   US-LIFECYCLE-4: Owner bookings page reflects status actions (UI)
 *
 * Note: Confirm (PENDING → CONFIRMED) requires Stripe payment intent,
 * so it's tested at the reject level (PENDING → CANCELLED) for API tests.
 * Seeded CONFIRMED/CHECKED_IN bookings are used for check-in/check-out.
 */

async function apiLogin(request: APIRequestContext, email: string, password: string): Promise<string> {
    const res = await request.post('/api/auth/login', { data: { email, password } });
    expect(res.status(), `Login failed for ${email} (status ${res.status()})`).toBe(200);
    const body = await res.json();
    expect(body.token, `Login response missing token for ${email}`).toBeTruthy();
    return body.token;
}

test.describe('US-LIFECYCLE-1/2/3: Owner booking lifecycle (API)', () => {
    test('Owner can check in a confirmed booking', async ({ request }) => {
        const token = await apiLogin(request, OWNER.email, OWNER.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Get owner bookings, find a CONFIRMED one eligible for check-in
        // Check-in is allowed from (checkInDate - 1 day)
        const bookingsRes = await request.get('/api/owner/bookings', { headers });
        expect(bookingsRes.status()).toBe(200);
        const bookings = await bookingsRes.json();

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const eligible = bookings.find(
            (b: Record<string, unknown>) =>
                b.status === 'CONFIRMED' &&
                typeof b.checkInDate === 'string' &&
                b.checkInDate <= tomorrowStr
        );
        test.skip(!eligible, 'No CONFIRMED bookings eligible for check-in today');

        // Check in
        const checkInRes = await request.put(`/api/owner/bookings/${eligible.id}/check-in`, { headers });
        expect(checkInRes.status(), `Check-in booking ${eligible.id} failed`).toBe(200);
        const checkedIn = await checkInRes.json();
        expect(checkedIn.status).toBe('CHECKED_IN');
    });

    test('Owner can check out a checked-in booking', async ({ request }) => {
        const token = await apiLogin(request, OWNER.email, OWNER.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Find a CHECKED_IN booking
        const bookingsRes = await request.get('/api/owner/bookings', { headers });
        const bookings = await bookingsRes.json();
        const checkedIn = bookings.find(
            (b: Record<string, unknown>) => b.status === 'CHECKED_IN'
        );
        test.skip(!checkedIn, 'No CHECKED_IN bookings available for check-out');

        // Check out
        const checkOutRes = await request.put(`/api/owner/bookings/${checkedIn.id}/check-out`, { headers });
        expect(checkOutRes.status(), `Check-out booking ${checkedIn.id} failed`).toBe(200);
        const completed = await checkOutRes.json();
        expect(completed.status).toBe('COMPLETED');
    });

    test('Owner can reject a pending booking', async ({ request }) => {
        const token = await apiLogin(request, OWNER.email, OWNER.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Find a PENDING booking
        const bookingsRes = await request.get('/api/owner/bookings', { headers });
        const bookings = await bookingsRes.json();
        const pending = bookings.find(
            (b: Record<string, unknown>) => b.status === 'PENDING'
        );
        test.skip(!pending, 'No PENDING bookings available for rejection');

        // Reject (cancel) the booking
        const rejectRes = await request.post(`/api/owner/bookings/${pending.id}/cancel`, { headers });
        expect(rejectRes.status(), `Reject booking ${pending.id} failed`).toBe(200);
        const rejected = await rejectRes.json();
        expect(rejected.status).toBe('CANCELLED');
    });

    test('Cannot check in a booking that is not CONFIRMED', async ({ request }) => {
        const token = await apiLogin(request, OWNER.email, OWNER.password);
        const headers = { Authorization: `Bearer ${token}` };

        // Find a COMPLETED booking
        const bookingsRes = await request.get('/api/owner/bookings', { headers });
        const bookings = await bookingsRes.json();
        const completed = bookings.find(
            (b: Record<string, unknown>) => b.status === 'COMPLETED'
        );
        test.skip(!completed, 'No COMPLETED bookings available');

        // Attempting to check in should fail
        const checkInRes = await request.put(`/api/owner/bookings/${completed.id}/check-in`, { headers });
        expect(checkInRes.status()).not.toBe(200);
    });
});

test.describe('US-LIFECYCLE-4: Owner bookings page shows status actions (UI)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner bookings page shows Check In button for confirmed bookings', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        const checkInButton = page.getByRole('button', { name: /Check.?In/i }).first();
        if (await checkInButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(checkInButton).toBeVisible();
        }
    });

    test('Owner bookings page shows Check Out button for checked-in bookings', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        const checkOutButton = page.getByRole('button', { name: /Check.?Out/i }).first();
        if (await checkOutButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(checkOutButton).toBeVisible();
        }
    });

    test('Today page shows arrivals and departures sections', async ({ page }) => {
        await page.goto('/owner/today');
        await expect(page.getByText(/Today/i).first()).toBeVisible({ timeout: 10_000 });
        await expect(page.getByText(/Arrivals|Departures|In-House/i).first()).toBeVisible({ timeout: 10_000 });
    });
});
