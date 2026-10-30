-- Optional start/end times and a location for calendar entries.
-- Entries without a start time stay all-day. Times are the church's local time.

alter table public.calendar_entries
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists location text;

alter table public.calendar_entries
  drop constraint if exists calendar_entries_time_order;

-- An end time needs a start time, and on a single-day entry it can't be earlier.
alter table public.calendar_entries
  add constraint calendar_entries_time_order check (
    end_time is null
    or (start_time is not null and (coalesce(end_date, start_date) > start_date or end_time >= start_time))
  );
