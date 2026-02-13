import { test, expect } from '@playwright/test';
import { login, ADMIN } from './helpers/auth';

test.describe('Admin Owner CRUD', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, ADMIN.email, ADMIN.password);
    });

    test('Owners list shows Create button', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('h2')).toBeVisible({ timeout: 10_000 });
        await expect(page.getByRole('button', { name: /Create Owner/i })).toBeVisible();
    });

    test('Owner detail page shows expanded read view with sections', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await expect(page.locator('h3', { hasText: 'Core Info' })).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('h3', { hasText: 'Location' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Contact' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Platform' })).toBeVisible();
        await expect(page.getByText('Phone', { exact: true })).toBeVisible();
        await expect(page.getByText('Website', { exact: true })).toBeVisible();
    });

    test('Owner detail edit form has all expanded fields', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await page.getByRole('button', { name: 'Edit' }).click();

        // Check that form fields are visible using label text
        await expect(page.locator('label:has-text("Property Name")')).toBeVisible();
        await expect(page.locator('label:has-text("Property Type")')).toBeVisible();
        await expect(page.locator('label:has-text("County")')).toBeVisible();
        await expect(page.locator('label:has-text("Town")')).toBeVisible();
        await expect(page.locator('label:has-text("Phone")')).toBeVisible();
        await expect(page.locator('label:has-text("Website")')).toBeVisible();
        await expect(page.locator('label:has-text("Latitude")')).toBeVisible();
        await expect(page.locator('label:has-text("Longitude")')).toBeVisible();
        await expect(page.locator('label:has-text("Description")')).toBeVisible();

        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    test('Owner detail shows Deactivate button', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await expect(page.getByRole('button', { name: /Deactivate|Reactivate/i })).toBeVisible();
    });

    test('Owner detail deactivate shows confirmation modal', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await page.getByRole('button', { name: /Deactivate|Reactivate/i }).click();
        await expect(page.getByText(/Are you sure/i)).toBeVisible({ timeout: 5_000 });

        // Close modal via Cancel
        await page.locator('.fixed button:has-text("Cancel")').click();
    });

    test('Create Owner modal opens and has two steps', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.getByRole('button', { name: /Create Owner/i })).toBeVisible({ timeout: 10_000 });

        await page.getByRole('button', { name: /Create Owner/i }).click();

        // Step 1: User search
        await expect(page.locator('.fixed h3:has-text("Create Owner")')).toBeVisible();
        await expect(page.getByPlaceholder(/Search by name or email/i)).toBeVisible();
    });

    test('Create Owner modal search finds eligible users', async ({ page }) => {
        await page.goto('/admin/owners');
        await page.getByRole('button', { name: /Create Owner/i }).click();

        await page.getByPlaceholder(/Search by name or email/i).fill('test');
        await page.locator('.fixed button:has-text("Search")').click();

        await page.waitForTimeout(2_000);
        const hasResults = await page.locator('.max-h-48 button').count();
        const hasEmpty = await page.getByText('No eligible users found').isVisible().catch(() => false);
        expect(hasResults > 0 || hasEmpty).toBeTruthy();
    });

    test('Owner edit saves and updates view', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await page.getByRole('button', { name: 'Edit' }).click();

        // Find the Description textarea and modify it
        const descTextarea = page.locator('textarea').first();
        await descTextarea.fill('E2E test description');

        await page.getByRole('button', { name: 'Save' }).click();

        // Wait for edit mode to exit (Save button disappears)
        await expect(page.getByRole('button', { name: 'Save' })).toBeHidden({ timeout: 10_000 });

        // Should show updated description in read mode
        await expect(page.getByText('E2E test description')).toBeVisible({ timeout: 5_000 });

        // Restore: clear the description
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.locator('textarea').first()).toBeVisible({ timeout: 5_000 });
        await page.locator('textarea').first().fill('');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('button', { name: 'Save' })).toBeHidden({ timeout: 10_000 });
    });

    test('Back button navigates to owners list', async ({ page }) => {
        await page.goto('/admin/owners');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/owners\/\d+/);

        await page.getByRole('button', { name: /Back to Owners/i }).click();
        await page.waitForURL('/admin/owners');
        await expect(page.locator('h2')).toBeVisible();
    });
});

