-- V1015: Create lot_blocked_periods table
CREATE TABLE lot_blocked_periods (
    id BIGSERIAL PRIMARY KEY,
    lot_id BIGINT NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_blocked_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_blocked_periods_lot_id ON lot_blocked_periods(lot_id);
CREATE INDEX idx_blocked_periods_dates ON lot_blocked_periods(lot_id, start_date, end_date);
