-- V1014: Add CHECKED_IN to booking status constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_booking_status;
ALTER TABLE bookings ADD CONSTRAINT chk_booking_status
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING_PAYMENT', 'PAYMENT_FAILED', 'CHECKED_IN'));
