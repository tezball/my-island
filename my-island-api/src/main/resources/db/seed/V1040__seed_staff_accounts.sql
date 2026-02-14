-- V1040: Seed staff accounts for testing

-- Staff user for Nore Valley Park (Owner)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('staff@norevalley.com', '$2b$10$sOF0W0oYpOFmEP0ftmaWhuqZ.j74lo9rZiI2N9ibNlW8RSiLpnS66', 'Aoife Brennan', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, owner_id, user_id, status)
VALUES (
    'staff@norevalley.com',
    (SELECT id FROM owners WHERE user_id = (SELECT id FROM users WHERE email = 'norevalley@myisland.com')),
    (SELECT id FROM users WHERE email = 'staff@norevalley.com'),
    'ACTIVE'
);

-- Staff user for Burren Glamping Village (Owner)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('staff@burrenglamp.ie', '$2b$10$sOF0W0oYpOFmEP0ftmaWhuqZ.j74lo9rZiI2N9ibNlW8RSiLpnS66', 'Cian Walsh', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, owner_id, user_id, status)
VALUES (
    'staff@burrenglamp.ie',
    (SELECT id FROM owners WHERE user_id = (SELECT id FROM users WHERE email = 'hello@burrenglampingvillage.ie')),
    (SELECT id FROM users WHERE email = 'staff@burrenglamp.ie'),
    'ACTIVE'
);

-- Staff user for Green Acres Farm Shop (Supplier)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('staff@greenacres.ie', '$2b$10$BU.7Ke9RaUYC661zG4yqA.JOir2D8hx868NHgwC1UBcx5g.5mLCOW', 'Niamh Kelly', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, supplier_id, user_id, status)
VALUES (
    'staff@greenacres.ie',
    (SELECT id FROM suppliers WHERE user_id = (SELECT id FROM users WHERE email = 'farmshop@greenacres.ie')),
    (SELECT id FROM users WHERE email = 'staff@greenacres.ie'),
    'ACTIVE'
);

-- Staff user for Aillwee Farm Shop (Supplier)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('staff@aillwee.ie', '$2b$10$BU.7Ke9RaUYC661zG4yqA.JOir2D8hx868NHgwC1UBcx5g.5mLCOW', 'Roisín Murphy', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, supplier_id, user_id, status)
VALUES (
    'staff@aillwee.ie',
    (SELECT id FROM suppliers WHERE user_id = (SELECT id FROM users WHERE email = 'info@aillweefarmshop.ie')),
    (SELECT id FROM users WHERE email = 'staff@aillwee.ie'),
    'ACTIVE'
);
