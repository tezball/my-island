-- V12__seed_users.sql
-- Seed users (guests, owners, suppliers)
-- Password for all users: demo123 (BCrypt hash)

-- Demo user (John Murphy - guest)
INSERT INTO users (id, email, password_hash, name, avatar, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'john.murphy@email.com',
    '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', -- demo123
    'John Murphy',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    '+353 87 123 4567',
    'Outdoor enthusiast who loves exploring Ireland''s beautiful campsites.',
    FALSE,
    FALSE,
    TRUE, TRUE, FALSE, TRUE,
    '2023-06-15',
    '2023-06-15'
);

-- Guest users (for reviews/bookings)
INSERT INTO users (id, email, password_hash, name, avatar, phone, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000002', 'sarah.oconnor@email.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Sarah O''Connor', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '+353 87 111 2222', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, '2023-08-01', '2023-08-01'),
('00000000-0000-0000-0000-000000000003', 'michael.kelly@email.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Michael Kelly', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+353 87 222 3333', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, '2023-09-15', '2023-09-15'),
('00000000-0000-0000-0000-000000000004', 'emma.walsh@email.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Emma Walsh', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+353 87 333 4444', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, '2023-10-01', '2023-10-01'),
('00000000-0000-0000-0000-000000000005', 'david.murphy@email.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'David Murphy', NULL, '+353 87 444 5555', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, '2023-11-01', '2023-11-01');

-- Owner users
INSERT INTO users (id, email, password_hash, name, avatar, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at) VALUES
('00000000-0000-0000-0001-000000000001', 'siobhan@clifdeneco.ie', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Siobhan O''Malley', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '+353 87 234 5678', 'Owner of Clifden Eco Beach Camping', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2022-01-15', '2022-01-15'),
('00000000-0000-0000-0001-000000000002', 'info@ringofkerryglamping.ie', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Patrick Kerry', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+353 86 345 6789', 'Owner of Ring of Kerry Glamping', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2021-06-01', '2021-06-01'),
('00000000-0000-0000-0001-000000000003', 'owner3@test.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Wicklow Owner', NULL, '+353 86 456 7890', 'Owner of Wicklow Mountains Retreat', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2022-03-01', '2022-03-01'),
('00000000-0000-0000-0001-000000000004', 'owner4@test.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Dingle Owner', NULL, '+353 86 567 8901', 'Owner of Dingle Peninsula Camp', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2022-04-01', '2022-04-01'),
('00000000-0000-0000-0001-000000000005', 'owner5@test.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Burren Owner', NULL, '+353 86 678 9012', 'Owner of Burren Wild Camp', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2022-05-01', '2022-05-01'),
('00000000-0000-0000-0001-000000000006', 'owner6@test.com', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'Giants Owner', NULL, '+353 86 789 0123', 'Owner of Giants Causeway Caravan Park', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, '2022-06-01', '2022-06-01');

-- Linked accounts for demo user
INSERT INTO linked_accounts (id, user_id, provider, email, connected, created_at, updated_at) VALUES
('00000000-0000-0000-1000-000000000001', '00000000-0000-0000-0000-000000000001', 'GOOGLE', 'john.murphy@gmail.com', TRUE, '2023-06-15', '2023-06-15'),
('00000000-0000-0000-1000-000000000002', '00000000-0000-0000-0000-000000000001', 'APPLE', 'john@icloud.com', FALSE, '2023-06-15', '2023-06-15'),
('00000000-0000-0000-1000-000000000003', '00000000-0000-0000-0000-000000000001', 'FACEBOOK', 'john@facebook.com', FALSE, '2023-06-15', '2023-06-15');

-- Support staff user (for ticket responses)
INSERT INTO users (id, email, password_hash, name, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at) VALUES
('00000000-0000-0000-0002-000000000001', 'support@myisland.ie', '$2a$10$Dtb8r5TFIhD1aQLi5zL6M.0dV9OmVUO0TpCCBUtAWLWIMQTSnVBJq', 'My Island Support', FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, '2020-01-01', '2020-01-01');
