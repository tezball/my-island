-- V1001: Add subscription fields to owners table
ALTER TABLE owners
    ADD COLUMN stripe_customer_id VARCHAR(255),
    ADD COLUMN stripe_subscription_id VARCHAR(255),
    ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'NONE',
    ADD COLUMN subscription_current_period_end TIMESTAMP,
    ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create indexes for Stripe lookups
CREATE INDEX idx_owners_stripe_customer_id ON owners(stripe_customer_id);
CREATE INDEX idx_owners_subscription_status ON owners(subscription_status);

-- Add check constraint for subscription status
ALTER TABLE owners
    ADD CONSTRAINT chk_owner_subscription_status CHECK (subscription_status IN (
        'NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'
    ));
