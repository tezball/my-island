-- Owner policy fields for guest modifications
ALTER TABLE owners ADD COLUMN allow_guest_modifications BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE owners ADD COLUMN modification_deadline_days INTEGER NOT NULL DEFAULT 3;
ALTER TABLE owners ADD COLUMN require_modification_approval BOOLEAN NOT NULL DEFAULT false;

-- Modification request table (for approval workflow)
CREATE TABLE booking_modification_requests (
    id                        BIGSERIAL PRIMARY KEY,
    booking_id                BIGINT NOT NULL REFERENCES bookings(id),
    requested_by_user_id      BIGINT NOT NULL REFERENCES users(id),
    status                    VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- Proposed changes (null = no change requested)
    requested_lot_id          BIGINT REFERENCES lots(id),
    requested_check_in_date   DATE,
    requested_check_out_date  DATE,
    requested_wants_power     BOOLEAN,
    -- Price preview
    estimated_new_price       DECIMAL(10,2),
    price_difference          DECIMAL(10,2),
    -- Metadata
    reason                    TEXT,
    resolved_by_user_id       BIGINT REFERENCES users(id),
    resolved_at               TIMESTAMP,
    decline_reason            TEXT,
    created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mod_req_booking ON booking_modification_requests(booking_id);
CREATE INDEX idx_mod_req_status ON booking_modification_requests(status);

-- Track who initiated modifications in existing audit log
ALTER TABLE booking_modification_log ADD COLUMN initiated_by VARCHAR(10) DEFAULT 'OWNER';
