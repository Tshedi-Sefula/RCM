"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// RLS also limits these to admins; requireAdmin() is the first line.

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The inbox and the dashboard's unread count.
function refreshMessages() {
  revalidatePath("/admin", "layout");
}

export async function setMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This message couldn't be found." };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) return { ok: false, error: "The message couldn't be updated. Try again." };

  refreshMessages();
  return { ok: true };
}

export async function deleteContactMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID_PATTERN.test(id)) return { ok: false, error: "This message couldn't be found." };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: "The message couldn't be deleted. Try again." };

  refreshMessages();
  return { ok: true };
}
