-- Mega Family Prayer Summit with Dr C Semono, Saturday 14 November 2026, 07:00.
-- Hosted at the main branch in Pretoria East, not at RCM Toitskraal.
-- Content, not schema: run once in the SQL editor after the migrations
-- (it needs 20261030000300_calendar_times_location.sql). Safe to re-run;
-- nothing is added twice. Afterwards, edit or delete it from /admin.
-- The poster is a file in public/images/events/, so it goes live with the code.

insert into public.events (title, description, event_date, location, poster_url, is_featured)
select
  'Mega Family Prayer Summit',
  E'A morning of prayer with Dr C Semono: deliverance, healing, breakthrough, family prayers and all kinds of prayers.\n\nThis summit is at our main branch in Pretoria East, not at RCM Toitskraal.\n\nReserve your seat: 067 715 3751.',
  '2026-11-14 07:00:00+02',
  'RCM Main Branch, 144 Lesedi Street, Nelmapius Ext 4, Pretoria East',
  '/images/events/mega-family-prayer-summit-2026-11-14.jpg',
  true
where not exists (
  select 1 from public.events
  where title = 'Mega Family Prayer Summit' and event_date = '2026-11-14 07:00:00+02'
);

insert into public.calendar_entries (title, start_date, start_time, description, location, category)
select
  'Mega Family Prayer Summit (Main Branch)',
  '2026-11-14',
  '07:00',
  'Morning service with Dr C Semono at the main branch in Pretoria East. Reserve your seat: 067 715 3751.',
  'RCM Main Branch, 144 Lesedi Street, Nelmapius Ext 4, Pretoria East',
  'special'
where not exists (
  select 1 from public.calendar_entries
  where title = 'Mega Family Prayer Summit (Main Branch)' and start_date = '2026-11-14'
);
