"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import type { ChatMessage } from "@/lib/threads";
import type { ReplySenderType } from "@/lib/types/database";

const timeFormat = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

type ChatMessagesProps = {
  messages: ChatMessage[];
  // Whose messages sit on the right: the viewer's own.
  ownSide: ReplySenderType;
};

// Conversation bubbles in a scrollable box that keeps the newest in view.
export default function ChatMessages({ messages, ownSide }: ChatMessagesProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  return (
    <ol
      ref={listRef}
      aria-label="Conversation"
      className="max-h-[60dvh] space-y-4 overflow-y-auto bg-brand-cream p-4 sm:p-6"
    >
      {messages.map((m) => {
        const own = m.from === ownSide;
        return (
          <li key={m.id} className={cn("flex flex-col", own ? "items-end" : "items-start")}>
            <p className="mb-1 px-1 text-xs text-brand-muted">
              <span className="font-semibold text-brand-ink">{m.author}</span>
              <span aria-hidden> · </span>
              <time dateTime={m.createdAt}>{timeFormat.format(new Date(m.createdAt))}</time>
            </p>
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 leading-relaxed shadow-card sm:max-w-[70%]",
                own
                  ? "rounded-br-sm bg-brand-primary text-white"
                  : "rounded-bl-sm border border-brand-line bg-white text-brand-ink",
              )}
            >
              {m.message}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
