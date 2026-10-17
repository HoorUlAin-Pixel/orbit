create table households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id),
  name text not null default 'My Household',
  created_at timestamptz default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null
);

create table chores (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  every_n_days int not null default 1
);

create table completions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  chore_id uuid not null references chores(id) on delete cascade,
  member_id uuid not null references members(id),
  done_on date not null default current_date
);

-- Privacy: each person only sees their own household's rows
alter table households enable row level security;
alter table members enable row level security;
alter table chores enable row level security;
alter table completions enable row level security;

create policy "own household" on households for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own members" on members for all
  using (household_id in (select id from households where owner_id = auth.uid()))
  with check (household_id in (select id from households where owner_id = auth.uid()));

create policy "own chores" on chores for all
  using (household_id in (select id from households where owner_id = auth.uid()))
  with check (household_id in (select id from households where owner_id = auth.uid()));

create policy "own completions" on completions for all
  using (household_id in (select id from households where owner_id = auth.uid()))
  with check (household_id in (select id from households where owner_id = auth.uid()));