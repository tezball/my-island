create extension if not exists postgis;

create table account (
  id bigserial primary key,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('guest','host','admin'))
);

create table place (
  id text primary key,
  name text not null,
  county text,
  country text,
  town text,
  website text,
  description text,
  lat double precision,
  lng double precision,
  geom geography(Point,4326)
);

create table experience (
  id text primary key,
  name text not null,
  county text,
  description text,
  lat double precision,
  lng double precision
);

create table stay (
  id bigserial primary key,
  host_id bigint not null references account(id),
  kind text not null check (kind in ('campsite','glamping','bed and breakfast')),
  title text not null,
  description text not null,
  county text,
  lat double precision,
  lng double precision,
  phone text,
  email text,
  website text,
  hidden boolean not null default true
);

create table lot (
  id bigserial primary key,
  stay_id bigint not null references stay(id),
  name text not null,
  sleeps int not null,
  price_eur numeric(8,2)
);

create table visit (
  account_id bigint not null references account(id),
  place_id text not null references place(id),
  primary key (account_id, place_id)
);
