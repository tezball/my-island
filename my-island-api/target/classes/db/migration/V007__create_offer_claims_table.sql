-- V007: Create offer claims table
CREATE TABLE offer_claims (
    id BIGSERIAL PRIMARY KEY,
    offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    claim_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'CLAIMED',
    is_test BOOLEAN NOT NULL DEFAULT FALSE,
    claimed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    redeemed_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_claim_status CHECK (status IN ('CLAIMED', 'REDEEMED', 'EXPIRED', 'CANCELLED'))
);

CREATE INDEX idx_offer_claims_offer_id ON offer_claims(offer_id);
CREATE INDEX idx_offer_claims_user_id ON offer_claims(user_id);
CREATE INDEX idx_offer_claims_booking_id ON offer_claims(booking_id);
CREATE INDEX idx_offer_claims_status ON offer_claims(status);
CREATE INDEX idx_offer_claims_claim_code ON offer_claims(claim_code);
CREATE INDEX idx_offer_claims_is_test ON offer_claims(is_test);
CREATE INDEX idx_offer_claims_expires_at ON offer_claims(expires_at);
