"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(LOGIN_PATH);
}
