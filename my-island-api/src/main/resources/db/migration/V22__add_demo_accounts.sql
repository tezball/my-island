-- V22__add_demo_accounts.sql
-- Add demo accounts matching frontend login page
-- Password for all: demo1234 (BCrypt hash)

-- Visitor demo account
INSERT INTO users (id, email, password_hash, name, phone, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
SELECT
    '00000000-0000-0000-0000-000000000100',
    'visitor@my-island.com',
    '$2a$10$gEbGJ1Drx//eQbg5SbaJsOdOfdQTGLZ4QY7qNTu.e0sjqDeRVfaRi', -- demo1234
    'Emma Murphy',
    '+353 87 555 1234',
    FALSE,
    FALSE,
    TRUE, TRUE, FALSE, TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'visitor@my-island.com');

-- Owner demo account (if not exists)
INSERT INTO users (id, email, password_hash, name, phone, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
SELECT
    '00000000-0000-0000-0000-000000000101',
    'owner@my-island.com',
    '$2a$10$gEbGJ1Drx//eQbg5SbaJsOdOfdQTGLZ4QY7qNTu.e0sjqDeRVfaRi', -- demo1234
    'Sarah O''Brien',
    '+353 87 123 4567',
    TRUE,
    FALSE,
    TRUE, TRUE, FALSE, TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'owner@my-island.com');

-- Supplier demo account (if not exists)
INSERT INTO users (id, email, password_hash, name, phone, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
SELECT
    '00000000-0000-0000-0000-000000000102',
    'supplier@my-island.com',
    '$2a$10$gEbGJ1Drx//eQbg5SbaJsOdOfdQTGLZ4QY7qNTu.e0sjqDeRVfaRi', -- demo1234
    'Michael Kelly',
    '+353 87 555 5678',
    FALSE,
    TRUE,
    TRUE, TRUE, FALSE, TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'supplier@my-island.com');
