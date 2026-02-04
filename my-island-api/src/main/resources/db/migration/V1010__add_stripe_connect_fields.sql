-- Add Stripe Connect fields to owners table
ALTER TABLE owners ADD COLUMN stripe_connect_account_id VARCHAR(255);
ALTER TABLE owners ADD COLUMN connect_onboarding_complete BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE owners ADD COLUMN payouts_enabled BOOLEAN DEFAULT FALSE NOT NULL;

-- Add Stripe Connect fields to suppliers table
ALTER TABLE suppliers ADD COLUMN stripe_connect_account_id VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN connect_onboarding_complete BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE suppliers ADD COLUMN payouts_enabled BOOLEAN DEFAULT FALSE NOT NULL;
