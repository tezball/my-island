-- V1030: Seed supplier review data for Green Acres Farm Shop (supplier_id=1)
-- First create REDEEMED offer claims for users, then add reviews

-- Create REDEEMED claims for various users at Green Acres Farm Shop offers
-- Green Acres has offers with supplier_id=1

-- Claim 1: Murphy Family (user 36) redeemed an offer
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 36, 'SEED-SR-001', 'REDEEMED', false,
       NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id LIMIT 1;

-- Claim 2: Solo Traveler (user 37) redeemed an offer
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 37, 'SEED-SR-002', 'REDEEMED', false,
       NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id LIMIT 1;

-- Claim 3: Romantic Getaway (user 38) redeemed a different offer
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 38, 'SEED-SR-003', 'REDEEMED', false,
       NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id DESC LIMIT 1;

-- Claim 4: Adventure Seekers (user 39) redeemed an offer
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 39, 'SEED-SR-004', 'REDEEMED', false,
       NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id LIMIT 1;

-- Claim 5: Hiking Group (user 40) redeemed an offer
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 40, 'SEED-SR-005', 'REDEEMED', false,
       NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id DESC LIMIT 1;

-- Claim 6: Family user (user 3 = family@example.com) redeemed an offer - for testing eligibility
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 3, 'SEED-SR-006', 'REDEEMED', false,
       NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id LIMIT 1;

-- Claim 7: Family user (user 3) has another REDEEMED claim at a different offer (not yet reviewed)
INSERT INTO offer_claims (offer_id, user_id, claim_code, status, is_test, claimed_at, redeemed_at, expires_at)
SELECT o.id, 3, 'SEED-SR-007', 'REDEEMED', false,
       NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days', NOW() + INTERVAL '30 days'
FROM offers o WHERE o.supplier_id = 1 AND o.is_active = true
ORDER BY o.id DESC LIMIT 1;

-- Now insert reviews for claims 1-5 (leave claims 6-7 unreviewed so family@example.com can test the review form)

-- Review 1: Murphy Family (user 36) - Enthusiastic about fresh local produce
INSERT INTO supplier_reviews (user_id, supplier_id, offer_claim_id, rating, comment,
    supplier_response, supplier_response_at, created_at, updated_at)
SELECT 36, 1, oc.id, 5.0,
    'Green Acres Farm Shop is an absolute gem! We popped in during our camping trip at Nore Valley and couldn''t believe the quality of their produce. The artisan cheeses were incredible, the sourdough bread was still warm from the oven, and the kids went mad for the homemade elderflower cordial. The staff were so friendly and gave us great tips on local walks. We ended up visiting three times during our week-long stay. Already planning our next trip around their seasonal market!',
    'What a wonderful review, thank you so much! We''re thrilled you enjoyed the cheeses - they''re made fresh by our neighbour in Kilkenny. The elderflower cordial is a firm favourite with families. We look forward to welcoming you back for our autumn harvest market!',
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '38 days', NOW() - INTERVAL '35 days'
FROM offer_claims oc WHERE oc.claim_code = 'SEED-SR-001' LIMIT 1;

-- Review 2: Solo Traveler (user 37) - Appreciated unique local experience
INSERT INTO supplier_reviews (user_id, supplier_id, offer_claim_id, rating, comment,
    supplier_response, supplier_response_at, created_at, updated_at)
SELECT 37, 1, oc.id, 4.5,
    'Visited Green Acres on a solo cycling tour through Kilkenny. What a find! The hamper I put together with their help was the highlight of my trip - local honey, smoked salmon, brown bread, and a bottle of craft cider. The discount voucher from my booking was a lovely bonus. The farm shop has real character and you can tell everything is sourced with care. Only wish they were open a bit later on weekdays for post-hike visits. Highly recommended for anyone exploring the Nore Valley.',
    'Thanks for taking the time to review! So glad the hamper was a hit. We''ve actually extended our summer opening hours to 7pm on weekdays now. Safe travels on your next adventure!',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '22 days', NOW() - INTERVAL '20 days'
FROM offer_claims oc WHERE oc.claim_code = 'SEED-SR-002' LIMIT 1;

-- Review 3: Romantic Getaway (user 38) - Date night ingredients
INSERT INTO supplier_reviews (user_id, supplier_id, offer_claim_id, rating, comment,
    created_at, updated_at)
SELECT 38, 1, oc.id, 4.0,
    'We stopped by Green Acres to pick up ingredients for a campfire dinner during our anniversary trip. The selection of local meats and vegetables was excellent, and the staff helped us choose the perfect steaks for grilling. The organic eggs were fantastic for our morning fry-up too. Pricing is a touch higher than supermarket rates, but the quality absolutely justifies it. A genuine farm-to-fork experience that made our trip extra special.',
    NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
FROM offer_claims oc WHERE oc.claim_code = 'SEED-SR-003' LIMIT 1;

-- Review 4: Adventure Seekers (user 39) - Post-hike refuelling
INSERT INTO supplier_reviews (user_id, supplier_id, offer_claim_id, rating, comment,
    supplier_response, supplier_response_at, created_at, updated_at)
SELECT 39, 1, oc.id, 4.5,
    'Perfect pit stop after a long hike along the Nore Valley Way! Their freshly baked scones and proper coffee hit the spot. We also stocked up on trail mix and energy bars - all locally made. The staff were chatty and full of local knowledge, pointed us towards a hidden waterfall we never would have found otherwise. The voucher discount was a nice touch. Will definitely be back next time we''re in the area.',
    'So happy you found the waterfall - it''s one of our favourite local secrets! Our scones come fresh from the oven at 10am daily. Thanks for the kind words and see you on your next adventure!',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'
FROM offer_claims oc WHERE oc.claim_code = 'SEED-SR-004' LIMIT 1;

-- Review 5: Hiking Group (user 40) - Group experience
INSERT INTO supplier_reviews (user_id, supplier_id, offer_claim_id, rating, comment,
    created_at, updated_at)
SELECT 40, 1, oc.id, 3.5,
    'Visited with a group of six after our hiking weekend at Nore Valley. The shop has a lovely atmosphere and the produce is clearly high quality. We picked up some jams and preserves as gifts which went down a treat back home. Service was friendly but a bit slow when it got busy - might struggle with larger groups at peak times. The outdoor seating area is a nice touch though. Would recommend visiting on a quieter weekday if you can.',
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
FROM offer_claims oc WHERE oc.claim_code = 'SEED-SR-005' LIMIT 1;

-- Update denormalized rating and count on supplier
UPDATE suppliers SET
    rating = (SELECT ROUND(AVG(r.rating), 1) FROM supplier_reviews r WHERE r.supplier_id = 1),
    review_count = (SELECT COUNT(*) FROM supplier_reviews r WHERE r.supplier_id = 1)
WHERE id = 1;
