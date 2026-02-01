-- V004: Create bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lot_id BIGINT NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_guests INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    special_requests TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_lot_id ON bookings(lot_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX idx_bookings_check_out ON bookings(check_out_date);
CREATE INDEX idx_bookings_dates ON bookings(lot_id, check_in_date, check_out_date);
