alter table profiles add column if not exists store_id text;
alter table profiles add column if not exists goals text not null default '';

alter table bookings add column if not exists site_id text;
create index if not exists bookings_site_user_idx on bookings (site_id, user_id);

create table if not exists listings (
  id text primary key,
  name text not null,
  region text not null,
  city text not null,
  address text not null default '',
  neighborhood text not null default '',
  lat double precision not null default 0,
  lng double precision not null default 0,
  kind text not null,
  tags text not null default '',
  booking_gap text not null default 'weak_web',
  phone text not null default '',
  website text not null default '',
  pitch text not null default '',
  house_rules text not null default '',
  cancel_note text not null default '24-hour hold. Desk may move a late guest.',
  cover_url text not null default '',
  tour3d_url text not null default '',
  guests_max integer not null default 4,
  instant_book boolean not null default false,
  listed boolean not null default true,
  store_user_id text,
  source text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists listing_media (
  id text primary key,
  listing_id text not null references listings(id) on delete cascade,
  kind text not null default 'photo',
  url text not null,
  caption text not null default '',
  sort integer not null default 0
);
create index if not exists listing_media_idx on listing_media (listing_id);
