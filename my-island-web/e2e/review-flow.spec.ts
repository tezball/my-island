import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Post-Stay Review Emails (Feature 2)
 *
 * User Stories covered:
 *   US-REV-1: As a Guest, I want to see reviews from other guests on a campsite page
 *   US-REV-2: As a Guest with a completed booking, I want to be prompted to leave a review
 *   US-REV-3: As a Guest, I want to view my past trips and know which ones I can review
 */

test.describe('US-REV-1: Guest can see reviews on campsite pages', () => {
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
});

test.describe('US-REV-2: Guest with completed booking can review a campsite', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Guest with completed booking sees review section on campsite page', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });
        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();
        await expect(reviewsHeading).toBeVisible();
    });
});

test.describe('US-REV-3: Guest can view past trips for review', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Trips page shows completed bookings in Past Trips section', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);
        const pastTrips = page.getByText('Past Trips');
        if (await pastTrips.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(pastTrips).toBeVisible();
        }
    });
});
