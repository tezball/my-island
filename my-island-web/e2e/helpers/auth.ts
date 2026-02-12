import type { Page } from '@playwright/test';

// Test accounts from CLAUDE.md
export const GUEST = {
    email: 'family@example.com',
    password: 'MurphyFamily!Trip2025',
    name: 'Murphy Family',
};

export const GUEST_CLEAN = {
    email: 'testguest@example.com',
    password: 'TestGuest#2026!Safe',
    name: 'Test Guest',
};

export const OWNER = {
    email: 'norevalley@myisland.com',
    password: 'NoreValley2025!Secured',
    name: 'Nore Valley Owner',
};

export const OWNER_2 = {
    email: 'hello@burrenglampingvillage.ie',
    password: 'BurrenGlamp$99Safe',
    name: 'Burren Glamping Village',
};

export const SUPPLIER = {
    email: 'farmshop@greenacres.ie',
    password: 'GreenAcres#Farm2025',
    name: 'Green Acres Farm Shop',
};

export const SUPPLIER_2 = {
    email: 'info@aillweefarmshop.ie',
    password: 'AillweeCh33se!Secure',
    name: 'Aillwee Farm Shop & Cheese',
};

export const OWNER_NO_SUB = {
    email: 'bookings@loughdergcamping.ie',
    password: 'LoughDerg!Camp2025',
};

export const SUPPLIER_NO_SUB = {
    email: 'hello@dinglekayak.ie',
    password: 'W@v3R!d3r$K3rrry#2026',
};

export const ADMIN = {
    email: 'tezball86@gmail.com',
    password: 'PlatformAdmin#2026!Secure',
};

export const OWNER_STAFF = {
    email: 'staff@norevalley.com',
    password: 'OwnerStaff#2026!Secure',
};

export const SUPPLIER_STAFF = {
    email: 'staff@greenacres.ie',
    password: 'SupplierStaff#2026!Safe',
};

export async function login(page: Page, email: string, password: string) {
    await page.goto('/signin');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('/');
}

/**
 * Fill the Stripe card element inside its iframe.
 * Uses Stripe test card 4242 4242 4242 4242.
 */
export async function fillStripeCard(page: Page) {
    // Stripe mounts its card element in an iframe
    const stripeFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]').first();
    const cardInput = stripeFrame.locator('[name="cardnumber"]');
    await cardInput.waitFor({ timeout: 15_000 });
    await cardInput.fill('4242424242424242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/30');
    await stripeFrame.locator('[name="cvc"]').fill('123');
}
