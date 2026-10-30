import { site } from "@/lib/site";

// South Africa is UTC+2 all year (no daylight saving), as in startOfToday().
const SITE_UTC_OFFSET = "+02:00";

const inputParts = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: site.timeZone,
});

// A stored timestamp as an <input type="datetime-local"> value in the
// church's time zone, e.g. "2026-11-01T16:00:00+00:00" → "2026-11-01T18:00".
export function toDateTimeInputValue(iso: string) {
  const parts = Object.fromEntries(
    inputParts.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

// The reverse: a datetime-local value, read as church time, to a timestamp
// with its offset. Null when the value isn't a valid date and time.
export function fromDateTimeInputValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const iso = `${value}:00${SITE_UTC_OFFSET}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

// True for a real calendar date in <input type="date"> format ("YYYY-MM-DD").
export function isDateInputValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
