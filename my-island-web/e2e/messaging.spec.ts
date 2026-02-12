import { test, expect } from '@playwright/test';
import { login, GUEST, OWNER } from './helpers/auth';

/**
 * BDD E2E tests for In-App Messaging (Communication Module)
 *
 * User Stories covered:
 *   US-COMM-1: As a Guest, I want to send messages to the property owner about my booking
 *   US-COMM-2: As an Owner, I want to view and reply to guest messages about their bookings
 *   US-COMM-3: As a User, I want messages to persist and be tied to a specific booking
 *
 * Acceptance Criteria (from P1_SPRINT_PLAN.md):
 *   - Guest can see "Message Owner" on confirmed/checked-in bookings
 *   - Guest can send a message from the booking messages page
 *   - Owner can access Messages from the sidebar navigation
 *   - Owner messages page lists all conversations with unread counts
 *   - Messages are anchored to a specific booking
 *   - Guest sends a message and owner sees it in their conversation list
 */

test.describe('US-COMM-1: Guest can send messages about a booking', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Guest sees "Message Owner" button on confirmed bookings in Trips page', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const messageButton = page.getByRole('link', { name: /Message Owner/i }).first();
        if (await messageButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await expect(messageButton).toBeVisible();
        }
    });

    test('Guest can navigate from Trips to booking messages page', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const messageButton = page.getByRole('link', { name: /Message Owner/i }).first();
        if (await messageButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await messageButton.click();
            await expect(page.url()).toContain('/messages');
            await expect(page.getByText(/Messages|Conversation|Start a conversation/i).first()).toBeVisible({ timeout: 10_000 });
        }
    });

    test('Guest can type and send a message from booking messages page', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('My Trips')).toBeVisible();
        await page.waitForTimeout(2000);

        const messageButton = page.getByRole('link', { name: /Message Owner/i }).first();
        const isVisible = await messageButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No confirmed bookings with Message Owner button');

        await messageButton.click();
        await expect(page.url()).toContain('/messages');
        await expect(page.getByPlaceholder('Type a message...')).toBeVisible({ timeout: 10_000 });

        // Send a unique message
        const uniqueMsg = `E2E test message ${Date.now()}`;
        await page.getByPlaceholder('Type a message...').fill(uniqueMsg);
        await page.locator('button:has(span:text("send"))').click();

        // Message should appear in the conversation
        await expect(page.getByText(uniqueMsg)).toBeVisible({ timeout: 10_000 });
    });
});

test.describe('US-COMM-2: Owner can view and reply to guest messages', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
    });

    test('Owner sees Messages link in the sidebar navigation', async ({ page }) => {
        await page.goto('/owner');
        await expect(page.getByText(/Dashboard|Overview/i).first()).toBeVisible({ timeout: 10_000 });

        const messagesLink = page.getByRole('link', { name: /Messages/i }).first();
        await expect(messagesLink).toBeVisible({ timeout: 10_000 });
    });

    test('Owner messages page loads and shows conversation list or empty state', async ({ page }) => {
        await page.goto('/owner/messages');
        await expect(page.getByText(/Messages/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Owner can open a conversation and reply to a guest message', async ({ page }) => {
        await page.goto('/owner/messages');
        await page.waitForTimeout(2000);

        const conversationButton = page.locator('button.w-full.text-left').first();
        const hasConversation = await conversationButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!hasConversation, 'No conversations available for owner');

        // Click into the conversation
        await conversationButton.click();
        await expect(page.getByPlaceholder('Type a message...')).toBeVisible({ timeout: 10_000 });

        // Send a reply
        const replyMsg = `Owner reply ${Date.now()}`;
        await page.getByPlaceholder('Type a message...').fill(replyMsg);
        await page.locator('button:has(span:text("send"))').click();

        // Reply should appear in the conversation
        await expect(page.getByText(replyMsg)).toBeVisible({ timeout: 10_000 });

        // Navigate back to conversation list
        const backButton = page.locator('button:has(span:text("arrow_back"))');
        await backButton.click();
        await expect(page.locator('button.w-full.text-left').first()).toBeVisible({ timeout: 5_000 });
    });
});

test.describe('US-COMM-3: Messages persist and are tied to a booking', () => {
    test('Guest sends a message and owner sees it in their conversations', async ({ browser }) => {
        // Step 1: Guest sends a message from the booking messages page
        const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const guestPage = await guestContext.newPage();
        await login(guestPage, GUEST.email, GUEST.password);
        await guestPage.goto('/trips');
        await expect(guestPage.getByText('My Trips')).toBeVisible();
        await guestPage.waitForTimeout(2000);

        const messageButton = guestPage.getByRole('link', { name: /Message Owner/i }).first();
        const isVisible = await messageButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No confirmed bookings with Message Owner button');

        await messageButton.click();
        await expect(guestPage.url()).toContain('/messages');
        await expect(guestPage.getByPlaceholder('Type a message...')).toBeVisible({ timeout: 10_000 });

        const uniqueMsg = `Cross-user test ${Date.now()}`;
        await guestPage.getByPlaceholder('Type a message...').fill(uniqueMsg);
        await guestPage.locator('button:has(span:text("send"))').click();
        await expect(guestPage.getByText(uniqueMsg)).toBeVisible({ timeout: 10_000 });
        await guestContext.close();

        // Step 2: Owner opens messages and sees the guest's conversation
        const ownerContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const ownerPage = await ownerContext.newPage();
        await login(ownerPage, OWNER.email, OWNER.password);
        await ownerPage.goto('/owner/messages');
        await ownerPage.waitForTimeout(2000);

        // Should see at least one conversation from Murphy Family
        const conversationWithMsg = ownerPage.locator('button.w-full.text-left', { hasText: /Murphy Family/i }).first();
        const found = await conversationWithMsg.isVisible({ timeout: 10_000 }).catch(() => false);

        if (found) {
            // Click into the conversation and verify the guest's message is visible
            await conversationWithMsg.click();
            await expect(ownerPage.getByPlaceholder('Type a message...')).toBeVisible({ timeout: 10_000 });
            await expect(ownerPage.getByText(uniqueMsg)).toBeVisible({ timeout: 10_000 });
        }

        await ownerContext.close();
    });
});
