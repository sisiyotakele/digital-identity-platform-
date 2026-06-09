-- ─── Fix: Re-create handle_new_user trigger with proper permissions ───────────
-- Run this in Supabase SQL Editor → New Query

-- Step 1: Drop the old trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Step 2: Re-create function with SET search_path for security
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Step 3: Re-create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Step 4: Grant the function permission to insert into profiles
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on public.profiles to postgres, anon, authenticated, service_role;

-- Step 5: Add a policy that lets the trigger insert (belt and suspenders)
-- First, make sure RLS allows insert from the service role / trigger context
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'profiles' and policyname = 'Service role can insert profiles'
  ) then
    execute 'create policy "Service role can insert profiles" on public.profiles for insert with check (true)';
  end if;
end;
$$;
