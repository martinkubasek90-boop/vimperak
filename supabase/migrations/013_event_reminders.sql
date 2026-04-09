alter table public.device_push_tokens
  add column if not exists installation_id text;

alter table public.web_push_subscriptions
  add column if not exists installation_id text;

create index if not exists idx_device_push_tokens_installation_id
  on public.device_push_tokens (installation_id);

create index if not exists idx_web_push_subscriptions_installation_id
  on public.web_push_subscriptions (installation_id);

create table if not exists public.event_reminders (
  id uuid primary key default uuid_generate_v4(),
  installation_id text not null,
  event_id text not null,
  reminder_type text not null check (reminder_type in ('2h', '1d')),
  remind_at timestamptz not null,
  event_title text not null,
  event_date text not null,
  event_time text not null,
  event_place text not null,
  event_url text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_event_reminders_installation_event_type
  on public.event_reminders (installation_id, event_id, reminder_type);

create index if not exists idx_event_reminders_due_unsent
  on public.event_reminders (remind_at)
  where sent_at is null;

alter table public.event_reminders enable row level security;

drop policy if exists "Service role can manage event reminders" on public.event_reminders;
create policy "Service role can manage event reminders"
on public.event_reminders
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
