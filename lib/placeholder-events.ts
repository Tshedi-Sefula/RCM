import type { CalendarEntry } from "@/lib/types/database";

// Sample dates shown on /calendar only while Supabase isn't configured
// (e.g. local development), so the calendar can still be previewed.
const created_at = "2026-01-01T00:00:00Z";

export const placeholderCalendarEntries: CalendarEntry[] = [
  { id: "sample-1", title: "Good Friday Service", start_date: "2026-04-03", end_date: null, description: "Remembering the cross. Service starts at 9:00.", category: "service", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-2", title: "Easter Sunday", start_date: "2026-04-05", end_date: null, description: "Resurrection celebration service.", category: "service", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-3", title: "Freedom Day", start_date: "2026-04-27", end_date: null, description: null, category: "holiday", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-4", title: "Heritage Day", start_date: "2026-09-24", end_date: null, description: null, category: "holiday", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-5", title: "Church Leaders' Meeting", start_date: "2026-11-07", end_date: null, description: "All ministry leaders, 10:00 in the hall.", category: "other", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-6", title: "Youth Camp", start_date: "2026-11-13", end_date: "2026-11-15", description: "A weekend away for the youth. Registration closes 6 November.", category: "special", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-7", title: "Community Outreach – Siyabuswa", start_date: "2026-11-21", end_date: null, description: "Serving our neighbours. Meet at the church at 8:00.", category: "special", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-8", title: "Thanksgiving Service", start_date: "2026-11-29", end_date: null, description: "A service of thanks for the year.", category: "service", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-9", title: "Day of Reconciliation", start_date: "2026-12-16", end_date: null, description: null, category: "holiday", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-10", title: "Christmas Service", start_date: "2026-12-25", end_date: null, description: "Celebrating the birth of Jesus. Service starts at 9:00.", category: "service", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-11", title: "Crossover Night", start_date: "2026-12-31", end_date: null, description: "Praying into the new year from 21:00.", category: "special", start_time: null, end_time: null, location: null, created_at },
  { id: "sample-12", title: "Annual Conference", start_date: "2027-01-22", end_date: "2027-01-24", description: "Three days of worship and the Word.", category: "special", start_time: null, end_time: null, location: null, created_at },
];
