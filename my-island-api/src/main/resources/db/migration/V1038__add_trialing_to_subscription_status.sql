-- Add TRIALING to subscription_status check constraints for both owners and suppliers

ALTER TABLE owners DROP CONSTRAINT chk_owner_subscription_status;
ALTER TABLE owners ADD CONSTRAINT chk_owner_subscription_status CHECK (subscription_status IN (
    'NONE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'
));

ALTER TABLE suppliers DROP CONSTRAINT chk_subscription_status;
ALTER TABLE suppliers ADD CONSTRAINT chk_subscription_status CHECK (subscription_status IN (
    'NONE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID'
));
