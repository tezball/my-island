import { test, expect } from '@playwright/test';
import { login, SUPPLIER, SUPPLIER_STAFF } from './helpers/auth';

test.describe('Supplier Portal', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, SUPPLIER.email, SUPPLIER.password);
    });

    test('Supplier dashboard loads with KPI metrics', async ({ page }) => {
        await page.goto('/supplier');
        await expect(page.getByText(/Dashboard|Overview/i).first()).toBeVisible({ timeout: 10_000 });
        // Should show offer/claim metrics
        await expect(page.getByText(/Offers|Claims/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view offers page', async ({ page }) => {
        await page.goto('/supplier/offers');
        await expect(page.getByText(/Offers/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view redeem page', async ({ page }) => {
        await page.goto('/supplier/redeem');
        await expect(page.getByText(/Redeem|Voucher/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view reviews page', async ({ page }) => {
        await page.goto('/supplier/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view profile page', async ({ page }) => {
        await page.goto('/supplier/profile');
        await expect(page.getByText(/Profile|Business/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view staff management page', async ({ page }) => {
        await page.goto('/supplier/staff');
        await expect(page.getByText(/Staff/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier can view settings page', async ({ page }) => {
        await page.goto('/supplier/settings');
        await expect(page.getByText(/Settings/i).first()).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('Supplier Staff Access', () => {
    test('Staff member can access supplier portal', async ({ page }) => {
        await login(page, SUPPLIER_STAFF.email, SUPPLIER_STAFF.password);
        await page.goto('/supplier');
        await expect(page.getByText(/Dashboard|Overview/i).first()).toBeVisible({ timeout: 10_000 });
    });
});
