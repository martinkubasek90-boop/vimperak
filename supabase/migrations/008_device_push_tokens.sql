create table if not exists public.device_push_tokens (
  token text primary key,
  platform text not null check (platform in ('android', 'ios')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.device_push_tokens enable row level security;

create policy "Service role can manage device push tokens"
on public.device_push_tokens
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
