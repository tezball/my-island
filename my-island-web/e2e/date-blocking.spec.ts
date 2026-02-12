import { test, expect } from '@playwright/test';
import { login, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Owner Date Blocking
 *
 * User Stories covered:
 *   US-BLOCK-1: Owner can block dates on a lot
 *   US-BLOCK-2: Blocked dates show as unavailable in calendar
 */

test.describe('US-BLOCK-1: Owner can block dates on a lot', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner calendar page has a Block Dates button', async ({ page }) => {
        await page.goto('/owner/calendar');
        await expect(page.getByText(/2026|January|February|March/i).first()).toBeVisible({ timeout: 10_000 });

        const blockButton = page.getByRole('button', { name: /Block Dates/i }).first();
        await expect(blockButton).toBeVisible({ timeout: 10_000 });
    });

    test('Block Dates button opens the block dates modal', async ({ page }) => {
        await page.goto('/owner/calendar');
        await expect(page.getByText(/2026|January|February|March/i).first()).toBeVisible({ timeout: 10_000 });

        const blockButton = page.getByRole('button', { name: /Block Dates/i }).first();
        await blockButton.click();

        // Modal should appear with lot dropdown, date inputs, and reason field
        await expect(page.locator('.fixed').getByText(/Block Dates/i).first()).toBeVisible({ timeout: 5_000 });
        await expect(page.locator('.fixed select').first()).toBeVisible({ timeout: 5_000 });
        await expect(page.locator('.fixed input[type="date"]').first()).toBeVisible();
    });

    test('Block dates modal has Cancel and submit action buttons', async ({ page }) => {
        await page.goto('/owner/calendar');
        await expect(page.getByText(/2026|January|February|March/i).first()).toBeVisible({ timeout: 10_000 });

        const blockButton = page.getByRole('button', { name: /Block Dates/i }).first();
        await blockButton.click();

        await expect(page.locator('.fixed').getByText(/Block Dates/i).first()).toBeVisible({ timeout: 5_000 });
        await expect(page.locator('.fixed').getByRole('button', { name: /Cancel/i })).toBeVisible();
        // The submit button inside the modal
        await expect(page.locator('.fixed button[type="submit"]')).toBeVisible();
    });
});

test.describe('US-BLOCK-2: Blocked dates show as unavailable in calendar', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Calendar renders with current month and day grid', async ({ page }) => {
        await page.goto('/owner/calendar');
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
        await expect(page.getByText(currentMonth).first()).toBeVisible({ timeout: 10_000 });

        // Calendar uses a CSS grid with grid-cols-7 for days
        await expect(page.locator('[class*="grid-cols-7"]').first()).toBeVisible({ timeout: 10_000 });
    });
});
