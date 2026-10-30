"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { closeThread, sendPastorReply } from "@/app/pastor/actions";
import ChatMessages from "@/components/ChatMessages";
import ReplyBox from "@/components/ReplyBox";
import { Button } from "@/components/ui";
import { THREAD_REFRESH_MS, type ChatMessage } from "@/lib/threads";

// A pastor's conversation. Messages come from the server render; while the
// tab is visible it re-renders every few seconds to pick up sender replies.
export default function PastorThreadView({ threadId, messages }: { threadId: string; messages: ChatMessage[] }) {
  const router = useRouter();
  const [closeError, setCloseError] = useState<string>();
  const [closing, startClosing] = useTransition();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, THREAD_REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  async function send(message: string) {
    const result = await sendPastorReply(threadId, message);
    if (!result.ok) return result.error;
    router.refresh();
    return undefined;
  }

  function close() {
    setCloseError(undefined);
    startClosing(async () => {
      // Redirects to the dashboard on success.
      const result = await closeThread(threadId);
      if (!result.ok) setCloseError(result.error);
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-card">
        <ChatMessages messages={messages} ownSide="pastor" />
        <ReplyBox onSend={send} placeholder="Write your reply…" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-muted">
        <p>The sender sees your replies on their private conversation page.</p>
        <Button variant="ghost" size="sm" onClick={close} disabled={closing}>
          {closing ? "Closing…" : "Close conversation"}
        </Button>
      </div>
      {closeError && (
        <p role="alert" className="mt-2 text-sm text-error">
          {closeError}
        </p>
      )}
    </>
  );
}
