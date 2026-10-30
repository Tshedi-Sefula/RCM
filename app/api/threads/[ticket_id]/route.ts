import type { NextRequest } from "next/server";
import { addSenderReply, getPublicThread } from "@/lib/data/threads";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// The sender's view of their conversation, for /threads/[ticket_id] to poll,
// and where they post replies. Knowing the ticket_id is the only credential,
// so unknown and malformed ids get the same 404.

// Private per visitor: no shared caches, and no Referer leaking the ticket.
const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers });
}

const unavailable = { error: "Messages aren't available right now. Please try again later." };

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/threads/[ticket_id]">) {
  const { ticket_id } = await ctx.params;
  if (!isSupabaseConfigured) return json(unavailable, 503);

  try {
    const thread = await getPublicThread(ticket_id);
    return thread ? json(thread) : json({ error: "This conversation couldn't be found." }, 404);
  } catch (error) {
    console.error("Couldn't load thread:", error);
    return json(unavailable, 500);
  }
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/threads/[ticket_id]">) {
  const { ticket_id } = await ctx.params;
  if (!isSupabaseConfigured) return json(unavailable, 503);

  const body: unknown = await request.json().catch(() => null);
  const message =
    body && typeof body === "object" && "message" in body && typeof body.message === "string"
      ? body.message.trim()
      : "";

  try {
    const result = await addSenderReply(ticket_id, message);
    return result.ok ? json({ ok: true }, 201) : json({ error: result.error }, result.status);
  } catch (error) {
    console.error("Couldn't save sender reply:", error);
    return json(unavailable, 500);
  }
}
