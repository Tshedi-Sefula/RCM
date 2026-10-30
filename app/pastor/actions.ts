"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LoginState } from "@/app/admin/actions";
import type { ActionResult } from "@/lib/action-result";
import { requirePastor } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PASTOR_LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN, validateReply } from "@/lib/threads";

// RLS also limits these to the thread's assigned pastor; requirePastor() is
// the first line.

export async function pastorLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured yet.", email };
  }
  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Same message for unknown email and wrong password, so accounts can't be probed.
    return { error: "Incorrect email or password.", email };
  }

  const { data: isPastor } = await supabase.rpc("is_pastor");
  if (!isPastor) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have pastor access.", email };
  }

  redirect("/pastor");
}

export async function pastorLogout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(PASTOR_LOGIN_PATH);
}

function refreshThreads() {
  revalidatePath("/pastor", "layout");
}

export async function sendPastorReply(threadId: string, message: string): Promise<ActionResult> {
  const pastor = await requirePastor();
  if (!UUID_PATTERN.test(threadId)) return { ok: false, error: "This conversation couldn't be found." };
  const text = message.trim();
  const invalid = validateReply(text);
  if (invalid) return { ok: false, error: invalid };

  const supabase = await createClient();
  // The insert trigger marks the thread "replied".
  const { error } = await supabase
    .from("thread_replies")
    .insert({ thread_id: threadId, sender_type: "pastor", sender_id: pastor.id, message: text });
  if (error) return { ok: false, error: "Your reply couldn't be sent. Try again." };

  refreshThreads();
  return { ok: true };
}

export async function closeThread(threadId: string): Promise<ActionResult> {
  const pastor = await requirePastor();
  if (!UUID_PATTERN.test(threadId)) return { ok: false, error: "This conversation couldn't be found." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_threads")
    .update({ status: "closed" })
    .eq("id", threadId)
    .eq("assigned_pastor_id", pastor.id)
    .select("id");
  if (error || data.length === 0) return { ok: false, error: "The conversation couldn't be closed. Try again." };

  refreshThreads();
  redirect("/pastor");
}
