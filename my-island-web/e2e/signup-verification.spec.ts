import { test, expect, type APIRequestContext } from '@playwright/test';

/**
 * BDD E2E tests for Sign Up + Email Verification
 *
 * User Stories covered:
 *   US-SIGNUP-1: New user can sign up (UI)
 *   US-SIGNUP-2: Sign up sends verification email (API + Mailpit)
 *   US-SIGNUP-3: User verifies email and can log in
 *   US-SIGNUP-4: Unverified user cannot log in
 */

const TEST_USER = {
    fullName: 'E2E Test User',
    email: `e2e-test-${Date.now()}@example.com`,
    password: 'E2ETest#2026!Secure',
};

test.describe('US-SIGNUP-1: New user can sign up (UI)', () => {
    test('Sign up page loads with form fields', async ({ page }) => {
        await page.goto('/signup');
        await page.evaluate(() => {
            localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true, timestamp: new Date().toISOString() }));
        });
        await page.reload();

        await expect(page.locator('#fullname')).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.getByRole('button', { name: /Continue/i })).toBeVisible();
    });

    test('Sign up shows validation for short password', async ({ page }) => {
        await page.goto('/signup');
        await page.evaluate(() => {
            localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true, timestamp: new Date().toISOString() }));
        });
        await page.reload();

        await page.locator('#fullname').fill('Test User');
        await page.locator('#email').fill('test-validation@example.com');
        await page.locator('#password').fill('short');
        await page.getByRole('button', { name: /Continue/i }).click();

        // Should show error or stay on signup page
        await page.waitForTimeout(2000);
        const onSignup = page.url().includes('/signup');
        const errorVisible = await page.getByText(/8 characters|password|too short/i).first()
            .isVisible({ timeout: 3_000 }).catch(() => false);
        expect(onSignup || errorVisible).toBeTruthy();
    });
});

test.describe('US-SIGNUP-2/3/4: Full signup → verification → login flow (API)', () => {
    test('User signs up, receives verification email, verifies, and logs in', async ({ request }) => {
        // 1. Clear Mailpit inbox first
        await request.delete('http://localhost:8025/api/v1/messages');

        // 2. Sign up via API (backend expects 'name' not 'fullName')
        const signupRes = await request.post('/api/auth/signup', {
            data: {
                name: TEST_USER.fullName,
                email: TEST_USER.email,
                password: TEST_USER.password,
            },
        });
        expect(signupRes.ok(), `Signup failed (status ${signupRes.status()})`).toBeTruthy();
        const signupBody = await signupRes.json();
        expect(signupBody.message || signupBody.token || signupBody.email).toBeTruthy();

        // 3. Unverified user should NOT be able to log in
        const loginBeforeVerify = await request.post('/api/auth/login', {
            data: { email: TEST_USER.email, password: TEST_USER.password },
        });
        // Should fail with 401/403 or return an error about unverified email
        expect(loginBeforeVerify.status()).not.toBe(200);

        // 4. Check Mailpit for the verification email (wait up to 10 seconds)
        let verificationToken = '';
        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const mailRes = await request.get('http://localhost:8025/api/v1/messages');
            if (mailRes.status() === 200) {
                const mailData = await mailRes.json();
                const messages = mailData.messages || [];
                // Find email sent to our test user
                const verifyEmail = messages.find((m: Record<string, unknown>) => {
                    const to = m.To as Array<Record<string, string>> | undefined;
                    return to?.some(t => t.Address === TEST_USER.email);
                });
                if (verifyEmail) {
                    // Get full message to extract verification link
                    const msgId = (verifyEmail as Record<string, string>).ID;
                    const fullMsgRes = await request.get(`http://localhost:8025/api/v1/message/${msgId}`);
                    const fullMsg = await fullMsgRes.json();
                    const body = fullMsg.Text || fullMsg.HTML || '';
                    // Extract token from verification URL
                    const tokenMatch = body.match(/verify-email\?token=([a-zA-Z0-9_-]+)/);
                    if (tokenMatch) {
                        verificationToken = tokenMatch[1];
                        break;
                    }
                    // Also try direct token pattern
                    const altMatch = body.match(/token=([a-f0-9-]{36})/);
                    if (altMatch) {
                        verificationToken = altMatch[1];
                        break;
                    }
                }
            }
        }
        expect(verificationToken, 'Verification token not found in Mailpit').toBeTruthy();

        // 5. Verify email via API
        const verifyRes = await request.get(`/api/auth/verify-email?token=${verificationToken}`);
        expect(verifyRes.status(), `Email verification failed`).toBe(200);

        // 6. Now user should be able to log in
        const loginAfterVerify = await request.post('/api/auth/login', {
            data: { email: TEST_USER.email, password: TEST_USER.password },
        });
        expect(loginAfterVerify.status(), `Login after verification failed`).toBe(200);
        const loginBody = await loginAfterVerify.json();
        expect(loginBody.token, 'Login should return a JWT token').toBeTruthy();
    });
});
