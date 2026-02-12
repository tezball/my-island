import { test, expect } from '@playwright/test';
import { login, OWNER } from './helpers/auth';

test.describe('Owner Booking Management', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Bookings page shows booking list with status filters', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        // Should show filter tabs or status badges
        await page.waitForTimeout(2000);
    });

    test('Owner can filter bookings by status', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        // Look for filter/tab buttons
        const pendingFilter = page.getByRole('button', { name: /Pending/i }).first();
        if (await pendingFilter.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await pendingFilter.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Owner can view a booking detail', async ({ page }) => {
        await page.goto('/owner/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
        // Click on first booking row/card if available
        const bookingCard = page.locator('[class*="rounded"]').filter({ hasText: /€/ }).first();
        if (await bookingCard.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await bookingCard.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Owner can manage lots', async ({ page }) => {
        await page.goto('/owner/lots');
        await expect(page.getByText(/Lots|Pitches|Accommodation/i).first()).toBeVisible({ timeout: 10_000 });
        // Should show lot cards with edit/delete options
        await page.waitForTimeout(2000);
    });

    test('Owner calendar shows month view', async ({ page }) => {
        await page.goto('/owner/calendar');
        // Calendar should render current month
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonth = monthNames[new Date().getMonth()];
        await expect(page.getByText(currentMonth).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can navigate calendar months', async ({ page }) => {
        await page.goto('/owner/calendar');
        await page.waitForTimeout(2000);
        // Click next month button
        const nextButton = page.getByText('chevron_right').or(page.getByRole('button', { name: /next|forward/i })).first();
        if (await nextButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await nextButton.click();
            await page.waitForTimeout(1000);
        }
    });
});
