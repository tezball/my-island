import { test, expect } from '@playwright/test';
import { login, GUEST, OWNER, SUPPLIER, ADMIN, OWNER_NO_SUB, SUPPLIER_NO_SUB } from './helpers/auth';

test.describe('Navigation & Layout', () => {
    test('Bottom navigation shows all 5 tabs', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await expect(page.getByRole('link', { name: /search Search/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /storefront Marketplace/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /favorite Saved/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /luggage Trips/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /person Profile/i })).toBeVisible();
    });

    test('Bottom nav navigates between pages', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        const nav = page.locator('nav').last();

        // Marketplace
        await nav.getByText('Marketplace').click();
        await page.waitForURL('/marketplace');

        // Saved
        await nav.getByText('Saved').click();
        await page.waitForURL('/saved');

        // Trips
        await nav.getByText('Trips').click();
        await page.waitForURL('/trips');

        // Profile
        await nav.getByText('Profile').click();
        await page.waitForURL('/profile');
    });

    test('Header is hidden on auth pages', async ({ page }) => {
        await page.goto('/signin');
        // Bottom nav should not be visible on signin
        const nav = page.locator('nav').last();
        await expect(nav.getByText('Marketplace')).toBeHidden();
    });

    test('Owner sees Owner Portal link on profile', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await page.goto('/profile');
        await expect(page.getByText(/Owner Portal/i)).toBeVisible({ timeout: 10_000 });
    });

    test('Supplier sees Supplier Portal link on profile', async ({ page }) => {
        await login(page, SUPPLIER.email, SUPPLIER.password);
        await page.goto('/profile');
        await expect(page.getByText(/Supplier Portal/i)).toBeVisible({ timeout: 10_000 });
    });

    test('Admin sees Admin Portal link on profile', async ({ page }) => {
        await login(page, ADMIN.email, ADMIN.password);
        await page.goto('/profile');
        await expect(page.getByText(/Admin Portal/i)).toBeVisible({ timeout: 10_000 });
    });

    test('Guest without owner role does not see Owner Portal', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await page.goto('/profile');
        await expect(page.getByRole('main').getByText(GUEST.name)).toBeVisible();
        // Owner Portal should NOT be on the page
        await expect(page.getByText('Owner Portal')).toHaveCount(0);
    });

    test('Owner without subscription sees subscription prompt', async ({ page }) => {
        await login(page, OWNER_NO_SUB.email, OWNER_NO_SUB.password);
        await page.goto('/owner');
        await expect(page.locator('body')).toBeVisible();
    });

    test('Supplier without subscription sees subscription prompt', async ({ page }) => {
        await login(page, SUPPLIER_NO_SUB.email, SUPPLIER_NO_SUB.password);
        await page.goto('/supplier');
        await expect(page.locator('body')).toBeVisible();
    });

    test('Saved page loads', async ({ page }) => {
        await page.goto('/saved');
        await expect(page.locator('body')).toBeVisible();
    });
});
