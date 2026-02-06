-- V1011: Add booking payment fields for Stripe PaymentIntent integration

-- Add payment-related columns to bookings table
ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'NONE';
ALTER TABLE bookings ADD COLUMN payment_captured_at TIMESTAMP;
ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10, 2);
ALTER TABLE bookings ADD COLUMN service_fee DECIMAL(10, 2);
ALTER TABLE bookings ADD COLUMN charge_total DECIMAL(10, 2);
ALTER TABLE bookings ADD COLUMN stripe_transfer_id VARCHAR(255);

-- Update status constraint to include new booking statuses
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_booking_status;
ALTER TABLE bookings ADD CONSTRAINT chk_booking_status
    CHECK (status IN ('PENDING_PAYMENT', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PAYMENT_FAILED'));

-- Add payment status constraint
ALTER TABLE bookings ADD CONSTRAINT chk_payment_status
    CHECK (payment_status IN ('NONE', 'AUTHORIZED', 'CAPTURED', 'RELEASED', 'REFUNDED', 'FAILED'));

-- Index for looking up bookings by payment intent
CREATE INDEX idx_bookings_payment_intent ON bookings(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
