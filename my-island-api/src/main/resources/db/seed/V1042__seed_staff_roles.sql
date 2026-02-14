-- V1042: Update existing staff with different roles and add new staff test accounts

-- Update existing owner staff with roles
UPDATE staff_members SET role = 'MANAGER'
WHERE email = 'staff@norevalley.com' AND owner_id IS NOT NULL;

UPDATE staff_members SET role = 'RECEPTIONIST'
WHERE email = 'staff@burrenglamp.ie' AND owner_id IS NOT NULL;

-- Update existing supplier staff with roles
UPDATE staff_members SET role = 'MANAGER'
WHERE email = 'staff@greenacres.ie' AND supplier_id IS NOT NULL;

UPDATE staff_members SET role = 'REDEEMER'
WHERE email = 'staff@aillwee.ie' AND supplier_id IS NOT NULL;

-- Add new Groundskeeper staff for Nore Valley
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('grounds@norevalley.com', '$2b$10$sOF0W0oYpOFmEP0ftmaWhuqZ.j74lo9rZiI2N9ibNlW8RSiLpnS66', 'Seán O''Brien', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, owner_id, user_id, status, role)
VALUES (
    'grounds@norevalley.com',
    (SELECT id FROM owners WHERE user_id = (SELECT id FROM users WHERE email = 'norevalley@myisland.com')),
    (SELECT id FROM users WHERE email = 'grounds@norevalley.com'),
    'ACTIVE',
    'GROUNDSKEEPER'
);

-- Add new Viewer staff for Nore Valley
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('viewer@norevalley.com', '$2b$10$sOF0W0oYpOFmEP0ftmaWhuqZ.j74lo9rZiI2N9ibNlW8RSiLpnS66', 'Maeve Doyle', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, owner_id, user_id, status, role)
VALUES (
    'viewer@norevalley.com',
    (SELECT id FROM owners WHERE user_id = (SELECT id FROM users WHERE email = 'norevalley@myisland.com')),
    (SELECT id FROM users WHERE email = 'viewer@norevalley.com'),
    'ACTIVE',
    'VIEWER'
);

-- Add new Associate staff for Green Acres
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, is_staff, email_verified)
VALUES ('shop@greenacres.ie', '$2b$10$BU.7Ke9RaUYC661zG4yqA.JOir2D8hx868NHgwC1UBcx5g.5mLCOW', 'Pádraig Flynn', 'STAFF', FALSE, FALSE, TRUE, TRUE);

INSERT INTO staff_members (email, supplier_id, user_id, status, role)
VALUES (
    'shop@greenacres.ie',
    (SELECT id FROM suppliers WHERE user_id = (SELECT id FROM users WHERE email = 'farmshop@greenacres.ie')),
    (SELECT id FROM users WHERE email = 'shop@greenacres.ie'),
    'ACTIVE',
    'ASSOCIATE'
);
