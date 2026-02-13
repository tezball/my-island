-- Refresh all offer dates so they are valid from today for 6 months
-- This ensures seed offers appear on the marketplace after DB rebuild
UPDATE offers
SET valid_from = CURRENT_DATE,
    valid_until = CURRENT_DATE + INTERVAL '6 months'
WHERE valid_until < CURRENT_DATE;

-- Also refresh subscription period end for test accounts so they stay active
UPDATE suppliers
SET subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '30 days'
WHERE subscription_status = 'ACTIVE'
  AND subscription_current_period_end < CURRENT_TIMESTAMP;

UPDATE owners
SET subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '30 days'
WHERE subscription_status = 'ACTIVE'
  AND subscription_current_period_end < CURRENT_TIMESTAMP;
