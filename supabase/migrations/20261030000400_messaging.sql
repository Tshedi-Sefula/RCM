-- Contact form conversations: admins forward each message to a pastor, the
-- pastor replies on the site, and the sender follows the conversation at
-- /threads/<ticket_id>.
--
-- Access model:
--   * Anyone can open a new thread (the contact form) but can't read any back.
--     Senders read and reply through /api/threads/[ticket_id], which uses the
--     service role after matching the secret ticket_id. There is deliberately
--     no anon select policy.
--   * Admins (profiles.is_admin) can read, forward and delete every thread.
--   * Pastors (profiles.role = 'pastor') can read and reply to threads
--     assigned to them, and change their status.
--
-- New pastors: create the user in Supabase Auth, then check their profile row
-- has role = 'pastor' (the default) and full_name set (shown to senders).

-- ------------------------------------------------------------------
-- profiles: email (for the forward dropdown) and role.
-- ------------------------------------------------------------------
alter table public.profiles
  add column if not exists email text,
  add column if not exists role text not null default 'pastor';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('pastor', 'admin'));

-- Existing admins aren't pastors; existing users get their email copied in.
update public.profiles set role = 'admin' where is_admin and role = 'pastor';
update public.profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.is_pastor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'pastor'
  );
$$;

revoke execute on function public.is_pastor() from public;
grant execute on function public.is_pastor() to anon, authenticated;

-- Only admins can add or change profiles (role, is_admin, names).
drop policy if exists "Admins insert profiles" on public.profiles;
create policy "Admins insert profiles"
  on public.profiles for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles"
  on public.profiles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ------------------------------------------------------------------
-- contact_threads: one per contact form submission.
-- ------------------------------------------------------------------
create table if not exists public.contact_threads (
  id uuid primary key default gen_random_uuid(),
  -- The secret in the sender's link. Separate from id, which appears in
  -- admin and pastor URLs.
  ticket_id uuid not null unique default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 1 and 100),
  sender_email text check (sender_email is null or char_length(sender_email) between 3 and 254),
  sender_phone text check (sender_phone is null or char_length(sender_phone) between 5 and 30),
  topic text not null default 'general' check (topic in ('general', 'prayer', 'visit')),
  original_message text not null check (char_length(original_message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'forwarded', 'replied', 'closed')),
  assigned_pastor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  -- Bumped by every reply, for sorting inboxes.
  last_activity_at timestamptz not null default now()
);

create index if not exists contact_threads_status_idx on public.contact_threads (status, created_at desc);
create index if not exists contact_threads_pastor_idx
  on public.contact_threads (assigned_pastor_id, last_activity_at desc);

alter table public.contact_threads enable row level security;

drop policy if exists "Public submit" on public.contact_threads;
create policy "Public submit"
  on public.contact_threads for insert
  to anon, authenticated
  with check (status = 'new' and assigned_pastor_id is null);

drop policy if exists "Admins and assigned pastor read" on public.contact_threads;
create policy "Admins and assigned pastor read"
  on public.contact_threads for select
  to authenticated
  using ((select public.is_admin()) or assigned_pastor_id = (select auth.uid()));

drop policy if exists "Admins update" on public.contact_threads;
create policy "Admins update"
  on public.contact_threads for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- A pastor can change the status of their own threads but not hand them
-- back to "new" or reassign them.
drop policy if exists "Assigned pastor update" on public.contact_threads;
create policy "Assigned pastor update"
  on public.contact_threads for update
  to authenticated
  using (assigned_pastor_id = (select auth.uid()))
  with check (assigned_pastor_id = (select auth.uid()) and status <> 'new');

drop policy if exists "Admins delete" on public.contact_threads;
create policy "Admins delete"
  on public.contact_threads for delete
  to authenticated
  using ((select public.is_admin()));

-- Signed-in users may only change routing columns; the sender's message and
-- ticket stay as submitted.
revoke update on public.contact_threads from anon, authenticated;
grant update (status, assigned_pastor_id) on public.contact_threads to authenticated;

-- ------------------------------------------------------------------
-- thread_replies: the conversation after the original message.
-- ------------------------------------------------------------------
create table if not exists public.thread_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.contact_threads (id) on delete cascade,
  sender_type text not null check (sender_type in ('pastor', 'user')),
  -- The pastor's profile; null for the sender, who has no account.
  sender_id uuid references public.profiles (id) on delete set null,
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists thread_replies_thread_idx on public.thread_replies (thread_id, created_at);

alter table public.thread_replies enable row level security;

drop policy if exists "Admins and assigned pastor read" on public.thread_replies;
create policy "Admins and assigned pastor read"
  on public.thread_replies for select
  to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.contact_threads t
      where t.id = thread_id and t.assigned_pastor_id = (select auth.uid())
    )
  );

-- Sender replies are inserted by the API route with the service role.
drop policy if exists "Assigned pastor reply" on public.thread_replies;
create policy "Assigned pastor reply"
  on public.thread_replies for insert
  to authenticated
  with check (
    sender_type = 'pastor'
    and sender_id = (select auth.uid())
    and exists (
      select 1 from public.contact_threads t
      where t.id = thread_id and t.assigned_pastor_id = (select auth.uid()) and t.status <> 'closed'
    )
  );

-- Keeps status meaning "whose turn it is": a pastor reply marks the thread
-- replied, a sender reply puts it back with the pastor. New and closed
-- threads keep their status.
create or replace function public.handle_thread_reply()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.contact_threads
  set last_activity_at = new.created_at,
      status = case
        when status in ('new', 'closed') then status
        when new.sender_type = 'pastor' then 'replied'
        else 'forwarded'
      end
  where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists on_thread_reply on public.thread_replies;
create trigger on_thread_reply
  after insert on public.thread_replies
  for each row execute function public.handle_thread_reply();

-- ------------------------------------------------------------------
-- Carry over messages from the old contact_messages inbox. Read ones are
-- closed; unread ones wait to be forwarded. The old table is left in place.
-- ------------------------------------------------------------------
insert into public.contact_threads
  (id, sender_name, sender_email, sender_phone, topic, original_message, status, created_at, last_activity_at)
select id, name, email, phone, topic, message,
  case when is_read then 'closed' else 'new' end,
  created_at, created_at
from public.contact_messages
on conflict (id) do nothing;
