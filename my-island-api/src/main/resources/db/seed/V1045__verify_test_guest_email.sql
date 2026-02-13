-- V1045: Mark testguest@example.com as email verified so the account is usable for testing.
UPDATE users SET email_verified = TRUE WHERE email = 'testguest@example.com';
