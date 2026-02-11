-- V1049: Schema changes for admin features

-- Users: soft-disable support
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Reviews: moderation flag
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN NOT NULL DEFAULT FALSE;

-- Supplier reviews: moderation flag
ALTER TABLE supplier_reviews ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN NOT NULL DEFAULT FALSE;
