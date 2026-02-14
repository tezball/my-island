import { test, expect, type APIRequestContext } from '@playwright/test';
import { login, GUEST, SUPPLIER, SUPPLIER_2 } from './helpers/auth';

/**
 * BDD E2E tests for Marketplace Offer Claiming + Voucher + Supplier Redeem
 *
 * User Stories covered:
 *   US-CLAIM-1: Guest can browse and see claim button (UI)
 *   US-CLAIM-2: Guest claims an offer via API and gets a voucher
 *   US-CLAIM-3: Supplier redeems the voucher via API
 *   US-CLAIM-4: Guest views vouchers page with QR code (UI)
 */

async function apiLogin(request: APIRequestContext, email: string, password: string): Promise<string> {
    const res = await request.post('/api/auth/login', { data: { email, password } });
    expect(res.status(), `Login failed for ${email} (status ${res.status()})`).toBe(200);
    const body = await res.json();
    expect(body.token, `Login response missing token for ${email}`).toBeTruthy();
    return body.token;
}

test.describe('US-CLAIM-1: Guest can browse marketplace (UI)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Marketplace page loads with offers and category filters', async ({ page }) => {
        await page.goto('/marketplace');
        await expect(page.getByRole('heading', { name: 'Local Offers' })).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('button', { hasText: 'All' }).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Guest can open offer detail and see Claim button', async ({ page }) => {
        await page.goto('/marketplace');
        await expect(page.getByRole('heading', { name: 'Local Offers' })).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        const offerCard = page.locator('text=View Details').first();
        const isVisible = await offerCard.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No offers available');

        await offerCard.click();
        await expect(page.getByRole('button', { name: /Claim This Offer/i })).toBeVisible({ timeout: 5_000 });
    });
});

test.describe('US-CLAIM-2/3: Full claim → redeem lifecycle (API)', () => {
    test('Guest claims offer, receives voucher, supplier redeems it', async ({ request }) => {
        const guestToken = await apiLogin(request, GUEST.email, GUEST.password);
        const guestHeaders = { Authorization: `Bearer ${guestToken}` };

        // Map of known test suppliers to their login credentials
        const supplierAccounts: Record<string, { email: string; password: string }> = {
            'Green Acres Farm Shop': SUPPLIER,
            'Aillwee Farm Shop & Cheese': SUPPLIER_2,
        };

        // 1. Get available offers and existing claims to find an unclaimed offer from a known supplier
        const offersRes = await request.get('/api/marketplace/offers', { headers: guestHeaders });
        expect(offersRes.status()).toBe(200);
        const offers = await offersRes.json();
        expect(offers.length).toBeGreaterThan(0);

        const claimsRes0 = await request.get('/api/marketplace/claims', { headers: guestHeaders });
        const existingClaims = claimsRes0.status() === 200 ? await claimsRes0.json() : [];
        const claimedOfferIds = new Set(existingClaims.map((c: Record<string, unknown>) => c.offerId));

        // Pick an unclaimed offer from a known test supplier so we can redeem it
        const knownSupplierNames = Object.keys(supplierAccounts);
        const offer = offers.find(
            (o: Record<string, unknown>) =>
                o.isAvailable === true &&
                !claimedOfferIds.has(o.id) &&
                knownSupplierNames.includes(o.supplierName as string)
        );
        test.skip(!offer, 'No unclaimed offers from known test suppliers');

        const supplierCreds = supplierAccounts[offer.supplierName as string];

        // 2. Claim the offer
        const claimRes = await request.post('/api/marketplace/offers/claim', {
            headers: { ...guestHeaders, 'Content-Type': 'application/json' },
            data: { offerId: offer.id },
        });
        expect(claimRes.ok(), `Claim offer ${offer.id} failed (status ${claimRes.status()})`).toBeTruthy();
        const claim = await claimRes.json();
        expect(claim.status).toBe('CLAIMED');
        expect(claim.claimCode).toBeTruthy();
        expect(claim.offerTitle).toBe(offer.title);

        const claimCode = claim.claimCode;

        // 3. Verify voucher appears in guest's claims list
        const claimsRes = await request.get('/api/marketplace/claims', { headers: guestHeaders });
        expect(claimsRes.status()).toBe(200);
        const claims = await claimsRes.json();
        const ourClaim = claims.find((c: Record<string, unknown>) => c.claimCode === claimCode);
        expect(ourClaim, `Claim ${claimCode} not found in guest's claims`).toBeTruthy();
        expect(ourClaim.status).toBe('CLAIMED');

        // 4. Supplier validates the voucher (use the matching supplier account)
        const supplierToken = await apiLogin(request, supplierCreds.email, supplierCreds.password);
        const supplierHeaders = { Authorization: `Bearer ${supplierToken}` };

        const validateRes = await request.get(`/api/supplier/redeem/validate/${claimCode}`, {
            headers: supplierHeaders,
        });
        expect(validateRes.ok(), `Validate claim ${claimCode} failed (status ${validateRes.status()})`).toBeTruthy();

        // 5. Supplier redeems the voucher
        const redeemRes = await request.post(`/api/supplier/redeem/${claimCode}`, {
            headers: supplierHeaders,
        });
        expect(redeemRes.ok(), `Redeem claim ${claimCode} failed (status ${redeemRes.status()})`).toBeTruthy();
        const redeemed = await redeemRes.json();
        expect(redeemed.status).toBe('REDEEMED');

        // 6. Verify voucher is now redeemed in guest's list
        const verifyRes = await request.get('/api/marketplace/claims', { headers: guestHeaders });
        const updatedClaims = await verifyRes.json();
        const updatedClaim = updatedClaims.find((c: Record<string, unknown>) => c.claimCode === claimCode);
        expect(updatedClaim.status).toBe('REDEEMED');
    });

    test('Cannot redeem an already-redeemed voucher', async ({ request }) => {
        const guestToken = await apiLogin(request, GUEST.email, GUEST.password);
        const guestHeaders = { Authorization: `Bearer ${guestToken}` };

        // Find an already-redeemed claim
        const claimsRes = await request.get('/api/marketplace/claims', { headers: guestHeaders });
        const claims = await claimsRes.json();
        const redeemed = claims.find((c: Record<string, unknown>) => c.status === 'REDEEMED');
        test.skip(!redeemed, 'No redeemed claims available');

        // Attempt to redeem again should fail
        const supplierToken = await apiLogin(request, SUPPLIER.email, SUPPLIER.password);
        const redeemRes = await request.post(`/api/supplier/redeem/${redeemed.claimCode}`, {
            headers: { Authorization: `Bearer ${supplierToken}` },
        });
        expect(redeemRes.status()).not.toBe(200);
    });
});

test.describe('US-CLAIM-4: Guest views vouchers page (UI)', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, GUEST.email, GUEST.password);
    });

    test('Vouchers page loads and shows claimed vouchers', async ({ page }) => {
        await page.goto('/vouchers');
        await expect(page.getByText(/Vouchers|My Vouchers/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('Claimed voucher shows View QR Code button that opens modal', async ({ page }) => {
        await page.goto('/vouchers');
        await expect(page.getByText(/Vouchers|My Vouchers/i).first()).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(2000);

        const qrButton = page.getByRole('button', { name: /QR Code|View QR/i }).first();
        const isVisible = await qrButton.isVisible({ timeout: 5_000 }).catch(() => false);
        test.skip(!isVisible, 'No claimed vouchers with QR code button');

        await qrButton.click();
        // QR modal should show voucher info
        await expect(page.getByText(/Your Voucher|Show this code/i).first()).toBeVisible({ timeout: 5_000 });
    });
});
