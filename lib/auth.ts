import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ADMIN_LOGIN_PATH } from "@/lib/supabase/proxy";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string };

// Data Access Layer for the admin area. proxy.ts only checks that a session
// exists; this verifies it and that the user has profiles.is_admin = true.
// Call it from every admin page, Server Action and Route Handler.
// cache() dedupes the lookup within a single request.
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  return { id: claims.sub, email: claims.email ?? "" };
});

// Returns the signed-in admin, or redirects to the login page.
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);
  return user;
}
