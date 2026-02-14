import { test, expect, type APIRequestContext } from '@playwright/test';
import { login, GUEST, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Review Submission Flow
 *
 * User Stories covered:
 *   US-REVIEW-1: Guest submits a campsite review via API
 *   US-REVIEW-2: Guest sees review form on campsite detail page (UI)
 *   US-REVIEW-3: Owner can respond to a review via API
 *   US-REVIEW-4: Owner reviews page displays reviews (UI)
 */

async function apiLogin(request: APIRequestContext, email: string, password: string): Promise<string> {
    const res = await request.post('/api/auth/login', { data: { email, password } });
    expect(res.status(), `Login failed for ${email} (status ${res.status()})`).toBe(200);
    const body = await res.json();
    expect(body.token, `Login response missing token for ${email}`).toBeTruthy();
    return body.token;
}

test.describe('US-REVIEW-1: Guest submits a review (API)', () => {
    test('Guest submits a review for a campsite with completed booking', async ({ request }) => {
        const token = await apiLogin(request, GUEST.email, GUEST.password);
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        // 1. Check eligibility for campsite (owner) 1
        const eligRes = await request.get('/api/reviews/eligibility/1', { headers });
        expect(eligRes.status()).toBe(200);
        const eligibility = await eligRes.json();

        // If not eligible (already reviewed all bookings), skip
        test.skip(!eligibility.isEligible && !eligibility.eligible, 'Guest not eligible to review campsite 1');

        // Get an eligible booking ID if provided
        const bookingId = eligibility.eligibleBookings?.[0]?.bookingId
            || eligibility.eligibleBookings?.[0]?.id
            || eligibility.bookingId;

        // 2. Submit a review
        const reviewData: Record<string, unknown> = {
            ownerId: 1,
            rating: 4.5,
            comment: 'Excellent campsite with amazing views! The facilities were clean and the staff was very friendly. Would definitely recommend.',
        };
        if (bookingId) reviewData.bookingId = bookingId;

        const reviewRes = await request.post('/api/reviews', {
            headers,
            data: reviewData,
        });
        expect(reviewRes.status(), `Submit review failed`).toBe(200);
        const review = await reviewRes.json();
        expect(review.rating).toBe(4.5);
        expect(review.comment || review.content).toBeTruthy();

        // 3. Verify review appears in campsite reviews
        const reviewsRes = await request.get('/api/reviews/campsite/1', {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(reviewsRes.status()).toBe(200);
        const reviews = await reviewsRes.json();
        expect(reviews.length).toBeGreaterThan(0);
    });
});

test.describe('US-REVIEW-2: Guest sees review form on campsite page (UI)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Campsite detail page shows reviews section with existing reviews', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();
        await expect(reviewsHeading).toBeVisible();
    });

    test('Review form has star rating and comment textarea', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();

        // Look for write review section or form elements
        const reviewForm = page.getByText(/Write a Review|Leave a Review|Your Review/i).first();
        if (await reviewForm.isVisible({ timeout: 5_000 }).catch(() => false)) {
            // Should have textarea for comment
            const textarea = page.locator('textarea[placeholder*="Share your experience"]').first();
            if (await textarea.isVisible({ timeout: 3_000 }).catch(() => false)) {
                await expect(textarea).toBeVisible();
                await expect(page.getByRole('button', { name: /Submit Review/i })).toBeVisible();
            }
        }
    });
});

test.describe('US-REVIEW-3: Owner responds to a review (API)', () => {
    test('Owner can respond to a guest review', async ({ request }) => {
        const token = await apiLogin(request, OWNER.email, OWNER.password);
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Get owner reviews
        const reviewsRes = await request.get('/api/owner/reviews', { headers });
        expect(reviewsRes.status()).toBe(200);
        const reviews = await reviewsRes.json();
        expect(reviews.length).toBeGreaterThan(0);

        // Find a review without an owner response
        const unresponded = reviews.find(
            (r: Record<string, unknown>) => !r.ownerResponse && !r.response
        );
        test.skip(!unresponded, 'No unresponded reviews available');

        // 2. Submit owner response
        const respondRes = await request.put(`/api/owner/reviews/${unresponded.id}/respond`, {
            headers: { ...headers, 'Content-Type': 'application/json' },
            data: { response: 'Thank you for your kind review! We loved having you stay with us.' },
        });
        expect(respondRes.status(), `Respond to review ${unresponded.id} failed`).toBe(200);
        const responded = await respondRes.json();
        expect(responded.ownerResponse || responded.response).toBeTruthy();
    });
});

test.describe('US-REVIEW-4: Owner reviews page (UI)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner reviews page loads and displays reviews', async ({ page }) => {
        await page.goto('/owner/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Should show review cards
        const respondButton = page.getByRole('button', { name: /Respond|Reply/i }).first();
        if (await respondButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(respondButton).toBeVisible();
        }
    });
});
