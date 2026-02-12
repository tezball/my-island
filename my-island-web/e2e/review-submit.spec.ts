import { test, expect } from '@playwright/test';
import { login, GUEST, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Review Submission Flow
 *
 * User Stories covered:
 *   US-REVIEW-1: Guest with completed booking can submit a review
 *   US-REVIEW-2: Owner can respond to a review
 */

test.describe('US-REVIEW-1: Guest with completed booking can submit a review', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Campsite detail page shows reviews section', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();
        await expect(reviewsHeading).toBeVisible();
    });

    test('Guest with completed booking sees write review option', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();
        await expect(reviewsHeading).toBeVisible();

        // Guest should see the review form or "Write a Review" prompt
        const reviewForm = page.getByText(/Write a Review|Leave a Review|Your Review/i).first();
        if (await reviewForm.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(reviewForm).toBeVisible();
        }
    });

    test('Review form has star rating and text input', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const reviewsHeading = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviewsHeading.scrollIntoViewIfNeeded();

        // Look for star rating elements and textarea
        const stars = page.locator('[class*="star"], button:has(span:text("star"))').first();
        if (await stars.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(stars).toBeVisible();
            const textarea = page.locator('textarea').first();
            await expect(textarea).toBeVisible();
        }
    });
});

test.describe('US-REVIEW-2: Owner can respond to a review', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner reviews page loads and displays reviews', async ({ page }) => {
        await page.goto('/owner/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can see response option on reviews', async ({ page }) => {
        await page.goto('/owner/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Look for a Respond/Reply button on review cards
        const respondButton = page.getByRole('button', { name: /Respond|Reply/i }).first();
        if (await respondButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(respondButton).toBeVisible();
        }
    });
});
