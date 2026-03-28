alter table public.directory
  add column if not exists city_department text,
  add column if not exists email text,
  add column if not exists website text,
  add column if not exists source_url text,
  add column if not exists appointment_url text,
  add column if not exists appointment_label text;

alter table public.directory
  drop constraint if exists directory_category_check;

alter table public.directory
  add constraint directory_category_check
  check (
    category in (
      'taxi',
      'restaurace',
      'lékař',
      'lékárna',
      'opravna',
      'sport',
      'ubytování',
      'obchod',
      'město'
    )
  );

drop policy if exists "Authenticated users can insert directory" on public.directory;
create policy "Authenticated users can insert directory"
on public.directory
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update directory" on public.directory;
create policy "Authenticated users can update directory"
on public.directory
for update
to authenticated
using (true)
with check (true);
