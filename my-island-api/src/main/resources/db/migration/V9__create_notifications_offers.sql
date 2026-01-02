-- V9__create_notifications_offers.sql
-- Create notifications and offers tables

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(500),
    related_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Offers table (deals/discounts from campsites or local suppliers)
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campsite_id UUID REFERENCES campsites(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(1000),
    original_price DECIMAL(10, 2),
    discount_price DECIMAL(10, 2),
    discount_percent INTEGER,
    valid_from DATE,
    valid_until DATE,
    promo_code VARCHAR(50),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_campsite ON offers(campsite_id);
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_active ON offers(active) WHERE active = TRUE;
CREATE INDEX idx_offers_featured ON offers(featured) WHERE featured = TRUE;
CREATE INDEX idx_offers_valid ON offers(valid_from, valid_until);
