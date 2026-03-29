alter table public.directory
  add column if not exists source_kind text not null default 'manual',
  add column if not exists source_external_id text,
  add column if not exists source_synced_at timestamptz,
  add column if not exists is_locked boolean not null default false;

alter table public.directory
  drop constraint if exists directory_source_kind_check;

alter table public.directory
  add constraint directory_source_kind_check
  check (source_kind in ('manual', 'vimperk_web', 'import'));

comment on column public.directory.source_kind is 'Určuje původ kontaktu. manual = ručně spravovaný záznam, vimperk_web = synchronizovaný oficiální kontakt z vimperk.cz.';
comment on column public.directory.source_external_id is 'Externí identifikátor nebo stabilní URL oficiální položky pro synchronizaci.';
comment on column public.directory.source_synced_at is 'Čas poslední úspěšné synchronizace oficiálních údajů.';
comment on column public.directory.is_locked is 'Pokud je true, základní údaje jsou synchronizované a nesmí se ručně přepisovat v adminu.';
