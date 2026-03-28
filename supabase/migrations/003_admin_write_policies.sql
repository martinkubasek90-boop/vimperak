-- Admin writes authenticated through Supabase Auth.
-- App-level role enforcement still happens in Next.js admin actions.

create policy "Authenticated users can insert news"
on public.news
for insert
to authenticated
with check (true);

create policy "Authenticated users can insert events"
on public.events
for insert
to authenticated
with check (true);

create policy "Authenticated users can update reports"
on public.reports
for update
to authenticated
using (true)
with check (true);
