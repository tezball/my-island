-- Add featured promotion fields to owners table
ALTER TABLE owners
ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN featured_until TIMESTAMP,
ADD COLUMN featured_purchase_id VARCHAR(255);

-- Index for efficient featured queries
CREATE INDEX idx_owners_featured ON owners(is_featured, featured_until);
