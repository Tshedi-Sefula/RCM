import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./env";

// The one staff login page (app/login) for both areas.
export const LOGIN_PATH = "/login";

// Everything under /admin or /pastor needs a session. (The old per-area login
// URLs redirect to LOGIN_PATH in next.config.ts before the proxy runs.)
function isProtected(pathname: string) {
  return ["/admin", "/pastor"].some((area) => pathname === area || pathname.startsWith(`${area}/`));
}

function redirectToLogin(request: NextRequest, from?: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Keep any refreshed (or cleared) auth cookies on the redirect.
  from?.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

// Refreshes the Supabase auth session and keeps request/response cookies in sync,
// then sends signed-out visitors on protected pages to the login page, and
// signed-in users without the pastor role away from /pastor.
// This is an optimistic check only: admin and pastor pages and actions verify
// the user again (profiles.is_admin / profiles.role) via lib/auth.ts.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isPastorArea = request.nextUrl.pathname.startsWith("/pastor");
  const needsSession = isProtected(request.nextUrl.pathname);

  // Without Supabase nobody can be signed in, so protected pages are off-limits.
  if (!isSupabaseConfigured) {
    return needsSession ? redirectToLogin(request) : response;
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

  if (!needsSession) return response;
  if (!data?.claims) return redirectToLogin(request, response);

  if (isPastorArea) {
    const { data: isPastor } = await supabase.rpc("is_pastor");
    if (!isPastor) return redirectToLogin(request, response);
  }

  return response;
}
