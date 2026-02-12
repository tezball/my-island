import { test, expect } from '@playwright/test';
import { login, GUEST, fillStripeCard } from './helpers/auth';

test('Guest can login, book a lot, and see booking on Trips page', async ({ page }) => {
    // Step 1: Login as the guest user
    await login(page, GUEST.email, GUEST.password);
    await expect(page).toHaveURL('/');

    // Step 2: Navigate to a campsite (Nore Valley Park, owner ID 1)
    await page.goto('/campsite/1');

    // Wait for the campsite page to fully load — accommodation cards should appear
    await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible({ timeout: 15_000 });

    // Step 3: Click Book Now on the first available accommodation type
    await page.getByRole('button', { name: 'Book Now' }).first().click();

    // Wait for the BookingModal to appear
    await expect(page.getByText('Book Your Stay')).toBeVisible();

    // Step 4: Select dates in the AvailabilityCalendar
    // Navigate to next month to ensure all dates are in the future
    await page.getByText('chevron_right').click();

    // Find available (non-disabled) date buttons in the calendar grid
    const calendarGrid = page.locator('.grid-cols-7').last();
    const availableDays = calendarGrid.locator('button:not([disabled])');

    // Click the first available day for check-in
    await availableDays.first().click();
    await expect(page.getByText('Now tap a date for check-out')).toBeVisible();

    // Click a later day for check-out (2+ night stay)
    const dayCount = await availableDays.count();
    const checkOutIndex = Math.min(3, dayCount - 1);
    await availableDays.nth(checkOutIndex).click();
    await expect(page.getByText('Tap any date to start over')).toBeVisible();

    // Step 5: Submit the booking form
    const continueButton = page.getByRole('button', { name: 'Continue to Payment' });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    // Wait for the payment step
    await expect(page.getByText('Secure Payment')).toBeVisible({ timeout: 15_000 });

    // Step 6: Handle payment — dev mode OR Stripe test card
    const isDevMode = await page.getByText('Development Mode').isVisible().catch(() => false);

    if (!isDevMode) {
        // Fill Stripe card form in iframe with test card
        await fillStripeCard(page);
    }

    const authorizeButton = page.getByRole('button', { name: 'Authorize Payment' });
    await expect(authorizeButton).toBeEnabled({ timeout: 10_000 });
    await authorizeButton.click();

    // Wait for the confirmation step
    await expect(page.getByText('Payment Authorized!')).toBeVisible({ timeout: 30_000 });

    // Step 7: Navigate to Trips page
    await page.getByRole('button', { name: 'View My Trips' }).click();
    await page.waitForURL('/trips');

    // Step 8: Verify the booking appears on the Trips page
    await expect(page.getByText('My Trips')).toBeVisible();
    await expect(page.getByText('Upcoming Trips')).toBeVisible({ timeout: 10_000 });

    // There should be at least one booking card with a status badge
    const statusBadge = page.getByText('Pending Approval').or(page.getByText('Confirmed'));
    await expect(statusBadge.first()).toBeVisible({ timeout: 10_000 });
});
