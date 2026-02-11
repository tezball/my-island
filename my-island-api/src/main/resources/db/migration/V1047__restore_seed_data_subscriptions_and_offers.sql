-- V1047: Restore seed data subscriptions and offers
-- V1021 deleted offers from suppliers with subscription_status='NONE',
-- which wiped out all original seed data offers since V999 predated subscription_status.
-- This migration activates subscriptions for all seeded suppliers/owners and re-inserts deleted offers.

-- 1. Activate subscriptions for all seeded owners (user_id 1-14 from V999)
UPDATE owners
SET subscription_status = 'ACTIVE',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_seed_owner_' || id),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_seed_owner_' || id),
    subscription_current_period_end = COALESCE(subscription_current_period_end, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    subscription_cancel_at_period_end = FALSE
WHERE subscription_status = 'NONE'
  AND user_id IN (SELECT id FROM users WHERE email IN (
    'norevalley@myisland.com', 'wildatlantic@myisland.com', 'lakeside@myisland.com',
    'clifden@myisland.com', 'dingle@myisland.com', 'wicklow@myisland.com',
    'donegal@myisland.com', 'westcork@myisland.com', 'burren@myisland.com',
    'mayo@myisland.com', 'sligo@myisland.com', 'wexford@myisland.com',
    'kerry@myisland.com', 'antrim@myisland.com'
  ));

-- 2. Activate subscriptions for all seeded suppliers (user_id 15-35 from V999)
UPDATE suppliers
SET subscription_status = 'ACTIVE',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_seed_supplier_' || id),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_seed_supplier_' || id),
    subscription_current_period_end = COALESCE(subscription_current_period_end, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    subscription_cancel_at_period_end = FALSE
WHERE subscription_status = 'NONE'
  AND user_id IN (SELECT id FROM users WHERE email IN (
    'farmshop@greenacres.ie', 'kayaks@wildwater.ie', 'cycles@atlantictrails.ie',
    'stables@irishhorse.ie', 'surf@lahinch.ie', 'fishing@loughcorrib.ie',
    'cheese@durrus.ie', 'bakery@soda.ie', 'pub@oconnors.ie',
    'crafts@aranknits.ie', 'pottery@louisburgh.ie', 'whiskey@dingle.ie',
    'chocolate@skelligs.ie', 'seaweed@wildirish.ie', 'boat@blasket.ie',
    'yoga@retreat.ie', 'falconry@ashford.ie', 'golf@links.ie',
    'seafood@kinsale.ie', 'coffee@badger.ie', 'spa@monart.ie'
  ));

-- 3. Re-insert deleted offers (suppliers 2-21 from V999, deleted by V1021)
-- Only re-insert if they don't already exist (idempotent)
-- Using supplier IDs looked up by user email to be safe

-- Wild Water Kayaks (supplier for user kayaks@wildwater.ie)
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('€10 Off Kayak Rental', 'Save €10 on any half-day or full-day kayak rental', 'FIXED_AMOUNT', 10.00, 30.00, 'Valid for single or double kayaks. Booking required.', '2025-04-01'::date, '2027-12-31'::date, 150),
    ('Buy One Get One Free Tour', 'Bring a friend for free on our guided coastal tour', 'BUY_ONE_GET_ONE', 0.00, 50.00, 'Must book in advance. Subject to availability.', '2025-05-01'::date, '2027-12-31'::date, 75),
    ('Sunset Paddle Special', '20% off evening sunset paddles', 'PERCENTAGE', 20.00, 40.00, 'Available May-August, departing 7pm.', '2025-05-01'::date, '2027-12-31'::date, 100)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'kayaks@wildwater.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Atlantic Trail Cycles
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Full Day Bike Hire - 15% Off', 'Explore the Wild Atlantic Way for less', 'PERCENTAGE', 15.00, 25.00, 'Includes helmet, lock, and repair kit. Return by 6pm.', '2025-03-01'::date, '2027-12-31'::date, 300),
    ('E-Bike Experience', '€15 off electric bike rental', 'FIXED_AMOUNT', 15.00, 45.00, 'Full day e-bike hire. Range up to 80km.', '2025-03-01'::date, '2027-12-31'::date, 200),
    ('Family Bike Package', 'Family of 4 bikes for price of 3', 'PERCENTAGE', 25.00, 80.00, '2 adult + 2 child bikes. Trailer available at extra cost.', '2025-06-01'::date, '2027-12-31'::date, 100)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'cycles@atlantictrails.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Connemara Pony Treks
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('€10 Off Beach Trek', 'Discount on our popular beach ride experience', 'FIXED_AMOUNT', 10.00, 55.00, '2-hour beach trek. All riding levels welcome.', '2025-04-01'::date, '2027-12-31'::date, 150),
    ('Kids Pony Experience', 'Free lead rein session for under 8s with adult booking', 'FREE_ITEM', 0.00, 45.00, 'Adult must book full trek. Child session 30 minutes.', '2025-04-01'::date, '2027-12-31'::date, 100)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'stables@irishhorse.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Lahinch Surf School
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Beginner Lesson Bundle', 'Book 3 lessons, get 4th free', 'FREE_ITEM', 0.00, 120.00, 'Must be used within 14 days. Same student only.', '2025-05-01'::date, '2027-12-31'::date, 80),
    ('Surf & Stay Package', '20% off lessons for campsite guests', 'PERCENTAGE', 20.00, 45.00, 'Show valid campsite booking confirmation.', '2025-05-01'::date, '2027-12-31'::date, 200),
    ('Wetsuit Rental Included', 'Free wetsuit with any lesson booking', 'FREE_ITEM', 0.00, 45.00, 'Normally €10 extra. Limited sizes available.', '2025-04-01'::date, '2027-12-31'::date, 300)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'surf@lahinch.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Corrib Fishing Guides
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Half-Day Guided Fishing', '€20 off guided fishing experience', 'FIXED_AMOUNT', 20.00, 120.00, 'Includes boat, tackle, and guide. Fish cleaning service included.', '2025-03-01'::date, '2027-12-31'::date, 80),
    ('Early Bird Special', '25% off dawn fishing trips', 'PERCENTAGE', 25.00, 100.00, 'Depart 5am, return by noon. Coffee and sandwiches included.', '2025-04-01'::date, '2027-12-31'::date, 50)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'fishing@loughcorrib.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Durrus Farmhouse Cheese
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Cheese Board for Two', '€8 off artisan cheese platter', 'FIXED_AMOUNT', 8.00, 28.00, 'Selection of 5 cheeses with crackers and chutney.', '2025-01-01'::date, '2027-12-31'::date, 200),
    ('Farm Tour & Tasting', 'Free tour with cheese purchase over €30', 'FREE_ITEM', 0.00, 30.00, 'Tours run 11am and 3pm daily. Booking recommended.', '2025-04-01'::date, '2027-12-31'::date, 150)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'cheese@durrus.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Annascaul Bakery
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Baker''s Breakfast Deal', '15% off full Irish breakfast', 'PERCENTAGE', 15.00, 12.00, 'Served until 11:30am. Vegetarian option available.', '2025-01-01'::date, '2027-12-31'::date, 500),
    ('Fresh Bread Bundle', 'Buy 2 loaves, get sourdough half price', 'PERCENTAGE', 50.00, 8.00, 'Baked fresh each morning. While stocks last.', '2025-01-01'::date, '2027-12-31'::date, 400)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'bakery@soda.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- O'Connors Traditional Pub
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Seafood Chowder & Guinness', '€5 off our famous combo', 'FIXED_AMOUNT', 5.00, 18.00, 'Award-winning chowder with fresh soda bread.', '2025-01-01'::date, '2027-12-31'::date, 500),
    ('Traditional Music Night', 'Free Irish coffee with dinner', 'FREE_ITEM', 0.00, 25.00, 'Valid Fri-Sun when music session is on.', '2025-01-01'::date, '2027-12-31'::date, 300)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'pub@oconnors.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Aran Islands Knitwear
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('€20 Off Aran Sweaters', 'Discount on hand-knitted sweaters', 'FIXED_AMOUNT', 20.00, 120.00, 'Valid on full-price items only. One per customer.', '2025-01-01'::date, '2027-12-31'::date, 100),
    ('Free Scarf with Purchase', 'Complimentary wool scarf with sweater purchase', 'FREE_ITEM', 0.00, 150.00, 'Choice of 3 colors. While stocks last.', '2025-01-01'::date, '2027-12-31'::date, 50)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'crafts@aranknits.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Westport Pottery Studio
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Pottery Workshop Discount', '€10 off 2-hour pottery experience', 'FIXED_AMOUNT', 10.00, 45.00, 'Create your own piece to take home. All materials included.', '2025-01-01'::date, '2027-12-31'::date, 200),
    ('15% Off Gallery Purchases', 'Discount on handcrafted pottery', 'PERCENTAGE', 15.00, 30.00, 'Valid in-store only. Not valid with other offers.', '2025-01-01'::date, '2027-12-31'::date, 300)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'pottery@louisburgh.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Dingle Distillery Tours
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Distillery Tour & Tasting', '€5 off guided tour with whiskey flight', 'FIXED_AMOUNT', 5.00, 25.00, 'Tours run hourly 10am-5pm. Over 18s only.', '2025-01-01'::date, '2027-12-31'::date, 400),
    ('Exclusive Bottle Purchase', '10% off cask-strength whiskey', 'PERCENTAGE', 10.00, 80.00, 'Distillery exclusive. Not available elsewhere.', '2025-01-01'::date, '2027-12-31'::date, 100)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'whiskey@dingle.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Skelligs Chocolate Factory
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Chocolate Making Workshop', 'Book for 2, pay for 1', 'BUY_ONE_GET_ONE', 0.00, 35.00, '90-minute workshop. Take home your creations.', '2025-01-01'::date, '2027-12-31'::date, 80),
    ('Free Hot Chocolate', 'Complimentary drink with €15 purchase', 'FREE_ITEM', 0.00, 15.00, 'Made with our signature chocolate. Cafe seating available.', '2025-01-01'::date, '2027-12-31'::date, 500)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'chocolate@skelligs.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Wild Irish Seaweed Co
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Seaweed Foraging Walk', '€10 off guided coastal foraging', 'FIXED_AMOUNT', 10.00, 40.00, '2-hour walk with expert guide. Taste as you go!', '2025-04-01'::date, '2027-12-31'::date, 100),
    ('Seaweed Spa Treatment', '20% off kelp wrap experience', 'PERCENTAGE', 20.00, 60.00, '45-minute treatment. Booking essential.', '2025-01-01'::date, '2027-12-31'::date, 150)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'seaweed@wildirish.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Blasket Island Ferries
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Island Explorer Ticket', '€5 off return ferry crossing', 'FIXED_AMOUNT', 5.00, 40.00, 'Includes dolphin watching. Weather dependent.', '2025-04-01'::date, '2027-12-31'::date, 300),
    ('Guided Island Walk', 'Free guided walk with ferry booking', 'FREE_ITEM', 0.00, 45.00, '2-hour walk through abandoned village. Fascinating history.', '2025-05-01'::date, '2027-12-31'::date, 150)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'boat@blasket.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Burren Yoga Retreats
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Day Retreat Special', '€15 off full day yoga retreat', 'FIXED_AMOUNT', 15.00, 85.00, 'Includes lunch and herbal tea. All levels.', '2025-01-01'::date, '2027-12-31'::date, 100),
    ('Sunrise Yoga Session', 'Free mat hire with drop-in class', 'FREE_ITEM', 0.00, 15.00, 'Classes 7am daily in summer months.', '2025-05-01'::date, '2027-12-31'::date, 200)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'yoga@retreat.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Irish Hawking Club
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Falconry Experience', '€20 off private hawk walk', 'FIXED_AMOUNT', 20.00, 120.00, '2-hour experience with Harris hawk. Unforgettable!', '2025-01-01'::date, '2027-12-31'::date, 100),
    ('Owl Encounter', 'Kids fly an owl for half price', 'PERCENTAGE', 50.00, 45.00, '30-minute session with barn owl. Ages 8+.', '2025-01-01'::date, '2027-12-31'::date, 80)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'falconry@ashford.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Lahinch Golf Club
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Weekday Green Fees', '€25 off Monday-Thursday rounds', 'FIXED_AMOUNT', 25.00, 120.00, 'Championship Old Course. Handicap cert required.', '2025-03-01'::date, '2027-12-31'::date, 200),
    ('Twilight Golf Special', '50% off after 4pm', 'PERCENTAGE', 50.00, 60.00, 'Castle Course only. Last tee time 5pm.', '2025-05-01'::date, '2027-12-31'::date, 150)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'golf@links.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Kinsale Seafood Restaurant
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Early Bird Menu', '20% off 3-course dinner before 7pm', 'PERCENTAGE', 20.00, 45.00, 'Reservations required. Set menu.', '2025-01-01'::date, '2027-12-31'::date, 300),
    ('Seafood Platter for 2', '€15 off our signature sharing platter', 'FIXED_AMOUNT', 15.00, 75.00, 'Includes lobster, crab, oysters, and prawns.', '2025-01-01'::date, '2027-12-31'::date, 150)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'seafood@kinsale.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Badger & Dodo Coffee
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Coffee & Pastry Deal', 'Free pastry with any specialty coffee', 'FREE_ITEM', 0.00, 5.00, 'Valid until noon. Choice of croissant or muffin.', '2025-01-01'::date, '2027-12-31'::date, 500),
    ('Coffee Bag Discount', '€3 off 250g bag of beans', 'FIXED_AMOUNT', 3.00, 12.00, 'Single-origin roasted locally. Grind to order.', '2025-01-01'::date, '2027-12-31'::date, 300)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'coffee@badger.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- Woodland Spa & Wellness
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
SELECT s.id, v.title, v.description, v.discount_type, v.discount_value, v.min_purchase, v.terms_conditions, v.valid_from, v.valid_until, v.max_claims, TRUE
FROM suppliers s
CROSS JOIN (VALUES
    ('Forest Bathing Experience', '€20 off guided forest therapy', 'FIXED_AMOUNT', 20.00, 65.00, '2-hour mindful walk in ancient woodland.', '2025-01-01'::date, '2027-12-31'::date, 100),
    ('Spa Day Package', '25% off full day package', 'PERCENTAGE', 25.00, 150.00, 'Includes treatment, lunch, and outdoor hot tub.', '2025-01-01'::date, '2027-12-31'::date, 80)
) AS v(title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'spa@monart.ie')
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = v.title);

-- 4. Also activate owners added by later migrations (V1008, V1009, etc.) that are still NONE
UPDATE owners
SET subscription_status = 'ACTIVE',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_seed_owner_' || id),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_seed_owner_' || id),
    subscription_current_period_end = COALESCE(subscription_current_period_end, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    subscription_cancel_at_period_end = FALSE
WHERE subscription_status = 'NONE';
