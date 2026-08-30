-- SupportTicketMessage extends BaseEntity, which requires updated_at.
-- Version is 1102 so this runs after seed migrations V1100/V1101.
ALTER TABLE support_ticket_messages
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();
