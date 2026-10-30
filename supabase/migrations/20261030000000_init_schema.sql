-- Core content tables, admin profiles and Row Level Security.
--
-- Access model:
--   * Anyone (anon + authenticated) can read all content.
--   * Only signed-in users flagged as admins (profiles.is_admin = true)
--     can insert, update or delete.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------
-- profiles: one row per auth user; is_admin gates content mutations.
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Create a profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer so policies can check admin status without
-- recursing through the profiles table's own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_admin = true
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Users can see their own profile; admins can see all.
-- No update policy: is_admin is changed only via the dashboard / SQL editor.
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

-- ------------------------------------------------------------------
-- events
-- ------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  poster_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date);

-- ------------------------------------------------------------------
-- calendar_entries
-- ------------------------------------------------------------------
create table if not exists public.calendar_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date not null,
  end_date date,
  description text,
  category text not null default 'other'
    check (category in ('service', 'special', 'holiday', 'other')),
  created_at timestamptz not null default now(),
  constraint calendar_entries_date_order check (end_date is null or end_date >= start_date)
);

create index if not exists calendar_entries_start_date_idx on public.calendar_entries (start_date);

-- ------------------------------------------------------------------
-- gallery_images
-- ------------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

create index if not exists gallery_images_uploaded_at_idx on public.gallery_images (uploaded_at desc);

-- ------------------------------------------------------------------
-- stream_videos
-- ------------------------------------------------------------------
create table if not exists public.stream_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null check (platform in ('youtube', 'facebook')),
  video_id_or_url text not null,
  is_memorable boolean not null default false,
  stream_date date,
  created_at timestamptz not null default now()
);

create index if not exists stream_videos_stream_date_idx on public.stream_videos (stream_date desc);

-- ------------------------------------------------------------------
-- RLS for content tables: public read, admin write.
-- ------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['events', 'calendar_entries', 'gallery_images', 'stream_videos']
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format(
      'create policy "Public read" on public.%I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "Admins insert" on public.%I', t);
    execute format(
      'create policy "Admins insert" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins update" on public.%I', t);
    execute format(
      'create policy "Admins update" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins delete" on public.%I', t);
    execute format(
      'create policy "Admins delete" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;
