-- WF-056. One hundred Gatling guests for the on-demand pulse and the 10-user trickle.
-- Test password for every row is guest, BCrypt ($2a$, strength 10), the house encoder.
-- Not a customer secret. Idempotent: a second boot inserts nothing new.
-- Activity attaches to places already in the catalog (imported leads / POIs).
-- This seed does not insert places and does not wipe a volume.
-- Cohorts by username number: 001-020 new (no visits), 021-040 one place,
-- 041-060 a short step (4), 061-080 moderate (8), 081-100 heavy (16).

INSERT INTO app_user (id, email, display_name, username, password_hash, email_verified)
SELECT
  ('00000000-0000-4000-a000-' || lpad(to_hex(n), 12, '0'))::uuid,
  'pulse-' || lpad(n::text, 3, '0') || '@gatling.test',
  'Pulse ' || lpad(n::text, 3, '0'),
  'pulse-' || lpad(n::text, 3, '0'),
  '$2a$10$yF2s58EPYxwqht8TT6Jo7eS2Weie4fL3S.uBrgCWAbmz77iYtrGpW',
  true
FROM generate_series(1, 100) AS n
WHERE NOT EXISTS (
  SELECT 1
  FROM app_user existing
  WHERE lower(existing.username) = lower('pulse-' || lpad(n::text, 3, '0'))
);

INSERT INTO visit_intent (guest_id, place_id, mark)
SELECT
  u.id,
  p.id,
  (ARRAY['been', 'want', 'never'])[1 + ((u.n + p.rn) % 3)::int]
FROM (
  SELECT
    id,
    substring(username FROM 7)::int AS n,
    CASE
      WHEN substring(username FROM 7)::int BETWEEN 1 AND 20 THEN 0
      WHEN substring(username FROM 7)::int BETWEEN 21 AND 40 THEN 1
      WHEN substring(username FROM 7)::int BETWEEN 41 AND 60 THEN 4
      WHEN substring(username FROM 7)::int BETWEEN 61 AND 80 THEN 8
      ELSE 16
    END AS quota
  FROM app_user
  WHERE username ~ '^pulse-[0-9]{3}$'
) u
JOIN LATERAL (
  SELECT id, row_number() OVER (ORDER BY slug) AS rn
  FROM place
) p ON p.rn <= u.quota
ON CONFLICT (guest_id, place_id) DO NOTHING;
