-- V1017: Add manual booking fields
-- Make user_id nullable (manual bookings may not have a registered user)
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- Add manual booking fields
ALTER TABLE bookings ADD COLUMN guest_name VARCHAR(255);
ALTER TABLE bookings ADD COLUMN guest_email VARCHAR(255);
ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(50);
ALTER TABLE bookings ADD COLUMN booking_source VARCHAR(20) NOT NULL DEFAULT 'ONLINE';
ALTER TABLE bookings ADD COLUMN created_by_owner_id BIGINT REFERENCES owners(id);

-- Constraint: either user_id or guest_name must be present
ALTER TABLE bookings ADD CONSTRAINT chk_booking_guest
    CHECK (user_id IS NOT NULL OR guest_name IS NOT NULL);

-- Update booking_source constraint
ALTER TABLE bookings ADD CONSTRAINT chk_booking_source
    CHECK (booking_source IN ('ONLINE', 'DIRECT', 'PHONE', 'WALKIN'));
