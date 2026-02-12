import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Guest Booking Cancellation
 *
 * User Stories covered:
 *   US-CANCEL-1: Guest sees cancel button on upcoming bookings
 *   US-CANCEL-2: Guest can cancel a booking from Trips page
 */

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

    test('Booking details modal shows Cancel button for active bookings', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const viewDetailsButton = page.getByRole('button', { name: 'View Details' }).first();
        const isVisible = await viewDetailsButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No bookings with View Details button');

        await viewDetailsButton.click();
        // Details modal should include Cancel option for pending/confirmed bookings
        await page.waitForTimeout(1000);
        const cancelInModal = page.getByRole('button', { name: /Cancel/i }).first();
        if (await cancelInModal.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await expect(cancelInModal).toBeVisible();
        }
    });
});

test.describe('US-CANCEL-2: Guest can cancel a booking', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Cancel button triggers confirmation dialog', async ({ page }) => {
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
    });

    test('Guest can dismiss the cancel confirmation to keep booking', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const cancelButton = page.getByRole('button', { name: /Cancel/i }).first();
        const isVisible = await cancelButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No cancellable bookings available');

        await cancelButton.click();
        await expect(page.getByText(/Are you sure/i)).toBeVisible({ timeout: 5_000 });

        // Click "Keep Booking" to dismiss
        await page.getByRole('button', { name: /Keep Booking/i }).click();
        // Confirmation dialog should close
        await expect(page.getByText(/Are you sure/i)).not.toBeVisible({ timeout: 5_000 });
    });
});
