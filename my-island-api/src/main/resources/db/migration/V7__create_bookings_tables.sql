-- V7__create_bookings_tables.sql
-- Create extras, bookings, and booking_extras tables

-- Extras catalog (add-ons available at campsites)
CREATE TABLE extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campsite_id UUID REFERENCES campsites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    per_night BOOLEAN NOT NULL DEFAULT FALSE,
    image_url VARCHAR(1000),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extras_campsite ON extras(campsite_id);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    lot_price DECIMAL(10, 2) NOT NULL,
    extras_price DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    special_requests VARCHAR(1000),
    cancellation_reason VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_dates CHECK (check_out > check_in),
    CONSTRAINT chk_booking_guests CHECK (guests > 0)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_lot ON bookings(lot_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);

-- Booking extras (junction table for bookings and extras)
CREATE TABLE booking_extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    extra_id UUID NOT NULL REFERENCES extras(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_booking_extras_booking ON booking_extras(booking_id);
CREATE INDEX idx_booking_extras_extra ON booking_extras(extra_id);
