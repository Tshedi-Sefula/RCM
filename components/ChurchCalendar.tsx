"use client";

import { useMemo, useSyncExternalStore } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import type { EventContentArg, EventMountArg } from "@fullcalendar/core";
import { toCalendarEvent } from "@/lib/calendar";
import type { CalendarEntry } from "@/lib/types/database";

type ChurchCalendarProps = {
  entries: CalendarEntry[];
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

// Hover tooltip with the description (a native title attribute).
function addTooltip({ el, event }: EventMountArg) {
  const description = event.extendedProps.description as string | null;
  if (description) el.title = description;
}

// Touch screens can't hover, so the list view shows descriptions inline.
function renderEventContent({ event, view }: EventContentArg) {
  if (!view.type.startsWith("list")) return true;
  const description = event.extendedProps.description as string | null;
  return (
    <>
      <span className="font-semibold">{event.title}</span>
      {description && <span className="mt-0.5 block text-sm text-brand-muted">{description}</span>}
    </>
  );
}

// View-only calendar: no drag/drop, selection or editing for visitors.
// Phones start on the list view, which reads better than a tiny grid.
export default function ChurchCalendar({ entries }: ChurchCalendarProps) {
  const events = useMemo(() => entries.map(toCalendarEvent), [entries]);
  const isMobile = useIsMobile();

  if (isMobile === null) return <CalendarSkeleton />;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      initialView={isMobile ? "listYear" : "dayGridMonth"}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listYear",
      }}
      buttonText={{ today: "Today", month: "Month", list: "List" }}
      events={events}
      editable={false}
      selectable={false}
      eventStartEditable={false}
      eventDurationEditable={false}
      eventDidMount={addTooltip}
      eventContent={renderEventContent}
      noEventsContent="No dates on the calendar for this period."
      height="auto"
      dayMaxEventRows={3}
    />
  );
}

export function CalendarSkeleton() {
  return <div className="h-[36rem] animate-pulse rounded-2xl bg-brand-cream" aria-hidden />;
}
