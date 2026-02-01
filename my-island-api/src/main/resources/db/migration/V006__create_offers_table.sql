-- V006: Create offers table
CREATE TABLE offers (
    id BIGSERIAL PRIMARY KEY,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2),
    terms_conditions TEXT,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    max_claims INT,
    current_claims INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_discount_type CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_ITEM', 'BUY_ONE_GET_ONE')),
    CONSTRAINT chk_validity CHECK (valid_until >= valid_from),
    CONSTRAINT chk_claims CHECK (max_claims IS NULL OR current_claims <= max_claims)
);

CREATE INDEX idx_offers_supplier_id ON offers(supplier_id);
CREATE INDEX idx_offers_is_active ON offers(is_active);
CREATE INDEX idx_offers_valid_from ON offers(valid_from);
CREATE INDEX idx_offers_valid_until ON offers(valid_until);
CREATE INDEX idx_offers_discount_type ON offers(discount_type);
