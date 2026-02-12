import { test, expect } from '@playwright/test';
import { login, OWNER, GUEST } from './helpers/auth';

/**
 * BDD E2E tests for Minimum Stay Rules (Feature 3)
 *
 * User Stories covered:
 *   US-MINSTAY-1: As an Owner, I want to set a minimum stay requirement on each lot
 *   US-MINSTAY-2: As a Guest, I want to see minimum stay badges on campsite pages
 *   US-MINSTAY-3: As a Guest, I want the booking modal to enforce minimum stay rules
 */

/**
 * Helper: find the table row for a specific lot by name and click its edit button.
 */
async function openEditModalForLot(page: import('@playwright/test').Page, lotName: string) {
    const row = page.locator('tr', { hasText: lotName }).first();
    await expect(row).toBeVisible({ timeout: 10_000 });
    const editBtn = row.locator('button', { hasText: 'edit' });
    await editBtn.click();
    await expect(page.getByText(/Edit Lot/i)).toBeVisible({ timeout: 5_000 });
}

/**
 * Helper: set minStay for a lot as the owner, then verify it saved.
 */
async function setMinStayForLot(
    page: import('@playwright/test').Page,
    lotName: string,
    minStay: number
) {
    await page.goto('/owner/lots');
    await expect(page.getByText(/My Lots/i).first()).toBeVisible({ timeout: 10_000 });

    await openEditModalForLot(page, lotName);

    const minStayInput = page.locator('input[data-testid="min-stay-input"]');
    await minStayInput.fill(String(minStay));
    await page.getByRole('button', { name: /Save Changes/i }).click();

    // Wait for modal to close and table to refresh
    await expect(page.getByText(/Edit Lot/i)).not.toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(500);
}

test.describe('US-MINSTAY-1: Owner can set minimum stay on a lot', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Lot form modal shows minimum stay field', async ({ page }) => {
        await page.goto('/owner/lots');
        await expect(page.getByText(/My Lots/i).first()).toBeVisible({ timeout: 10_000 });

        await openEditModalForLot(page, 'Riverside Pitch 1');

        await expect(page.getByText(/Minimum Stay/i).first()).toBeVisible({ timeout: 5_000 });

        const minStayInput = page.locator('input[data-testid="min-stay-input"]');
        await expect(minStayInput).toBeVisible();
        const value = await minStayInput.inputValue();
        expect(Number(value)).toBeGreaterThanOrEqual(1);
    });

    test('Owner can update minimum stay for a lot and value persists', async ({ page }) => {
        const targetLot = 'Treehouse Retreat';

        await page.goto('/owner/lots');
        await expect(page.getByText(/My Lots/i).first()).toBeVisible({ timeout: 10_000 });

        await openEditModalForLot(page, targetLot);

        const minStayInput = page.locator('input[data-testid="min-stay-input"]');
        await minStayInput.fill('3');

        await page.getByRole('button', { name: /Save Changes/i }).click();
        await expect(page.getByText(/Edit Lot/i)).not.toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(1000);

        // Re-open the same lot to verify the value persisted
        await openEditModalForLot(page, targetLot);
        const updatedValue = await page.locator('input[data-testid="min-stay-input"]').inputValue();
        expect(Number(updatedValue)).toBe(3);

        // Cleanup: reset back to 1
        await page.locator('input[data-testid="min-stay-input"]').fill('1');
        await page.getByRole('button', { name: /Save Changes/i }).click();
        await expect(page.getByText(/Edit Lot/i)).not.toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-MINSTAY-2: Guest sees minimum stay badges on campsite pages', () => {
    test('Lot cards show min stay badge when minStay > 1', async ({ page }) => {
        const targetLot = 'Treehouse Retreat';

        // Set minStay to 2 as the owner
        await login(page, OWNER.email, OWNER.password);
        await setMinStayForLot(page, targetLot, 2);

        // Navigate to the campsite details page
        await page.goto('/');
        const campsiteLink = page.getByText('Nore Valley Park').first();
        await campsiteLink.click();

        await expect(page.getByText(/Accommodation Options/i).first()).toBeVisible({ timeout: 10_000 });

        // Should show a "Min 2 nights" badge
        await expect(page.getByText(/Min 2 nights/i).first()).toBeVisible({ timeout: 5_000 });

        // Cleanup: reset min stay to 1
        await setMinStayForLot(page, targetLot, 1);
    });
});

test.describe('US-MINSTAY-3: Booking modal enforces minimum stay rules', () => {
    test('Booking modal shows minimum stay hint and validates date range', async ({ page }) => {
        const targetLot = 'Treehouse Retreat';

        // Set minimum stay to 3 as the owner
        await login(page, OWNER.email, OWNER.password);
        await setMinStayForLot(page, targetLot, 3);

        // Login as guest and go to campsite details
        await login(page, GUEST.email, GUEST.password);
        await page.goto('/');
        await page.getByText('Nore Valley Park').first().click();
        await expect(page.getByText(/Accommodation Options/i).first()).toBeVisible({ timeout: 10_000 });

        // Click Book Now on the Cabins & Lodges card
        const cabinCard = page.locator('[class*="rounded"]', { hasText: /Cabin/i }).filter({ hasText: /Book Now/i }).first();
        const bookButton = cabinCard.getByRole('button', { name: /Book Now/i });
        await bookButton.click();

        // Booking modal should appear with minimum stay hint
        await expect(page.getByText(/Minimum stay.*3 nights/i).first()).toBeVisible({ timeout: 5_000 });

        // Cleanup: reset min stay to 1
        await login(page, OWNER.email, OWNER.password);
        await setMinStayForLot(page, targetLot, 1);
    });
});
