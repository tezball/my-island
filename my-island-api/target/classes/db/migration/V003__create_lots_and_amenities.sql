-- V003: Create lots and amenities tables

-- Lot types enum-like constraint
CREATE TABLE lots (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lot_type VARCHAR(50) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_guests INT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_lot_type CHECK (lot_type IN ('TENT', 'CAMPERVAN', 'GLAMPING', 'CABIN', 'TREEHOUSE', 'YURT', 'POD'))
);

CREATE INDEX idx_lots_owner_id ON lots(owner_id);
CREATE INDEX idx_lots_lot_type ON lots(lot_type);
CREATE INDEX idx_lots_is_active ON lots(is_active);
CREATE INDEX idx_lots_price ON lots(price_per_night);

-- Amenity reference table
CREATE TABLE amenities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    CONSTRAINT chk_amenity_category CHECK (category IN ('FACILITY', 'ACTIVITY', 'SERVICE', 'FEATURE'))
);

-- Junction table for lot amenities
CREATE TABLE lot_amenities (
    lot_id BIGINT NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    amenity_id BIGINT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (lot_id, amenity_id)
);

-- Junction table for campsite (owner) amenities
CREATE TABLE campsite_amenities (
    owner_id BIGINT NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    amenity_id BIGINT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (owner_id, amenity_id)
);

-- Insert default amenities
INSERT INTO amenities (name, icon, category) VALUES
    ('WiFi', 'wifi', 'FACILITY'),
    ('Electricity', 'bolt', 'FACILITY'),
    ('Water Hookup', 'droplet', 'FACILITY'),
    ('Toilet', 'toilet', 'FACILITY'),
    ('Shower', 'shower', 'FACILITY'),
    ('Fire Pit', 'flame', 'FEATURE'),
    ('BBQ', 'grill', 'FEATURE'),
    ('Picnic Table', 'table', 'FEATURE'),
    ('Parking', 'car', 'FACILITY'),
    ('Pet Friendly', 'paw', 'FEATURE'),
    ('Playground', 'playground', 'ACTIVITY'),
    ('Swimming', 'swimmer', 'ACTIVITY'),
    ('Fishing', 'fish', 'ACTIVITY'),
    ('Hiking', 'hiking', 'ACTIVITY'),
    ('Cycling', 'bike', 'ACTIVITY'),
    ('Laundry', 'washing-machine', 'SERVICE'),
    ('Shop', 'store', 'SERVICE'),
    ('Restaurant', 'utensils', 'SERVICE'),
    ('Reception', 'bell', 'SERVICE'),
    ('Security', 'shield', 'SERVICE');
