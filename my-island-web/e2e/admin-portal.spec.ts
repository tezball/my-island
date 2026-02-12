import { test, expect } from '@playwright/test';
import { login, ADMIN } from './helpers/auth';

test.describe('Admin Portal', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, ADMIN.email, ADMIN.password);
    });

    test('Admin dashboard loads with KPI cards', async ({ page }) => {
        await page.goto('/admin');
        await expect(page.getByText(/Dashboard|Admin/i).first()).toBeVisible({ timeout: 10_000 });
        // Should show platform-wide metrics
        await expect(page.getByText(/Users|Bookings|Revenue/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view users page', async ({ page }) => {
        await page.goto('/admin/users');
        await expect(page.getByText(/Users/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view bookings page', async ({ page }) => {
        await page.goto('/admin/bookings');
        await expect(page.getByText(/Bookings/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view owners page', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.getByText(/Owners/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view suppliers page', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.getByText(/Suppliers/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view reviews page', async ({ page }) => {
        await page.goto('/admin/reviews');
        await expect(page.getByText(/Reviews/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view subscriptions page', async ({ page }) => {
        await page.goto('/admin/subscriptions');
        await expect(page.getByText(/Subscriptions/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view financial page', async ({ page }) => {
        await page.goto('/admin/financial');
        await expect(page.getByText(/Financial|Revenue/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view leads CRM page', async ({ page }) => {
        await page.goto('/admin/leads');
        await expect(page.getByText(/Leads/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Admin can view audit log page', async ({ page }) => {
        await page.goto('/admin/audit');
        await expect(page.getByText(/Audit/i).first()).toBeVisible({ timeout: 10_000 });
    });
});
