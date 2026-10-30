"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import type { EventInput } from "@fullcalendar/core";

type ChurchCalendarProps = {
  events: EventInput[];
};

// View-only calendar: no drag/drop, selection or editing for visitors.
export default function ChurchCalendar({ events }: ChurchCalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listMonth",
      }}
      buttonText={{ today: "Today", month: "Month", list: "List" }}
      events={events}
      editable={false}
      selectable={false}
      eventStartEditable={false}
      eventDurationEditable={false}
      height="auto"
      dayMaxEventRows={3}
    />
  );
}
