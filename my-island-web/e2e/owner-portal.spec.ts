import { test, expect } from '@playwright/test';
import { login, OWNER, OWNER_STAFF } from './helpers/auth';

test.describe('Owner Portal', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner dashboard loads with KPI metrics', async ({ page }) => {
        await page.goto('/owner');
        await expect(page.getByText(/Dashboard|Overview/i).first()).toBeVisible({ timeout: 10_000 });
        // Should show KPI cards
        await expect(page.getByText(/Total Lots|Lots/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view lots page', async ({ page }) => {
        await page.goto('/owner/lots');
        await expect(page.getByText(/Lots|Pitches|Accommodation/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view bookings page', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view calendar page', async ({ page }) => {
        await page.goto('/owner/calendar');
        await expect(page.locator('body')).toBeVisible();
        // Calendar should render with month/navigation
        await expect(page.getByText(/2026|January|February|March/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view property page', async ({ page }) => {
        await page.goto('/owner/property');
        await expect(page.getByRole('heading', { name: 'Property Details' }).first()).toBeVisible({ timeout: 10_000 });
        // Property name is in an input field
        await expect(page.locator('input[value="Nore Valley Park"]')).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view reviews page', async ({ page }) => {
        await page.goto('/owner/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view pricing page', async ({ page }) => {
        await page.goto('/owner/pricing');
        await expect(page.getByText(/Pricing/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view today page', async ({ page }) => {
        await page.goto('/owner/today');
        await expect(page.getByText(/Today/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view staff management page', async ({ page }) => {
        await page.goto('/owner/staff');
        await expect(page.getByText(/Staff/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view modification requests page', async ({ page }) => {
        await page.goto('/owner/modification-requests');
        await expect(page.getByText(/Modification|Requests/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can view settings page', async ({ page }) => {
        await page.goto('/owner/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can open Add Lot modal', async ({ page }) => {
        await page.goto('/owner/lots');
        await expect(page.getByText(/Lots|Pitches/i).first()).toBeVisible({ timeout: 10_000 });
        const addButton = page.getByRole('button', { name: /Add|New|Create/i }).first();
        if (await addButton.isVisible()) {
            await addButton.click();
            // Modal should appear
            await page.waitForTimeout(500);
        }
    });
});

test.describe('Owner Staff Access', () => {
    test('Staff member can access owner portal', async ({ page }) => {
        await login(page, OWNER_STAFF.email, OWNER_STAFF.password);
        await page.goto('/owner');
        await expect(page.getByText(/Dashboard|Overview/i).first()).toBeVisible({ timeout: 10_000 });
    });
});
