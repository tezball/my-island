-- V1018: Create reviews table and add rating fields to owners

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    owner_id BIGINT NOT NULL REFERENCES owners(id),
    booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id),
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT NOT NULL,
    owner_response TEXT,
    owner_response_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_rating_range CHECK (rating >= 1.0 AND rating <= 5.0),
    CONSTRAINT chk_rating_half_star CHECK (rating * 2 = FLOOR(rating * 2))
);

CREATE INDEX idx_reviews_owner_id ON reviews(owner_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Add denormalized rating fields to owners
ALTER TABLE owners ADD COLUMN rating DECIMAL(2,1) DEFAULT NULL;
ALTER TABLE owners ADD COLUMN review_count INT NOT NULL DEFAULT 0;
