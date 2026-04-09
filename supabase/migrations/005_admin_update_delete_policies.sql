drop policy if exists "Authenticated users can update news" on public.news;
create policy "Authenticated users can update news"
on public.news
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete news" on public.news;
create policy "Authenticated users can delete news"
on public.news
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can update events" on public.events;
create policy "Authenticated users can update events"
on public.events
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete events" on public.events;
create policy "Authenticated users can delete events"
on public.events
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can delete directory" on public.directory;
create policy "Authenticated users can delete directory"
on public.directory
for delete
to authenticated
using (true);
