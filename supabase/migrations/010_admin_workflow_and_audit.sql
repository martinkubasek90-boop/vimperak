create table if not exists public.admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null check (entity_type in ('news', 'event', 'poll', 'directory', 'report')),
  entity_id uuid not null,
  action text not null check (action in ('create', 'update', 'delete', 'workflow', 'status')),
  summary text not null,
  actor_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

create policy "Authenticated users can read audit log"
on public.admin_audit_log
for select
to authenticated
using (true);

create policy "Authenticated users can insert audit log"
on public.admin_audit_log
for insert
to authenticated
with check (true);

alter table public.news
  add column if not exists workflow_status text not null default 'draft',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by_email text;

alter table public.events
  add column if not exists workflow_status text not null default 'draft',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by_email text;

alter table public.polls
  add column if not exists workflow_status text not null default 'draft',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by_email text;

alter table public.directory
  add column if not exists workflow_status text not null default 'draft',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by_email text;

alter table public.reports
  add column if not exists updated_by_email text;

alter table public.news drop constraint if exists news_workflow_status_check;
alter table public.news add constraint news_workflow_status_check check (workflow_status in ('draft', 'review', 'ready', 'live'));

alter table public.events drop constraint if exists events_workflow_status_check;
alter table public.events add constraint events_workflow_status_check check (workflow_status in ('draft', 'review', 'ready', 'live'));

alter table public.polls drop constraint if exists polls_workflow_status_check;
alter table public.polls add constraint polls_workflow_status_check check (workflow_status in ('draft', 'review', 'ready', 'live'));

alter table public.directory drop constraint if exists directory_workflow_status_check;
alter table public.directory add constraint directory_workflow_status_check check (workflow_status in ('draft', 'review', 'ready', 'live'));

update public.news
set workflow_status = case when urgent then 'live' else 'ready' end
where workflow_status = 'draft';

update public.events
set workflow_status = 'ready'
where workflow_status = 'draft';

update public.polls
set workflow_status = case when ends_at >= current_date then 'live' else 'review' end
where workflow_status = 'draft';

update public.directory
set workflow_status = case when source_kind = 'vimperk_web' or is_locked then 'live' else 'ready' end
where workflow_status = 'draft';
