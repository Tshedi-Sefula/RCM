import "server-only";
import { requirePastor } from "@/lib/auth";
import type { QueryResult } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";
import type { ChatMessage } from "@/lib/threads";
import type { ContactThread } from "@/lib/types/database";

// Queries for the pastor dashboard. These use the pastor's own session, so
// RLS limits them to threads assigned to that pastor.

// Open threads assigned to the signed-in pastor, most recent activity first.
export async function getPastorThreads(): Promise<QueryResult<ContactThread[]>> {
  const pastor = await requirePastor();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_threads")
    .select("*")
    .eq("assigned_pastor_id", pastor.id)
    .in("status", ["forwarded", "replied"])
    .order("last_activity_at", { ascending: false });
  return error ? { data: null, error: error.message } : { data, error: null };
}

export type PastorThread = { thread: ContactThread; messages: ChatMessage[] };

// One assigned thread with its conversation; null if it isn't this pastor's.
export async function getPastorThread(id: string): Promise<QueryResult<PastorThread | null>> {
  const pastor = await requirePastor();
  const supabase = await createClient();
  const { data: thread, error } = await supabase
    .from("contact_threads")
    .select("*")
    .eq("id", id)
    .eq("assigned_pastor_id", pastor.id)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  if (!thread) return { data: null, error: null };

  const { data: replies, error: repliesError } = await supabase
    .from("thread_replies")
    .select("*")
    .eq("thread_id", id)
    .order("created_at", { ascending: true });
  if (repliesError) return { data: null, error: repliesError.message };

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
      author: r.sender_type === "user" ? thread.sender_name : r.sender_id === pastor.id ? "You" : "Pastor",
      message: r.message,
      createdAt: r.created_at,
    })),
  ];
  return { data: { thread, messages }, error: null };
}
