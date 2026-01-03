-- Create local_businesses table for displaying local suppliers on the map
CREATE TABLE IF NOT EXISTS local_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(500),
    weekday_hours VARCHAR(50),
    weekend_hours VARCHAR(50),
    rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create images table for local businesses
CREATE TABLE IF NOT EXISTS local_business_images (
    local_business_id UUID NOT NULL REFERENCES local_businesses(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (local_business_id, image_url)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_local_businesses_category ON local_businesses(category);
CREATE INDEX IF NOT EXISTS idx_local_businesses_county ON local_businesses(county);
CREATE INDEX IF NOT EXISTS idx_local_businesses_location ON local_businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_local_businesses_featured ON local_businesses(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_local_businesses_active ON local_businesses(active) WHERE active = TRUE;
