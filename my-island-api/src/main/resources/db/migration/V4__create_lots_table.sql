-- Lots table
CREATE TABLE lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campsite_id UUID NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lot images
CREATE TABLE lot_images (
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL
);

-- Lot amenities
CREATE TABLE lot_amenities (
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    amenity VARCHAR(100) NOT NULL
);

-- Indexes
CREATE INDEX idx_lots_campsite ON lots(campsite_id);
CREATE INDEX idx_lots_type ON lots(type);
CREATE INDEX idx_lots_available ON lots(available) WHERE available = TRUE;
