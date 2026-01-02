-- V16__seed_support_data.sql
-- Seed FAQs, support tickets, check-in instructions, and messages

-- FAQs
INSERT INTO faqs (id, question, answer, category, sort_order, active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000007001', 'How do I cancel a booking?', 'You can cancel a booking from the My Bookings section. Select the booking you want to cancel and tap "Cancel Booking". Cancellation fees may apply depending on how close to the check-in date you cancel.', 'Booking', 1, TRUE, '2024-01-01', '2024-01-01'),
('00000000-0000-0000-0000-000000007002', 'Can I modify my booking dates?', 'Yes! Go to My Bookings, select your booking, and tap "Modify Dates". You can change dates subject to availability. Price differences will be calculated automatically.', 'Booking', 2, TRUE, '2024-01-01', '2024-01-01'),
('00000000-0000-0000-0000-000000007003', 'What payment methods are accepted?', 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay.', 'Payment', 1, TRUE, '2024-01-01', '2024-01-01'),
('00000000-0000-0000-0000-000000007004', 'How do I delete my account?', 'Go to Profile > Settings > Privacy & Security > Delete Account. Please note this action is permanent and will delete all your data including booking history.', 'Account', 1, TRUE, '2024-01-01', '2024-01-01'),
('00000000-0000-0000-0000-000000007005', 'Are pets allowed at campsites?', 'Pet policies vary by campsite. Look for the "Pets" facility icon on campsite listings. Always check the specific campsite rules before booking with pets.', 'Campsite', 1, TRUE, '2024-01-01', '2024-01-01');

-- Support ticket for demo user
INSERT INTO support_tickets (id, user_id, subject, description, category, status, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000008001', '00000000-0000-0000-0000-000000000001', 'Refund for cancelled booking', 'Hi, I cancelled my booking last week but haven''t received my refund yet. Booking ID: book-123', 'Payment', 'IN_PROGRESS', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Ticket messages
INSERT INTO ticket_messages (id, ticket_id, sender_id, content, is_staff_reply, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000008101', '00000000-0000-0000-0000-000000008001', '00000000-0000-0000-0000-000000000001', 'Hi, I cancelled my booking last week but haven''t received my refund yet. Booking ID: book-123', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000008102', '00000000-0000-0000-0000-000000008001', '00000000-0000-0000-0002-000000000001', 'Hi John, thanks for reaching out. I can see your cancellation request. Refunds typically take 5-7 business days to process. Your refund should arrive by January 2nd.', TRUE, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Check-in instructions for Clifden
INSERT INTO check_in_instructions (id, campsite_id, access_code, gate_code, wifi_name, wifi_password, check_in_time, check_out_time, directions, parking_info, host_name, host_phone, host_email, host_avatar, host_response_time, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000009001', '00000000-0000-0000-0000-000000000101', '4892#', '1234', 'ClifdenEco_Guest', 'WildAtlantic2025', '14:00', '11:00',
 'From Clifden town centre, take the Sky Road west. After 3km, turn left at the Eco Beach sign. Follow the gravel road for 500m to the reception.',
 'Park in the designated visitor bay on arrival. Your pitch has a dedicated parking space.',
 'Siobhan O''Malley', '+353 87 234 5678', 'siobhan@clifdeneco.ie', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Usually responds within 1 hour', '2022-01-15', '2022-01-15');

INSERT INTO check_in_rules (instructions_id, rule, sort_order) VALUES
('00000000-0000-0000-0000-000000009001', 'Quiet hours: 11pm - 7am', 1),
('00000000-0000-0000-0000-000000009001', 'No open fires - fire pits provided', 2),
('00000000-0000-0000-0000-000000009001', 'Dogs must be kept on lead', 3),
('00000000-0000-0000-0000-000000009001', 'Please recycle - bins by reception', 4),
('00000000-0000-0000-0000-000000009001', 'Maximum 6 people per pitch', 5);

-- Check-in instructions for Ring of Kerry
INSERT INTO check_in_instructions (id, campsite_id, access_code, wifi_name, wifi_password, check_in_time, check_out_time, directions, parking_info, host_name, host_phone, host_email, host_avatar, host_response_time, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000009002', '00000000-0000-0000-0000-000000000102', '7531#', 'RingOfKerry_Glamping', 'Mountains2025', '15:00', '10:00',
 'Take N72 from Killarney towards Kenmare. After 8km, look for our sign on the right. Turn right and follow the lane for 1km.',
 'Free parking at reception. A buggy will take you and your luggage to your accommodation.',
 'Patrick Kerry', '+353 86 345 6789', 'info@ringofkerryglamping.ie', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Usually responds within 30 minutes', '2021-06-01', '2021-06-01');

INSERT INTO check_in_rules (instructions_id, rule, sort_order) VALUES
('00000000-0000-0000-0000-000000009002', 'Quiet hours: 10pm - 8am', 1),
('00000000-0000-0000-0000-000000009002', 'No smoking in accommodation', 2),
('00000000-0000-0000-0000-000000009002', 'Breakfast served 8am - 10am', 3),
('00000000-0000-0000-0000-000000009002', 'Checkout: Leave key in lockbox', 4);

-- Host-guest messages for booking 1
INSERT INTO messages (id, booking_id, sender_id, content, is_read, created_at, updated_at) VALUES
('00000000-0000-0000-0000-00000000A001', '00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000000001', 'Hi Siobhan, we''re really looking forward to our stay! What time does the gate close in the evening?', TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('00000000-0000-0000-0000-00000000A002', '00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0001-000000000001', 'Hi John! The gate is accessible 24/7 with your code. I''ll send you the details closer to your arrival. Let me know if you have any other questions!', TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 hour');
