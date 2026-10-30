"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN } from "@/lib/threads";

// RLS also limits these to admins; requireAdmin() is the first line.

// The inbox and the dashboard's count.
function refreshMessages() {
  revalidatePath("/admin", "layout");
}

// Assigns a thread to a pastor, then shows the inbox with a confirmation.
// Also reassigns threads whose pastor's account was removed.
export async function forwardThread(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const pastorId = formData.get("pastor_id");
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This message couldn't be found." };
  if (typeof pastorId !== "string" || !UUID_PATTERN.test(pastorId)) {
    return { ok: false, error: "Choose a pastor.", fieldErrors: { pastor_id: "Choose a pastor." } };
  }

  const supabase = await createClient();
  const { data: pastor } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", pastorId)
    .eq("role", "pastor")
    .maybeSingle();
  if (!pastor) return { ok: false, error: "That pastor couldn't be found. Refresh and try again." };

  const { data: updated, error } = await supabase
    .from("contact_threads")
    .update({ status: "forwarded", assigned_pastor_id: pastorId })
    .eq("id", id)
    .neq("status", "closed")
    .select("id");
  if (error) return { ok: false, error: "The message couldn't be forwarded. Try again." };
  if (updated.length === 0) return { ok: false, error: "This message is closed or no longer exists." };

  refreshMessages();
  redirect(`/admin/messages?forwarded=${id}`);
}

export async function deleteThread(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This message couldn't be found." };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_threads").delete().eq("id", id);
  if (error) return { ok: false, error: "The message couldn't be deleted. Try again." };

  refreshMessages();
  return { ok: true };
}
