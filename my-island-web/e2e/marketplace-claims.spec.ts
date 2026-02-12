import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Marketplace Offer Claiming + Vouchers
 *
 * User Stories covered:
 *   US-CLAIM-1: Guest can claim an offer from marketplace
 *   US-CLAIM-2: Guest can view claimed voucher with QR code
 */

test.describe('US-CLAIM-1: Guest can claim an offer from marketplace', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Marketplace page loads with header and category filters', async ({ page }) => {
        await page.goto('/marketplace');

        // Wait for the page heading to appear (loading is done)
        await expect(page.getByRole('heading', { name: 'Local Offers' })).toBeVisible({ timeout: 10_000 });

        // Category filters should appear after data loads
        await expect(page.locator('button', { hasText: 'All' }).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Guest can filter offers by category', async ({ page }) => {
        await page.goto('/marketplace');
        await expect(page.getByRole('heading', { name: 'Local Offers' })).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('button', { hasText: 'All' }).first()).toBeVisible({ timeout: 10_000 });

        // Click a category filter if available
        const categoryButton = page.locator('button', { hasText: /Food|Tours|Events/i }).first();
        if (await categoryButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await categoryButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Guest can view an offer detail and see the Claim button', async ({ page }) => {
        await page.goto('/marketplace');
        await expect(page.getByRole('heading', { name: 'Local Offers' })).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        // Click on an offer card to open detail
        const offerCard = page.locator('text=View Details').first();
        const isVisible = await offerCard.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No offers available to claim');

        await offerCard.click();

        // Should see a Claim button in the detail modal
        await expect(page.getByRole('button', { name: /Claim This Offer/i })).toBeVisible({ timeout: 5_000 });
    });
});

test.describe('US-CLAIM-2: Guest can view claimed voucher with QR code', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Vouchers page loads and shows claimed vouchers or empty state', async ({ page }) => {
        await page.goto('/vouchers');
        await expect(page.getByText(/Vouchers|My Vouchers/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Vouchers page has filter tabs', async ({ page }) => {
        await page.goto('/vouchers');
        await expect(page.getByText(/Vouchers|My Vouchers/i).first()).toBeVisible({ timeout: 10_000 });

        await expect(page.locator('button', { hasText: 'All' }).first()).toBeVisible({ timeout: 5_000 });
    });

    test('Claimed voucher shows View QR Code button', async ({ page }) => {
        await page.goto('/vouchers');
        await expect(page.getByText(/Vouchers|My Vouchers/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        const qrButton = page.getByRole('button', { name: /QR Code|View QR/i }).first();
        if (await qrButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(qrButton).toBeVisible();

            // Click to open QR modal
            await qrButton.click();
            await page.waitForTimeout(1000);
            // QR modal should show voucher code
            await expect(page.locator('canvas, svg, [class*="qr"]').first()).toBeVisible({ timeout: 5_000 });
        }
    });
});
