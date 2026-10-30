-- Messages and prayer requests from the public contact form.
--
-- Access model:
--   * Anyone (anon + authenticated) can submit a new, unread message,
--     but can't read any back: prayer requests are private.
--   * Only admins (profiles.is_admin = true) can read, mark as read or delete.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text check (email is null or char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) between 5 and 30),
  topic text not null default 'general' check (topic in ('general', 'prayer', 'visit')),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  -- The church needs some way to reply.
  constraint contact_messages_has_contact check (email is not null or phone is not null)
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "Public submit" on public.contact_messages;
create policy "Public submit"
  on public.contact_messages for insert
  to anon, authenticated
  with check (is_read = false);

drop policy if exists "Admins read" on public.contact_messages;
create policy "Admins read"
  on public.contact_messages for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins update" on public.contact_messages;
create policy "Admins update"
  on public.contact_messages for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins delete" on public.contact_messages;
create policy "Admins delete"
  on public.contact_messages for delete
  to authenticated
  using ((select public.is_admin()));
