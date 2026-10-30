"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/data/public";
import { isDateInputValue } from "@/lib/dates";
import { normalizeStreamSource } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import type { Database, StreamPlatform } from "@/lib/types/database";

// RLS also limits writes to admins; requireAdmin() is the first line.

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isPlatform(value: string): value is StreamPlatform {
  return value === "youtube" || value === "facebook";
}

// Home page player, plus the admin list and dashboard count.
function refreshStreams() {
  updateTag(CACHE_TAGS.streams);
  revalidatePath("/admin", "layout");
}

// Creates a stream, or updates it when the form includes an `id`.
export async function saveStreamVideo(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const platform = text(formData, "platform");
  const source = text(formData, "video_id_or_url");
  const streamDate = text(formData, "stream_date");

  if (id && !UUID_PATTERN.test(id)) return { ok: false, error: "This stream couldn't be found." };

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Enter a title.";
  else if (title.length > 200) fieldErrors.title = "Keep the title under 200 characters.";
  if (!isPlatform(platform)) fieldErrors.platform = "Choose YouTube or Facebook.";
  // YouTube is stored as the bare video ID, Facebook as the full link.
  const videoIdOrUrl = isPlatform(platform) ? normalizeStreamSource(platform, source) : null;
  if (isPlatform(platform) && !videoIdOrUrl) {
    fieldErrors.video_id_or_url = !source
      ? "Paste the video link."
      : platform === "youtube"
        ? "That doesn't look like a YouTube video link or ID."
        : "Paste the full facebook.com link to the video.";
  }
  if (streamDate && !isDateInputValue(streamDate)) fieldErrors.stream_date = "Choose a valid date, or leave it empty.";
  if (Object.keys(fieldErrors).length > 0 || !isPlatform(platform) || !videoIdOrUrl) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const values = {
    title,
    platform,
    video_id_or_url: videoIdOrUrl,
    is_memorable: formData.get("is_memorable") === "on",
    stream_date: streamDate || null,
  } satisfies Database["public"]["Tables"]["stream_videos"]["Insert"];

  const supabase = await createClient();
  if (id) {
    const { data: updated, error } = await supabase.from("stream_videos").update(values).eq("id", id).select("id");
    if (error) return { ok: false, error: "The stream couldn't be saved. Try again." };
    // RLS turns a forbidden update into zero rows; so does a deleted stream.
    if (updated.length === 0) return { ok: false, error: "This stream no longer exists. Refresh the page." };
  } else {
    const { error } = await supabase.from("stream_videos").insert(values);
    if (error) return { ok: false, error: "The stream couldn't be saved. Try again." };
  }

  refreshStreams();
  return { ok: true };
}

export async function deleteStreamVideo(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This stream couldn't be found." };

  const supabase = await createClient();
  // No row deleted means it was already gone, which is fine too.
  const { error } = await supabase.from("stream_videos").delete().eq("id", id);
  if (error) return { ok: false, error: "The stream couldn't be deleted. Try again." };

  refreshStreams();
  return { ok: true };
}
