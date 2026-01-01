-- Campsites table
CREATE TABLE campsites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    county VARCHAR(100),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    rating DOUBLE PRECISION DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campsite images
CREATE TABLE campsite_images (
    campsite_id UUID NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL
);

-- Campsite facilities
CREATE TABLE campsite_facilities (
    campsite_id UUID NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
    facility VARCHAR(50) NOT NULL
);

-- Indexes
CREATE INDEX idx_campsites_owner ON campsites(owner_id);
CREATE INDEX idx_campsites_county ON campsites(county);
CREATE INDEX idx_campsites_featured ON campsites(featured) WHERE featured = TRUE;
CREATE INDEX idx_campsites_active ON campsites(active) WHERE active = TRUE;
CREATE INDEX idx_campsites_location ON campsites(lat, lng);
