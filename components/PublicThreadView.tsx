"use client";

import { useCallback, useEffect, useState } from "react";
import ChatMessages from "@/components/ChatMessages";
import ReplyBox from "@/components/ReplyBox";
import { THREAD_REFRESH_MS, type PublicThread } from "@/lib/threads";

// The sender's conversation at /threads/[ticket_id]. Starts from the
// server-rendered thread, then polls the API while the tab is visible.
export default function PublicThreadView({ ticketId, initial }: { ticketId: string; initial: PublicThread }) {
  const [thread, setThread] = useState(initial);
  const endpoint = `/api/threads/${ticketId}`;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (res.ok) setThread(await res.json());
    } catch {
      // Offline for a moment; the next tick tries again.
    }
  }, [endpoint]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, THREAD_REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  async function send(message: string) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const body: { error?: string } = await res.json().catch(() => ({}));
        return body.error ?? "Your message couldn't be sent. Please try again.";
      }
    } catch {
      return "Your message couldn't be sent. Check your connection and try again.";
    }
    await refresh();
    return undefined;
  }

  const hasPastorReply = thread.messages.some((m) => m.from === "pastor");

  return (
    <div className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-card">
      <ChatMessages messages={thread.messages} ownSide="user" />
      {!hasPastorReply && thread.status !== "closed" && (
        <p className="border-t border-brand-line px-4 py-3 text-sm text-brand-muted sm:px-6">
          Your message has been received. A pastor will reply here; this page checks for new messages
          automatically.
        </p>
      )}
      {thread.status === "closed" ? (
        <p className="border-t border-brand-line px-4 py-3 text-sm text-brand-muted sm:px-6">
          This conversation has been closed. If you need anything else, send a new message from the contact page.
        </p>
      ) : (
        <ReplyBox onSend={send} />
      )}
    </div>
  );
}
