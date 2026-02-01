-- V008: Add subscription fields to suppliers table
ALTER TABLE suppliers
    ADD COLUMN stripe_customer_id VARCHAR(255),
    ADD COLUMN stripe_subscription_id VARCHAR(255),
    ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'NONE',
    ADD COLUMN subscription_current_period_end TIMESTAMP,
    ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create indexes for Stripe lookups
CREATE INDEX idx_suppliers_stripe_customer_id ON suppliers(stripe_customer_id);
CREATE INDEX idx_suppliers_subscription_status ON suppliers(subscription_status);

-- Add check constraint for subscription status
ALTER TABLE suppliers
    ADD CONSTRAINT chk_subscription_status CHECK (subscription_status IN (
        'NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'
    ));
