alter table public.web_push_subscriptions
  add column if not exists topics text[] not null default '{}';

alter table public.device_push_tokens
  add column if not exists topics text[] not null default '{}';
