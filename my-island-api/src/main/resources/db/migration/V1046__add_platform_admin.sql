-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Insert platform admin user (skip if already exists)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, is_admin, email_verified, created_at, updated_at)
VALUES (
    'tezball86@gmail.com',
    '$2b$12$2uroLmvPEIikOdGSE9OF1OcwxPrg7TuIEgWAmu83f3buWJRJsZXY2',
    'Platform Admin',
    'GUEST',
    FALSE,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;
