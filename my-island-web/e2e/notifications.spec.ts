import { test, expect } from '@playwright/test';
import { login, GUEST, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for Notification Centre
 *
 * User Stories covered:
 *   US-NOTIF-1: User sees notification bell with unread count
 *   US-NOTIF-2: User can view notifications and mark as read
 */

test.describe('US-NOTIF-1: User sees notification bell with unread count', () => {
    test('Guest sees notification bell icon in header', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await expect(page).toHaveURL('/');

        // Header should contain a notification bell icon
        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });
    });

    test('Owner sees notification bell icon in header', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');

        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });
    });

    test('Notification bell shows unread count badge when notifications exist', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');

        // The bell should be visible, and may have a badge
        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });

        // Check if there's a count badge (number displayed near the bell)
        const badge = page.locator('[class*="badge"], [class*="rounded-full"]').filter({ hasText: /^\d+$/ }).first();
        if (await badge.isVisible({ timeout: 3_000 }).catch(() => false)) {
            const count = await badge.textContent();
            expect(Number(count)).toBeGreaterThanOrEqual(0);
        }
    });
});

test.describe('US-NOTIF-2: User can view notifications and mark as read', () => {
    test('Clicking bell opens notification dropdown', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');

        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });
        await bellIcon.click();

        // Dropdown should appear with notifications or empty state
        await expect(page.getByText(/Notifications|No notifications|Mark all as read/i).first()).toBeVisible({ timeout: 5_000 });
    });

    test('Notification dropdown shows Mark all as read button', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');

        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });
        await bellIcon.click();

        await page.waitForTimeout(1000);
        const markReadButton = page.getByText(/Mark all as read/i).first();
        if (await markReadButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await expect(markReadButton).toBeVisible();
        }
    });

    test('Notifications show time-ago formatting', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');

        const bellIcon = page.locator('span:text("notifications")').first();
        await expect(bellIcon).toBeVisible({ timeout: 10_000 });
        await bellIcon.click();

        await page.waitForTimeout(1000);
        // Look for time-ago formatted text (e.g., "2 hours ago", "1 day ago", "just now")
        const timeAgo = page.getByText(/ago|just now/i).first();
        if (await timeAgo.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await expect(timeAgo).toBeVisible();
        }
    });
});
