-- V1004: Add more seed bookings to reach target of 75+
-- Users: 36=Murphy, 37=Solo, 38=Romantic, 39=Adventure, 40=Group

INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, special_requests) VALUES
    -- Autumn 2025 (COMPLETED)
    (36, 12, '2025-09-05', '2025-09-07', 4, 60.00, 'COMPLETED', NULL),
    (37, 18, '2025-09-10', '2025-09-12', 1, 56.00, 'COMPLETED', NULL),
    (38, 25, '2025-09-15', '2025-09-18', 2, 78.00, 'COMPLETED', 'Quiet spot please'),
    (39, 30, '2025-09-20', '2025-09-22', 2, 36.00, 'COMPLETED', NULL),
    (40, 35, '2025-09-25', '2025-09-28', 4, 126.00, 'COMPLETED', 'Near facilities'),
    (36, 40, '2025-10-02', '2025-10-05', 3, 66.00, 'COMPLETED', NULL),
    (37, 45, '2025-10-10', '2025-10-12', 1, 40.00, 'COMPLETED', NULL),
    (38, 50, '2025-10-15', '2025-10-17', 2, 76.00, 'COMPLETED', NULL),
    (39, 55, '2025-10-20', '2025-10-22', 2, 48.00, 'COMPLETED', NULL),
    (40, 60, '2025-10-27', '2025-10-30', 4, 120.00, 'COMPLETED', 'Mid-term break'),

    -- Winter 2025/2026 (COMPLETED)
    (36, 2, '2025-11-05', '2025-11-07', 2, 50.00, 'COMPLETED', NULL),
    (37, 14, '2025-11-15', '2025-11-17', 1, 140.00, 'COMPLETED', 'Cosy cabin trip'),
    (38, 28, '2025-12-05', '2025-12-07', 2, 180.00, 'COMPLETED', 'Christmas shopping break'),
    (39, 42, '2025-12-27', '2025-12-30', 2, 330.00, 'COMPLETED', 'New Year getaway'),
    (40, 68, '2026-01-03', '2026-01-05', 4, 450.00, 'COMPLETED', 'New Year detox hike'),

    -- Spring 2026 (COMPLETED/CONFIRMED)
    (36, 5, '2026-02-14', '2026-02-16', 2, 80.00, 'COMPLETED', 'Valentines'),
    (37, 19, '2026-03-15', '2026-03-18', 1, 66.00, 'COMPLETED', 'St Patricks Day'),
    (38, 33, '2026-03-20', '2026-03-22', 2, 350.00, 'COMPLETED', 'Spring equinox'),
    (39, 47, '2026-04-03', '2026-04-06', 2, 60.00, 'COMPLETED', 'Easter break'),
    (40, 52, '2026-04-10', '2026-04-12', 4, 48.00, 'COMPLETED', NULL),
    (36, 65, '2026-04-24', '2026-04-26', 4, 560.00, 'COMPLETED', NULL),
    (37, 70, '2026-05-01', '2026-05-03', 1, 390.00, 'COMPLETED', 'May bank holiday'),

    -- Summer 2026 (CONFIRMED/PENDING)
    (38, 1, '2026-06-05', '2026-06-08', 2, 75.00, 'CONFIRMED', 'June bank holiday'),
    (39, 6, '2026-06-12', '2026-06-14', 2, 84.00, 'CONFIRMED', NULL),
    (40, 10, '2026-06-19', '2026-06-21', 4, 440.00, 'CONFIRMED', 'Solstice group trip'),
    (36, 15, '2026-06-26', '2026-07-03', 4, 210.00, 'CONFIRMED', 'First week of summer holidays'),
    (37, 20, '2026-07-03', '2026-07-05', 1, 36.00, 'CONFIRMED', NULL),
    (38, 24, '2026-07-10', '2026-07-12', 2, 280.00, 'CONFIRMED', 'Summer weekend'),
    (39, 29, '2026-07-15', '2026-07-20', 2, 110.00, 'CONFIRMED', 'Wild camping trip'),
    (40, 34, '2026-07-24', '2026-07-26', 6, 350.00, 'CONFIRMED', 'Family reunion'),
    (36, 38, '2026-07-31', '2026-08-03', 4, 114.00, 'CONFIRMED', 'August bank holiday'),
    (37, 43, '2026-08-07', '2026-08-09', 1, 44.00, 'PENDING', 'Awaiting leave confirmation'),
    (38, 48, '2026-08-14', '2026-08-16', 2, 40.00, 'PENDING', NULL),
    (39, 53, '2026-08-21', '2026-08-23', 2, 48.00, 'PENDING', NULL),
    (40, 58, '2026-08-28', '2026-08-30', 4, 240.00, 'PENDING', 'End of summer'),

    -- Scattered Future/Past Cancellation (CANCELLED)
    (36, 3, '2025-08-10', '2025-08-12', 4, 50.00, 'CANCELLED', 'Child sick'),
    (37, 13, '2026-05-15', '2026-05-17', 1, 165.00, 'CANCELLED', 'Work conflict'),
    (39, 72, '2026-09-01', '2026-09-02', 2, 125.00, 'CANCELLED', 'Changed plans'),

    -- More Filler Bookings to Ensure Volume (Various Dates)
    (36, 4, '2026-05-20', '2026-05-22', 2, 70.00, 'CONFIRMED', NULL),
    (37, 8, '2026-05-25', '2026-05-27', 1, 150.00, 'CONFIRMED', NULL),
    (38, 16, '2026-06-01', '2026-06-03', 2, 60.00, 'CONFIRMED', NULL),
    (39, 21, '2026-06-10', '2026-06-12', 2, 44.00, 'CONFIRMED', NULL),
    (40, 26, '2026-06-20', '2026-06-22', 3, 66.00, 'CONFIRMED', NULL),
    (36, 31, '2026-07-01', '2026-07-05', 4, 100.00, 'CONFIRMED', NULL),
    (37, 36, '2026-07-10', '2026-07-12', 1, 45.00, 'CONFIRMED', NULL),
    (38, 41, '2026-07-20', '2026-07-22', 2, 50.00, 'CONFIRMED', NULL),
    (39, 46, '2026-08-01', '2026-08-05', 2, 80.00, 'CONFIRMED', NULL),
    (40, 51, '2026-08-10', '2026-08-12', 2, 200.00, 'CONFIRMED', NULL),
    (36, 56, '2026-09-01', '2026-09-03', 2, 56.00, 'PENDING', NULL),
    (37, 61, '2026-09-10', '2026-09-12', 1, 140.00, 'PENDING', NULL),
    (38, 66, '2026-04-15', '2026-04-17', 2, 265.00, 'COMPLETED', NULL),
    (39, 71, '2026-04-20', '2026-04-22', 2, 195.00, 'COMPLETED', NULL),
    (40, 74, '2026-05-05', '2026-05-07', 4, 155.00, 'COMPLETED', NULL),
    (36, 9, '2026-05-15', '2026-05-17', 2, 44.00, 'COMPLETED', NULL),
    (37, 17, '2026-05-22', '2026-05-24', 1, 50.00, 'COMPLETED', NULL),
    (38, 22, '2026-06-05', '2026-06-07', 2, 120.00, 'CONFIRMED', NULL),
    (39, 27, '2026-06-15', '2026-06-17', 2, 20.00, 'CONFIRMED', NULL),
    (40, 32, '2026-06-25', '2026-06-27', 4, 90.00, 'CONFIRMED', NULL),
    (36, 37, '2026-07-05', '2026-07-07', 2, 210.00, 'CONFIRMED', NULL),
    (37, 44, '2026-07-15', '2026-07-17', 1, 130.00, 'CONFIRMED', NULL),
    (38, 49, '2026-07-25', '2026-07-27', 2, 22.00, 'CONFIRMED', NULL),
    (39, 54, '2026-08-05', '2026-08-07', 2, 24.00, 'CONFIRMED', NULL),
    (40, 57, '2026-08-15', '2026-08-17', 4, 110.00, 'CONFIRMED', NULL),
    (36, 63, '2026-08-25', '2026-08-29', 4, 88.00, 'PENDING', NULL),
    (37, 69, '2026-09-05', '2026-09-07', 1, 165.00, 'PENDING', NULL);
