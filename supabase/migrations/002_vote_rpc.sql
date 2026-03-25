-- RPC function for atomic vote increment
create or replace function increment_vote(option_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.poll_options
  set votes = votes + 1
  where id = option_id;
end;
$$;
