-- Category is data, never a Java enum. Seeds match ops/data/listing-types.md.
CREATE TABLE category (
  id text PRIMARY KEY,
  label text NOT NULL,
  guest_verb text NOT NULL,
  sort_order integer NOT NULL
);

INSERT INTO category (id, label, guest_verb, sort_order) VALUES
  ('poi', 'Point of interest', 'visited', 1),
  ('experience', 'Experience', 'visited', 2),
  ('campsite', 'Campsite', 'visited or stayed', 3),
  ('bnb', 'B&B', 'visited or stayed', 4);
