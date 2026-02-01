-- Add owner preference fields
ALTER TABLE owners
    ADD COLUMN email_notifications_bookings BOOLEAN DEFAULT TRUE,
    ADD COLUMN weekly_summary_reports BOOLEAN DEFAULT FALSE,
    ADD COLUMN instant_booking BOOLEAN DEFAULT TRUE,
    ADD COLUMN allow_same_day_bookings BOOLEAN DEFAULT FALSE,
    ADD COLUMN require_guest_verification BOOLEAN DEFAULT TRUE;
