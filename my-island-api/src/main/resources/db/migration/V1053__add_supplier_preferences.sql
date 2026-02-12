-- Add supplier notification preference fields
ALTER TABLE suppliers
    ADD COLUMN email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN new_claim_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN weekly_report BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN is_deactivated BOOLEAN NOT NULL DEFAULT FALSE;
