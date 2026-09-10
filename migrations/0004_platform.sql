create table if not exists sites (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  city text not null default '',
  address text not null default '',
  phone text not null default '',
  website text not null default '',
  hours_note text not null default '',
  open_min integer not null default 510,
  close_min integer not null default 1380,
  day_cutoff_min integer not null default 1060,
  buffer_min integer not null default 15,
  max_concurrent integer not null default 6,
  theme text not null default 'cream',
  booking_note text not null default '',
  pitch text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists resources (
  id text primary key,
  site_id text not null references sites(id) on delete cascade,
  name text not null,
  short text not null default '',
  blurb text not null default '',
  kind text not null default 'room',
  amenities text not null default '',
  capacity integer not null default 2,
  sort integer not null default 0
);
create index if not exists resources_site_idx on resources (site_id);

create table if not exists categories (
  id text primary key,
  site_id text not null references sites(id) on delete cascade,
  key text not null,
  name text not null,
  blurb text not null default '',
  sort integer not null default 0
);
create index if not exists categories_site_idx on categories (site_id);

create table if not exists services (
  id text primary key,
  site_id text not null references sites(id) on delete cascade,
  category_key text not null,
  name text not null,
  duration_min integer not null default 60,
  blurb text not null default '',
  weekday_price numeric,
  weekend_price numeric,
  evening_price numeric,
  list_price numeric,
  per_person boolean not null default false,
  kind text not null default 'appointment',
  source text not null default '',
  sort integer not null default 0
);
create index if not exists services_site_idx on services (site_id);

create table if not exists memberships (
  id text primary key,
  site_id text not null references sites(id) on delete cascade,
  name text not null,
  price_month numeric not null,
  blurb text not null default '',
  credits text not null default '',
  sort integer not null default 0
);

create table if not exists platform_settings (
  id text primary key default 'global',
  live_site_id text not null default 'watercourse',
  preview_site_id text,
  demo_mode boolean not null default true,
  discovery_mode boolean not null default true,
  house_voice boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into platform_settings (id) values ('global')
on conflict (id) do nothing;

alter table bookings add column if not exists site_id text;
alter table visits add column if not exists site_id text;
create index if not exists bookings_site_idx on bookings (site_id);
create index if not exists visits_site_idx on visits (site_id);
