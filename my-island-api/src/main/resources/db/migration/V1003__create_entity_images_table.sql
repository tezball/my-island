-- Entity Images table for multi-image gallery support
-- Supports: Lots, Offers, Suppliers, Owners

CREATE TABLE entity_images (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    filename VARCHAR(255),
    content_type VARCHAR(100),
    file_size BIGINT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient lookups by entity
CREATE INDEX idx_entity_images_lookup ON entity_images(entity_type, entity_id);

-- Index for ordering
CREATE INDEX idx_entity_images_order ON entity_images(entity_type, entity_id, display_order);

-- Unique constraint on s3_key
CREATE UNIQUE INDEX idx_entity_images_s3_key ON entity_images(s3_key);

-- Ensure only one primary image per entity
CREATE UNIQUE INDEX idx_entity_images_primary
    ON entity_images(entity_type, entity_id)
    WHERE is_primary = true;

COMMENT ON TABLE entity_images IS 'Stores image metadata for various entities (Lots, Offers, Suppliers, etc.)';
COMMENT ON COLUMN entity_images.entity_type IS 'Type of entity: LOT, OFFER, SUPPLIER, OWNER, USER';
COMMENT ON COLUMN entity_images.entity_id IS 'ID of the related entity';
COMMENT ON COLUMN entity_images.s3_key IS 'S3 object key (e.g., lots/uuid.jpg)';
COMMENT ON COLUMN entity_images.is_primary IS 'Primary/hero image for the entity';
