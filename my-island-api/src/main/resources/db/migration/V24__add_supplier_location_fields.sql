-- Add eircode and GPS coordinates to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS eircode VARCHAR(10);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Create index on coordinates for spatial queries
CREATE INDEX IF NOT EXISTS idx_suppliers_coordinates ON suppliers(latitude, longitude);
