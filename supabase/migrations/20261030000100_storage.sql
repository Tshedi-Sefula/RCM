-- Storage buckets for event posters and gallery photos.
-- Public read (files are served from /storage/v1/object/public/...),
-- admin-only upload / replace / delete. Depends on public.is_admin()
-- from the previous migration.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-posters', 'event-posters', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('gallery', 'gallery', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Listing objects (public URLs work without this, but list() needs it).
drop policy if exists "Public read site images" on storage.objects;
create policy "Public read site images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('event-posters', 'gallery'));

drop policy if exists "Admins upload site images" on storage.objects;
create policy "Admins upload site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('event-posters', 'gallery') and (select public.is_admin()));

drop policy if exists "Admins update site images" on storage.objects;
create policy "Admins update site images"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('event-posters', 'gallery') and (select public.is_admin()))
  with check (bucket_id in ('event-posters', 'gallery') and (select public.is_admin()));

drop policy if exists "Admins delete site images" on storage.objects;
create policy "Admins delete site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('event-posters', 'gallery') and (select public.is_admin()));
