-- V1044: Add a clean guest account for testing the full booking + payment flow.
-- This user has no existing bookings, so it can be used to test fresh booking creation.
-- Password: TestGuest#2026!Safe

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier)
VALUES ('testguest@example.com', '$2b$10$gdd3Wpaj3NpRh4i1jiYzSeua57D97aGnvK6Ky4RGhoaP8DIzkghWu', 'Test Guest', 'GUEST', FALSE, FALSE);
