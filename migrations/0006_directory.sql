alter table platform_settings add column if not exists directory_unlocked boolean not null default false;

create table if not exists prospects (
  id text primary key,
  name text not null,
  region text not null,
  city text not null,
  address text not null default '',
  lat double precision not null,
  lng double precision not null,
  kind text not null,
  tags text not null default '',
  booking_gap text not null default 'weak_web',
  phone text not null default '',
  website text not null default '',
  pitch text not null default '',
  source text not null default '',
  public boolean not null default false
);
create index if not exists prospects_region_idx on prospects (region);
create index if not exists prospects_kind_idx on prospects (kind);
