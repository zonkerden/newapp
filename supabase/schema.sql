-- Vessel schema — safe to run in a project already used by other apps
-- (e.g. CalmCore/ZENO). Table names are prefixed vessel_ so nothing collides.
-- Run this once in the Supabase SQL editor for your project.

create table if not exists vessel_water_logs (
  user_id uuid references auth.users(id) on delete cascade not null,
  day date not null,
  ml integer not null default 0,
  meals jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists vessel_sleep_logs (
  user_id uuid references auth.users(id) on delete cascade not null,
  day date not null,
  bedtime text not null default '',
  waketime text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists vessel_breath_sessions (
  user_id uuid references auth.users(id) on delete cascade not null,
  day date not null,
  sessions_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists vessel_meds_items (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  time text not null,
  created_at timestamptz not null default now()
);

create table if not exists vessel_meds_taken (
  user_id uuid references auth.users(id) on delete cascade not null,
  item_id uuid references vessel_meds_items(id) on delete cascade not null,
  day date not null,
  primary key (user_id, item_id, day)
);

alter table vessel_water_logs enable row level security;
alter table vessel_sleep_logs enable row level security;
alter table vessel_breath_sessions enable row level security;
alter table vessel_meds_items enable row level security;
alter table vessel_meds_taken enable row level security;

create policy "own water logs" on vessel_water_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own sleep logs" on vessel_sleep_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own breath sessions" on vessel_breath_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own meds items" on vessel_meds_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own meds taken" on vessel_meds_taken
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
