-- RCM Youth Movie + Games Night, Saturday 21 November 2026, 18:00.
-- Content, not schema: run once in the SQL editor after the migrations
-- (it needs 20261030000300_calendar_times_location.sql). Safe to re-run;
-- nothing is added twice. Afterwards, edit or delete it from /admin.
-- The poster is a file in public/images/events/, so it goes live with the code.

insert into public.events (title, description, event_date, location, poster_url, is_featured)
select
  'Movie + Games Night',
  E'RCM Youth presents a Movie + Games Night. Bring your friends for a movie, games and a great evening together.\n\nTickets: R50 per person.',
  '2026-11-21 18:00:00+02',
  'RCM Toitskraal, D5 Toitskraal Woongebied, Marble Hall',
  '/images/events/movie-games-night-2026-11-21.webp',
  true
where not exists (
  select 1 from public.events
  where title = 'Movie + Games Night' and event_date = '2026-11-21 18:00:00+02'
);

insert into public.calendar_entries (title, start_date, start_time, description, location, category)
select
  'Youth Movie + Games Night',
  '2026-11-21',
  '18:00',
  'RCM Youth presents a Movie + Games Night. Tickets R50 per person.',
  'RCM Toitskraal, D5 Toitskraal Woongebied, Marble Hall',
  'special'
where not exists (
  select 1 from public.calendar_entries
  where title = 'Youth Movie + Games Night' and start_date = '2026-11-21'
);
