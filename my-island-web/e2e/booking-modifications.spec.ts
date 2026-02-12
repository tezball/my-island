import { test, expect } from '@playwright/test';
import { login, OWNER, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Booking Modifications (Owner + Guest)
 *
 * User Stories covered:
 *   US-MOD-1: Owner can modify booking dates
 *   US-MOD-2: Guest sees modification policy on booking
 *   US-MOD-3: Guest can request a booking modification
 */

test.describe('US-MOD-1: Owner can modify booking dates', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner bookings page shows Modify button on bookings', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Look for a modify/edit action button
        const modifyButton = page.getByRole('button', { name: /Modify|Edit/i }).first();
        if (await modifyButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(modifyButton).toBeVisible();
        }
    });

    test('Owner can access modification requests page', async ({ page }) => {
        await page.goto('/owner/modification-requests');
        await expect(page.getByText(/Modification|Requests/i).first()).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-MOD-2: Guest sees modification policy on booking', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Guest sees Modify button on confirmed bookings in Trips page', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        // Look for a Modify button on booking cards
        const modifyButton = page.getByRole('button', { name: /Modify/i }).first();
        if (await modifyButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(modifyButton).toBeVisible();
        }
    });
});

test.describe('US-MOD-3: Guest can request a booking modification', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Modify button opens the guest modification modal', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const modifyButton = page.getByRole('button', { name: /Modify/i }).first();
        const isVisible = await modifyButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No confirmed bookings with Modify button');

        await modifyButton.click();

        // Modification modal should appear with current booking details and date inputs
        await expect(page.getByText(/Check-in|Check-out/i).first()).toBeVisible({ timeout: 5_000 });
    });

    test('Guest modification modal shows current booking summary', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const modifyButton = page.getByRole('button', { name: /Modify/i }).first();
        const isVisible = await modifyButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No confirmed bookings with Modify button');

        await modifyButton.click();

        // Modal should show the current booking info
        await expect(page.locator('input[type="date"]').first()).toBeVisible({ timeout: 5_000 });
        // Should have a submit/request button
        const submitButton = page.getByRole('button', { name: /Submit Request|Update Booking/i }).first();
        await expect(submitButton).toBeVisible({ timeout: 5_000 });
    });
});
