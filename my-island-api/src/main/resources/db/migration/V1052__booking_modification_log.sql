-- Booking modification audit log
CREATE TABLE booking_modification_log (
    id              BIGSERIAL PRIMARY KEY,
    booking_id      BIGINT NOT NULL REFERENCES bookings(id),
    modified_by_user_id BIGINT NOT NULL REFERENCES users(id),
    modification_type VARCHAR(30) NOT NULL,
    previous_lot_id BIGINT REFERENCES lots(id),
    previous_check_in_date DATE,
    previous_check_out_date DATE,
    previous_total_price DECIMAL(10, 2),
    new_lot_id      BIGINT REFERENCES lots(id),
    new_check_in_date DATE,
    new_check_out_date DATE,
    new_total_price DECIMAL(10, 2),
    price_adjustment DECIMAL(10, 2),
    reason          TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_mod_log_booking_id ON booking_modification_log(booking_id);
CREATE INDEX idx_booking_mod_log_modified_by ON booking_modification_log(modified_by_user_id);
CREATE INDEX idx_booking_mod_log_created_at ON booking_modification_log(created_at DESC);
