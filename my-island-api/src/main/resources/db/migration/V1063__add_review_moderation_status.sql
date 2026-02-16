-- Add moderation columns to reviews
ALTER TABLE reviews ADD COLUMN moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE reviews ADD COLUMN moderation_reason TEXT;
ALTER TABLE reviews ADD COLUMN moderated_at TIMESTAMP;

-- Add moderation columns to supplier_reviews
ALTER TABLE supplier_reviews ADD COLUMN moderation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE supplier_reviews ADD COLUMN moderation_reason TEXT;
ALTER TABLE supplier_reviews ADD COLUMN moderated_at TIMESTAMP;
