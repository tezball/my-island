alter table account add column supplier_approved boolean not null default true;
alter table account add column review_reason text;

alter table stay add column image bytea;
alter table stay add column image_type text;
alter table stay add column review_reason text;

alter table experience add column image bytea;
alter table experience add column image_type text;
alter table experience add column review_reason text;

alter table place add column account_id bigint references account(id);

create table session (
  token_hash text primary key,
  account_id bigint not null references account(id),
  expires_at timestamptz not null
);

update account
set password_hash = 'pbkdf2-sha256$100000$Sx2eKnwF+LNOah2Qwrfk8Q==$0iAUmQCJLb4b6h//whLu/ZpAlwKs8+bhEDP0uAtasbo='
where password_hash = '84983c60f7daadc1cb8698621f802c0d9f9a3c3c295c810748fb048115c186ec';

update stay set hidden = true;

create table place_image (
  place_id text not null references place(id),
  position int not null check (position >= 0 and position < 5),
  image bytea not null,
  image_type text not null,
  primary key (place_id, position)
);

update stay
set hidden = false,
    image_type = 'image/png',
    image = decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
where title = 'Kerry glamping 001'
  and lat between 51.0 and 55.5
  and lng between -11.0 and -5.0
  and position('<' in title) = 0
  and position('<' in description) = 0
  and title !~* 'script'
  and description !~* 'script'
  and website is null;
