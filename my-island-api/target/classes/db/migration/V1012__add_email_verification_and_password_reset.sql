ALTER TABLE users
  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN email_verification_token VARCHAR(255),
  ADD COLUMN email_verification_token_expiry TIMESTAMP,
  ADD COLUMN password_reset_token VARCHAR(255),
  ADD COLUMN password_reset_token_expiry TIMESTAMP;

CREATE INDEX idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token);

-- Mark all existing seed users as verified
UPDATE users SET email_verified = TRUE;
