import type { EventInput } from "@fullcalendar/core";
import { site } from "@/lib/site";
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

// Postgres `time` values arrive as "HH:MM:SS"; inputs and labels use "HH:MM".
export function shortTime(time: string) {
  return time.slice(0, 5);
}

export function toCalendarEvent(entry: CalendarEntry): EventInput {
  const { color, textColor } = calendarCategories[entry.category] ?? calendarCategories.other;
  const extendedProps = { description: entry.description, location: entry.location };

  if (entry.start_time) {
    const lastDay = entry.end_date ?? entry.start_date;
    return {
      id: entry.id,
      title: entry.title,
      start: `${entry.start_date}T${shortTime(entry.start_time)}`,
      end: entry.end_time ? `${lastDay}T${shortTime(entry.end_time)}` : undefined,
      allDay: false,
      color,
      textColor,
      extendedProps,
    };
  }

  return {
    id: entry.id,
    title: entry.title,
    start: entry.start_date,
    end: entry.end_date && entry.end_date !== entry.start_date ? nextDay(entry.end_date) : undefined,
    allDay: true,
    color,
    textColor,
    extendedProps,
  };
}

// site.recurringServices as FullCalendar recurring events, repeating every week
// at the church's address.
export function recurringServiceEvents(): EventInput[] {
  const { color, textColor } = calendarCategories.service;
  return site.recurringServices.map((service) => ({
    id: `recurring-${service.weekday}-${service.startTime}`,
    title: service.title,
    daysOfWeek: [service.weekday],
    startTime: service.startTime,
    endTime: service.endTime,
    color,
    textColor,
    extendedProps: { description: "Every week. All are welcome.", location: site.contact.address },
  }));
}
