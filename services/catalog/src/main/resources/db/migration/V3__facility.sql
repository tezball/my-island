-- Facilities are data (small MVP set), not a Java enum.
CREATE TABLE facility (
  id text PRIMARY KEY,
  label text NOT NULL
);

INSERT INTO facility (id, label) VALUES
  ('parking', 'Parking'),
  ('toilets', 'Toilets'),
  ('dog_friendly', 'Dog-friendly'),
  ('accessible', 'Accessible');
