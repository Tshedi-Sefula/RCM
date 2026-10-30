import "server-only";
import { requireAdmin } from "@/lib/auth";
import { startOfToday } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";

// A count is null when its query failed, so the dashboard can show "—".
export type DashboardCounts = {
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
  const [events, calendar, gallery, streams] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).gte("event_date", startOfToday()),
    supabase.from("calendar_entries").select("*", { count: "exact", head: true }),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("stream_videos").select("*", { count: "exact", head: true }),
  ]);

  const count = (result: { count: number | null; error: unknown }) =>
    result.error ? null : (result.count ?? 0);

  return {
    upcomingEvents: count(events),
    calendarEntries: count(calendar),
    galleryImages: count(gallery),
    streamVideos: count(streams),
  };
}
