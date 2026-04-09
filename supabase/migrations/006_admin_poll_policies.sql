drop policy if exists "Authenticated users can insert polls" on public.polls;
create policy "Authenticated users can insert polls"
on public.polls
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update polls" on public.polls;
create policy "Authenticated users can update polls"
on public.polls
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete polls" on public.polls;
create policy "Authenticated users can delete polls"
on public.polls
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can insert poll options" on public.poll_options;
create policy "Authenticated users can insert poll options"
on public.poll_options
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can delete poll options" on public.poll_options;
create policy "Authenticated users can delete poll options"
on public.poll_options
for delete
to authenticated
using (true);
