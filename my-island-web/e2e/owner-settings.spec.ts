import { test, expect } from '@playwright/test';
import { login, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Owner Preferences/Settings
 *
 * User Stories covered:
 *   US-SETTINGS-1: Owner can update notification preferences
 *   US-SETTINGS-2: Owner can configure modification policy
 */

test.describe('US-SETTINGS-1: Owner can update notification preferences', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Settings page loads with notification preferences section', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Should show notification toggle section
        await expect(page.getByText(/Notification/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Settings page has toggle switches for preferences', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Toggles are custom buttons with rounded-full class (not native checkboxes)
        const toggles = page.locator('button.relative.inline-flex');
        await expect(toggles.first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can see email notification toggle for new bookings', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Find the notification toggle by its label text
        await expect(page.getByText(/Email notifications for new bookings/i)).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-SETTINGS-2: Owner can configure modification policy', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Settings page has Guest Modifications section', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Should show modification policy section
        await expect(page.getByText(/Guest Modification|Allow guests to modify/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Modification policy has toggle for allowing guest modifications', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Find the modification toggle by its label text
        await expect(page.getByText(/Allow guests to modify their bookings/i)).toBeVisible({ timeout: 10_000 });
    });

    test('Settings page has booking preferences section', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });

        // Booking preferences: instant booking, same-day bookings, guest verification
        await expect(page.getByText(/Instant booking/i).first()).toBeVisible({ timeout: 10_000 });
    });
});
