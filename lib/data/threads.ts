import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pastorLabel, UUID_PATTERN, validateReply, type ChatMessage, type PublicThread } from "@/lib/threads";

// Public access to one conversation, keyed by its secret ticket_id. Senders
// have no account, so RLS gives them nothing; these use the service role and
// must only ever look a thread up by the exact ticket_id. Never cached: each
// visitor's thread is private and changes as people reply.

export type SenderReplyResult = { ok: true } | { ok: false; status: 400 | 404 | 409 | 500; error: string };

async function findThreadByTicket(ticketId: string) {
  if (!UUID_PATTERN.test(ticketId)) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_threads")
    .select("id, sender_name, topic, status, original_message, created_at")
    .eq("ticket_id", ticketId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// null when no thread has this ticket_id.
export async function getPublicThread(ticketId: string): Promise<PublicThread | null> {
  await connection();
  const thread = await findThreadByTicket(ticketId);
  if (!thread) return null;

  const supabase = createAdminClient();
  const { data: replies, error } = await supabase
    .from("thread_replies")
    .select("id, sender_type, sender_id, message, created_at")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  const pastorIds = [...new Set(replies.map((r) => r.sender_id).filter((id) => id !== null))];
  const names = new Map<string, string | null>();
  if (pastorIds.length > 0) {
    const { data: pastors } = await supabase.from("profiles").select("id, full_name").in("id", pastorIds);
    pastors?.forEach((p) => names.set(p.id, p.full_name));
  }

  const messages: ChatMessage[] = [
    {
      id: "original",
      from: "user",
      author: thread.sender_name,
      message: thread.original_message,
      createdAt: thread.created_at,
    },
    ...replies.map((r) => ({
      id: r.id,
      from: r.sender_type,
      author: r.sender_type === "pastor" ? pastorLabel(r.sender_id && names.get(r.sender_id)) : thread.sender_name,
      message: r.message,
      createdAt: r.created_at,
    })),
  ];

  return { senderName: thread.sender_name, topic: thread.topic, status: thread.status, messages };
}

// Adds the sender's reply to their thread.
export async function addSenderReply(ticketId: string, message: string): Promise<SenderReplyResult> {
  const invalid = validateReply(message);
  if (invalid) return { ok: false, status: 400, error: invalid };

  const thread = await findThreadByTicket(ticketId);
  if (!thread) return { ok: false, status: 404, error: "This conversation couldn't be found." };
  if (thread.status === "closed") {
    return {
      ok: false,
      status: 409,
      error: "This conversation has been closed. Send a new message from the contact page.",
    };
  }

  const { error } = await createAdminClient()
    .from("thread_replies")
    .insert({ thread_id: thread.id, sender_type: "user", message });
  if (error) {
    console.error("Couldn't save sender reply:", error.message);
    return { ok: false, status: 500, error: "Your message couldn't be sent. Please try again in a moment." };
  }
  return { ok: true };
}
