"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { calendarCategories } from "@/lib/calendar";
import { CACHE_TAGS } from "@/lib/data/public";
import { isDateInputValue } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { CalendarCategory, Database } from "@/lib/types/database";

// RLS also limits writes to admins; requireAdmin() is the first line.

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// <input type="time"> values, "HH:MM".
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isCategory(value: string): value is CalendarCategory {
  return Object.hasOwn(calendarCategories, value);
}

// Public /calendar page, plus the admin list and dashboard count.
function refreshCalendar() {
  updateTag(CACHE_TAGS.calendar);
  revalidatePath("/admin", "layout");
}

// Creates an entry, or updates it when the form includes an `id`.
export async function saveCalendarEntry(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const startDate = text(formData, "start_date");
  const endDate = text(formData, "end_date");
  const category = text(formData, "category");
  const startTime = text(formData, "start_time");
  const endTime = text(formData, "end_time");
  const location = text(formData, "location");

  if (id && !UUID_PATTERN.test(id)) return { ok: false, error: "This entry couldn't be found." };

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Enter a title.";
  else if (title.length > 200) fieldErrors.title = "Keep the title under 200 characters.";
  if (!isDateInputValue(startDate)) fieldErrors.start_date = "Choose a start date.";
  if (endDate && !isDateInputValue(endDate)) fieldErrors.end_date = "Choose a valid end date, or leave it empty.";
  // "YYYY-MM-DD" strings sort the same as the dates they hold.
  else if (endDate && endDate < startDate) fieldErrors.end_date = "The end date can't be before the start date.";
  if (startTime && !TIME_PATTERN.test(startTime)) fieldErrors.start_time = "Choose a valid start time, or leave it empty.";
  if (endTime && !TIME_PATTERN.test(endTime)) fieldErrors.end_time = "Choose a valid end time, or leave it empty.";
  else if (endTime && !startTime) fieldErrors.end_time = "Add a start time too, or leave the end time empty.";
  // "HH:MM" strings sort the same as the times they hold.
  else if (endTime && (!endDate || endDate === startDate) && endTime < startTime) {
    fieldErrors.end_time = "The end time can't be before the start time.";
  }
  if (location.length > 200) fieldErrors.location = "Keep the location under 200 characters.";
  if (!isCategory(category)) fieldErrors.category = "Choose a category.";
  if (Object.keys(fieldErrors).length > 0 || !isCategory(category)) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const values = {
    title,
    start_date: startDate,
    end_date: endDate || null,
    description: text(formData, "description") || null,
    category,
    start_time: startTime || null,
    end_time: endTime || null,
    location: location || null,
  } satisfies Database["public"]["Tables"]["calendar_entries"]["Insert"];

  const supabase = await createClient();
  if (id) {
    const { data: updated, error } = await supabase
      .from("calendar_entries")
      .update(values)
      .eq("id", id)
      .select("id");
    if (error) return { ok: false, error: "The entry couldn't be saved. Try again." };
    // RLS turns a forbidden update into zero rows; so does a deleted entry.
    if (updated.length === 0) return { ok: false, error: "This entry no longer exists. Refresh the page." };
  } else {
    const { error } = await supabase.from("calendar_entries").insert(values);
    if (error) return { ok: false, error: "The entry couldn't be saved. Try again." };
  }

  refreshCalendar();
  return { ok: true };
}

export async function deleteCalendarEntry(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This entry couldn't be found." };

  const supabase = await createClient();
  // No row deleted means it was already gone, which is fine too.
  const { error } = await supabase.from("calendar_entries").delete().eq("id", id);
  if (error) return { ok: false, error: "The entry couldn't be deleted. Try again." };

  refreshCalendar();
  return { ok: true };
}
