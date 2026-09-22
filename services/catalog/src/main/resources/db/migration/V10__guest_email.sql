ALTER TABLE app_user ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE app_user ADD COLUMN verify_token TEXT;
ALTER TABLE app_user ADD COLUMN verify_expires_at TIMESTAMPTZ;
ALTER TABLE app_user ADD COLUMN reset_token TEXT;
ALTER TABLE app_user ADD COLUMN reset_expires_at TIMESTAMPTZ;

CREATE UNIQUE INDEX app_user_verify_token_unique
  ON app_user (verify_token)
  WHERE verify_token IS NOT NULL;

CREATE UNIQUE INDEX app_user_reset_token_unique
  ON app_user (reset_token)
  WHERE reset_token IS NOT NULL;

UPDATE app_user
SET email_verified = true
WHERE password_hash IS NOT NULL OR username IS NOT NULL;
