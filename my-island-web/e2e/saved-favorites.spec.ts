import { test, expect } from '@playwright/test';
import { login, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Persisted Saved/Favorites (Feature 4)
 *
 * User Stories covered:
 *   US-FAV-1: As a Guest, I want to save lots I'm interested in via a heart icon
 *   US-FAV-2: As a Guest, I want to view all my saved lots on a dedicated Saved page
 *   US-FAV-3: As a Guest, I want my saved lots to persist across login sessions (server-side)
 *   US-FAV-4: As a Guest, I want to remove a lot from my saved list
 */

test.describe('US-FAV-1: Guest can save a lot via heart icon', () => {
    test('Guest can save a lot from campsite detail page via heart icon', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);

        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const heartButton = page.locator('button[title="Save for later"]').first();
        await expect(heartButton).toBeVisible();

        await heartButton.click();

        // Heart should now show as saved (red filled heart)
        const savedButton = page.locator('button[title="Remove from saved"]').first();
        await expect(savedButton).toBeVisible();
    });
});

test.describe('US-FAV-2: Guest can view saved lots on Saved page', () => {
    test('Saved lots appear on the Saved page', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);

        // Ensure at least one lot is saved
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const alreadySaved = await page.locator('button[title="Remove from saved"]').first().isVisible().catch(() => false);
        if (!alreadySaved) {
            const heartButton = page.locator('button[title="Save for later"]').first();
            await heartButton.click();
            await expect(page.locator('button[title="Remove from saved"]').first()).toBeVisible();
        }

        // Navigate to the Saved page
        await page.goto('/saved');
        await expect(page.getByRole('heading', { name: 'Saved' })).toBeVisible({ timeout: 10_000 });

        // Should show at least one saved place
        await expect(page.getByText(/\d+ saved place/)).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-FAV-3: Saved lots persist across sessions', () => {
    test('Saved lots persist after logout and login (server-side persistence)', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);

        // Save a lot
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        const alreadySaved = await page.locator('button[title="Remove from saved"]').first().isVisible().catch(() => false);
        if (!alreadySaved) {
            await page.locator('button[title="Save for later"]').first().click();
            await expect(page.locator('button[title="Remove from saved"]').first()).toBeVisible();
        }

        // Logout
        await page.evaluate(() => localStorage.clear());
        await page.goto('/signin');
        await page.waitForURL('/signin');

        // Login again
        await login(page, GUEST.email, GUEST.password);

        // Navigate back — lot should still be saved
        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });
        await expect(page.locator('button[title="Remove from saved"]').first()).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-FAV-4: Guest can remove a saved lot', () => {
    test('Guest can unsave a lot by clicking the heart icon again', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);

        await page.goto('/campsite/1');
        await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

        // Save first if not already saved
        const alreadySaved = await page.locator('button[title="Remove from saved"]').first().isVisible().catch(() => false);
        if (!alreadySaved) {
            const heartButton = page.locator('button[title="Save for later"]').first();
            await heartButton.click();
            await expect(page.locator('button[title="Remove from saved"]').first()).toBeVisible();
        }

        // Unsave it
        const savedButton = page.locator('button[title="Remove from saved"]').first();
        await savedButton.click();

        // Heart should revert to unsaved state
        await expect(page.locator('button[title="Save for later"]').first()).toBeVisible();
    });
});
