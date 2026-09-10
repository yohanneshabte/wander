create table if not exists modalities (
  key text primary key,
  name text not null,
  family text not null,
  blurb text not null default '',
  setting text not null default 'wellness',
  sort integer not null default 0
);

create table if not exists outcome_tags (
  key text primary key,
  name text not null,
  family text not null,
  sort integer not null default 0
);

create table if not exists modality_outcomes (
  modality_key text not null references modalities(key) on delete cascade,
  tag_key text not null references outcome_tags(key) on delete cascade,
  primary key (modality_key, tag_key)
);

create table if not exists evidence_claims (
  id text primary key,
  modality_key text not null references modalities(key) on delete cascade,
  claim text not null,
  grade text not null,
  population text not null default '',
  caveat text not null default '',
  source_name text not null,
  source_url text not null default '',
  pmid text,
  year integer,
  reviewed_on text not null
);
create index if not exists evidence_modality_idx on evidence_claims (modality_key);

create table if not exists reimbursement (
  modality_key text primary key references modalities(key) on delete cascade,
  hsa_fsa text not null,
  fda text not null,
  lmn_note text not null default '',
  plan_note text not null default ''
);

create table if not exists service_modalities (
  service_id text not null,
  modality_key text not null references modalities(key) on delete cascade,
  primary key (service_id, modality_key)
);
