create table if not exists public.web_push_subscriptions (
  endpoint text primary key,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.web_push_subscriptions enable row level security;

create policy "Service role can manage web push subscriptions"
on public.web_push_subscriptions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
