create table if not exists public.user_app_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  home_preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_user_app_preferences_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_touch_user_app_preferences_updated_at on public.user_app_preferences;
create trigger trg_touch_user_app_preferences_updated_at
before update on public.user_app_preferences
for each row execute function public.touch_user_app_preferences_updated_at();

alter table public.user_app_preferences enable row level security;

drop policy if exists "Users can read their own app preferences" on public.user_app_preferences;
create policy "Users can read their own app preferences"
on public.user_app_preferences
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own app preferences" on public.user_app_preferences;
create policy "Users can insert their own app preferences"
on public.user_app_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own app preferences" on public.user_app_preferences;
create policy "Users can update their own app preferences"
on public.user_app_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
