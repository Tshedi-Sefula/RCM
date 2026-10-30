import type { EventInput } from "@fullcalendar/core";

// Temporary hardcoded data until events are stored in Supabase.
export const placeholderEvents: EventInput[] = [
  {
    id: "sunday-service",
    title: "Sunday Service",
    daysOfWeek: [0],
    startTime: "09:00",
    endTime: "11:00",
  },
  {
    id: "sunday-evening",
    title: "Sunday Evening Service",
    daysOfWeek: [0],
    startTime: "18:00",
    endTime: "19:30",
  },
  {
    id: "midweek",
    title: "Midweek Service",
    daysOfWeek: [3],
    startTime: "19:00",
    endTime: "20:30",
  },
  {
    id: "youth-camp",
    title: "Youth Camp",
    start: "2026-11-13",
    end: "2026-11-16",
    allDay: true,
  },
  {
    id: "community-outreach",
    title: "Community Outreach – Siyabuswa",
    start: "2026-11-21T10:00:00",
    end: "2026-11-21T14:00:00",
  },
  {
    id: "christmas-service",
    title: "Christmas Service",
    start: "2026-12-25T09:00:00",
    end: "2026-12-25T11:30:00",
  },
];
