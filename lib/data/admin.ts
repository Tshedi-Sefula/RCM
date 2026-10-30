import "server-only";
import { requireAdmin } from "@/lib/auth";
import { startOfToday, type QueryResult } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";
import type { CalendarEntry, ChurchEvent, ContactMessage, GalleryImage, StreamVideo } from "@/lib/types/database";

// A count is null when its query failed, so the dashboard can show "—".
export type DashboardCounts = {
  unreadMessages: number | null;
  upcomingEvents: number | null;
  calendarEntries: number | null;
  galleryImages: number | null;
  streamVideos: number | null;
};

// Row counts for the dashboard. Not cached: admins should see edits at once.
export async function getDashboardCounts(): Promise<DashboardCounts> {
  await requireAdmin();
  const supabase = await createClient();

  // head: true returns only the count, no rows.
  const [messages, events, calendar, gallery, streams] = await Promise.all([
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("event_date", startOfToday()),
    supabase.from("calendar_entries").select("*", { count: "exact", head: true }),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("stream_videos").select("*", { count: "exact", head: true }),
  ]);

  const count = (result: { count: number | null; error: unknown }) =>
    result.error ? null : (result.count ?? 0);

  return {
    unreadMessages: count(messages),
    upcomingEvents: count(events),
    calendarEntries: count(calendar),
    galleryImages: count(gallery),
    streamVideos: count(streams),
  };
}

// Every event, newest first, for the admin list. Not cached, like the counts.
export async function getAllEvents(): Promise<QueryResult<ChurchEvent[]>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}

// Every calendar entry, latest start date first.
export async function getAllCalendarEntries(): Promise<QueryResult<CalendarEntry[]>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_entries")
    .select("*")
    .order("start_date", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}

// Every gallery photo, newest upload first.
export async function getAllGalleryImages(): Promise<QueryResult<GalleryImage[]>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("uploaded_at", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}

// Every stream, latest stream date first (undated ones last).
export async function getAllStreamVideos(): Promise<QueryResult<StreamVideo[]>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stream_videos")
    .select("*")
    .order("stream_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}

// Every contact form message, newest first.
export async function getAllContactMessages(): Promise<QueryResult<ContactMessage[]>> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}
