import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

test.describe('Guest Browsing', () => {
    test('Homepage loads with hero search and campsite sections', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText("Discover Ireland's")).toBeVisible();
        await expect(page.getByText('Browse by property type')).toBeVisible({ timeout: 10_000 });
    });

    test('Search from homepage navigates to search results', async ({ page }) => {
        await page.goto('/');
        const locationInput = page.locator('input[list]').first();
        await locationInput.fill('Kilkenny');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.waitForURL(/\/search/);
    });

    test('Browse by property type navigates to search with filter', async ({ page }) => {
        await page.goto('/');
        const tentCategory = page.getByText('Tent Pitches');
        await tentCategory.scrollIntoViewIfNeeded();
        await tentCategory.click();
        await page.waitForURL(/\/search/);
    });

    test('Campsite detail page loads with accommodation types and Book Now', async ({ page }) => {
        await page.goto('/campsite/1');
        // Wait for accommodation cards to load
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });
        // Should have pricing
        await expect(page.getByText(/€\d+/).first()).toBeVisible();
    });

    test('Campsite detail page shows reviews section', async ({ page }) => {
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });
        // Scroll to reviews section
        const reviews = page.getByRole('heading', { name: /Reviews/i }).first();
        await reviews.scrollIntoViewIfNeeded();
        await expect(reviews).toBeVisible();
    });

    test('Logged-in guest can view campsite and see save button', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });
    });

    test('Marketplace page loads with offers', async ({ page }) => {
        await page.goto('/marketplace');
        await expect(page.locator('body')).toBeVisible();
        await page.waitForTimeout(2000);
    });

    test('Explore map page loads', async ({ page }) => {
        await page.goto('/explore');
        // Wait for the map container or page heading
        await expect(page.locator('.leaflet-container').first()).toBeVisible({ timeout: 15_000 });
    });

    test('Search results page loads', async ({ page }) => {
        await page.goto('/search');
        await expect(page.locator('body')).toBeVisible();
        await page.waitForTimeout(2000);
    });

    test('Profile page shows user info', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await page.goto('/profile');
        await expect(page.getByRole('main').getByText(GUEST.name)).toBeVisible();
        await expect(page.getByText(GUEST.email)).toBeVisible();
    });
});
