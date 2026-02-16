-- Remove '!' from all test account passwords for shell compatibility
-- This migration updates bcrypt hashes to match the new plaintext passwords

-- norevalley@myisland.com: NoreValley2025Secured (was NoreValley2025!Secured)
UPDATE users SET password_hash = '$2b$10$lCI1BKSYZWbR430FyFA2..YPLK.77gGGlw/sEFcy9YCFnQJbADEf2'
WHERE email = 'norevalley@myisland.com';

-- info@aillweefarmshop.ie: AillweeCh33seSecure (was AillweeCh33se!Secure)
UPDATE users SET password_hash = '$2b$10$M9K3V8pFN7n2ZFo7J8Tsy.204PjSozEa6rw.sFMnHIr5Q7hjIYDeS'
WHERE email = 'info@aillweefarmshop.ie';

-- bookings@loughdergcamping.ie: LoughDergCamp2025 (was LoughDerg!Camp2025)
UPDATE users SET password_hash = '$2b$10$mg7A..tyB2e/H5DewGrQh.otDsYc2QJo7DcAw7EXgbMTj0jA2nkP2'
WHERE email = 'bookings@loughdergcamping.ie';

-- hello@dinglekayak.ie: W@v3Rd3r$K3rrry#2026 (was W@v3R!d3r$K3rrry#2026)
UPDATE users SET password_hash = '$2b$10$Q5EJ.nf8OavQRh8bfq/KL.31Ge6H38ddQc8xnXcV9sbWHUzMImrZO'
WHERE email = 'hello@dinglekayak.ie';

-- Owner staff accounts: OwnerStaff#2026Secure (was OwnerStaff#2026!Secure)
UPDATE users SET password_hash = '$2b$10$izQ0A2kBopOqmYoJoAaZSuFlWG6vkxuhrX6V5svbxPdnGrFg/Rrby'
WHERE email IN ('staff@norevalley.com', 'staff@burrenglamp.ie', 'grounds@norevalley.com', 'viewer@norevalley.com');

-- Supplier staff accounts: SupplierStaff#2026Safe (was SupplierStaff#2026!Safe)
UPDATE users SET password_hash = '$2b$10$WfMTgy0FafCmxTIe6JTTf.PeA1X9TPqjQ6a/9NOfnDU24.Y1QrrZC'
WHERE email IN ('staff@greenacres.ie', 'staff@aillwee.ie', 'shop@greenacres.ie');

-- tezball86@gmail.com: PlatformAdmin#2026Secure (was PlatformAdmin#2026!Secure)
UPDATE users SET password_hash = '$2b$10$NcIt8yRQS9xYrpYPkf.QF.xkGG38Ucq3Va8yIWyB8e8IYPB4Rh7dK'
WHERE email = 'tezball86@gmail.com';

-- family@example.com: MurphyFamilyTrip2025 (was MurphyFamily!Trip2025)
UPDATE users SET password_hash = '$2b$10$eJkMA9Sstr9A2GzrCnbWHOXmjv1bzX7QI5vVG6pAzl12yRonBcv2u'
WHERE email = 'family@example.com';

-- testguest@example.com: TestGuest#2026Safe (was TestGuest#2026!Safe)
UPDATE users SET password_hash = '$2b$10$.uVrqgqH7RoqEweb19P9Ce5bWPcW1//ZVwwCg6qHAEuvgz5UO384u'
WHERE email = 'testguest@example.com';
