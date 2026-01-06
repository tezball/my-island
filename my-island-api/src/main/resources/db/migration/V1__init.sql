-- V1__init.sql
-- Comprehensive schema and seed data for my-island camping/glamping platform
-- Flyway handles both schema creation and seeding

-- ============================================
-- SCHEMA CREATION
-- ============================================

-- Users table
CREATE TABLE users (
    email_notifications boolean,
    is_owner boolean NOT NULL,
    is_supplier boolean NOT NULL,
    marketing_notifications boolean,
    push_notifications boolean,
    sms_notifications boolean,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    bio character varying(500),
    avatar character varying(255),
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(255),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Linked accounts
CREATE TABLE linked_accounts (
    connected boolean NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    email character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    CONSTRAINT linked_accounts_pkey PRIMARY KEY (id),
    CONSTRAINT linked_accounts_user_id_provider_key UNIQUE (user_id, provider),
    CONSTRAINT linked_accounts_provider_check CHECK (((provider)::text = ANY ((ARRAY['GOOGLE'::character varying, 'APPLE'::character varying, 'FACEBOOK'::character varying])::text[]))),
    CONSTRAINT fkmsnsia7gyeipkp0to1ftol5wj FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Suppliers
CREATE TABLE suppliers (
    latitude double precision,
    longitude double precision,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    eircode character varying(10),
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    category character varying(50),
    phone_number character varying(50),
    logo_url character varying(500),
    description character varying(2000),
    business_name character varying(255),
    contact_email character varying(255),
    location character varying(255),
    CONSTRAINT suppliers_pkey PRIMARY KEY (id),
    CONSTRAINT suppliers_user_id_key UNIQUE (user_id),
    CONSTRAINT suppliers_category_check CHECK (((category)::text = ANY ((ARRAY['RESTAURANT'::character varying, 'PUB'::character varying, 'FARM_SHOP'::character varying, 'GROCERY'::character varying, 'OUTDOOR_GEAR'::character varying, 'KAYAK_RENTAL'::character varying, 'BIKE_RENTAL'::character varying, 'FISHING'::character varying, 'CONVENIENCE'::character varying])::text[]))),
    CONSTRAINT fkja3xaqihwgllahrmo5op9ks4d FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Campsites
CREATE TABLE campsites (
    active boolean NOT NULL,
    featured boolean NOT NULL,
    latitude double precision,
    longitude double precision,
    price_per_night numeric(10,2),
    rating numeric(3,2),
    review_count integer,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    owner_id uuid NOT NULL,
    description character varying(2000),
    address character varying(255),
    county character varying(255),
    name character varying(255) NOT NULL,
    CONSTRAINT campsites_pkey PRIMARY KEY (id),
    CONSTRAINT fk4igdfdifit5ul5d4400icvvca FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Campsite images
CREATE TABLE campsite_images (
    campsite_id uuid NOT NULL,
    image_url text,
    CONSTRAINT fkiqfvb7262ttk04cp372okmi74 FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Campsite facilities
CREATE TABLE campsite_facilities (
    campsite_id uuid NOT NULL,
    facility character varying(255),
    CONSTRAINT campsite_facilities_facility_check CHECK (((facility)::text = ANY ((ARRAY['WIFI'::character varying, 'ELECTRIC'::character varying, 'WATER'::character varying, 'TOILET'::character varying, 'SHOWER'::character varying, 'LAUNDRY'::character varying, 'SHOP'::character varying, 'RESTAURANT'::character varying, 'PLAYGROUND'::character varying, 'BEACH'::character varying, 'FISHING'::character varying, 'HIKING'::character varying, 'CYCLING'::character varying, 'PETS'::character varying])::text[]))),
    CONSTRAINT fktlxgdio1b6l8pqy3s7q2kiugd FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Lots
CREATE TABLE lots (
    available boolean NOT NULL,
    capacity integer NOT NULL,
    price_per_night numeric(10,2) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    campsite_id uuid NOT NULL,
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    CONSTRAINT lots_pkey PRIMARY KEY (id),
    CONSTRAINT lots_type_check CHECK (((type)::text = ANY ((ARRAY['TENT'::character varying, 'CARAVAN'::character varying, 'CAMPERVAN'::character varying, 'GLAMPING'::character varying, 'CABIN'::character varying, 'RV'::character varying, 'TREEHOUSE'::character varying, 'YURT'::character varying, 'POD'::character varying, 'APARTMENT'::character varying, 'COTTAGE'::character varying, 'SAFARI_TENT'::character varying, 'BED_AND_BREAKFAST'::character varying, 'MOBILE_HOME'::character varying])::text[]))),
    CONSTRAINT fksedjcrpyl84jclbq11cs3qlo6 FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Lot images
CREATE TABLE lot_images (
    lot_id uuid NOT NULL,
    image_url character varying(255),
    CONSTRAINT fki8jrc68p1sp5rmm9ajdycmoig FOREIGN KEY (lot_id) REFERENCES lots(id)
);

-- Lot amenities
CREATE TABLE lot_amenities (
    lot_id uuid NOT NULL,
    amenity character varying(255),
    CONSTRAINT fkcbvncjbhc70qxast002i8cyq4 FOREIGN KEY (lot_id) REFERENCES lots(id)
);

-- Bookings
CREATE TABLE bookings (
    check_in date NOT NULL,
    check_out date NOT NULL,
    extras_price numeric(10,2),
    guests integer NOT NULL,
    lot_price numeric(10,2) NOT NULL,
    service_fee numeric(10,2),
    total_price numeric(10,2) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    lot_id uuid NOT NULL,
    user_id uuid NOT NULL,
    special_requests character varying(1000),
    cancellation_reason character varying(255),
    status character varying(255) NOT NULL,
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'CHECKED_IN'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT fks3ra4466vq4n5u98gnlk7mij6 FOREIGN KEY (lot_id) REFERENCES lots(id),
    CONSTRAINT fkeyog2oic85xg7hsu2je2lx3s6 FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Lot availability
CREATE TABLE lot_availability (
    date date NOT NULL,
    price_override numeric(10,2),
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_id uuid,
    id uuid NOT NULL,
    lot_id uuid NOT NULL,
    status character varying(255) NOT NULL,
    CONSTRAINT lot_availability_pkey PRIMARY KEY (id),
    CONSTRAINT lot_availability_lot_id_date_key UNIQUE (lot_id, date),
    CONSTRAINT lot_availability_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'BOOKED'::character varying, 'BLOCKED'::character varying, 'MAINTENANCE'::character varying])::text[]))),
    CONSTRAINT fk7n2ra854cbq2q8mrdpn1akuuy FOREIGN KEY (lot_id) REFERENCES lots(id),
    CONSTRAINT fkoaodrh4fu2jdp4e21m1mb12jw FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Extras
CREATE TABLE extras (
    available boolean NOT NULL,
    per_night boolean,
    price numeric(10,2) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    campsite_id uuid,
    id uuid NOT NULL,
    description character varying(255),
    image_url character varying(255),
    name character varying(255) NOT NULL,
    CONSTRAINT extras_pkey PRIMARY KEY (id),
    CONSTRAINT fkan8hdvantovp29rrntdd6xrb7 FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Booking extras
CREATE TABLE booking_extras (
    quantity integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_id uuid NOT NULL,
    extra_id uuid NOT NULL,
    id uuid NOT NULL,
    CONSTRAINT booking_extras_pkey PRIMARY KEY (id),
    CONSTRAINT fk2soqb9kk2v1hnk6fr4wdxdlax FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fkiau8e0uoyv2lu3m0cnppn7awk FOREIGN KEY (extra_id) REFERENCES extras(id)
);

-- Reviews
CREATE TABLE reviews (
    cleanliness_rating integer,
    facilities_rating integer,
    helpful_count integer,
    location_rating integer,
    rating integer NOT NULL,
    value_rating integer,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_id uuid NOT NULL,
    campsite_id uuid NOT NULL,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    owner_response character varying(1000),
    comment character varying(2000) NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_booking_id_key UNIQUE (booking_id),
    CONSTRAINT reviews_rating_check CHECK (((rating <= 5) AND (rating >= 1))),
    CONSTRAINT fk28an517hrxtt2bsg93uefugrm FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fkbcx08oi5labb6kw67f39ra1co FOREIGN KEY (campsite_id) REFERENCES campsites(id),
    CONSTRAINT fkcgy7qjc1r99dp117y9en6lxye FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Favorites
CREATE TABLE favorites (
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    campsite_id uuid NOT NULL,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT favorites_user_id_campsite_id_key UNIQUE (user_id, campsite_id),
    CONSTRAINT fkfmf1ajjs603kdwh6otyv0nc92 FOREIGN KEY (campsite_id) REFERENCES campsites(id),
    CONSTRAINT fkk7du8b8ewipawnnpg76d55fus FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Messages
CREATE TABLE messages (
    is_read boolean,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_id uuid NOT NULL,
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content character varying(2000) NOT NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT fk3dchyurwssx2ht9hgswmw7jt1 FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fk4ui4nnwntodh6wjvck53dbk9m FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
    is_read boolean,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    message character varying(500),
    action_url character varying(255),
    related_id character varying(255),
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['BOOKING'::character varying, 'REVIEW'::character varying, 'OFFER'::character varying, 'SYSTEM'::character varying, 'REMINDER'::character varying])::text[]))),
    CONSTRAINT fk9y21adhxn0ayjhfocscqox7bh FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Check-in instructions
CREATE TABLE check_in_instructions (
    check_in_time time(0) without time zone NOT NULL,
    check_out_time time(0) without time zone NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    campsite_id uuid NOT NULL,
    id uuid NOT NULL,
    parking_info character varying(500),
    host_avatar character varying(1000),
    directions character varying(2000),
    access_code character varying(255),
    gate_code character varying(255),
    host_email character varying(255),
    host_name character varying(255),
    host_phone character varying(255),
    host_response_time character varying(255),
    wifi_name character varying(255),
    wifi_password character varying(255),
    CONSTRAINT check_in_instructions_pkey PRIMARY KEY (id),
    CONSTRAINT check_in_instructions_campsite_id_key UNIQUE (campsite_id),
    CONSTRAINT fkqbpm5wwnqrprl75iyrns11tqt FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Check-in rules
CREATE TABLE check_in_rules (
    sort_order integer NOT NULL,
    instructions_id uuid NOT NULL,
    rule character varying(255),
    CONSTRAINT check_in_rules_pkey PRIMARY KEY (sort_order, instructions_id),
    CONSTRAINT fk3l76n5dq8jjsvml4u8nndove6 FOREIGN KEY (instructions_id) REFERENCES check_in_instructions(id)
);

-- Offers
CREATE TABLE offers (
    active boolean NOT NULL,
    discount_percent integer,
    discount_price numeric(10,2),
    featured boolean NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    original_price numeric(10,2),
    valid_from date,
    valid_until date,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    campsite_id uuid,
    id uuid NOT NULL,
    description character varying(2000),
    category character varying(255) NOT NULL,
    image_url character varying(255),
    promo_code character varying(255),
    title character varying(255) NOT NULL,
    CONSTRAINT offers_pkey PRIMARY KEY (id),
    CONSTRAINT offers_category_check CHECK (((category)::text = ANY ((ARRAY['FOOD'::character varying, 'ACTIVITIES'::character varying, 'GEAR'::character varying, 'ATTRACTIONS'::character varying, 'TRANSPORT'::character varying])::text[]))),
    CONSTRAINT fkr7wwo8ls9j0ypy6gysgey5lcg FOREIGN KEY (campsite_id) REFERENCES campsites(id)
);

-- Local businesses
CREATE TABLE local_businesses (
    active boolean NOT NULL,
    featured boolean NOT NULL,
    latitude double precision,
    longitude double precision,
    rating numeric(3,2),
    review_count integer,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    description character varying(2000),
    address character varying(255),
    category character varying(255) NOT NULL,
    county character varying(255),
    email character varying(255),
    name character varying(255) NOT NULL,
    phone character varying(255),
    website character varying(255),
    weekday_hours character varying(255),
    weekend_hours character varying(255),
    CONSTRAINT local_businesses_pkey PRIMARY KEY (id),
    CONSTRAINT local_businesses_category_check CHECK (((category)::text = ANY ((ARRAY['RESTAURANT'::character varying, 'PUB'::character varying, 'FARM_SHOP'::character varying, 'GROCERY'::character varying, 'OUTDOOR_GEAR'::character varying, 'KAYAK_RENTAL'::character varying, 'BIKE_RENTAL'::character varying, 'FISHING'::character varying, 'CONVENIENCE'::character varying])::text[])))
);

-- Local business images
CREATE TABLE local_business_images (
    local_business_id uuid NOT NULL,
    image_url character varying(255),
    CONSTRAINT fkhwckh397bxp790qt23cy6klyh FOREIGN KEY (local_business_id) REFERENCES local_businesses(id)
);

-- Support tickets
CREATE TABLE support_tickets (
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_id uuid,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    description character varying(2000),
    category character varying(255),
    status character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
    CONSTRAINT support_tickets_status_check CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'IN_PROGRESS'::character varying, 'RESOLVED'::character varying, 'CLOSED'::character varying])::text[]))),
    CONSTRAINT fk4reg1h2465c00bg6dmqlv7ujv FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk5xn7pb1up58bl15wbjb8a5esu FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Ticket messages
CREATE TABLE ticket_messages (
    is_staff_reply boolean,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    ticket_id uuid NOT NULL,
    content character varying(2000) NOT NULL,
    CONSTRAINT ticket_messages_pkey PRIMARY KEY (id),
    CONSTRAINT fk3cdue8h4un44cfo9q4tq4mt4n FOREIGN KEY (sender_id) REFERENCES users(id),
    CONSTRAINT fkf95vo0g1fx8hddsno1j8jtd4o FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
);

-- FAQs
CREATE TABLE faqs (
    active boolean NOT NULL,
    sort_order integer,
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    answer character varying(2000) NOT NULL,
    category character varying(255) NOT NULL,
    question character varying(255) NOT NULL,
    CONSTRAINT faqs_pkey PRIMARY KEY (id)
);

-- Property drafts
CREATE TABLE property_drafts (
    created_at timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    id uuid NOT NULL,
    owner_id uuid NOT NULL,
    property_type character varying(255) NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT property_drafts_pkey PRIMARY KEY (id),
    CONSTRAINT property_drafts_property_type_check CHECK (((property_type)::text = ANY ((ARRAY['CAMPSITE'::character varying, 'BNB'::character varying])::text[]))),
    CONSTRAINT fko4ttwxdl27fdjbrpmopvpstpp FOREIGN KEY (owner_id) REFERENCES users(id)
);


-- ============================================
-- SEED DATA
-- Password for all demo accounts: demo1234
-- BCrypt hash: $2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi
-- ============================================

-- ============================================
-- USERS (12 total: 1 guest, 1 supplier, 10 owners)
-- ============================================

-- Guest account
INSERT INTO users (id, email, password_hash, name, phone, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000001', 'visitor@my-island.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Emma Murphy', '+353 87 555 1234', FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Supplier account
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000002', 'supplier@my-island.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Michael Kelly', '+353 87 555 5678', 'Local outdoor equipment supplier serving campsites across Ireland.', FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Sean O'Donnell (3 properties - Wild Atlantic Way)
INSERT INTO users (id, email, password_hash, name, phone, bio, avatar, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000001', 'sean@wildatlantic-glamping.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Sean O''Donnell', '+353 74 555 5678', 'Former fisherman turned eco-tourism entrepreneur. Owns 3 properties along the Wild Atlantic Way.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Mary Gallagher (2 properties - Galway)
INSERT INTO users (id, email, password_hash, name, phone, bio, avatar, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000002', 'mary@galwaybay-guesthouse.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Mary Gallagher', '+353 91 555 1234', 'Third-generation hospitality professional in Galway. Passionate about Irish culture and local food.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Aoife Brennan (1 property - Cork)
INSERT INTO users (id, email, password_hash, name, phone, bio, avatar, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000003', 'aoife@cork-eco-retreat.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Aoife Brennan', '+353 21 555 9012', 'Sustainability advocate and designer. Created an award-winning eco-retreat in West Cork.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Sarah O'Brien (1 property - Wicklow)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000004', 'owner@my-island.com', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Sarah O''Brien', '+353 87 123 4567', 'Nature lover running a family-friendly woodland camp in the Wicklow Mountains.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Patrick Kerry (1 property - Kerry)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000005', 'patrick@ringofkerry.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Patrick Kerry', '+353 66 555 3456', 'Lifelong Kerry resident sharing the beauty of the Ring of Kerry with visitors from around the world.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Siobhan O'Malley (2 properties - Connemara)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000006', 'siobhan@clifdeneco.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Siobhan O''Malley', '+353 95 555 7890', 'Environmental scientist turned glamping entrepreneur. Runs 2 eco-focused sites in Connemara.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Liam Brennan (1 property - Clare)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000007', 'liam@burrencamping.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Liam Brennan', '+353 65 555 2345', 'Farmer and campsite owner in the heart of the Burren. Offering authentic rural Irish experiences.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Niamh Walsh (1 property - Kerry)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000008', 'niamh@dinglebandb.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Niamh Walsh', '+353 66 555 8901', 'Running a cozy B&B on the Dingle Peninsula with stunning ocean views.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- Owner: Declan Murphy (1 property - Antrim)
INSERT INTO users (id, email, password_hash, name, phone, bio, is_owner, is_supplier, email_notifications, push_notifications, sms_notifications, marketing_notifications, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000009', 'declan@giantscauseway.ie', '$2a$10$2JGfLWNvpojLau8SanBWKubgvV9lNQg1AzbA2hqo4OXjqTFtaGzqi', 'Declan Murphy', '+353 28 555 6789', 'Showcasing the dramatic beauty of the Causeway Coast through unique camping experiences.', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, NOW(), NOW());

-- ============================================
-- CAMPSITES (13 properties total)
-- ============================================

-- Sean O'Donnell's Properties (3)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Wild Atlantic Glamping', 'Luxury geodesic domes perched on cliffs overlooking the Atlantic Ocean. Each dome features a private hot tub, king-sized bed, and panoramic windows for stargazing. Wake up to the sound of waves and stunning sunset views.', 'Malin Head Road, Malin', 'Donegal', 55.3714, -7.3742, 185.00, 4.85, 127, TRUE, TRUE, NOW(), NOW()),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Donegal Coastal Camp', 'Traditional camping with a modern twist. Family-friendly site with direct beach access, perfect for surfers and outdoor enthusiasts. On-site facilities include a camp shop and fish & chips takeaway.', 'Downings Beach Road', 'Donegal', 55.1894, -7.8456, 45.00, 4.52, 89, FALSE, TRUE, NOW(), NOW()),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Sligo Surf Camp', 'Ireland''s premier surf camping destination. Wake up steps from world-class waves at Strandhill Beach. Equipment rental and lessons available. Communal fire pit and surf shack cafe.', 'Shore Road, Strandhill', 'Sligo', 54.2708, -8.5992, 35.00, 4.67, 156, TRUE, TRUE, NOW(), NOW());

-- Mary Gallagher's Properties (2)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Galway Bay Guesthouse', 'Charming family-run guesthouse overlooking Galway Bay. Traditional Irish breakfast included daily. Walking distance to Salthill promenade and a short bus ride to Galway city center.', 'Salthill Promenade', 'Galway', 53.2590, -9.0863, 120.00, 4.78, 203, TRUE, TRUE, NOW(), NOW()),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Connemara Retreat', 'Escape to peaceful stone cottages in the heart of Connemara. Each cottage features a turf fire, fully equipped kitchen, and views of the Twelve Bens mountains. Perfect for walkers and nature lovers.', 'Letterfrack Village', 'Galway', 53.5519, -9.9456, 145.00, 4.91, 78, FALSE, TRUE, NOW(), NOW());

-- Aoife Brennan's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'West Cork Eco Retreat', 'Award-winning sustainable retreat featuring solar-powered treehouses and recycled shipping container cabins. Farm-to-table restaurant on site. Carbon-neutral certified and surrounded by organic gardens.', 'Glengarriff Woods', 'Cork', 51.7506, -9.5517, 175.00, 4.95, 167, TRUE, TRUE, NOW(), NOW());

-- Sarah O'Brien's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', 'Wicklow Woodland Camp', 'Family-friendly woodland camping in the heart of the Wicklow Mountains. Nature trails, outdoor activities, and stargazing opportunities. Close to Glendalough and other historic sites.', 'Laragh Village', 'Wicklow', 53.0117, -6.3456, 55.00, 4.45, 92, FALSE, TRUE, NOW(), NOW());

-- Patrick Kerry's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000005', 'Ring of Kerry Glamping', 'Luxury safari tents on the famous Ring of Kerry route. Breathtaking mountain and lake views. Each tent includes a wood-burning stove, outdoor deck, and private BBQ area.', 'Killarney National Park', 'Kerry', 52.0091, -9.5714, 165.00, 4.82, 134, TRUE, TRUE, NOW(), NOW());

-- Siobhan O'Malley's Properties (2)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000006', 'Clifden Eco Camp', 'Sustainable camping in the capital of Connemara. Yurts and eco-pods powered by wind and solar. Walking distance to Clifden town, the Sky Road, and numerous hiking trails.', 'Sky Road, Clifden', 'Galway', 53.4897, -10.0234, 85.00, 4.63, 71, FALSE, TRUE, NOW(), NOW()),
('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000006', 'Roundstone Harbour View', 'Boutique glamping overlooking Roundstone Harbour. Watch fishermen bring in their daily catch. Fresh seafood restaurant on site. Perfect for foodies and photographers.', 'Roundstone Harbour', 'Galway', 53.3956, -9.9178, 155.00, 4.88, 56, TRUE, TRUE, NOW(), NOW());

-- Liam Brennan's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000007', 'Burren Camping', 'Camp among the unique limestone landscape of the Burren. Working farm with fresh eggs and milk available. Close to the Cliffs of Moher and Doolin''s famous music pubs.', 'Ballyvaughan Road', 'Clare', 53.0789, -9.1234, 40.00, 4.34, 145, FALSE, TRUE, NOW(), NOW());

-- Niamh Walsh's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000008', 'Dingle Peninsula B&B', 'Cozy bed & breakfast with stunning views of Dingle Bay. Hearty Irish breakfast featuring local produce. Walking distance to Dingle town''s famous pubs and restaurants.', 'Slea Head Drive', 'Kerry', 52.1408, -10.2678, 110.00, 4.72, 189, FALSE, TRUE, NOW(), NOW());

-- Declan Murphy's Property (1)
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, price_per_night, rating, review_count, featured, active, created_at, updated_at)
VALUES
('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000009', 'Giant''s Causeway Camp', 'Camp on the dramatic Causeway Coast. Mixed accommodation from traditional pitches to luxury pods. Walking distance to the Giant''s Causeway World Heritage Site.', 'Causeway Road, Bushmills', 'Antrim', 55.2408, -6.5117, 65.00, 4.56, 212, TRUE, TRUE, NOW(), NOW());

