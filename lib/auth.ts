import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { LOGIN_PATH } from "@/lib/supabase/proxy";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string };

// Data Access Layer for the admin area. proxy.ts only checks that a session
// exists; this verifies it and that the user has profiles.is_admin = true.
// Call it from every admin page, Server Action and Route Handler.
// cache() dedupes the lookup within a single request.
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseConfigured) return null;

  // getClaims() checks the token's expiry with Date.now(). With partial
  // prefetching, cookies resolve while the shell prerenders, so defer to
  // request time first; the admin check should never be prerendered anyway.
  await connection();
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
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export type PastorUser = { id: string; email: string; fullName: string | null };

// The same check for the pastor area: a verified session whose profile has
// role = 'pastor'.
export const getPastorUser = cache(async (): Promise<PastorUser | null> => {
  if (!isSupabaseConfigured) return null;

  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  // RLS lets users read their own profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", claims.sub)
    .maybeSingle();
  if (profile?.role !== "pastor") return null;

  return { id: claims.sub, email: claims.email ?? "", fullName: profile.full_name };
});

// Returns the signed-in pastor, or redirects to the login page.
export async function requirePastor(): Promise<PastorUser> {
  const user = await getPastorUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}
