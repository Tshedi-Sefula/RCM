import type { EventInput, EventSourceFuncArg } from "@fullcalendar/core";
import { calendarCategories } from "@/lib/calendar";

// South African public holidays (Public Holidays Act 36 of 1994), worked out
// for any year so the public calendar is right whichever month a visitor
// pages to. For 2026 this gives:
//   1 Jan New Year's Day, 21 Mar Human Rights Day, 3 Apr Good Friday,
//   6 Apr Family Day, 27 Apr Freedom Day, 1 May Workers' Day,
//   16 Jun Youth Day, 9 Aug National Women's Day (observed Mon 10 Aug),
//   24 Sep Heritage Day, 16 Dec Day of Reconciliation, 25 Dec Christmas Day,
//   26 Dec Day of Goodwill.
// One-off holidays the President declares (e.g. election days) aren't
// included: add those as "Holidays" entries in the admin calendar.

export type PublicHoliday = {
  date: string; // YYYY-MM-DD
  name: string;
};

const FIXED_HOLIDAYS: Array<{ month: number; day: number; name: string }> = [
  { month: 1, day: 1, name: "New Year's Day" },
  { month: 3, day: 21, name: "Human Rights Day" },
  { month: 4, day: 27, name: "Freedom Day" },
  { month: 5, day: 1, name: "Workers' Day" },
  { month: 6, day: 16, name: "Youth Day" },
  { month: 8, day: 9, name: "National Women's Day" },
  { month: 9, day: 24, name: "Heritage Day" },
  { month: 12, day: 16, name: "Day of Reconciliation" },
  { month: 12, day: 25, name: "Christmas Day" },
  { month: 12, day: 26, name: "Day of Goodwill" },
];

// Dates are handled in UTC so the local time zone can't shift a day.
function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Western (Gregorian) Easter Sunday: the anonymous Gregorian algorithm
// (Meeus/Jones/Butcher).
export function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utcDate(year, month, day);
}

// Every public holiday in `year`, in date order. When a holiday falls on a
// Sunday the Act makes the following Monday a holiday too; if that Monday is
// already one (Christmas on a Sunday), the next free day is used.
export function southAfricanHolidays(year: number): PublicHoliday[] {
  const easter = easterSunday(year);
  const holidays = [
    ...FIXED_HOLIDAYS.map(({ month, day, name }) => ({ date: utcDate(year, month, day), name })),
    { date: addDays(easter, -2), name: "Good Friday" },
    { date: addDays(easter, 1), name: "Family Day" },
  ].sort((x, y) => x.date.getTime() - y.date.getTime());

  const taken = new Set(holidays.map((h) => isoDate(h.date)));
  const observed: PublicHoliday[] = [];
  for (const { date, name } of holidays) {
    if (date.getUTCDay() !== 0) continue;
    let next = addDays(date, 1);
    while (taken.has(isoDate(next))) next = addDays(next, 1);
    taken.add(isoDate(next));
    observed.push({ date: isoDate(next), name: `${name} (observed)` });
  }

  return [...holidays.map((h) => ({ date: isoDate(h.date), name: h.name })), ...observed].sort((x, y) =>
    x.date.localeCompare(y.date),
  );
}

// 2026 South African public holidays (including Monday 10 Aug observed for
// National Women's Day, which falls on Sunday 9 Aug).
export const saPublicHolidays2026: PublicHoliday[] = southAfricanHolidays(2026);

// FullCalendar event source function: the holidays inside the visible range,
// as all-day events in the "Holidays" colour. They're display-only (there is
// nothing to click or edit), and `skipDates` drops any day an admin has
// already added a holiday entry for, so it doesn't appear twice.
export function holidayEventSource(skipDates: ReadonlySet<string> = new Set()) {
  const { color, textColor } = calendarCategories.holiday;
  return (info: EventSourceFuncArg): Promise<EventInput[]> => {
    const from = info.startStr.slice(0, 10);
    const to = info.endStr.slice(0, 10); // exclusive
    const events: EventInput[] = [];
    for (let year = Number(from.slice(0, 4)); year <= Number(to.slice(0, 4)); year++) {
      for (const holiday of southAfricanHolidays(year)) {
        if (holiday.date < from || holiday.date >= to || skipDates.has(holiday.date)) continue;
        events.push({
          id: `sa-holiday-${holiday.date}`,
          title: holiday.name,
          start: holiday.date,
          allDay: true,
          color,
          textColor,
          editable: false,
          interactive: false,
          extendedProps: { description: "South African public holiday", location: null },
        });
      }
    }
    return Promise.resolve(events);
  };
}
