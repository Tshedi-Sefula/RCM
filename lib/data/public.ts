import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";
import type { CalendarEntry, ChurchEvent, Database, GalleryImage, StreamVideo } from "@/lib/types/database";

// Read-only queries for the public pages. Content is the same for every
// visitor, so these use a cookie-less anon client and are cached with
// `use cache`; that keeps the pages in the prerendered static shell.
// After an admin edit, call revalidateTag() with the matching tag.
export const CACHE_TAGS = {
  events: "events",
  calendar: "calendar_entries",
  gallery: "gallery_images",
  streams: "stream_videos",
} as const;

// Errors are returned rather than thrown so pages can show a friendly
// message instead of failing the render.
export type QueryResult<T> = { data: T; error: null } | { data: null; error: string };

function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

const notConfigured = "Supabase is not configured. Add the keys from .env.local.example to .env.local.";

// Midnight today in the church's time zone, so events on today's date
// still count as upcoming. South Africa is UTC+2 with no daylight saving.
export function startOfToday() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: site.timeZone });
  return `${today}T00:00:00+02:00`;
}

export async function getUpcomingEvents(): Promise<QueryResult<ChurchEvent[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.events);
  if (!isSupabaseConfigured) {
    cacheLife("hours");
    return { data: null, error: notConfigured };
  }

  const { data, error } = await createPublicClient()
    .from("events")
    .select("*")
    .gte("event_date", startOfToday())
    .order("event_date", { ascending: true });

  if (error) {
    // Retry soon rather than caching the failure for hours.
    cacheLife("minutes");
    return { data: null, error: error.message };
  }
  cacheLife("hours");
  return { data, error: null };
}

// Every calendar entry, so visitors can page back and forward through
// the year. The table only holds the big dates, so it stays small.
export async function getCalendarEntries(): Promise<QueryResult<CalendarEntry[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.calendar);
  if (!isSupabaseConfigured) {
    cacheLife("hours");
    return { data: null, error: notConfigured };
  }

  const { data, error } = await createPublicClient()
    .from("calendar_entries")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    cacheLife("minutes");
    return { data: null, error: error.message };
  }
  cacheLife("hours");
  return { data, error: null };
}

export async function getGalleryImages(): Promise<QueryResult<GalleryImage[]>> {
  "use cache";
  cacheTag(CACHE_TAGS.gallery);
  if (!isSupabaseConfigured) {
    cacheLife("hours");
    return { data: null, error: notConfigured };
  }

  const { data, error } = await createPublicClient()
    .from("gallery_images")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) {
    cacheLife("minutes");
    return { data: null, error: error.message };
  }
  cacheLife("hours");
  return { data, error: null };
}

// The newest memorable stream, or the newest stream if none are marked
// memorable. `data` is undefined when there are no streams yet.
export async function getLatestStream(): Promise<QueryResult<StreamVideo | undefined>> {
  "use cache";
  cacheTag(CACHE_TAGS.streams);
  if (!isSupabaseConfigured) {
    cacheLife("hours");
    return { data: null, error: notConfigured };
  }

  const { data, error } = await createPublicClient()
    .from("stream_videos")
    .select("*")
    .order("is_memorable", { ascending: false })
    .order("stream_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    cacheLife("minutes");
    return { data: null, error: error.message };
  }
  cacheLife("hours");
  return { data: data[0], error: null };
}
