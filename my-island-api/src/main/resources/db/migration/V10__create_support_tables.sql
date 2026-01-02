-- V10__create_support_tables.sql
-- Create FAQs, support tickets, messages, and check-in instructions tables

-- FAQs table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question VARCHAR(500) NOT NULL,
    answer VARCHAR(2000) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(active) WHERE active = TRUE;

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_booking ON support_tickets(booking_id);

-- Ticket messages table
CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(2000) NOT NULL,
    is_staff_reply BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_sender ON ticket_messages(sender_id);

-- Booking messages (host-guest communication)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(2000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_read ON messages(booking_id, is_read);

-- Check-in instructions table
CREATE TABLE check_in_instructions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campsite_id UUID NOT NULL UNIQUE REFERENCES campsites(id) ON DELETE CASCADE,
    access_code VARCHAR(50),
    gate_code VARCHAR(50),
    wifi_name VARCHAR(100),
    wifi_password VARCHAR(100),
    check_in_time TIME NOT NULL DEFAULT '14:00',
    check_out_time TIME NOT NULL DEFAULT '11:00',
    directions VARCHAR(2000),
    parking_info VARCHAR(500),
    host_name VARCHAR(255),
    host_phone VARCHAR(50),
    host_email VARCHAR(255),
    host_avatar VARCHAR(1000),
    host_response_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_check_in_instructions_campsite ON check_in_instructions(campsite_id);

-- Check-in rules (one-to-many with check_in_instructions)
CREATE TABLE check_in_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructions_id UUID NOT NULL REFERENCES check_in_instructions(id) ON DELETE CASCADE,
    rule VARCHAR(500) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_check_in_rules_instructions ON check_in_rules(instructions_id);

-- Broadcast alerts (owner messages to current guests)
CREATE TABLE broadcast_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campsite_id UUID NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
    message VARCHAR(1000) NOT NULL,
    sent_to INTEGER DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_broadcast_alerts_campsite ON broadcast_alerts(campsite_id);
