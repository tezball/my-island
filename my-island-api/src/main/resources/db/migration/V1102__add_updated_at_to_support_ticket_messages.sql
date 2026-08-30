-- Fix: support_ticket_messages was created without an updated_at column in V1065,
-- but SupportTicketMessage extends BaseEntity which maps a non-null updated_at.
-- Without this column, JPA schema validation (ddl-auto: validate) fails on startup.
ALTER TABLE support_ticket_messages
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
