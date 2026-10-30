import type { EventInput } from "@fullcalendar/core";
import type { CalendarCategory, CalendarEntry } from "@/lib/types/database";

// Colours live in globals.css as --color-calendar-*. `swatch` is written
// out in full so Tailwind generates the class (and its CSS variable).
export const calendarCategories: Record<
  CalendarCategory,
  { label: string; description: string; color: string; textColor: string; swatch: string }
> = {
  service: {
    label: "Services",
    description: "Regular and special church services",
    color: "var(--color-calendar-service)",
    textColor: "#ffffff",
    swatch: "bg-calendar-service",
  },
  special: {
    label: "Special events",
    description: "Conferences, camps, outreaches and celebrations",
    color: "var(--color-calendar-special)",
    textColor: "var(--color-brand-ink)",
    swatch: "bg-calendar-special",
  },
  holiday: {
    label: "Holidays",
    description: "Public holidays and church seasons",
    color: "var(--color-calendar-holiday)",
    textColor: "#ffffff",
    swatch: "bg-calendar-holiday",
  },
  other: {
    label: "Other",
    description: "Meetings and other dates to note",
    color: "var(--color-calendar-other)",
    textColor: "#ffffff",
    swatch: "bg-calendar-other",
  },
};

// end_date is inclusive in the database but FullCalendar's `end` is
// exclusive, so multi-day entries end the day after.
function nextDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function toCalendarEvent(entry: CalendarEntry): EventInput {
  const { color, textColor } = calendarCategories[entry.category] ?? calendarCategories.other;
  return {
    id: entry.id,
    title: entry.title,
    start: entry.start_date,
    end: entry.end_date && entry.end_date !== entry.start_date ? nextDay(entry.end_date) : undefined,
    allDay: true,
    color,
    textColor,
    extendedProps: { description: entry.description },
  };
}
