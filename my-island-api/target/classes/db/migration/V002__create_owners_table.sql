-- V002: Create owners table
CREATE TABLE owners (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    county VARCHAR(100) NOT NULL,
    town VARCHAR(100),
    property_type VARCHAR(50) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(50),
    website VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_owners_user_id ON owners(user_id);
CREATE INDEX idx_owners_county ON owners(county);
CREATE INDEX idx_owners_property_type ON owners(property_type);
