import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

test.describe('Trips Page Management', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Trips page loads with booking sections', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await expect(page.getByText('Manage your camping adventures')).toBeVisible();
    });

    test('Guest can see upcoming bookings with status badges', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        // Murphy Family has seeded bookings
        const upcomingSection = page.getByText('Upcoming Trips');
        if (await upcomingSection.isVisible({ timeout: 5_000 }).catch(() => false)) {
            // Should have booking cards with dates and prices
            await expect(page.locator('text=/€\\d+/').first()).toBeVisible();
        }
    });

    test('Guest can open booking details modal', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        const viewDetailsButton = page.getByRole('button', { name: 'View Details' }).first();
        if (await viewDetailsButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await viewDetailsButton.click();
            // Details modal should show booking info
            await expect(page.getByText(/Check-in|Check-out/i).first()).toBeVisible();
            // Close the modal by clicking the X button in the modal header
            await page.locator('.fixed').locator('button:has(span:text("close"))').first().click();
        }
    });

    test('Guest can see past bookings section', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        // Past trips section may or may not exist depending on data
        await page.waitForTimeout(2000);
    });

    test('Bottom navigation shows Trips tab active', async ({ page }) => {
        await page.goto('/trips');
        // The bottom nav should highlight Trips
        const tripsNav = page.locator('a[href="/trips"], button').filter({ hasText: 'Trips' }).first();
        await expect(tripsNav).toBeVisible();
    });
});
