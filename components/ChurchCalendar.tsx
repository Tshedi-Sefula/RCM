"use client";

import { useMemo, useSyncExternalStore } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import type { EventContentArg, EventMountArg } from "@fullcalendar/core";
import { recurringServiceEvents, toCalendarEvent, toChurchCalendarEvent } from "@/lib/calendar";
import type { CalendarChurchEvent } from "@/lib/data/public";
import { holidayEventSource } from "@/lib/holidays";
import type { CalendarEntry } from "@/lib/types/database";

type ChurchCalendarProps = {
  entries: CalendarEntry[];
  churchEvents?: CalendarChurchEvent[];
};

const mobileQuery = "(max-width: 767px)";
// Only the starting view depends on screen size, so there's nothing to
// subscribe to. On the server (and during hydration) this is null.
const noSubscribe = () => () => {};
function useIsMobile() {
  return useSyncExternalStore(
    noSubscribe,
    () => window.matchMedia(mobileQuery).matches,
    () => null,
  );
}

// Hover tooltip with the description and location (a native title attribute).
function addTooltip({ el, event }: EventMountArg) {
  const description = event.extendedProps.description as string | null;
  const location = event.extendedProps.location as string | null;
  const tooltip = [description, location && `Location: ${location}`].filter(Boolean).join("\n");
  if (tooltip) el.title = tooltip;
}

// Touch screens can't hover, so the list view shows descriptions and locations inline.
function renderEventContent({ event, view }: EventContentArg) {
  if (!view.type.startsWith("list")) return true;
  const description = event.extendedProps.description as string | null;
  const location = event.extendedProps.location as string | null;
  return (
    <>
      <span className="font-semibold">{event.title}</span>
      {description && <span className="mt-0.5 block text-sm text-brand-muted">{description}</span>}
      {location && (
        <span className="mt-1 inline-flex items-start gap-1 text-sm text-brand-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden>
            <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span>
            <span className="sr-only">Location: </span>
            {location}
          </span>
        </span>
      )}
    </>
  );
}

// View-only calendar: no drag/drop, selection or editing for visitors.
// Phones start on the list view, which reads better than a tiny grid. It lists a
// month at a time so the weekly services don't crowd out everything else.
export default function ChurchCalendar({ entries, churchEvents = [] }: ChurchCalendarProps) {
  const events = useMemo(() => {
    const entryKeys = new Set(
      entries.map((entry) => `${entry.start_date}::${entry.title.trim().toLowerCase()}`),
    );
    const mappedEvents = churchEvents
      .filter((event) => {
        const dateKey = event.event_date.slice(0, 10);
        return !entryKeys.has(`${dateKey}::${event.title.trim().toLowerCase()}`);
      })
      .map(toChurchCalendarEvent);

    return [...recurringServiceEvents(), ...entries.map(toCalendarEvent), ...mappedEvents];
  }, [entries, churchEvents]);
  // SA public holidays for whichever range is on screen, minus days the admin
  // has already marked with their own holiday entry.
  const holidays = useMemo(
    () =>
      holidayEventSource(
        new Set(entries.filter((entry) => entry.category === "holiday").map((entry) => entry.start_date)),
      ),
    [entries],
  );
  const eventSources = useMemo(() => [{ events }, { events: holidays }], [events, holidays]);
  const isMobile = useIsMobile();

  if (isMobile === null) return <CalendarSkeleton />;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      initialView={isMobile ? "listMonth" : "dayGridMonth"}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listMonth",
      }}
      buttonText={{ today: "Today", month: "Month", list: "List" }}
      eventSources={eventSources}
      editable={false}
      selectable={false}
      eventStartEditable={false}
      eventDurationEditable={false}
      eventDidMount={addTooltip}
      eventContent={renderEventContent}
      noEventsContent="No dates on the calendar for this period."
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      height="auto"
      dayMaxEventRows={3}
    />
  );
}

export function CalendarSkeleton() {
  return <div className="h-[36rem] animate-pulse rounded-2xl bg-brand-cream" aria-hidden />;
}
