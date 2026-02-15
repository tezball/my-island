CREATE TABLE feature_toggle (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    description     VARCHAR(500),
    category        VARCHAR(50),
    updated_by      BIGINT REFERENCES users(id),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Default toggle: subscription enforcement (enabled = current behavior)
INSERT INTO feature_toggle (name, enabled, description, category)
VALUES ('SUBSCRIPTION_ENFORCEMENT', true, 'When enabled, owners and suppliers must have active subscriptions to create bookings, offers, and access analytics.', 'BILLING');
