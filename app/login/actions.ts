"use server";

import { redirect } from "next/navigation";
import { EMAIL_MAX, EMAIL_PATTERN, PASSWORD_MAX, PASSWORD_MIN } from "@/lib/login";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string; email: string } | undefined;

// Same message for unknown email and wrong password, so accounts can't be probed.
const INVALID_CREDENTIALS = "Invalid email or password.";

// One sign-in for all staff. signInWithPassword sends the credentials to the
// Supabase Auth API as JSON (never into SQL), and @supabase/ssr stores the
// session in SameSite=Lax cookies. Supabase's own rate limits back up the
// form's client-side lockout.
export async function staffLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured yet.", email };
  }
  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address.", email };
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return { error: INVALID_CREDENTIALS, email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: INVALID_CREDENTIALS, email };
  }

  // RLS lets users read their own profile. is_admin is what /admin checks
  // (lib/auth.ts), so it wins over role; role = 'pastor' opens /pastor.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.is_admin) redirect("/admin");
  if (profile?.role === "pastor") redirect("/pastor");

  // Signed in but no staff role: don't leave the session behind.
  await supabase.auth.signOut();
  return { error: "Unauthorized access.", email };
}
