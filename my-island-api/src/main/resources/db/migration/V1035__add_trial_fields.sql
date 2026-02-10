-- Add trial fields to owners table
ALTER TABLE owners
    ADD COLUMN trial_ends_at TIMESTAMPTZ,
    ADD COLUMN trial_used BOOLEAN NOT NULL DEFAULT FALSE;

-- Add trial fields to suppliers table
ALTER TABLE suppliers
    ADD COLUMN trial_ends_at TIMESTAMPTZ,
    ADD COLUMN trial_used BOOLEAN NOT NULL DEFAULT FALSE;

-- Drop existing subscription_status check constraints and recreate with TRIALING
ALTER TABLE owners DROP CONSTRAINT IF EXISTS owners_subscription_status_check;
ALTER TABLE owners ADD CONSTRAINT owners_subscription_status_check
    CHECK (subscription_status IN ('NONE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'));

ALTER TABLE suppliers DROP CONSTRAINT IF EXISTS suppliers_subscription_status_check;
ALTER TABLE suppliers ADD CONSTRAINT suppliers_subscription_status_check
    CHECK (subscription_status IN ('NONE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'));

-- Update seed test accounts to simulate expired trial
UPDATE owners SET trial_used = TRUE
WHERE id = (SELECT o.id FROM owners o JOIN users u ON o.user_id = u.id WHERE u.email = 'norevalley@myisland.com');

UPDATE suppliers SET trial_used = TRUE
WHERE id = (SELECT s.id FROM suppliers s JOIN users u ON s.user_id = u.id WHERE u.email = 'farmshop@greenacres.ie');
