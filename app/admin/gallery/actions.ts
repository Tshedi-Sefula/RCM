"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/data/public";
import { storagePathFromPublicUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, type Database } from "@/lib/types/database";
import { CAPTION_MAX_LENGTH, GALLERY_MAX_FILES, IMAGE_PATH_PATTERN } from "@/lib/uploads";

// The photos themselves are uploaded by the form, straight from the browser
// to Storage (Server Action bodies are capped at 1 MB). These actions receive
// only their object paths, check them, and keep the rows and files in step.
// RLS also limits writes to admins; requireAdmin() is the first line.

type Supabase = Awaited<ReturnType<typeof createClient>>;

const bucket = STORAGE_BUCKETS.gallery;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function removeFiles(supabase: Supabase, paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  // An orphaned file only costs storage, so log it rather than fail.
  if (error) console.error(`Couldn't remove gallery files ${paths.join(", ")}:`, error.message);
}

// Public /gallery page, plus the admin list and dashboard count.
function refreshGallery() {
  updateTag(CACHE_TAGS.gallery);
  revalidatePath("/admin", "layout");
}

// Saves one row per uploaded photo, all with the same (optional) caption.
export async function addGalleryImages(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const paths = formData.getAll("image_path").filter((value): value is string => typeof value === "string");
  const rawCaption = formData.get("caption");
  const caption = typeof rawCaption === "string" ? rawCaption.trim() : "";
  // Only files this form could have uploaded are ever removed.
  const validPaths = paths.filter((path) => IMAGE_PATH_PATTERN.test(path));

  const fail = async (result: Extract<ActionResult, { ok: false }>) => {
    await removeFiles(supabase, validPaths);
    return result;
  };

  if (paths.length === 0) return { ok: false, error: "Choose at least one photo." };
  if (validPaths.length !== paths.length || paths.length > GALLERY_MAX_FILES) {
    return fail({ ok: false, error: "The upload didn't work. Choose the photos again." });
  }
  if (caption.length > CAPTION_MAX_LENGTH) {
    return fail({
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors: { caption: `Keep the caption under ${CAPTION_MAX_LENGTH} characters.` },
    });
  }

  const rows = validPaths.map(
    (path) =>
      ({
        image_url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl,
        caption: caption || null,
      }) satisfies Database["public"]["Tables"]["gallery_images"]["Insert"],
  );

  const { error } = await supabase.from("gallery_images").insert(rows);
  if (error) return fail({ ok: false, error: "The photos couldn't be saved. Try again." });

  refreshGallery();
  return { ok: true };
}

// Deletes the row, then its file.
export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This photo couldn't be found." };

  const supabase = await createClient();
  const { data: deleted, error } = await supabase.from("gallery_images").delete().eq("id", id).select("image_url");
  if (error) return { ok: false, error: "The photo couldn't be deleted. Try again." };
  // No row means it was already gone (e.g. deleted in another tab).
  const path = deleted[0] && storagePathFromPublicUrl(deleted[0].image_url, bucket);
  if (path) await removeFiles(supabase, [path]);

  refreshGallery();
  return { ok: true };
}
