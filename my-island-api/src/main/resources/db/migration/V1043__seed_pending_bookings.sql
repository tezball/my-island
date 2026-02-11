-- Seed bookings in PENDING status (payment authorized, awaiting owner confirmation)
-- and PENDING_PAYMENT status for testing the booking flow.
-- Uses Nore Valley lots (owner_id=1) and existing guest users.

-- Murphy Family: PENDING booking at Nore Valley (lot 1) - future dates
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, stripe_payment_intent_id, service_fee, charge_total, booking_source)
VALUES
    (36, 1, '2026-03-15', '2026-03-18', 4, 75.00, 'PENDING', 'AUTHORIZED', 'pi_dev_seed_pending_1', 3.75, 78.75, 'ONLINE'),
    (37, 2, '2026-03-20', '2026-03-22', 1, 50.00, 'PENDING', 'AUTHORIZED', 'pi_dev_seed_pending_2', 2.50, 52.50, 'ONLINE');

-- Adventure Seekers: PENDING_PAYMENT booking (guest hasn't paid yet)
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source)
VALUES
    (39, 3, '2026-03-25', '2026-03-28', 2, 90.00, 'PENDING_PAYMENT', 'NONE', 4.50, 94.50, 'ONLINE');
