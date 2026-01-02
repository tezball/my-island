-- V11__create_lot_availability.sql
-- Create lot availability table for calendar/pricing management

CREATE TABLE lot_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id UUID NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    price_override DECIMAL(10, 2),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lot_id, date)
);

CREATE INDEX idx_lot_availability_lot ON lot_availability(lot_id);
CREATE INDEX idx_lot_availability_date ON lot_availability(date);
CREATE INDEX idx_lot_availability_status ON lot_availability(status);
CREATE INDEX idx_lot_availability_booking ON lot_availability(booking_id);
CREATE INDEX idx_lot_availability_lot_date_range ON lot_availability(lot_id, date, status);