-- ============================================
-- CAMPSITE IMAGES
-- ============================================

INSERT INTO campsite_images (campsite_id, image_url) VALUES
-- Wild Atlantic Glamping
('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800'),
('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1520824071669-8a84a5f6c5f5?w=800'),
('c0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'),
-- Donegal Coastal Camp
('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'),
('c0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'),
-- Sligo Surf Camp
('c0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800'),
('c0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=800'),
-- Galway Bay Guesthouse
('c0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
('c0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'),
-- Connemara Retreat
('c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800'),
('c0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'),
-- West Cork Eco Retreat
('c0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
('c0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800'),
-- Wicklow Woodland Camp
('c0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800'),
('c0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800'),
-- Ring of Kerry Glamping
('c0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800'),
('c0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=800'),
-- Clifden Eco Camp
('c0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1496545672447-f699b503d270?w=800'),
-- Roundstone Harbour View
('c0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'),
-- Burren Camping
('c0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800'),
-- Dingle Peninsula B&B
('c0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'),
-- Giant's Causeway Camp
('c0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');

-- ============================================
-- CAMPSITE FACILITIES
-- ============================================

INSERT INTO campsite_facilities (campsite_id, facility) VALUES
-- Wild Atlantic Glamping (luxury amenities)
('c0000000-0000-0000-0000-000000000001', 'WIFI'),
('c0000000-0000-0000-0000-000000000001', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000001', 'WATER'),
('c0000000-0000-0000-0000-000000000001', 'TOILET'),
('c0000000-0000-0000-0000-000000000001', 'SHOWER'),
('c0000000-0000-0000-0000-000000000001', 'RESTAURANT'),
('c0000000-0000-0000-0000-000000000001', 'HIKING'),
-- Donegal Coastal Camp (family camping)
('c0000000-0000-0000-0000-000000000002', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000002', 'WATER'),
('c0000000-0000-0000-0000-000000000002', 'TOILET'),
('c0000000-0000-0000-0000-000000000002', 'SHOWER'),
('c0000000-0000-0000-0000-000000000002', 'SHOP'),
('c0000000-0000-0000-0000-000000000002', 'BEACH'),
('c0000000-0000-0000-0000-000000000002', 'PLAYGROUND'),
('c0000000-0000-0000-0000-000000000002', 'PETS'),
-- Sligo Surf Camp
('c0000000-0000-0000-0000-000000000003', 'WIFI'),
('c0000000-0000-0000-0000-000000000003', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000003', 'TOILET'),
('c0000000-0000-0000-0000-000000000003', 'SHOWER'),
('c0000000-0000-0000-0000-000000000003', 'BEACH'),
-- Galway Bay Guesthouse
('c0000000-0000-0000-0000-000000000004', 'WIFI'),
('c0000000-0000-0000-0000-000000000004', 'RESTAURANT'),
('c0000000-0000-0000-0000-000000000004', 'LAUNDRY'),
-- Connemara Retreat
('c0000000-0000-0000-0000-000000000005', 'WIFI'),
('c0000000-0000-0000-0000-000000000005', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000005', 'HIKING'),
('c0000000-0000-0000-0000-000000000005', 'FISHING'),
('c0000000-0000-0000-0000-000000000005', 'PETS'),
-- West Cork Eco Retreat (eco amenities)
('c0000000-0000-0000-0000-000000000006', 'WIFI'),
('c0000000-0000-0000-0000-000000000006', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000006', 'WATER'),
('c0000000-0000-0000-0000-000000000006', 'TOILET'),
('c0000000-0000-0000-0000-000000000006', 'SHOWER'),
('c0000000-0000-0000-0000-000000000006', 'RESTAURANT'),
('c0000000-0000-0000-0000-000000000006', 'HIKING'),
('c0000000-0000-0000-0000-000000000006', 'CYCLING'),
-- Wicklow Woodland Camp
('c0000000-0000-0000-0000-000000000007', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000007', 'WATER'),
('c0000000-0000-0000-0000-000000000007', 'TOILET'),
('c0000000-0000-0000-0000-000000000007', 'SHOWER'),
('c0000000-0000-0000-0000-000000000007', 'PLAYGROUND'),
('c0000000-0000-0000-0000-000000000007', 'HIKING'),
('c0000000-0000-0000-0000-000000000007', 'PETS'),
-- Ring of Kerry Glamping
('c0000000-0000-0000-0000-000000000008', 'WIFI'),
('c0000000-0000-0000-0000-000000000008', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000008', 'WATER'),
('c0000000-0000-0000-0000-000000000008', 'TOILET'),
('c0000000-0000-0000-0000-000000000008', 'SHOWER'),
('c0000000-0000-0000-0000-000000000008', 'HIKING'),
('c0000000-0000-0000-0000-000000000008', 'CYCLING'),
-- Clifden Eco Camp
('c0000000-0000-0000-0000-000000000009', 'WIFI'),
('c0000000-0000-0000-0000-000000000009', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000009', 'TOILET'),
('c0000000-0000-0000-0000-000000000009', 'SHOWER'),
('c0000000-0000-0000-0000-000000000009', 'HIKING'),
-- Roundstone Harbour View
('c0000000-0000-0000-0000-000000000010', 'WIFI'),
('c0000000-0000-0000-0000-000000000010', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000010', 'RESTAURANT'),
('c0000000-0000-0000-0000-000000000010', 'FISHING'),
-- Burren Camping
('c0000000-0000-0000-0000-000000000011', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000011', 'WATER'),
('c0000000-0000-0000-0000-000000000011', 'TOILET'),
('c0000000-0000-0000-0000-000000000011', 'SHOWER'),
('c0000000-0000-0000-0000-000000000011', 'SHOP'),
('c0000000-0000-0000-0000-000000000011', 'HIKING'),
('c0000000-0000-0000-0000-000000000011', 'PETS'),
-- Dingle Peninsula B&B
('c0000000-0000-0000-0000-000000000012', 'WIFI'),
('c0000000-0000-0000-0000-000000000012', 'RESTAURANT'),
-- Giant's Causeway Camp
('c0000000-0000-0000-0000-000000000013', 'WIFI'),
('c0000000-0000-0000-0000-000000000013', 'ELECTRIC'),
('c0000000-0000-0000-0000-000000000013', 'WATER'),
('c0000000-0000-0000-0000-000000000013', 'TOILET'),
('c0000000-0000-0000-0000-000000000013', 'SHOWER'),
('c0000000-0000-0000-0000-000000000013', 'SHOP'),
('c0000000-0000-0000-0000-000000000013', 'HIKING');

-- ============================================
-- LOTS (Multiple lots per campsite)
-- ============================================

-- Wild Atlantic Glamping - Luxury Domes
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Ocean View Dome', 'GLAMPING', 2, 185.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Sunset Dome', 'GLAMPING', 2, 195.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Stargazer Dome', 'GLAMPING', 4, 245.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Honeymoon Suite Dome', 'GLAMPING', 2, 275.00, TRUE, NOW(), NOW());

-- Donegal Coastal Camp - Traditional Camping
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Beach Front Pitch 1', 'TENT', 4, 35.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'Beach Front Pitch 2', 'TENT', 4, 35.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'Campervan Bay 1', 'CAMPERVAN', 4, 45.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Campervan Bay 2', 'CAMPERVAN', 4, 45.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002', 'Family Caravan Spot', 'CARAVAN', 6, 55.00, TRUE, NOW(), NOW());

-- Sligo Surf Camp
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'Surfer Tent Pitch 1', 'TENT', 2, 30.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'Surfer Tent Pitch 2', 'TENT', 2, 30.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'Van Life Spot 1', 'CAMPERVAN', 2, 40.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003', 'Beach Pod', 'POD', 2, 65.00, TRUE, NOW(), NOW());

-- Galway Bay Guesthouse - B&B Rooms
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000004', 'Sea View Double', 'BED_AND_BREAKFAST', 2, 120.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000004', 'Garden Twin', 'BED_AND_BREAKFAST', 2, 110.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000004', 'Family Suite', 'BED_AND_BREAKFAST', 4, 180.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000004', 'Deluxe King', 'BED_AND_BREAKFAST', 2, 145.00, TRUE, NOW(), NOW());

-- Connemara Retreat - Cottages
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000005', 'Mountain View Cottage', 'COTTAGE', 4, 145.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000005', 'Lakeside Cottage', 'COTTAGE', 4, 155.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000005', 'Artist Cabin', 'CABIN', 2, 125.00, TRUE, NOW(), NOW());

-- West Cork Eco Retreat - Mixed Eco Accommodations
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000006', 'Oak Treehouse', 'TREEHOUSE', 2, 195.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000006', 'Willow Treehouse', 'TREEHOUSE', 2, 185.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000006', 'Container Suite 1', 'CABIN', 2, 165.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000006', 'Container Suite 2', 'CABIN', 4, 195.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000006', 'Garden Yurt', 'YURT', 4, 145.00, TRUE, NOW(), NOW());

-- Wicklow Woodland Camp
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000007', 'Forest Clearing 1', 'TENT', 4, 45.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000007', 'Forest Clearing 2', 'TENT', 4, 45.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000007', 'Woodland Pod', 'POD', 2, 75.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000007', 'Tree Pod', 'POD', 2, 85.00, TRUE, NOW(), NOW());

-- Ring of Kerry Glamping - Safari Tents
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000008', 'Killarney Safari Tent', 'SAFARI_TENT', 4, 165.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000008', 'Lakes Safari Tent', 'SAFARI_TENT', 4, 165.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000008', 'Mountain Safari Tent', 'SAFARI_TENT', 6, 195.00, TRUE, NOW(), NOW());

-- Clifden Eco Camp - Yurts and Pods
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-000000000009', 'Sky Road Yurt', 'YURT', 4, 95.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000009', 'Atlantic Yurt', 'YURT', 4, 95.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000009', 'Eco Pod 1', 'POD', 2, 75.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000009', 'Eco Pod 2', 'POD', 2, 75.00, TRUE, NOW(), NOW());

-- Roundstone Harbour View
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-000000000010', 'Harbour Glamping Suite', 'GLAMPING', 2, 175.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000010', 'Fisherman Cottage', 'COTTAGE', 4, 165.00, TRUE, NOW(), NOW());

-- Burren Camping
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-000000000011', 'Limestone Field 1', 'TENT', 4, 35.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000011', 'Limestone Field 2', 'TENT', 4, 35.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000011', 'Farm Campervan Spot', 'CAMPERVAN', 4, 45.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000011', 'RV Hookup', 'RV', 4, 50.00, TRUE, NOW(), NOW());

-- Dingle Peninsula B&B
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000012', 'Bay View Room', 'BED_AND_BREAKFAST', 2, 115.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000012', 'Blasket Islands Room', 'BED_AND_BREAKFAST', 2, 110.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000012', 'Slea Head Suite', 'BED_AND_BREAKFAST', 4, 165.00, TRUE, NOW(), NOW());

-- Giant's Causeway Camp
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000013', 'Basalt Tent Pitch 1', 'TENT', 4, 40.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-000000000013', 'Basalt Tent Pitch 2', 'TENT', 4, 40.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000013', 'Causeway Pod', 'POD', 2, 85.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000013', 'Giant Pod', 'POD', 4, 105.00, TRUE, NOW(), NOW()),
('d0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000013', 'Mobile Home 1', 'MOBILE_HOME', 6, 125.00, TRUE, NOW(), NOW());

-- ============================================
-- LOT AMENITIES
-- ============================================

INSERT INTO lot_amenities (lot_id, amenity) VALUES
-- Wild Atlantic Glamping Domes
('d0000000-0000-0000-0000-000000000001', 'Hot Tub'),
('d0000000-0000-0000-0000-000000000001', 'King Bed'),
('d0000000-0000-0000-0000-000000000001', 'Heating'),
('d0000000-0000-0000-0000-000000000002', 'Hot Tub'),
('d0000000-0000-0000-0000-000000000002', 'King Bed'),
('d0000000-0000-0000-0000-000000000003', 'Hot Tub'),
('d0000000-0000-0000-0000-000000000003', 'Bunk Beds'),
('d0000000-0000-0000-0000-000000000004', 'Private Hot Tub'),
('d0000000-0000-0000-0000-000000000004', 'Champagne on Arrival'),
-- Cottages and B&B amenities
('d0000000-0000-0000-0000-000000000018', 'Turf Fire'),
('d0000000-0000-0000-0000-000000000018', 'Full Kitchen'),
('d0000000-0000-0000-0000-000000000019', 'Lake View'),
('d0000000-0000-0000-0000-000000000019', 'Fishing Gear'),
-- Treehouses
('d0000000-0000-0000-0000-000000000021', 'Rope Bridge Access'),
('d0000000-0000-0000-0000-000000000021', 'Wildlife Viewing Deck'),
('d0000000-0000-0000-0000-000000000022', 'Reading Nook'),
-- Safari Tents
('d0000000-0000-0000-0000-000000000030', 'Wood Burning Stove'),
('d0000000-0000-0000-0000-000000000030', 'Outdoor Deck'),
('d0000000-0000-0000-0000-000000000031', 'BBQ Area'),
('d0000000-0000-0000-0000-000000000032', 'Family Bunks');
