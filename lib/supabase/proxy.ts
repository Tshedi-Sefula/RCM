import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./env";

export const ADMIN_LOGIN_PATH = "/admin/login";
export const PASTOR_LOGIN_PATH = "/pastor/login";

// Everything under /admin or /pastor except its login page needs a session.
// Returns that area's login page, or null for paths anyone may open.
function loginPathFor(pathname: string) {
  for (const [area, login] of [
    ["/admin", ADMIN_LOGIN_PATH],
    ["/pastor", PASTOR_LOGIN_PATH],
  ]) {
    if ((pathname === area || pathname.startsWith(`${area}/`)) && pathname !== login) return login;
  }
  return null;
}

function redirectToLogin(request: NextRequest, loginPath: string, from?: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = loginPath;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Keep any refreshed (or cleared) auth cookies on the redirect.
  from?.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

// Refreshes the Supabase auth session and keeps request/response cookies in sync,
// then sends signed-out visitors on protected pages to their login page, and
// signed-in users without the pastor role away from /pastor.
// This is an optimistic check only: admin and pastor pages and actions verify
// the user again (profiles.is_admin / profiles.role) via lib/auth.ts.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const loginPath = loginPathFor(request.nextUrl.pathname);

  // Without Supabase nobody can be signed in, so protected pages are off-limits.
  if (!isSupabaseConfigured) {
    return loginPath ? redirectToLogin(request, loginPath) : response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims():
  // it revalidates the token and triggers setAll when it needs refreshing.
  const { data } = await supabase.auth.getClaims();

  if (!loginPath) return response;
  if (!data?.claims) return redirectToLogin(request, loginPath, response);

  if (loginPath === PASTOR_LOGIN_PATH) {
    const { data: isPastor } = await supabase.rpc("is_pastor");
    if (!isPastor) return redirectToLogin(request, loginPath, response);
  }

  return response;
}
