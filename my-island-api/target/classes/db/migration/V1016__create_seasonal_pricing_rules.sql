-- V1016: Create seasonal_pricing_rules table
CREATE TABLE seasonal_pricing_rules (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    lot_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pricing_dates CHECK (end_date > start_date),
    CONSTRAINT chk_pricing_price CHECK (price_per_night > 0)
);

CREATE INDEX idx_pricing_rules_owner ON seasonal_pricing_rules(owner_id);
CREATE INDEX idx_pricing_rules_dates ON seasonal_pricing_rules(owner_id, lot_type, start_date, end_date);
