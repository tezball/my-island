-- Add category column to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
