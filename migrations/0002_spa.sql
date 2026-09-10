create table if not exists profiles (
  user_id text primary key,
  role text not null default 'customer',
  name text not null default '',
  email text,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id text primary key,
  user_id text not null,
  source text not null default 'guest',
  date text not null,
  room_id text not null,
  start_min integer not null,
  duration_min integer not null,
  guests integer not null default 2,
  with_sauna boolean not null default true,
  massage_request boolean not null default false,
  massage_note text not null default '',
  member_tier text not null default 'none',
  paid_via text not null default 'desk',
  late_minutes integer not null default 0,
  guest_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists bookings_date_idx on bookings (date);
create index if not exists bookings_user_id_idx on bookings (user_id);

create table if not exists visits (
  id serial primary key,
  path text not null,
  created_at timestamptz not null default now()
);
create index if not exists visits_created_at_idx on visits (created_at);
create index if not exists visits_path_idx on visits (path);
