import type { ContactTopic, ReplySenderType, ThreadStatus } from "@/lib/types/database";

// Shared by the public thread page, the pastor dashboard and their Server
// Actions / Route Handler. Mirrors supabase/migrations/20261030000400_messaging.sql.

export const REPLY_MAX_LENGTH = 5000;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const THREAD_STATUS_LABELS: Record<ThreadStatus, string> = {
  new: "New",
  forwarded: "Awaiting pastor",
  replied: "Replied",
  closed: "Closed",
};

// How often open conversations check for new messages.
export const THREAD_REFRESH_MS = 10_000;

// One bubble in a conversation. The sender's original message is the first.
export type ChatMessage = {
  id: string;
  from: ReplySenderType;
  author: string;
  message: string;
  createdAt: string;
};

// What the sender sees at /threads/[ticket_id]: no contact details or ids.
export type PublicThread = {
  senderName: string;
  topic: ContactTopic;
  status: ThreadStatus;
  messages: ChatMessage[];
};

export function threadPath(ticketId: string) {
  return `/threads/${ticketId}`;
}

export function pastorLabel(fullName: string | null | undefined) {
  return fullName ? `Pastor ${fullName}` : "Pastor";
}

// Returns an error message, or null when the reply is fine.
export function validateReply(message: string) {
  if (!message) return "Write a message first.";
  if (message.length > REPLY_MAX_LENGTH) return "Keep your message under 5,000 characters.";
  return null;
}
