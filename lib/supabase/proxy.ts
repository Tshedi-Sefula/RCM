import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./env";

export const ADMIN_LOGIN_PATH = "/admin/login";

// Everything under /admin except the login page needs a session.
function isProtectedAdminPath(pathname: string) {
  return (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    pathname !== ADMIN_LOGIN_PATH
  );
}

function redirectToLogin(request: NextRequest, from?: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = ADMIN_LOGIN_PATH;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Keep any refreshed (or cleared) auth cookies on the redirect.
  from?.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

// Refreshes the Supabase auth session and keeps request/response cookies in sync,
// then sends signed-out visitors on protected admin pages to the login page.
// This is an optimistic check only: admin pages and actions verify the user
// again (and check profiles.is_admin) via lib/auth.ts.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Without Supabase nobody can be signed in, so admin pages are off-limits.
  if (!isSupabaseConfigured) {
    return isProtectedAdminPath(pathname) ? redirectToLogin(request) : response;
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

  if (!data?.claims && isProtectedAdminPath(pathname)) {
    return redirectToLogin(request, response);
  }

  return response;
}
