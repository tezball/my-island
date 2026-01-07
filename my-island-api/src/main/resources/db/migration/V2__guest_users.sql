-- V2__guest_users.sql
-- Add guest users who will make bookings across the platform
-- Password for all demo accounts: demo1234
-- BCrypt hash: $2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi

-- ============================================
-- GUEST USERS (20 additional guests)
-- ============================================

-- Dublin area guests
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000001', 'ciara.murphy@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Ciara Murphy', '+353 87 111 2001', 'Loves weekend getaways and hiking', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '8 months', NOW()),
('a1000000-0000-0000-0000-000000000002', 'conor.ryan@outlook.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Conor Ryan', '+353 86 222 3002', 'Outdoor enthusiast and photographer', FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '7 months', NOW()),
('a1000000-0000-0000-0000-000000000003', 'aoife.kelly@yahoo.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Aoife Kelly', '+353 85 333 4003', 'Family traveler with 2 kids', FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, NOW() - INTERVAL '6 months', NOW()),
('a1000000-0000-0000-0000-000000000004', 'sean.oconnor@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Sean O''Connor', '+353 87 444 5004', 'Surfer and beach lover', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '9 months', NOW()),
('a1000000-0000-0000-0000-000000000005', 'niamh.walsh@hotmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Niamh Walsh', '+353 86 555 6005', 'Nature lover and birdwatcher', FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, NOW() - INTERVAL '5 months', NOW());

-- Cork area guests
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000006', 'padraig.obrien@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Padraig O''Brien', '+353 87 666 7006', 'Weekend camper and foodie', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '10 months', NOW()),
('a1000000-0000-0000-0000-000000000007', 'sinead.mccarthy@outlook.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Sinead McCarthy', '+353 85 777 8007', 'Glamping enthusiast', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, NOW() - INTERVAL '4 months', NOW()),
('a1000000-0000-0000-0000-000000000008', 'dermot.collins@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Dermot Collins', '+353 86 888 9008', 'Retired teacher exploring Ireland', FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, NOW() - INTERVAL '11 months', NOW());

-- Galway area guests
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000009', 'roisin.gallagher@yahoo.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Roisin Gallagher', '+353 87 999 0009', 'Young professional seeking adventure', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '3 months', NOW()),
('a1000000-0000-0000-0000-000000000010', 'eoin.burke@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Eoin Burke', '+353 85 100 1010', 'Cycling enthusiast', FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, NOW() - INTERVAL '6 months', NOW());

-- Belfast/Northern Ireland guests
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000011', 'aisling.oneill@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Aisling O''Neill', '+44 28 111 2011', 'History buff and coastal walker', FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, NOW() - INTERVAL '8 months', NOW()),
('a1000000-0000-0000-0000-000000000012', 'cillian.stewart@outlook.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Cillian Stewart', '+44 28 222 3012', 'Weekend adventurer', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, NOW() - INTERVAL '5 months', NOW());

-- International guests living in Ireland
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000013', 'emma.johnson@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Emma Johnson', '+353 87 333 4013', 'American expat exploring Ireland', FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '4 months', NOW()),
('a1000000-0000-0000-0000-000000000014', 'hans.mueller@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Hans Mueller', '+353 86 444 5014', 'German tech worker in Dublin', FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, NOW() - INTERVAL '7 months', NOW()),
('a1000000-0000-0000-0000-000000000015', 'marie.dupont@outlook.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Marie Dupont', '+353 85 555 6015', 'French student at UCD', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, NOW() - INTERVAL '2 months', NOW());

-- More Irish guests
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES
('a1000000-0000-0000-0000-000000000016', 'fionnuala.brennan@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Fionnuala Brennan', '+353 87 666 7016', 'Yoga teacher seeking peaceful retreats', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '9 months', NOW()),
('a1000000-0000-0000-0000-000000000017', 'tadhg.odonoghue@yahoo.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Tadhg O''Donoghue', '+353 86 777 8017', 'Fisherman and outdoor cook', FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, NOW() - INTERVAL '6 months', NOW()),
('a1000000-0000-0000-0000-000000000018', 'grainne.fitzgerald@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Grainne Fitzgerald', '+353 85 888 9018', 'Couple looking for romantic getaways', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, NOW() - INTERVAL '3 months', NOW()),
('a1000000-0000-0000-0000-000000000019', 'oisin.healy@outlook.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Oisin Healy', '+353 87 999 0019', 'Solo traveler and writer', FALSE, FALSE, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '5 months', NOW()),
('a1000000-0000-0000-0000-000000000020', 'saoirse.kenny@gmail.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Saoirse Kenny', '+353 86 100 2020', 'Music festival enthusiast', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '4 months', NOW());
