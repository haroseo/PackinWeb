create table if not exists public.saved_features (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, feature_id)
);

create table if not exists public.checked_features (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, feature_id)
);

alter table public.saved_features enable row level security;
alter table public.checked_features enable row level security;

drop policy if exists "Users manage their saved features" on public.saved_features;
create policy "Users manage their saved features"
  on public.saved_features for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their checked features" on public.checked_features;
create policy "Users manage their checked features"
  on public.checked_features for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists saved_features_user_id_idx
  on public.saved_features(user_id);
create index if not exists checked_features_user_id_idx
  on public.checked_features(user_id);
