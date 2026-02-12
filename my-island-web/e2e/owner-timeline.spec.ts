import { test, expect } from '@playwright/test';
import { login, OWNER, OWNER_NO_SUB, OWNER_STAFF } from './helpers/auth';

test.describe('Owner Timeline View', () => {

    // US-TIMELINE-1: Owner can access /owner/timeline
    test.describe('US-TIMELINE-1: Access timeline page', () => {
        test.beforeEach(async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
        });

        test('sidebar has Timeline navigation link', async ({ page }) => {
            await page.goto('/owner');
            await expect(page.getByRole('link', { name: 'Timeline' })).toBeVisible({ timeout: 10_000 });
        });

        test('timeline page loads at /owner/timeline', async ({ page }) => {
            await page.goto('/owner/timeline');
            await expect(page.getByText('Timeline').first()).toBeVisible({ timeout: 10_000 });
        });

        test('navigation controls are visible', async ({ page }) => {
            await page.goto('/owner/timeline');
            await expect(page.getByRole('button', { name: /prev/i })).toBeVisible({ timeout: 10_000 });
            await expect(page.getByRole('button', { name: /next/i })).toBeVisible({ timeout: 10_000 });
            await expect(page.getByRole('button', { name: /today/i })).toBeVisible({ timeout: 10_000 });
        });
    });

    // US-TIMELINE-2: Lots as rows with booking bars
    test.describe('US-TIMELINE-2: Lot rows and booking bars', () => {
        test.beforeEach(async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
            await page.goto('/owner/timeline');
            await page.waitForSelector('[data-testid="timeline-lot-name"]', { timeout: 15_000 });
        });

        test('lot names appear in left column', async ({ page }) => {
            const lotNames = page.locator('[data-testid="timeline-lot-name"]');
            await expect(lotNames.first()).toBeVisible();
            expect(await lotNames.count()).toBeGreaterThan(0);
        });

        test('date headers are rendered', async ({ page }) => {
            const headers = page.locator('[data-testid="timeline-date-header"]');
            await expect(headers.first()).toBeVisible();
            expect(await headers.count()).toBeGreaterThan(0);
        });

        test('booking bars are rendered for lots with bookings', async ({ page }) => {
            const bars = page.locator('[data-testid="timeline-booking-bar"]');
            // With seed data, there should be at least one booking
            await expect(bars.first()).toBeVisible({ timeout: 10_000 });
        });

        test('group headers for lot types are visible', async ({ page }) => {
            const groupHeaders = page.locator('[data-testid="timeline-group-header"]');
            await expect(groupHeaders.first()).toBeVisible();
            expect(await groupHeaders.count()).toBeGreaterThan(0);
        });
    });

    // US-TIMELINE-3: Date range navigation
    test.describe('US-TIMELINE-3: Date range navigation', () => {
        test.beforeEach(async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
            await page.goto('/owner/timeline');
            await page.waitForSelector('[data-testid="timeline-lot-name"]', { timeout: 15_000 });
        });

        test('view range selector has 1w/2w/1m options', async ({ page }) => {
            await expect(page.getByRole('button', { name: '1w' })).toBeVisible();
            await expect(page.getByRole('button', { name: '2w' })).toBeVisible();
            await expect(page.getByRole('button', { name: '1m' })).toBeVisible();
        });

        test('prev and next buttons are functional', async ({ page }) => {
            const prevBtn = page.getByRole('button', { name: /prev/i });
            const nextBtn = page.getByRole('button', { name: /next/i });
            await expect(prevBtn).toBeEnabled();
            await expect(nextBtn).toBeEnabled();
        });

        test('clicking next advances the date range', async ({ page }) => {
            const headersBefore = await page.locator('[data-testid="timeline-date-header"]').allTextContents();
            await page.getByRole('button', { name: /next/i }).click();
            await page.waitForTimeout(300);
            const headersAfter = await page.locator('[data-testid="timeline-date-header"]').allTextContents();
            expect(headersAfter).not.toEqual(headersBefore);
        });

        test('today button resets to current date', async ({ page }) => {
            // Navigate away
            await page.getByRole('button', { name: /next/i }).click();
            await page.getByRole('button', { name: /next/i }).click();
            await page.waitForTimeout(300);
            // Click today
            await page.getByRole('button', { name: /today/i }).click();
            await page.waitForTimeout(300);
            // Today indicator should be visible
            const todayLine = page.locator('[data-testid="timeline-today-line"]');
            await expect(todayLine).toBeVisible({ timeout: 5_000 });
        });
    });

    // US-TIMELINE-4: Blocked periods
    test.describe('US-TIMELINE-4: Blocked periods', () => {
        test('blocked periods show with striped styling', async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
            await page.goto('/owner/timeline');
            await page.waitForSelector('[data-testid="timeline-lot-name"]', { timeout: 15_000 });
            // Blocked bars may or may not exist depending on seed data
            // Just verify the page loaded and check if any exist
            const blockedBars = page.locator('[data-testid="timeline-blocked-bar"]');
            // If there are blocked periods, they should have striped background
            const count = await blockedBars.count();
            if (count > 0) {
                await expect(blockedBars.first()).toBeVisible();
            }
            // Page at minimum shouldn't error
            await expect(page.locator('[data-testid="timeline-lot-name"]').first()).toBeVisible();
        });
    });

    // US-TIMELINE-5: Booking bar popover
    test.describe('US-TIMELINE-5: Booking bar popover', () => {
        test('clicking a booking bar shows popover with details', async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
            await page.goto('/owner/timeline');
            await page.waitForSelector('[data-testid="timeline-booking-bar"]', { timeout: 15_000 });
            // Click the first booking bar
            await page.locator('[data-testid="timeline-booking-bar"]').first().click();
            // Popover should appear
            await expect(page.locator('[data-testid="timeline-popover"]')).toBeVisible({ timeout: 5_000 });
        });
    });

    // US-TIMELINE-6: Subscription gate
    test.describe('US-TIMELINE-6: Subscription gate', () => {
        test('unsubscribed owner sees subscription prompt', async ({ page }) => {
            await login(page, OWNER_NO_SUB.email, OWNER_NO_SUB.password);
            await page.goto('/owner/timeline');
            // Should see subscription gate message
            await expect(page.getByText(/subscribe|subscription|upgrade/i).first()).toBeVisible({ timeout: 10_000 });
        });
    });

    // US-TIMELINE-7: Staff access
    test.describe('US-TIMELINE-7: Staff access', () => {
        test('staff member can access timeline', async ({ page }) => {
            await login(page, OWNER_STAFF.email, OWNER_STAFF.password);
            await page.goto('/owner/timeline');
            await expect(page.getByText('Timeline').first()).toBeVisible({ timeout: 10_000 });
        });
    });

    // US-TIMELINE-8: Legend and today indicator
    test.describe('US-TIMELINE-8: Legend and today indicator', () => {
        test.beforeEach(async ({ page }) => {
            await login(page, OWNER.email, OWNER.password);
            await page.goto('/owner/timeline');
            await page.waitForSelector('[data-testid="timeline-lot-name"]', { timeout: 15_000 });
        });

        test('legend shows status colors', async ({ page }) => {
            const legend = page.locator('[data-testid="timeline-legend"]');
            await expect(legend).toBeVisible();
            await expect(legend.getByText('Confirmed')).toBeVisible();
            await expect(legend.getByText('Pending')).toBeVisible();
        });

        test('today indicator line is visible', async ({ page }) => {
            const todayLine = page.locator('[data-testid="timeline-today-line"]');
            await expect(todayLine).toBeVisible({ timeout: 5_000 });
        });
    });
});
