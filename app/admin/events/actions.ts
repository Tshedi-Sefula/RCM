"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/data/public";
import { fromDateTimeInputValue } from "@/lib/dates";
import { storagePathFromPublicUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, type Database } from "@/lib/types/database";
import { IMAGE_PATH_PATTERN } from "@/lib/uploads";

// The poster itself is uploaded by the form, straight from the browser to
// Storage (Server Action bodies are capped at 1 MB). These actions receive
// only its object path, check it, and keep the row and the file in step.
// RLS also limits writes to admins; requireAdmin() is the first line.

type Supabase = Awaited<ReturnType<typeof createClient>>;

const bucket = STORAGE_BUCKETS.eventPosters;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function removePoster(supabase: Supabase, posterUrl: string | null) {
  const path = posterUrl && storagePathFromPublicUrl(posterUrl, bucket);
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  // The row change already succeeded; an orphaned file only costs storage.
  if (error) console.error(`Couldn't remove poster ${path}:`, error.message);
}

// Public /events and home page, plus the admin list and dashboard count.
function refreshEvents() {
  updateTag(CACHE_TAGS.events);
  revalidatePath("/admin", "layout");
}

// Creates an event, or updates it when the form includes an `id`.
export async function saveEvent(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const eventDate = fromDateTimeInputValue(text(formData, "event_date"));
  const posterPath = text(formData, "poster_path");
  const newPosterUrl = posterPath ? supabase.storage.from(bucket).getPublicUrl(posterPath).data.publicUrl : null;

  // Anything that stops the save also discards the poster just uploaded.
  const fail = async (result: Extract<ActionResult, { ok: false }>) => {
    if (posterPath && IMAGE_PATH_PATTERN.test(posterPath)) await removePoster(supabase, newPosterUrl);
    return result;
  };

  if (id && !UUID_PATTERN.test(id)) return fail({ ok: false, error: "This event couldn't be found." });
  if (posterPath && !IMAGE_PATH_PATTERN.test(posterPath)) {
    return { ok: false, error: "The poster upload didn't work. Choose the file again." };
  }

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Enter a title.";
  else if (title.length > 200) fieldErrors.title = "Keep the title under 200 characters.";
  if (!eventDate) fieldErrors.event_date = "Choose a date and time.";
  if (Object.keys(fieldErrors).length > 0 || !eventDate) {
    return fail({ ok: false, error: "Check the highlighted fields.", fieldErrors });
  }

  const values = {
    title,
    description: text(formData, "description") || null,
    event_date: eventDate,
    location: text(formData, "location") || null,
    is_featured: formData.get("is_featured") === "on",
  } satisfies Database["public"]["Tables"]["events"]["Insert"];

  if (!id) {
    const { error } = await supabase.from("events").insert({ ...values, poster_url: newPosterUrl });
    if (error) return fail({ ok: false, error: "The event couldn't be saved. Try again." });
    refreshEvents();
    return { ok: true };
  }

  const { data: existing, error: readError } = await supabase
    .from("events")
    .select("poster_url")
    .eq("id", id)
    .maybeSingle();
  if (readError) return fail({ ok: false, error: "The event couldn't be saved. Try again." });
  if (!existing) return fail({ ok: false, error: "This event no longer exists. Refresh the page." });

  // A new upload replaces the poster; the checkbox removes it outright.
  const replacePoster = newPosterUrl !== null || formData.get("remove_poster") === "on";
  const { data: updated, error } = await supabase
    .from("events")
    .update(replacePoster ? { ...values, poster_url: newPosterUrl } : values)
    .eq("id", id)
    .select("id");
  // RLS turns a forbidden update into zero rows rather than an error.
  if (error || updated.length === 0) return fail({ ok: false, error: "The event couldn't be saved. Try again." });

  if (replacePoster && existing.poster_url !== newPosterUrl) await removePoster(supabase, existing.poster_url);
  refreshEvents();
  return { ok: true };
}

// Deletes the event, then its poster file.
export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This event couldn't be found." };

  const supabase = await createClient();
  const { data: deleted, error } = await supabase.from("events").delete().eq("id", id).select("poster_url");
  if (error) return { ok: false, error: "The event couldn't be deleted. Try again." };
  // No row means it was already gone (e.g. deleted in another tab).
  if (deleted.length > 0) await removePoster(supabase, deleted[0].poster_url);
  refreshEvents();
  return { ok: true };
}
