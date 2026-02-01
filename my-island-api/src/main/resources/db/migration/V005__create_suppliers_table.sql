-- V005: Create suppliers table
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    county VARCHAR(100) NOT NULL,
    town VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_supplier_category CHECK (category IN (
        'FARM_SHOP', 'RESTAURANT', 'CAFE', 'PUB',
        'ACTIVITY_PROVIDER', 'TOUR_OPERATOR', 'EQUIPMENT_RENTAL',
        'SPA', 'ARTISAN', 'GROCERY', 'OTHER'
    ))
);

CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_county ON suppliers(county);
CREATE INDEX idx_suppliers_is_verified ON suppliers(is_verified);
