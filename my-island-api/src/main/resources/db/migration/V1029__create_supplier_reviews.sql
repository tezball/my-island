-- V1029: Create supplier_reviews table and add denormalized rating fields to suppliers

CREATE TABLE supplier_reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id),
    offer_claim_id BIGINT NOT NULL UNIQUE REFERENCES offer_claims(id),
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT NOT NULL,
    supplier_response TEXT,
    supplier_response_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_sr_rating_range CHECK (rating >= 1.0 AND rating <= 5.0),
    CONSTRAINT chk_sr_rating_half_star CHECK (rating * 2 = FLOOR(rating * 2))
);

CREATE INDEX idx_supplier_reviews_supplier_id ON supplier_reviews(supplier_id);
CREATE INDEX idx_supplier_reviews_user_id ON supplier_reviews(user_id);
CREATE INDEX idx_supplier_reviews_created_at ON supplier_reviews(created_at DESC);

ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT NULL;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS review_count INT NOT NULL DEFAULT 0;
