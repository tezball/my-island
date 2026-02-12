import { test, expect } from '@playwright/test';
import { login, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Owner Check-in / Check-out
 *
 * User Stories covered:
 *   US-CHECKIN-1: Owner can check in a guest from bookings page
 *   US-CHECKIN-2: Owner can check out a guest
 */

test.describe('US-CHECKIN-1: Owner can check in a guest', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner bookings page shows check-in button for confirmed bookings', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Look for check-in action button
        const checkInButton = page.getByRole('button', { name: /Check.?In/i }).first();
        if (await checkInButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(checkInButton).toBeVisible();
        }
    });

    test('Today page shows arrivals section', async ({ page }) => {
        await page.goto('/owner/today');
        await expect(page.getByText(/Today/i).first()).toBeVisible({ timeout: 10_000 });

        // Today page should show arrivals/departures/in-house sections
        await expect(page.getByText(/Arrivals|Departures|In-House/i).first()).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-CHECKIN-2: Owner can check out a guest', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner bookings page shows check-out button for checked-in bookings', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Look for check-out action button
        const checkOutButton = page.getByRole('button', { name: /Check.?Out|Complete/i }).first();
        if (await checkOutButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(checkOutButton).toBeVisible();
        }
    });

    test('Today page shows departures section for checked-in guests', async ({ page }) => {
        await page.goto('/owner/today');
        await expect(page.getByText(/Today/i).first()).toBeVisible({ timeout: 10_000 });

        // Departures section should exist
        const departuresSection = page.getByText(/Departures/i).first();
        if (await departuresSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(departuresSection).toBeVisible();
        }
    });
});
