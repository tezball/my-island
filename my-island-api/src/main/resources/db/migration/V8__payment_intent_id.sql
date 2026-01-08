-- Add payment_intent_id column to bookings table for Stripe integration
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255);
