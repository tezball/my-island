-- Add featured promotion fields to suppliers table
ALTER TABLE suppliers
ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN featured_until TIMESTAMP,
ADD COLUMN featured_purchase_id VARCHAR(255);

-- Create index for efficient queries on featured suppliers
CREATE INDEX idx_suppliers_featured ON suppliers(is_featured, featured_until);
