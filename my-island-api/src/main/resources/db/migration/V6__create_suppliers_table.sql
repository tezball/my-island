-- Add isSupplier column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_supplier BOOLEAN NOT NULL DEFAULT FALSE;

-- Create suppliers table for business profile data
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    contact_email VARCHAR(255),
    phone_number VARCHAR(50),
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
