import { test, expect } from '@playwright/test';
import { login, GUEST, OWNER, SUPPLIER, ADMIN } from './helpers/auth';

test.describe('Authentication', () => {
    test('Guest can sign in and lands on homepage', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await expect(page).toHaveURL('/');
        await expect(page.getByText('Welcome back')).toBeVisible();
        await expect(page.getByText(GUEST.name)).toBeVisible();
    });

    test('Owner can sign in and lands on homepage', async ({ page }) => {
        await login(page, OWNER.email, OWNER.password);
        await expect(page).toHaveURL('/');
        await expect(page.getByText('Welcome back')).toBeVisible();
    });

    test('Supplier can sign in and lands on homepage', async ({ page }) => {
        await login(page, SUPPLIER.email, SUPPLIER.password);
        await expect(page).toHaveURL('/');
        await expect(page.getByText('Welcome back')).toBeVisible();
    });

    test('Admin can sign in and lands on homepage', async ({ page }) => {
        await login(page, ADMIN.email, ADMIN.password);
        await expect(page).toHaveURL('/');
    });

    test('Invalid credentials show error', async ({ page }) => {
        await page.goto('/signin');
        await page.locator('#email').fill('fake@example.com');
        await page.locator('#password').fill('WrongPassword123!');
        await page.getByRole('button', { name: 'Sign In' }).click();
        // Should stay on signin page and show error
        await expect(page).toHaveURL('/signin');
        await expect(page.getByText(/invalid|incorrect|failed/i).first()).toBeVisible({ timeout: 5_000 });
    });

    test('Test user dropdown auto-fills credentials', async ({ page }) => {
        await page.goto('/signin');
        // Open the test user dropdown and pick the first option
        const dropdown = page.locator('select').first();
        await dropdown.selectOption({ index: 1 });
        // Email and password should be pre-filled
        const emailValue = await page.locator('#email').inputValue();
        expect(emailValue).toBeTruthy();
        const passwordValue = await page.locator('#password').inputValue();
        expect(passwordValue).toBeTruthy();
    });

    test('User can log out from profile page', async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
        await page.goto('/profile');
        await expect(page.getByRole('main').getByText(GUEST.name)).toBeVisible();
        await page.getByText('Log out').click();
        // Should redirect to signin
        await expect(page).toHaveURL('/signin');
    });

    test('Unauthenticated user sees sign-in prompt on Trips page', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.getByText('Sign in to view your trips')).toBeVisible();
    });
});
