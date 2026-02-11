-- V1048: Revert non-subscription test accounts to NONE
-- These accounts are intentionally unsubscribed for testing subscription gates.

-- Lough Derg Lakeside (Owner - no subscription test account)
UPDATE owners
SET subscription_status = 'NONE',
    stripe_customer_id = NULL,
    stripe_subscription_id = NULL,
    subscription_current_period_end = NULL,
    subscription_cancel_at_period_end = FALSE
WHERE user_id = (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie');

-- Dingle Kayak Adventures (Supplier - no subscription test account)
UPDATE suppliers
SET subscription_status = 'NONE',
    stripe_customer_id = NULL,
    stripe_subscription_id = NULL,
    subscription_current_period_end = NULL,
    subscription_cancel_at_period_end = FALSE
WHERE user_id = (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');
