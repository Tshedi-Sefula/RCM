import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renamed middleware.ts to proxy.ts; this is the app's middleware.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only admin and pastor routes. Public pages read content with a cookie-less
  // client, so they never need the session and the proxy never touches them.
  matcher: ["/admin", "/admin/:path*", "/pastor", "/pastor/:path*"],
};