test.describe('Admin Supplier CRUD', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, ADMIN.email, ADMIN.password);
    });

    test('Suppliers list shows Create button', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('h2')).toBeVisible({ timeout: 10_000 });
        await expect(page.getByRole('button', { name: /Create Supplier/i })).toBeVisible();
    });

    test('Supplier detail page shows expanded read view with sections', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await expect(page.locator('h3', { hasText: 'Core Info' })).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('h3', { hasText: 'Location' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Contact' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Platform' })).toBeVisible();
        await expect(page.getByText('Address')).toBeVisible();
    });

    test('Supplier detail edit form has all expanded fields', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await page.getByRole('button', { name: 'Edit' }).click();

        await expect(page.locator('label:has-text("Business Name")')).toBeVisible();
        await expect(page.locator('label:has-text("Category")')).toBeVisible();
        await expect(page.locator('label:has-text("County")')).toBeVisible();
        await expect(page.locator('label:has-text("Town")')).toBeVisible();
        await expect(page.locator('label:has-text("Address")')).toBeVisible();
        await expect(page.locator('label:has-text("Phone")')).toBeVisible();
        await expect(page.locator('label:has-text("Website")')).toBeVisible();
        await expect(page.locator('label:has-text("Latitude")')).toBeVisible();
        await expect(page.locator('label:has-text("Longitude")')).toBeVisible();
        await expect(page.locator('label:has-text("Description")')).toBeVisible();
    });

    test('Supplier detail has Deactivate and Verify buttons', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await expect(page.getByRole('button', { name: /Deactivate|Reactivate/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Verify|Unverify/i })).toBeVisible();
    });

    test('Supplier deactivate shows confirmation modal', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await page.getByRole('button', { name: /Deactivate|Reactivate/i }).click();
        await expect(page.getByText(/Are you sure/i)).toBeVisible({ timeout: 5_000 });
        await page.locator('.fixed button:has-text("Cancel")').click();
    });

    test('Create Supplier modal opens with user search', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.getByRole('button', { name: /Create Supplier/i })).toBeVisible({ timeout: 10_000 });

        await page.getByRole('button', { name: /Create Supplier/i }).click();
        await expect(page.locator('.fixed h3:has-text("Create Supplier")')).toBeVisible();
        await expect(page.getByPlaceholder(/Search by name or email/i)).toBeVisible();
    });

    test('Create Supplier modal search finds eligible users', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await page.getByRole('button', { name: /Create Supplier/i }).click();

        await page.getByPlaceholder(/Search by name or email/i).fill('test');
        await page.locator('.fixed button:has-text("Search")').click();

        await page.waitForTimeout(2_000);
        const hasResults = await page.locator('.max-h-48 button').count();
        const hasEmpty = await page.getByText('No eligible users found').isVisible().catch(() => false);
        expect(hasResults > 0 || hasEmpty).toBeTruthy();
    });

    test('Supplier edit saves and updates view', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await page.getByRole('button', { name: 'Edit' }).click();

        const descTextarea = page.locator('textarea').first();
        await descTextarea.fill('E2E test description');

        await page.getByRole('button', { name: 'Save' }).click();

        // Wait for edit mode to exit (Save button disappears)
        await expect(page.getByRole('button', { name: 'Save' })).toBeHidden({ timeout: 10_000 });

        // Should show updated description in read mode
        await expect(page.getByText('E2E test description')).toBeVisible({ timeout: 5_000 });

        // Restore
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.locator('textarea').first()).toBeVisible({ timeout: 5_000 });
        await page.locator('textarea').first().fill('');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('button', { name: 'Save' })).toBeHidden({ timeout: 10_000 });
    });

    test('Back button navigates to suppliers list', async ({ page }) => {
        await page.goto('/admin/suppliers');
        await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 });
        await page.locator('table tbody tr').first().click();
        await page.waitForURL(/\/admin\/suppliers\/\d+/);

        await page.getByRole('button', { name: /Back to Suppliers/i }).click();
        await page.waitForURL('/admin/suppliers');
        await expect(page.locator('h2')).toBeVisible();
    });
});
